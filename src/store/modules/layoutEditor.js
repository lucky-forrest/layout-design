import {
  getExtGlobComps,
  setElId,
  getChildNode,
  calcRelativePoint
} from '@/helpers/recursiveMethods'
import {
  fixElementToParentBounds,
  getComputedProp,
  getAbsoluteBox,
  getNodeBoxSize
} from '@/helpers/positionDimension'
import { clampZoom } from '@/helpers/zoom'
import { alignBoxes, distributeBoxes, equalizeSize, unionBox } from '@/helpers/layoutAlign'
import { toCSV, buildElementRow, buildLinkTable, ELEMENT_EXPORT_HEADER } from '@/helpers/exporters'
import { flattenPage } from '@/helpers/nodeInfo'
import componentFactory from '@/factories/componentFactory'
import newProject from '@/factories/projectFactory'
import newPage from '@/factories/pageFactory'
import * as download from 'downloadjs'
import localforage from 'localforage'
import types from '@/store/types'

/** 当前工程档案结构版本，导出时写入，加载时用于兼容判断 */
export const PROJECT_VERSION = 2

/** 自动保存的草稿快照（每次改动写入） */
const CHECKPOINT_KEY = 'local-checkpoint'
/** 显式保存的快照（点“保存”时写入），用于判断是否存在未保存改动 */
const SAVED_KEY = 'local-saved'

/**
 * 显式保存快照的内存缓存。
 * 放在模块作用域而不是 store.state，避免被撤销/重做整体回滚。
 */
let savedSnapshot

/**
 * 兼容早期版本的项目存档：加载时把旧字段名迁移为当前字段名，
 * 并补全缺失的容器字段，避免属性面板读到 undefined 直接报错。
 */
const legacyFieldMap = {
  egglement: 'element',
  containegg: 'canContain',
  componegg: 'componentType',
  wrappegg: 'isWrapper'
}

function normalizeProject(project) {
  if (!project || !Array.isArray(project.pages)) return project
  project.pages.forEach(migrateNode)
  project.pages.forEach(page => {
    // 页面实际尺寸（毫米），用于比例尺与导出换算
    if (!page.mm || typeof page.mm !== 'object') page.mm = { width: null, height: null }
    // 元件之间的连线关系（连线工具生成）
    if (!Array.isArray(page.links)) page.links = []
  })

  if (!Array.isArray(project.components)) project.components = []
  if (!project.title) project.title = '未命名项目'
  project.version = PROJECT_VERSION
  return project

  function migrateNode(node) {
    if (!node || typeof node !== 'object') return
    Object.keys(legacyFieldMap).forEach(oldKey => {
      const newKey = legacyFieldMap[oldKey]
      if (node[oldKey] !== undefined && node[newKey] === undefined) {
        node[newKey] = node[oldKey]
      }
      delete node[oldKey]
    })
    if (!Array.isArray(node.children)) node.children = []
    if (!node.attrs || typeof node.attrs !== 'object') node.attrs = {}
    if (!node.styles || typeof node.styles !== 'object') node.styles = {}
    if (!node.classes) node.classes = []
    if (Array.isArray(node.children)) node.children.forEach(migrateNode)
  }
}

/** 把工程对象编码为工程文件的 Base64 内容 */
function encodeProject(project) {
  return btoa(encodeURIComponent(escape(JSON.stringify(project))))
}

/**
 * 解析工程文件内容。
 * 支持本设计器导出的 Base64 档案，并顺带兼容未编码的裸 JSON。
 *
 * @param {string} raw : 工程文件原文
 * @return {object} : 解析后的工程对象
 * @throws {Error} : 内容为空、Base64 非法或 JSON 损坏时抛出可读错误
 */
function decodeProject(raw) {
  const text = String(raw === null || raw === undefined ? '' : raw)
    .replace(/^\uFEFF/, '')
    .trim()

  if (!text) throw new Error('工程文件内容为空')
  if (text.charAt(0) === '{') {
    try {
      return JSON.parse(text)
    } catch (error) {
      throw new Error('工程文件无法解析，可能已损坏')
    }
  }

  try {
    return JSON.parse(unescape(decodeURIComponent(atob(text))))
  } catch (error) {
    throw new Error('工程文件无法解析，可能已损坏或不是本设计器导出的工程文件')
  }
}

/**
 * 校验工程结构是否可用，失败时抛出可直接展示给用户的错误。
 * @param {object} project : 解析后的工程对象
 * @return {object} : 原对象
 */
function assertProject(project) {
  if (!project || typeof project !== 'object') {
    throw new Error('工程文件内容不是有效的工程数据')
  }
  if (!Array.isArray(project.pages) || project.pages.length === 0) {
    throw new Error('工程文件中没有任何页面，无法加载')
  }
  project.pages.forEach(page => {
    if (!page || typeof page !== 'object' || !page.id) {
      throw new Error('工程文件中的页面数据不完整，无法加载')
    }
  })
  return project
}

/**
 * 把一组属性写到元件上。
 * updateElement（单个）与 updateElements（批量，如对齐/分布）共用，
 * 保证两条路径的属性口径完全一致；undefined / null 一律跳过。
 */
function applyElementProps(element, payload) {
  if (!element || !payload) return
  if (typeof payload.left !== 'undefined' && payload.left !== null) {
    element.left = payload.left
  }
  if (typeof payload.top !== 'undefined' && payload.top !== null) {
    element.top = payload.top
  }
  if (typeof payload.right !== 'undefined' && payload.right !== null) {
    element.right = payload.right
  }
  if (typeof payload.bottom !== 'undefined' && payload.bottom !== null) {
    element.bottom = payload.bottom
  }
  if (typeof payload.zIndex !== 'undefined' && payload.zIndex !== null) {
    element.zIndex = payload.zIndex
  }
  if (typeof payload.height !== 'undefined' && payload.height !== null) {
    element.height = payload.height
  }
  if (typeof payload.width !== 'undefined' && payload.width !== null) {
    element.width = payload.width
  }
  if (
    typeof payload.primaryKey !== 'undefined' &&
    payload.primaryKey !== null
  ) {
    element.primaryKey = payload.primaryKey
  }
  if (typeof payload.text !== 'undefined' && payload.text !== null) {
    element.text = payload.text
  }
  if (typeof payload.locked !== 'undefined') element.locked = !!payload.locked
  if (payload.classes) element.classes = payload.classes
  if (payload.styles) element.styles = payload.styles
  if (payload.attrs) element.attrs = payload.attrs
}

/** 取出可参与计算的数值型坐标；'auto' / 百分比 / 非法值返回 null */
function numericPosition(value) {
  if (typeof value === 'number' && !isNaN(value)) return value
  if (typeof value === 'string' && value !== 'auto' && value.indexOf('%') === -1) {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? null : parsed
  }
  return null
}

/** 位移后的新坐标；非数值坐标（auto / 百分比）返回 null，交给调用方跳过 */
function shiftPosition(value, delta) {
  const numeric = numericPosition(value)
  if (numeric === null) return null
  return Math.round(numeric + delta)
}

/** 对齐基准取「当前编辑层级」的盒子：进入容器时是容器，否则是页面 */
function getScopeBox(state) {
  if (state.editorScopeId && state.selectedPage) {
    const node = getChildNode(state.selectedPage, state.editorScopeId)
    if (node) {
      const box = getAbsoluteBox(node.id)
      if (box) return box
    }
  }

  const page = state.selectedPage
  if (!page) return null
  const size = getNodeBoxSize(page)
  return { left: 0, top: 0, width: size.width, height: size.height }
}

/** 收集当前选中元件的绝对盒子（按选中顺序） */
function selectedBoxes(state) {
  return state.selectedElements
    .map(element => {
      const box = getAbsoluteBox(element.id)
      return box ? { element, box } : null
    })
    .filter(item => !!item)
}

export default {
  state: {
    isLoading: false,
    isBlockLoading: false,
    hasChanges: false,
    isSyncing: false,
    canUndo: false,
    canRedo: false,
    pageDialog: {
      isNew: true,
      isOpen: false
    },
    selectedPage: null,
    selectedElements: [],
    editorZoom: 1,
    /** 网格与吸附设置：visible 显示网格、snap 拖动吸附、size 步长（px） */
    grid: {
      visible: false,
      snap: true,
      size: 20
    },
    /** 当前进入的容器 id（null 表示停留在页面层级），用于框选与层级导航 */
    editorScopeId: null,
    /** 模拟状态预览：normal / alarm / offline，只影响画布显示 */
    previewState: 'normal',
    /** 连线模式：打开后画布上从元件拖到元件即可连线 */
    linkMode: false,
    /** 显式保存时间 / 草稿自动保存时间（毫秒时间戳） */
    lastSavedAt: null,
    lastSyncedAt: null,
    project: newProject('Layout Design')
  },
  getters: {
    /** componentGet */
    [types.getComponentRefIndexByName]: state => componentName => {
      return state.project.components.findIndex(
        page => page.name === componentName
      )
    },
    [types.getComponentRefByName]: (state, getters) => componentName => {
      const compIndex = getters.getComponentRefIndexByName(componentName)
      return state.project.components[compIndex]
    },
    [types.getComponentRefByIndex]: (state, getters) => compIndex => {
      return state.project.components[compIndex]
    },
    [types.componentExist]: (state, getters) => componentName => {
      const compIndex = getters.getComponentRefIndexByName(componentName)
      return compIndex > -1
    },
    /** componentGet */
    /** elementGet */
    [types.getSelectedElIndexById]: (state, getters) => id => {
      return state.selectedElements.findIndex(el => el.id === id)
    },
    /** elementGet */
    /** pageGet */
    [types.getPageIndexById]: state => id => {
      return state.project.pages.findIndex(page => page.id === id)
    },
    [types.getPageById]: (state, getters) => id => {
      const pageIndex = getters.getPageIndexById(id)
      return state.project.pages[pageIndex]
    },
    [types.pageExists]: (state, getters) => id => {
      const pageIndex = getters.getPageIndexById(id)
      return pageIndex > -1
    },
    [types.pathInUse]: state => pagePath => {
      const pageIndex = state.project.pages.findIndex(
        page => page.path === pagePath
      )
      return pageIndex > -1
    },
    [types.nameInUse]: state => pageName => {
      const pageIndex = state.project.pages.findIndex(
        page => page.name === pageName
      )
      return pageIndex > -1
    },
    currentPage: state => state.project.pages[0]
    /** pageGet */
  },
  mutations: {
    initializeState: function(state) {
      console.debug('Base state saved')
    },
    /** appMut */
    [types._toggleLoadingStatus]: function(state, isLoading) {
      state.isLoading = isLoading
    },
    [types._toggleBlockLoadingStatus]: function(state, isBlockLoading) {
      state.isBlockLoading = isBlockLoading
    },
    [types._toggleHasChanges]: function(state, hasChanges) {
      state.hasChanges = hasChanges
    },
    [types._toggleIsSyncing]: function(state, isSyncing) {
      state.isSyncing = isSyncing
    },
    [types._toggleCanUndo]: function(state, canUndo) {
      state.canUndo = canUndo
    },
    [types._toggleCanRedo]: function(state, canRedo) {
      state.canRedo = canRedo
    },
    [types._updateEditorZoom]: function(state, currentZoom) {
      state.editorZoom = clampZoom(currentZoom)
    },
    [types._setEditorScope]: function(state, elementId) {
      state.editorScopeId = elementId || null
    },
    /** 网格与吸附设置（编辑器偏好，不进撤销栈） */
    [types._updateGrid]: function(state, payload) {
      if (!payload) return
      if (typeof payload.visible === 'boolean') state.grid.visible = payload.visible
      if (typeof payload.snap === 'boolean') state.grid.snap = payload.snap
      if (typeof payload.size === 'number' && payload.size > 0) state.grid.size = payload.size
    },
    /** 模拟状态预览（编辑器偏好，不进撤销栈） */
    [types._setPreviewState]: function(state, value) {
      state.previewState = value || 'normal'
    },
    /** 连线模式开关（编辑器偏好） */
    [types._setLinkMode]: function(state, value) {
      state.linkMode = !!value
    },
    [types._addLink]: function(state, payload) {
      const page = payload.page
      if (!page) return
      if (!Array.isArray(page.links)) page.links = []
      page.links.push({
        id: payload.id,
        from: payload.from,
        to: payload.to,
        label: payload.label || ''
      })
    },
    [types._removeLink]: function(state, payload) {
      const page = payload.page
      if (!page || !Array.isArray(page.links)) return
      const index = page.links.findIndex(link => link.id === payload.id)
      if (index > -1) page.links.splice(index, 1)
    },
    [types._updateSaveStatus]: function(state, payload) {
      if (!payload) return
      if (typeof payload.lastSavedAt === 'number') state.lastSavedAt = payload.lastSavedAt
      if (typeof payload.lastSyncedAt === 'number') state.lastSyncedAt = payload.lastSyncedAt
    },
    /** appMut */
    /** componentMut */
    [types._saveComponentRef]: function(state, componentRef) {
      state.project.components.push(componentRef)
    },
    [types._updateComponentRef]: function(state, payload) {
      state.project.components.splice(payload.compIndex, 1, {
        ...state.project.components[payload.compIndex],
        usageCount: payload.newCount
      })
    },
    [types._removeComponentRef]: function(state, componentRefIndex) {
      state.project.components.splice(componentRefIndex, 1)
    },
    /** componentMut */
    /** elementMut */
    [types.createElement]: function(state, payload) {
      payload.parent.children.push(payload.element)
    },
    [types.updateElement]: function(state, payload) {
      applyElementProps(payload.element, payload)
    },
    /** 批量更新（对齐、分布、统一尺寸、批量锁定等），一次提交 = 一步撤销 */
    [types.updateElements]: function(state, payload) {
      const items = (payload && payload.items) || []
      items.forEach(item => applyElementProps(item.element, item))
    },
    [types.deleteElement]: function(state, payload) {
      payload.parent.children.splice(payload.elIndex, 1)
    },
    [types._clearSelectedElements]: function(state) {
      state.selectedElements = []
    },
    [types._addSelectedElements]: function(state, elements) {
      state.selectedElements = elements
    },

    [types._addSelectedElement]: function(state, elem) {
      state.selectedElements.push(elem)
    },
    [types._removeSelectedElement]: function(state, elemIndex) {
      state.selectedElements.splice(elemIndex, 1)
    },
    /** elementMut */
    /** pageMut */
    [types.createPage]: function(state, page) {
      state.project.pages.push(page)
    },
    [types.updatePage]: function(state, payload) {
      if (typeof payload.name !== 'undefined' && payload.name !== null) {
        payload.page.name = payload.name
      }
      if (typeof payload.path !== 'undefined' && payload.path !== null) {
        payload.page.path = payload.path
      }
      if (typeof payload.height !== 'undefined' && payload.height !== null) {
        payload.page.height = payload.height
      }
      if (typeof payload.width !== 'undefined' && payload.width !== null) {
        payload.page.width = payload.width
      }
      if (payload.mm && typeof payload.mm === 'object') {
        payload.page.mm = {
          width: Number(payload.mm.width) > 0 ? Number(payload.mm.width) : null,
          height: Number(payload.mm.height) > 0 ? Number(payload.mm.height) : null
        }
      }
      if (payload.styles) payload.page.styles = payload.styles
      if (payload.attrs) payload.page.attrs = payload.attrs
    },
    [types.deletePage]: function(state, pageIndex) {
      state.project.pages.splice(pageIndex, 1)
    },
    [types._togglePageDialog]: function(state, payload) {
      state.pageDialog.isNew = payload.isNew
      state.pageDialog.isOpen = payload.isOpen
    },
    [types._changeActivePage]: function(state, page) {
      state.selectedPage = page
      state.editorScopeId = null
    },
    [types._rebaseActivePage]: function(state, pageIndex) {
      state.project.pages.splice(pageIndex, 1, state.selectedPage)
    },
    /** pageMut */
    /** projectMut */
    [types.updateProject]: function(state, payload) {
      state.project.title = payload.title
    },
    [types.addProject]: function(state) {
      console.debug('The project has been loaded successfuly')
    },
    [types.deleteProject]: function(state) {
      console.debug('The project has been cleared')
    },
    [types.restoreProject]: function(state, payload) {
      state.selectedPage = payload.selectedPage
      state.editorScopeId = null
      state.project = payload.project
    }
    /** projectMut */
  },
  actions: {
    [types.registerElement]: function({ getters, commit }, payload) {
      const parent = getters.getPageById(payload.pageId)
      let el = payload.el

      if (el.componentType) {
        if (payload.global) {
          el = componentFactory.compInst(payload.el)
          if (!getters.componentExist(el.name)) {
            const componentRef = componentFactory.compRef(payload.el)
            commit(types._saveComponentRef, setElId(componentRef))
          } else {
            const compIndex = getters.getComponentRefIndexByName(el.name)
            const newCount =
              getters.getComponentRefByIndex(compIndex).usageCount + 1
            commit(types._updateComponentRef, { compIndex, newCount })
          }
        } else if (el.external) {
          // In case the componentType is from a external library...
          if (!getters.componentExist(el.name)) {
            const componentRef = componentFactory.compRef(payload.el)
            commit(types._saveComponentRef, setElId(componentRef))
          } else {
            const compIndex = getters.getComponentRefIndexByName(el.name)
            const newCount =
              getters.getComponentRefByIndex(compIndex).usageCount + 1
            commit(types._updateComponentRef, { compIndex, newCount })
          }
        }
      }

      const element = setElId(el, payload.pageId)
      commit(types.createElement, { parent, element })
    },
    [types.removeElement]: function({ getters, commit }, payload) {
      commit(types._clearSelectedElements)

      const parentId = payload.elId.substring(0, payload.elId.lastIndexOf('.'))
      const parent = getChildNode(payload.page, parentId)
      const elIndex = parent.children.findIndex(item => item.id === payload.elId)

      const element = parent.children[elIndex]
      if (element.componentType) {
        if (element.global || element.external) {
          const compIndex = getters.getComponentRefIndexByName(element.name)
          const count = getters.getComponentRefByIndex(compIndex).usageCount

          count > 1
            ? commit(types._updateComponentRef, {
              compIndex,
              newCount: count - 1
            })
            : commit(types._removeComponentRef, compIndex)
        }
      }
      commit(types.deleteElement, { parent, elIndex })
    },
    [types.resizeElement]: function({ getters, commit }, payload) {
      const page = getters.getPageById(payload.pageId)
      const element = getChildNode(page, payload.elId)

      if (
        payload.left !== element.left ||
        payload.top !== element.top ||
        payload.right !== element.right ||
        payload.bottom !== element.bottom ||
        payload.height !== element.height ||
        payload.width !== element.width
      ) {
        commit(types.updateElement, {
          element,
          left: element.left !== 'auto' ? payload.left : null,
          top: element.top !== 'auto' ? payload.top : null,
          bottom: element.bottom !== 'auto' ? payload.bottom : null,
          right: element.right !== 'auto' ? payload.right : null,
          height: element.height !== 'auto' ? payload.height : null,
          width: element.width !== 'auto' ? payload.width : null
        })
      }
    },
    [types.moveElement]: function({ getters, dispatch, commit }, payload) {
      const page = getters.getPageById(payload.pageId)
      const element = getChildNode(page, payload.elId)

      if (payload.parentId) {
        dispatch(types.changeElementParent, { ...payload, page, element })
      } else if (
        payload.left !== element.left ||
        payload.top !== element.top
      ) {
        commit(types.updateElement, {
          element,
          left: element.left !== 'auto' ? payload.left : null,
          top: element.top !== 'auto' ? payload.top : null,
          bottom: element.bottom !== 'auto' ? payload.bottom : null,
          right: element.right !== 'auto' ? payload.right : null
        })
      }
    },
    [types.changeElementParent]: function({ getters, commit }, payload) {
      // To avoid reference problems (the oldSelected element will be different)
      commit(types._clearSelectedElements)

      // Gets the computed dimensions before being take off the stage
      const height = getComputedProp('height', payload.element)
      const width = getComputedProp('width', payload.element)

      // OLD FAMILY business
      const oldParentId = payload.elId.substring(
        0,
        payload.elId.lastIndexOf('.')
      )
      const oldParent = getChildNode(payload.page, oldParentId)
      const childElIndex = oldParent.children.findIndex(
        item => item.id === payload.element.id
      )

      commit(types.deleteElement, {
        parent: oldParent,
        elIndex: childElIndex
      })

      // NEW FAMILY business
      const newParent = getChildNode(payload.page, payload.parentId)
      payload.element = setElId(payload.element, payload.parentId)

      commit(types.createElement, {
        parent: newParent,
        element: payload.element
      })

      // Update relative position and dimensions of the element
      const relPoint = calcRelativePoint(
        payload.page,
        payload.element.id,
        payload.mouseX,
        payload.mouseY
      )

      const left = relPoint.left - width / 2
      const top = relPoint.top - height / 2

      const fixedProps = fixElementToParentBounds(
        { top, left, height, width },
        newParent
      )
      commit(types.updateElement, {
        ...fixedProps,
        element: payload.element,
        bottom: 'auto',
        right: 'auto'
      })
    },
    [types.rebaseSelectedElements]: function({ getters, commit, state }) {
      const freshElements = state.selectedElements
        .map(el => (el ? getChildNode(state.selectedPage, el.id) : null))
        .filter(el => !!el)
      commit(types._clearSelectedElements)
      freshElements.map(el => commit(types._addSelectedElement, el))
    },
    /** elementMut */
    /** pageMut */
    [types.savePageAndClose]: function({ getters, commit }, payload) {
      commit(types._togglePageDialog, { isOpen: false, isNew: !payload.id })

      if (!payload.id) {
        const page = newPage({
          name: payload.name,
          path: payload.path.toLowerCase()
        })
        commit(types.createPage, page)
        commit(types._clearSelectedElements)
        commit(types._changeActivePage, page)
      } else {
        const pagePayload = {
          page: getters.getPageById(payload.id),
          name: payload.name,
          path: payload.path
        }
        commit(types.updatePage, pagePayload)
      }
    },
    [types.duplicatePage]: function({ getters, commit }, payload) {
      const extGlobCompList = getExtGlobComps(payload.page)

      let copyName = payload.page.name + ' 副本'
      let copySuffix = 1
      while (getters.nameInUse(copyName)) {
        copySuffix++
        copyName = payload.page.name + ' 副本' + copySuffix
      }

      let copyPath = payload.page.path + '-copy'
      copySuffix = 1
      while (getters.pathInUse(copyPath)) {
        copySuffix++
        copyPath = payload.page.path + '-copy' + copySuffix
      }

      const pageCopy = {
        ...setElId(payload.page),
        name: copyName,
        path: copyPath
      }

      if (extGlobCompList.length > 0) {
        for (const comp of extGlobCompList) {
          if (!getters.componentExist(comp.name)) {
            const componentRef = componentFactory.compRef(comp)
            commit(types._saveComponentRef, setElId(componentRef))
          } else {
            const compIndex = getters.getComponentRefIndexByName(comp.name)
            const newCount =
              getters.getComponentRefByIndex(compIndex).usageCount + 1
            commit(types._updateComponentRef, { compIndex, newCount })
          }
        }
      }
      commit(types.createPage, pageCopy)
      commit(types._changeActivePage, pageCopy)
    },
    [types.removePage]: function({ state, getters, commit }, payload) {
      const extGlobCompList = getExtGlobComps(
        state.project.pages[payload.pageIndex]
      )

      if (extGlobCompList.length > 0) {
        for (const comp of extGlobCompList) {
          const compIndex = getters.getComponentRefIndexByName(comp.name)
          const count = getters.getComponentRefByIndex(compIndex).usageCount

          count > 1
            ? commit(types._updateComponentRef, {
              compIndex,
              newCount: count - 1
            })
            : commit(types._removeComponentRef, compIndex)
        }
      }

      commit(types.deletePage, payload.pageIndex)
    },
    /** pageMut */
    /** projectMut */
    [types.checkLastSaved]: async function({ state, dispatch, commit }) {
      const currentProjectB64 = encodeProject(state.project)

      if (savedSnapshot === null || savedSnapshot === undefined) {
        savedSnapshot = await localforage.getItem(SAVED_KEY)
      }
      commit(types._toggleHasChanges, currentProjectB64 !== savedSnapshot)

      dispatch(types.syncLocal, currentProjectB64)
    },
    [types.syncLocal]: async function({ state, commit }, projectB64) {
      commit(types._toggleIsSyncing, true)

      const snapshot = projectB64 || encodeProject(state.project)
      try {
        await localforage.setItem(CHECKPOINT_KEY, snapshot)
        commit(types._updateSaveStatus, { lastSyncedAt: Date.now() })
      } catch (error) {
        // 本地存储不可用（隐私模式、空间不足）时不影响编辑，仅不写入草稿
        console.warn('草稿自动保存失败：', error)
      }

      commit(types._toggleIsSyncing, false)
    },
    [types.saveProject]: async function({ state, commit }) {
      const snapshot = encodeProject(state.project)
      try {
        await localforage.setItem(SAVED_KEY, snapshot)
      } catch (error) {
        return { ok: false, error: '保存失败：浏览器本地存储不可用或空间不足' }
      }

      savedSnapshot = snapshot
      commit(types._updateSaveStatus, { lastSavedAt: Date.now() })
      commit(types._toggleHasChanges, false)
      return { ok: true, savedAt: Date.now() }
    },
    [types.downloadProject]: async function({ state, commit }) {
      commit(types._toggleLoadingStatus, true)
      const parsedRepoName = state.project.title.replace(
        /[^a-zA-Z0-9-_]+/g,
        '-'
      )
      try {
        download(encodeProject(state.project), parsedRepoName + '.gg', 'application/json')
      } catch (error) {
        return { ok: false, error: '导出失败，请检查浏览器下载权限' }
      } finally {
        commit(types._toggleLoadingStatus, false)
      }
      return { ok: true }
    },
    [types.loadProject]: async function({ commit }, { origin, content }) {
      commit(types._toggleBlockLoadingStatus, true)

      try {
        let raw = content
        if (origin !== 'pc') {
          raw = await localforage.getItem(CHECKPOINT_KEY)
          if (!raw) return { ok: false, empty: true }
        }

        const project = assertProject(
          normalizeProject(decodeProject(raw))
        )

        commit(types.restoreProject, {
          selectedPage: null,
          project
        })
        commit(types.addProject)

        // 打开工程即视为「当前内容与存档一致」，
        // 否则刚打开就会显示未保存改动
        savedSnapshot = encodeProject(project)
        commit(types._toggleHasChanges, false)
        commit(types._updateSaveStatus, { lastSavedAt: Date.now() })

        return { ok: true, title: project.title, pageCount: project.pages.length }
      } catch (error) {
        return { ok: false, error: error.message || '工程文件加载失败' }
      } finally {
        commit(types._toggleBlockLoadingStatus, false)
      }
    },
    [types.clearProject]: async function({ commit }) {
      commit(types._toggleBlockLoadingStatus, true)
      commit(types.restoreProject, {
        selectedPage: null,
        project: newProject('Layout Design')
      })
      commit(types.deleteProject)
      commit(types._toggleBlockLoadingStatus, false)
      return { ok: true }
    },
    /**
     * 对齐选中元件：一次提交，撤销栈里只算一步。
     *
     * @param {{mode: string, reference: 'selection'|'canvas'}} payload
     */
    [types.alignElements]: function({ state, commit }, payload) {
      const mode = payload && payload.mode
      const items = selectedBoxes(state)
      if (items.length < 1) return { ok: false, error: '请先选中要处理的元件' }

      const reference = payload && payload.reference === 'canvas'
        ? getScopeBox(state)
        : unionBox(items.map(item => item.box))
      if (!reference) return { ok: false, error: '取不到对齐基准' }

      const targets = alignBoxes(items.map(item => item.box), mode, reference)
      const patches = []
      items.forEach((item, index) => {
        const dx = targets[index].left - item.box.left
        const dy = targets[index].top - item.box.top
        if (!dx && !dy) return
        const left = shiftPosition(item.element.left, dx)
        const top = shiftPosition(item.element.top, dy)
        if (left === null && top === null) return
        patches.push({ element: item.element, left, top })
      })

      if (!patches.length) {
        return { ok: false, error: '选中的元件已是该对齐方式，或坐标是百分比无法换算' }
      }
      commit(types.updateElements, { items: patches })
      return { ok: true, count: patches.length }
    },
    /** 等距分布（至少 3 个，首尾不动） */
    [types.distributeElements]: function({ state, commit }, payload) {
      const items = selectedBoxes(state)
      if (items.length < 3) return { ok: false, error: '等距分布至少需要选中 3 个元件' }

      const axis = payload && payload.axis === 'y' ? 'y' : 'x'
      const targets = distributeBoxes(items.map(item => item.box), axis)
      if (!targets) return { ok: false, error: '首尾元件之间放不下其余元件' }

      const patches = []
      items.forEach((item, index) => {
        const dx = targets[index].left - item.box.left
        const dy = targets[index].top - item.box.top
        if (!dx && !dy) return
        const left = shiftPosition(item.element.left, dx)
        const top = shiftPosition(item.element.top, dy)
        if (left === null && top === null) return
        patches.push({ element: item.element, left, top })
      })

      if (!patches.length) return { ok: false, error: '选中的元件已经等距' }
      commit(types.updateElements, { items: patches })
      return { ok: true, count: patches.length }
    },
    /** 统一尺寸：以第一个（或指定）元件为基准 */
    [types.equalizeElements]: function({ state, commit }, payload) {
      const items = selectedBoxes(state)
      if (items.length < 2) return { ok: false, error: '统一尺寸至少需要选中 2 个元件' }

      const prop = payload && payload.prop === 'height' ? 'height' : 'width'
      const size = equalizeSize(items.map(item => item.box), prop)
      if (!size) return { ok: false, error: '取不到基准尺寸' }

      const patches = items
        .filter(item => Math.round(item.box[prop]) !== size)
        .map(item => ({ element: item.element, [prop]: size }))

      if (!patches.length) return { ok: false, error: '选中的元件尺寸已经一致' }
      commit(types.updateElements, { items: patches })
      return { ok: true, count: patches.length, size, prop }
    },
    /** 批量锁定 / 编辑态隐藏 */
    [types.setElementsFlag]: function({ state, commit }, payload) {
      const elements = state.selectedElements.filter(element => !!element)
      if (!elements.length) return { ok: false, error: '请先选中元件' }

      const flag = payload && payload.flag === 'hidden' ? 'hidden' : 'locked'
      const value = !!(payload && payload.value)
      const items = elements.map(element =>
        flag === 'hidden'
          ? { element, attrs: Object.assign({}, element.attrs, { hidden: value }) }
          : { element, locked: value }
      )

      commit(types.updateElements, { items })
      if (flag === 'locked') commit(types._clearSelectedElements)
      return { ok: true, count: items.length, flag, value }
    },
    /**
     * 导出设备清单（CSV）。
     * scope = 'all' 导出整线（所有页面），'selected' 只导出当前选中元件。
     */
    [types.exportElementList]: function({ state }, payload) {
      const scope = payload && payload.scope === 'selected' ? 'selected' : 'all'
      const pages = state.project.pages || []

      let filter = null
      if (scope === 'selected') {
        filter = state.selectedElements.map(element => element.id)
        if (!filter.length) return { ok: false, error: '当前没有选中元件' }
      }

      const rows = []
      pages.forEach(page => {
        flattenPage(page).forEach(entry => {
          if (filter && filter.indexOf(entry.node.id) === -1) return
          rows.push(buildElementRow(entry.node, page, entry.parent))
        })
      })
      if (!rows.length) return { ok: false, error: '这个范围里没有元件可导出' }

      const name = String(state.project.title || 'layout').replace(
        /[^a-zA-Z0-9-_]+/g,
        '-'
      )
      try {
        // 前置 BOM，Excel 打开中文才不乱码
        download(
          '\ufeff' + toCSV([ELEMENT_EXPORT_HEADER].concat(rows)),
          name + '-设备清单.csv',
          'text/csv;charset=utf-8'
        )
      } catch (error) {
        return { ok: false, error: '导出失败，请检查浏览器下载权限' }
      }
      return { ok: true, count: rows.length, scope }
    },
    /**
     * 导出连线关系表（CSV）。
     * 端点元件已被删除的连线会自动跳过。
     */
    [types.exportLinkList]: function({ state }, payload) {
      const scope = payload && payload.scope === 'page' ? 'page' : 'all'
      const pages = scope === 'page'
        ? (state.selectedPage ? [state.selectedPage] : [])
        : (state.project.pages || [])
      if (!pages.length) return { ok: false, error: '没有可导出的页面' }

      const rows = buildLinkTable(pages)
      const count = rows.length - 1
      if (count <= 0) {
        return { ok: false, error: '还没有连线，先用工具栏的「连线」工具连几条' }
      }

      const name = String(state.project.title || 'layout').replace(
        /[^a-zA-Z0-9-_]+/g,
        '-'
      )
      try {
        download(
          '\ufeff' + toCSV(rows),
          name + '-连线关系.csv',
          'text/csv;charset=utf-8'
        )
      } catch (error) {
        return { ok: false, error: '导出失败，请检查浏览器下载权限' }
      }
      return { ok: true, count, scope }
    }
    /** projectMut */
  }
}
