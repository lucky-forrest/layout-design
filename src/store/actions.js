import * as t from './mutations'
import notice from '@/utils/notice'

const makeAction = type => ({ commit }, payload) => commit(type, payload)

const makeActions = mutations => {
  return Object.keys(mutations).reduce((actions, type) => {
    actions[type] = makeAction(normalMutations[type])
    return actions
  }, {})
}

// 可以简单处理的 mutation
const normalMutations = {
  addRenderItem: t.ADD_RENDER_ITEM,
  copyRenderItem: t.COPY_RENDER_ITEM,
  editRenderItem: t.EDIT_RENDER_ITEM,
  cleanRenderItem: t.CLEAN_RENDER_ITEM,
  loadRenderItem: t.LOAD_RENDER_ITEM,
  editDragModule: t.EDIT_DRAG_MODULE,
  blurRenderItem: t.BLUR_RENDER_ITEM,
  focusDocumentTitle: t.FOCUS_DOCUMENT_TITLE,
  editDraging: t.EDIT_DRAGING,
  editRenderData: t.EDIT_RENDER_DATA,
  resetRenderState: t.RESET_RENDER_STATE,
  updateLayoutData: t.UPDATE_LAYOUT_DATA,
  loadRenderConfig: t.LOAD_RENDER_CONFIG
}

const activeRenderItem = ({ commit }, event) => {
  commit(t.ACTIVE_RENDER_ITEM, getDragInfo(event))
}
const dropRenderItem = ({ state, commit }, event) => {
  const module = state.layout.dragModule
  const { dragTag, isDragZone } = getDragInfo(event)
  if (isDragZone) {
    if (dragTag === 'modules') {
      if (['local', 'panel'].includes(module.type)) {
        commit(t.ADD_RENDER_ITEM, {
          type: module.type,
          module: module
        })
      }
    } else {
      const index = dragTag.split('-')[1]
      commit(t.ADD_RENDER_ITEM, {
        type: module.type,
        module: module,
        parent: index
      })
    }
  }
  if (dragTag && !isDragZone) {
    notice.error('当前容器不支持添加此组件！', () => {
      commit(t.ACTIVE_RENDER_ITEM, {})
    })
  }
  return dragTag
}

/**
 * 获得拖拽元素标签和应该出现的位置
 * @param event
 * @returns {{dragTag: string, position: string}}
 */
function getDragInfo(event) {
  const dragTarget = getDragTarget(event.target)
  const dragTag = dragTarget && dragTarget.getAttribute('drag-tag')
  const isDragZone = dragTarget && dragTarget.getAttribute('drag-zone')

  return {
    dragTag,
    isDragZone
  }
}

/**
 * 获得拖拽元素的标签名
 * @param target
 * @returns {string}
 */
function getDragTarget(target) {
  let currentNode = target

  while (currentNode) {
    if (currentNode.getAttribute && currentNode.getAttribute('drag-tag')) {
      return currentNode
    }

    currentNode = currentNode.parentNode
  }
}

export default {
  ...makeActions(normalMutations),
  activeRenderItem,
  dropRenderItem
}
