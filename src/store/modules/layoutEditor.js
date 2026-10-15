import {
  getExtGlobComps,
  setElId,
  getChildNode,
  calcRelativePoint
} from '@/helpers/recursiveMethods'
import {
  fixElementToParentBounds,
  getComputedProp
} from '@/helpers/positionDimension'
import componentFactory from '@/factories/componentFactory'
import newProject from '@/factories/projectFactory'
import newPage from '@/factories/pageFactory'
import * as download from 'downloadjs'
import localforage from 'localforage'
import types from '@/store/types'
import shortid from 'shortid'

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
      state.editorZoom = currentZoom
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
    [types.createEgglement]: function(state, payload) {
      payload.parent.children.push(payload.egglement)
    },
    [types.updateEgglement]: function(state, payload) {
      if (typeof payload.left !== 'undefined' && payload.left !== null) {
        payload.egglement.left = payload.left
      }
      if (typeof payload.top !== 'undefined' && payload.top !== null) {
        payload.egglement.top = payload.top
      }
      if (typeof payload.right !== 'undefined' && payload.right !== null) {
        payload.egglement.right = payload.right
      }
      if (typeof payload.bottom !== 'undefined' && payload.bottom !== null) {
        payload.egglement.bottom = payload.bottom
      }
      if (typeof payload.zIndex !== 'undefined' && payload.zIndex !== null) {
        payload.egglement.zIndex = payload.zIndex
      }
      if (typeof payload.height !== 'undefined' && payload.height !== null) {
        payload.egglement.height = payload.height
      }
      if (typeof payload.width !== 'undefined' && payload.width !== null) {
        payload.egglement.width = payload.width
      }
      if (
        typeof payload.primaryKey !== 'undefined' &&
        payload.primaryKey !== null
      ) {
        payload.egglement.primaryKey = payload.primaryKey
      }
      if (typeof payload.text !== 'undefined' && payload.text !== null) {
        payload.egglement.text = payload.text
      }
      if (payload.classes) payload.egglement.classes = payload.classes
      if (payload.styles) payload.egglement.styles = payload.styles
      if (payload.attrs) payload.egglement.attrs = payload.attrs
    },
    [types.deleteEgglement]: function(state, payload) {
      payload.parent.children.splice(payload.eggIndex, 1)
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
      if (payload.styles) payload.page.styles = payload.styles
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
      state.project = payload.project
    }
    /** projectMut */
  },
  actions: {
    [types.registerElement]: function({ getters, commit }, payload) {
      const parent = getters.getPageById(payload.pageId)
      let el = payload.el

      if (el.componegg) {
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
          // In case the componegg is from a external library...
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

      const egglement = setElId(el, payload.pageId)
      commit(types.createEgglement, { parent, egglement })
    },
    [types.removeElement]: function({ getters, commit }, payload) {
      commit(types._clearSelectedElements)

      const parentId = payload.elId.substring(0, payload.elId.lastIndexOf('.'))
      const parent = getChildNode(payload.page, parentId)
      const eggIndex = parent.children.findIndex(egg => egg.id === payload.elId)

      const element = parent.children[eggIndex]
      if (element.componegg) {
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
      commit(types.deleteEgglement, { parent, eggIndex })
    },
    [types.resizeElement]: function({ getters, commit }, payload) {
      const page = getters.getPageById(payload.pageId)
      const egglement = getChildNode(page, payload.elId)

      if (
        payload.left !== egglement.left ||
        payload.top !== egglement.top ||
        payload.right !== egglement.right ||
        payload.bottom !== egglement.bottom ||
        payload.height !== egglement.height ||
        payload.width !== egglement.width
      ) {
        commit(types.updateEgglement, {
          egglement,
          left: egglement.left !== 'auto' ? payload.left : null,
          top: egglement.top !== 'auto' ? payload.top : null,
          bottom: egglement.bottom !== 'auto' ? payload.bottom : null,
          right: egglement.right !== 'auto' ? payload.right : null,
          height: egglement.height !== 'auto' ? payload.height : null,
          width: egglement.width !== 'auto' ? payload.width : null
        })
      }
    },
    [types.moveElement]: function({ getters, dispatch, commit }, payload) {
      const page = getters.getPageById(payload.pageId)
      const egglement = getChildNode(page, payload.elId)

      if (payload.parentId) {
        dispatch(types.changeElementParent, { ...payload, page, egglement })
      } else if (
        payload.left !== egglement.left ||
        payload.top !== egglement.top
      ) {
        commit(types.updateEgglement, {
          egglement,
          left: egglement.left !== 'auto' ? payload.left : null,
          top: egglement.top !== 'auto' ? payload.top : null,
          bottom: egglement.bottom !== 'auto' ? payload.bottom : null,
          right: egglement.right !== 'auto' ? payload.right : null
        })
      }
    },
    [types.changeElementParent]: function({ getters, commit }, payload) {
      // To avoid reference problems (the oldSelected element will be different)
      commit(types._clearSelectedElements)

      // Gets the computed dimensions before being take off the stage
      const height = getComputedProp('height', payload.egglement)
      const width = getComputedProp('width', payload.egglement)

      // OLD FAMILY business
      const oldParentId = payload.elId.substring(
        0,
        payload.elId.lastIndexOf('.')
      )
      const oldParent = getChildNode(payload.page, oldParentId)
      const childEggIndex = oldParent.children.findIndex(
        egg => egg.id === payload.egglement.id
      )

      commit(types.deleteEgglement, {
        parent: oldParent,
        eggIndex: childEggIndex
      })

      // NEW FAMILY business
      const newParent = getChildNode(payload.page, payload.parentId)
      payload.egglement = setElId(payload.egglement, payload.parentId)

      commit(types.createEgglement, {
        parent: newParent,
        egglement: payload.egglement
      })

      // Update relative position and dimensions of the element
      const relPoint = calcRelativePoint(
        payload.page,
        payload.egglement.id,
        payload.mouseX,
        payload.mouseY
      )

      const left = relPoint.left - width / 2
      const top = relPoint.top - height / 2

      const fixedProps = fixElementToParentBounds(
        { top, left, height, width },
        newParent
      )
      commit(types.updateEgglement, {
        ...fixedProps,
        egglement: payload.egglement,
        bottom: 'auto',
        right: 'auto'
      })
    },
    [types.rebaseSelectedElements]: function({ getters, commit, state }) {
      const freshElements = state.selectedElements.map(el =>
        getChildNode(state.selectedPage, el.id)
      )
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
      const copyId = shortid.generate()
      const extGlobCompList = getExtGlobComps(payload.page)

      const pageCopy = {
        ...setElId(payload.page),
        name: payload.page.name + copyId,
        path: payload.page.path + copyId
      }

      if (extGlobCompList.length > 0) {
        for (const comp of extGlobCompList) {
          if (!getters.componentExist(comp.name)) {
            const componentRef = componentFactory.compRef(payload.el)
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
      const currentProjectB64 =
        btoa(encodeURIComponent(escape(JSON.stringify(state.project))))
      const lastSavedProjectB64 = await localforage.getItem('gh-last-saved')

      if (currentProjectB64 === lastSavedProjectB64) {
        commit(types._toggleHasChanges, false)
      } else {
        commit(types._toggleHasChanges, true)
      }

      dispatch(types.syncLocal, currentProjectB64)
    },
    [types.syncLocal]: async function({ state, commit }, projectB64) {
      commit(types._toggleIsSyncing, true)

      let pB64 = projectB64
      if (!pB64) {
        pB64 = btoa(encodeURIComponent(escape(JSON.stringify(state.project))))
      }

      await localforage.setItem('local-checkpoint', pB64)
      commit(types._toggleIsSyncing, false)
    },
    [types.downloadProject]: async function({ state, dispatch, commit }) {
      commit(types._toggleLoadingStatus, true)
      const parsedRepoName = state.project.title.replace(
        /[^a-zA-Z0-9-_]+/g,
        '-'
      )
      const projectB64 = btoa(encodeURIComponent(escape(JSON.stringify(state.project))))
      download(projectB64, parsedRepoName + '.gg', 'appliction/json')
      commit(types._toggleLoadingStatus, false)
    },
    [types.loadVueggProject]: async function(
      { state, dispatch, commit },
      { origin, userName, repoName, content }
    ) {
      commit(types._toggleBlockLoadingStatus, true)
      let project
      switch (origin) {
        case 'local':
          project = await localforage.getItem('local-checkpoint')
          break
        case 'pc':
          project = content
          break
        default:
          project = await localforage.getItem('local-checkpoint')
      }
      if (project) {
        commit(types.restoreProject, {
          selectedPage: null,
          project: JSON.parse(unescape(decodeURIComponent(atob(project))))
        })
        commit(types.addProject)
      }
      commit(types._toggleBlockLoadingStatus, false)
    },
    [types.clearProject]: async function(state) {
      state.commit(types._toggleBlockLoadingStatus, true)

      state.commit(types.restoreProject, {
        selectedPage: null,
        project: newProject('LayoutDesign')
      })
      state.commit(types.deleteProject)
      state.commit(types._toggleBlockLoadingStatus, false)
    }
    /** projectMut */
  }
}
