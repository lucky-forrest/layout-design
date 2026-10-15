<template>
  <mr-container
    :id="page.id"
    :zoom="zoom"
    :style="pageStyles"
    :class="[page.classes, {stage: true}]"
    :active-elements="selectedElements"
    @arrows="arrowsHandler"
    @moving="movingHandler"
    @movestop="moveStopHandler"
    @resizestop="resizeStopHandler"
    @selectstop="selectStopHandler"
    @clearselection="clearSelectionHandler"
    @escape="escapeHandler"
    @delete="deleteHandler"
    @copy="copyHandler"
    @cut="cutHandler"
    @paste="pasteHandler"
    @drop="dropHandler"
    @dblclick.native="dblclickHandler"
    @undo="$root.$emit('undo')"
    @redo="$root.$emit('redo')"
  >
    <img
      v-if="pageBackground"
      :src="pageBackground.src"
      :style="backgroundStyle"
      :class="{ 'stage-bg': true }"
      data-stage-bg="true"
      alt="">
    <stage-el v-for="element in page.children" :key="element.id" :elem="element" />
    <link-layer :page="page" :zoom="zoom"/>
  </mr-container>
</template>

<script>
import cloneDeep from 'clone-deep'
import elementsFromPoint from '@/polyfills/elementsFromPoint'
import {
  getComputedProp,
  fixElementToParentBounds,
  getAbsoluteBox
} from '@/helpers/positionDimension'
import { getChildNode } from '@/helpers/recursiveMethods'
import { snapToGrid } from '@/helpers/grid'

import { mapState, mapActions, mapMutations } from 'vuex'
import {
  _clearSelectedElements,
  _addSelectedElements,
  _setEditorScope,
  registerElement,
  removeElement,
  resizeElement,
  moveElement,
  rebaseSelectedElements
} from '@/store/types'

import notify from '@/views/layouteditor/components/mixins/notify'
import MrContainer from '@/views/layouteditor/components/editor/common/mr-vue/MrContainer'
import StageEl from './StageEl'
import LinkLayer from './LinkLayer'

const DROP_BORDER = {
  width: '2px',
  style: 'solid',
  color: '#f1867f'
}

export default {
  name: 'Stage',
  components: { StageEl, MrContainer, LinkLayer },
  mixins: [notify],
  /* eslint-disable */
  props: ['page', 'zoom'],
  data: function() {
    return {
      clipboard: [],
      dropContainer: null,
      defaultBorder: {
        width: '',
        style: '',
        color: ''
      }
    }
  },
  computed: {
    /** 网格背景：小格 = 步长、大格 = 5 倍步长 */
    gridStyles() {
      if (!this.grid || !this.grid.visible) return {}

      const step = this.grid.size
      const major = step * 5
      const minorLine = 'rgba(43, 106, 115, .08) 1px, transparent 1px'
      const majorLine = 'rgba(43, 106, 115, .20) 1px, transparent 1px'

      return {
        backgroundImage: [
          'linear-gradient(to right, ' + majorLine + ')',
          'linear-gradient(to bottom, ' + majorLine + ')',
          'linear-gradient(to right, ' + minorLine + ')',
          'linear-gradient(to bottom, ' + minorLine + ')'
        ].join(','),
        backgroundSize: [
          major + 'px ' + major + 'px',
          major + 'px ' + major + 'px',
          step + 'px ' + step + 'px',
          step + 'px ' + step + 'px'
        ].join(',')
      }
    },

    pageStyles() {
      return {
        ...this.page.styles,
        ...this.gridStyles,
        height:
          typeof this.page.height === 'string'
            ? this.page.height
            : this.page.height + 'px',
        width:
          typeof this.page.width === 'string'
            ? this.page.width
            : this.page.width + 'px',
        transform: 'scale(' + this.zoom + ')'
      }
    },

    /** 当前编辑层级：进入了容器就作用于容器，否则作用于页面 */
    scopeNode() {
      if (!this.editorScopeId) return this.page
      return getChildNode(this.page, this.editorScopeId) || this.page
    },

    /** 底图：始终固定在元件之下，不参与点选与拖动 */
    pageBackground() {
      const bg = this.page.attrs && this.page.attrs.background
      return bg && bg.src ? bg : null
    },

    backgroundStyle() {
      const bg = this.pageBackground
      if (!bg) return {}

      return {
        position: 'absolute',
        left: (Number(bg.x) || 0) + 'px',
        top: (Number(bg.y) || 0) + 'px',
        width: (Number(bg.width) || 0) + 'px',
        height: 'auto',
        opacity: typeof bg.opacity === 'number' ? bg.opacity : 1,
        transform: 'rotate(' + (Number(bg.rotate) || 0) + 'deg)',
        transformOrigin: 'top left',
        pointerEvents: 'none',
        userSelect: 'none'
      }
    },

    ...mapState({
      editorScopeId: state => state.layoutEditor.editorScopeId,
      selectedElements: state => state.layoutEditor.selectedElements || [],
      grid: state => state.layoutEditor.grid,
      projectComponents: state => state.layoutEditor.project.components
    })
  },
  methods: {
    clearSelectionHandler() {
      if (this.selectedElements.length > 0) this._clearSelectedElements()
    },

    /** Esc：先清空选中，已在容器内时再退回上一层 */
    escapeHandler() {
      if (this.selectedElements.length > 0) {
        this._clearSelectedElements()
      } else if (this.editorScopeId) {
        this._setEditorScope(null)
      }
    },

    /** 双击容器：进入该容器层级，方便选中与框选内部元件 */
    dblclickHandler(e) {
      const containerDom = e.target.closest
        ? e.target.closest('[data-can-contain="true"]')
        : null
      if (!containerDom || !containerDom.id) return
      if (containerDom.id === this.editorScopeId) return

      const node = getChildNode(this.page, containerDom.id)
      if (!node) return

      this._setEditorScope(node.id)
      this._clearSelectedElements()
      this._addSelectedElements([node])
    },

    deleteHandler() {
      const count = this.selectedElements.length
      if (count === 0) return

      this.selectedElements.map(el =>
        this.removeElement({ page: this.page, elId: el.id })
      )
      this.notifySuccess('已删除 ' + count + ' 个元件，可用 Ctrl+Z 撤销')
    },

    copyHandler() {
      if (this.selectedElements.length > 0) {
        this.clipboard = []
        this.selectedElements.map(el => this.clipboard.push(cloneDeep(el)))
        this.notifyInfo('已复制 ' + this.clipboard.length + ' 个元件')
      }
    },

    cutHandler() {
      if (this.selectedElements.length > 0) {
        this.clipboard = []
        this.selectedElements.map(el => {
          this.clipboard.push(cloneDeep(el))
          this.removeElement({ page: this.page, elId: el.id })
        })
        this.notifyInfo('已剪切 ' + this.clipboard.length + ' 个元件，可用 Ctrl+V 粘贴')
      }
    },

    pasteHandler() {
      if (this.clipboard.length > 0) {
        this.clipboard.map(el => {
          this.registerElement({ pageId: this.page.id, el, global: el.global })
        })
        this.notifySuccess('已粘贴 ' + this.clipboard.length + ' 个元件')
      }
    },

    dropHandler(e) {
      let element = JSON.parse(e.dataTransfer.getData('text/plain'))

      const height = getComputedProp('height', element, this.page)
      const width = getComputedProp('width', element, this.page)

      // 以鼠标在画布中的实际落点为基准：
      // 扣掉画布自身偏移与边框，再换算回未缩放的页面坐标，最后按元件中心对齐
      const stageRect = this.$el.getBoundingClientRect()
      const stageStyle = window.getComputedStyle(this.$el)
      const borderLeft = parseFloat(stageStyle.borderLeftWidth) || 0
      const borderTop = parseFloat(stageStyle.borderTopWidth) || 0

      const top = Math.round(
        (e.clientY - stageRect.top) / this.zoom - borderTop - height / 2
      )
      const left = Math.round(
        (e.clientX - stageRect.left) / this.zoom - borderLeft - width / 2
      )

      // 开了网格吸附时，落点也吸到网格线上，和拖动保持一致
      const snapSize = this.grid && this.grid.snap ? this.grid.size : 0
      const dropped = snapSize
        ? { top: snapToGrid(top, snapSize), left: snapToGrid(left, snapSize) }
        : { top, left }

      const fixedElement = fixElementToParentBounds(
        { ...dropped, height, width },
        this.page
      )
      element = { ...element, ...fixedElement }

      this.registerElement({
        pageId: this.page.id,
        el: element,
        global: e.shiftKey
      })
    },

    selectStopHandler(selectionBox) {
      const scopeNode = this.scopeNode

      if (
        (selectionBox.top === selectionBox.bottom &&
          selectionBox.left === selectionBox.right) ||
        !scopeNode ||
        scopeNode.children.length === 0
      )
        return

      const matched = []
      scopeNode.children.forEach(childEl => {
        // 锁定的元件不参与框选
        if (childEl.locked) return

        const child = childEl.global
          ? { ...childEl, ...this.getComponentRef(childEl), id: childEl.id }
          : childEl

        // 用绝对盒子做相交判断，容器内的元件同样能框选到
        const box = getAbsoluteBox(childEl.id)
        if (!box) return

        const childTop = box.top
        const childLeft = box.left
        const childBottom = box.top + box.height
        const childRight = box.left + box.width

        if (
          childTop <= selectionBox.bottom &&
          childLeft <= selectionBox.right &&
          childBottom >= selectionBox.top &&
          childRight >= selectionBox.left
        ) {
          matched.push(child)
        }
      })

      if (matched.length === 0) return

      if (selectionBox.additive) {
        // Shift 框选：把新框到的元件追加到已有选中里
        const selectedIds = this.selectedElements.map(el => el.id)
        this._addSelectedElements(
          this.selectedElements.concat(
            matched.filter(el => selectedIds.indexOf(el.id) === -1)
          )
        )
      } else {
        this._addSelectedElements(matched)
      }
    },

    getComponentRef(component) {
      return this.projectComponents[
        this.projectComponents.findIndex(comp => comp.name === component.name)
      ]
    },

    resizeStopHandler(resStopData) {
      resStopData.map(resElData =>
        this.resizeElement({ ...resElData, pageId: this.page.id })
      )
      this.rebaseSelectedElements()
    },

    arrowsHandler({ direction, shiftKey }) {
      if (this.selectedElements.length > 0) {
        const diff = shiftKey ? 10 : 1

        let addedTop = 0
        let addedBottom = 0
        let addedLeft = 0
        let addedRight = 0

        switch (direction) {
          case 'up':
            addedTop -= diff
            addedBottom += diff
            addedLeft = addedRight = null
            break
          case 'down':
            addedBottom -= diff
            addedTop += diff
            addedLeft = addedRight = null
            break
          case 'left':
            addedLeft -= diff
            addedRight += diff
            addedTop = addedBottom = null
            break
          case 'right':
            addedRight -= diff
            addedLeft += diff
            addedTop = addedBottom = null
            break
        }

        this.selectedElements.map(el => {
          const compTop = getComputedProp('top', el)
          const compBottom = getComputedProp('bottom', el)
          const compLeft = getComputedProp('left', el)
          const compRight = getComputedProp('right', el)

          const top =
            addedTop && compTop + addedTop >= 0 && compBottom + addedBottom >= 0
              ? compTop + addedTop
              : null
          const bottom =
            addedBottom &&
            compBottom + addedBottom >= 0 &&
            compTop + addedTop >= 0
              ? compBottom + addedBottom
              : null
          const left =
            addedLeft &&
            compLeft + addedLeft >= 0 &&
            compRight + addedRight >= 0
              ? compLeft + addedLeft
              : null
          const right =
            addedRight &&
            compRight + addedRight >= 0 &&
            compLeft + addedLeft >= 0
              ? compRight + addedRight
              : null

          if (top || bottom || left || right) {
            this.moveElement({
              elId: el.id,
              pageId: this.page.id,
              top,
              bottom,
              left,
              right
            })
          }
        })
        this.rebaseSelectedElements()
      }
    },

    movingHandler(absMouseX, absMouseY) {
      this.dropContainer = this.getContainerOnPoint(absMouseX, absMouseY)
      this.toggleDroppableCursor(!!this.dropContainer)
    },

    moveStopHandler(moveStopData) {
      const canContain = this.getContainerOnPoint(
        moveStopData.absMouseX,
        moveStopData.absMouseY
      )
      const parentId = canContain ? canContain.id : null

      moveStopData.moveElData.map(moveData =>
        this.moveElement({
          ...moveData,
          pageId: this.page.id,
          parentId,
          mouseX: moveStopData.relMouseX,
          mouseY: moveStopData.relMouseY
        })
      )

      this.rebaseSelectedElements()
      this.toggleDroppableCursor(false)
      this.dropContainer = null
    },

    getContainerOnPoint(x, y) {
      const movingElements = this.selectedElements
      const parentsIds = movingElements.map(item =>
        item.id.substring(0, item.id.lastIndexOf('.'))
      )
      const commonParentId = parentsIds.every((val, i, arr) => val === arr[0])
        ? parentsIds[0]
        : null
      const elementsOnPoint = elementsFromPoint(x, y)

      for (const el of elementsOnPoint) {
        if (el.id === commonParentId) return null
        if (
          el.dataset.mrContainer ||
          (el.dataset.canContain &&
            !el.dataset.componentType &&
            movingElements.every(item => !el.id.includes(item.id)))
        )
          return el
      }
      return null
    },

    toggleDroppableCursor(isDroppable) {
      isDroppable
        ? document.documentElement.classList.add('droppable')
        : document.documentElement.classList.remove('droppable')
    },

    ...mapActions([
      rebaseSelectedElements,
      registerElement,
      removeElement,
      resizeElement,
      moveElement
    ]),
    ...mapMutations([
      _clearSelectedElements,
      _addSelectedElements,
      _setEditorScope
    ])
  },
  watch: {
    dropContainer: function(newVal, oldVal) {
      if (oldVal) {
        oldVal.style.borderWidth = this.defaultBorder.width
        oldVal.style.borderStyle = this.defaultBorder.style
        oldVal.style.borderColor = this.defaultBorder.color
      }

      if (newVal) {
        this.defaultBorder.width = newVal.style.borderWidth
        this.defaultBorder.style = newVal.style.borderStyle
        this.defaultBorder.color = newVal.style.borderColor
        newVal.style.borderWidth = DROP_BORDER.width
        newVal.style.borderStyle = DROP_BORDER.style
        newVal.style.borderColor = DROP_BORDER.color
      }
    }
  }
}
</script>

<style>
html.droppable,
html.droppable * {
  cursor: copy !important;
}
</style>

<style scoped>
.stage {
  position: absolute !important;
  left: 0;
  top: 0;
  margin: 0;
  transform-origin: 0 0;
  user-select: none;
  border: 2px solid #e3e3e3;
  /* for paper style */
  /* box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2); */
}

/* 底图垫在最下层，永远不接收鼠标事件 */
.stage-bg {
  z-index: 0;
}
</style>
