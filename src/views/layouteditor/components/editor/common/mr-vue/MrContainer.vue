<template>
  <div
    data-mr-container="true"
    class="mr-container"
    tabindex="0"
    @mousedown.capture="mouseDownHandler"
    @keydown.esc.stop.exact.prevent="$emit('escape')"
    @keydown.delete.exact.stop.prevent="$emit('delete')"
    @keydown.ctrl.67.exact.stop.prevent="$emit('copy')"
    @keydown.meta.67.exact.stop.prevent="$emit('copy')"
    @keydown.ctrl.88.exact.stop.prevent="$emit('cut')"
    @keydown.meta.88.exact.stop.prevent="$emit('cut')"
    @keydown.ctrl.86.exact.stop.prevent="$emit('paste')"
    @keydown.meta.86.exact.stop.prevent="$emit('paste')"
    @keydown.ctrl.90.exact.stop.prevent="$emit('undo')"
    @keydown.meta.90.exact.stop.prevent="$emit('undo')"
    @keydown.ctrl.shift.90.exact.stop.prevent="$emit('redo')"
    @keydown.meta.shift.90.exact.stop.prevent="$emit('redo')"
    @keydown.up.stop.prevent="e => $emit('arrows', {direction: 'up', shiftKey: e.shiftKey})"
    @keydown.down.stop.prevent="e => $emit('arrows', {direction: 'down', shiftKey: e.shiftKey})"
    @keydown.left.stop.prevent="e => $emit('arrows', {direction: 'left', shiftKey: e.shiftKey})"
    @keydown.right.stop.prevent="e => $emit('arrows', {direction: 'right', shiftKey: e.shiftKey})"
    @drop.prevent="e => $emit('drop', e)"
    @dragover.prevent
  >
    <slot/>
    <div
      v-if="guides.vertical.length || guides.horizontal.length"
      class="guide-layer"
      data-mr-guides="true">
      <div
        v-for="(line, index) in guides.vertical"
        :key="'v' + index"
        :style="{ left: line + 'px' }"
        class="guide guide--v"/>
      <div
        v-for="(line, index) in guides.horizontal"
        :key="'h' + index"
        :style="{ top: line + 'px' }"
        class="guide guide--h"/>
    </div>
    <div v-show="selecting" ref="selectionArea" class="selection-area"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { unionBox } from '@/helpers/layoutAlign'
import { guideLines, resolveSnap } from '@/helpers/grid'

export default {
  name: 'MrContainer',
  props: {
    activeElements: {
      type: Array,
      default() {
        return []
      }
    },
    zoom: {
      type: Number,
      default: 1
    }
  },
  data: function() {
    return {
      initialAbsPos: { x: 0, y: 0 },
      initialRelPos: { x: 0, y: 0 },
      currentAbsPos: { x: 0, y: 0 },
      currentRelPos: { x: 0, y: 0 },
      lastAbsPos: { x: 0, y: 0 },
      selecting: false,
      selectionAdditive: false,
      moving: false,
      resizing: false,
      handle: null,
      /** 拖动过程中命中的对齐参考线（容器坐标系） */
      guides: { vertical: [], horizontal: [] },
      /** 按下时各元件的位置、整个选区的起始外框与候选参考线 */
      startPositions: [],
      startBox: null,
      guideTargets: { vertical: [], horizontal: [] }
    }
  },
  computed: {
    mrElements() {
      return this.activeElements.map(el => document.getElementById(el.id).parentElement)
    },

    ...mapState({
      grid: state => state.layoutEditor.grid
    })
  },
  methods: {
    mouseDownHandler(e) {
      let isMrs = false
      const modifierKey = e.shiftKey || e.metaKey || e.ctrlKey
      this.initialAbsPos = this.currentAbsPos = this.getMouseAbsPoint(e)
      this.initialRelPos = this.currentRelPos = this.getMouseRelPoint(e)
      this.lastAbsPos = { x: this.currentAbsPos.x, y: this.currentAbsPos.y }

      if (e.target.dataset.mrContainer) {
        // Shift 按住时先在容器空白处起框选，保留已有选中以便追加
        if (!e.shiftKey) this.$emit('clearselection')
        this.selectionAdditive = e.shiftKey
        this.renderSelectionArea({ x: -1, y: -1 }, { x: -1, y: -1 })
        isMrs = this.selecting = true
      } else if (e.target.dataset.mrHandle) {
        isMrs = this.resizing = true
        this.handle = e.target.classList[1]
        // this.$emit('resizestart')
      } else if (this.getParentMr(e.target)) {
        // 按住 Shift/Ctrl/Cmd 点选元件时只做加减选，不进入拖拽，
        // 避免加选过程中误移动已选中的元件
        isMrs = this.moving = !modifierKey
        if (this.moving) this.captureMoveStart()
        // this.$emit('movestart')
      }

      if (isMrs) {
        document.documentElement.addEventListener('mousemove', this.mouseMoveHandler, true)
        document.documentElement.addEventListener('mouseup', this.mouseUpHandler, true)
      }
    },

    mouseUpHandler(e) {
      // 让画布容器获得焦点以接收键盘事件，同时保持滚动位置不变
      const scroller =
        document.getElementById('canvas-main') || document.getElementById('main')
      const scrollLeft = scroller.scrollLeft
      const scrollTop = scroller.scrollTop
      this.$el.focus()
      scroller.scrollLeft = scrollLeft
      scroller.scrollTop = scrollTop

      // 只有真正发生了位移才提交，避免单击被当成一次拖动
      const moved =
        this.initialAbsPos.x !== this.currentAbsPos.x ||
        this.initialAbsPos.y !== this.currentAbsPos.y

      if (moved) {
        if (this.resizing) this.$emit('resizestop', this.resizeStopData())
        else if (this.moving) this.$emit('movestop', this.moveStopData())
        else if (this.selecting) this.$emit('selectstop', this.selectStopData())
      }

      this.moving = false
      this.resizing = false
      this.selecting = false
      this.handle = null
      this.startPositions = []
      this.startBox = null
      this.guides = { vertical: [], horizontal: [] }
      this.$root.$emit('editor-hud', { visible: false })

      document.documentElement.removeEventListener('mousemove', this.mouseMoveHandler, true)
      document.documentElement.removeEventListener('mouseup', this.mouseUpHandler, true)
    },

    mouseMoveHandler(e) {
      const lastAbsX = this.lastAbsPos.x
      const lastAbsY = this.lastAbsPos.y

      this.currentAbsPos = this.getMouseAbsPoint(e)
      this.currentRelPos = this.getMouseRelPoint(e)
      this.lastAbsPos = { x: this.currentAbsPos.x, y: this.currentAbsPos.y }

      if (this.resizing) {
        const offX = this.currentAbsPos.x - lastAbsX
        const offY = this.currentAbsPos.y - lastAbsY
        this.mrElements.map(mrEl => {
          if (!mrEl.children[0].dataset.global) this.resizeElementBy(mrEl, offX, offY)
        })
        this.publishHud('resize')
        // this.$emit('resizing')
      } else if (this.moving) {
        this.moveByCursor(e)
        this.$emit('moving', this.currentAbsPos.x, this.currentAbsPos.y)
      } else {
        this.renderSelectionArea(this.initialRelPos, this.currentRelPos)
        // this.$emit('selecting')
      }
    },

    /**
     * 拖动：位置始终由「按下时的位置 + 累计位移」算出，
     * 累加误差与贴边后的粘连都不会出现；位移先经过参考线/网格吸附再写回。
     */
    moveByCursor(e) {
      const totalX = (this.currentAbsPos.x - this.initialAbsPos.x) / this.zoom
      const totalY = (this.currentAbsPos.y - this.initialAbsPos.y) / this.zoom
      const start = this.startBox || this.unionOf(this.mrElements)
      if (!start) return

      const snap = resolveSnap(
        {
          left: start.left + totalX,
          top: start.top + totalY,
          width: start.width,
          height: start.height
        },
        this.guideTargets,
        {
          snap: !!(this.grid && this.grid.snap),
          size: this.grid && this.grid.size,
          disabled: !!e.altKey
        }
      )

      this.mrElements.forEach((el, index) => {
        this.applyPosition(el, this.startPositions[index], totalX + snap.dx, totalY + snap.dy)
      })

      this.guides = { vertical: snap.vertical, horizontal: snap.horizontal }
      this.publishHud('move')
    },

    /** 按方向写回位置，precent/auto 保持原样 */
    applyPosition(el, start, deltaX, deltaY) {
      if (!start) return

      // Re-set height and width on move to preserve dimensions (due addition of bottom/right props)
      el.style.height = el.style.height
      el.style.width = el.style.width

      el.style.top = start.useTop
        ? this.fixPosition(el, Math.round(start.top + deltaY), 'top') + 'px'
        : 'auto'
      el.style.left = start.useLeft
        ? this.fixPosition(el, Math.round(start.left + deltaX), 'left') + 'px'
        : 'auto'
      el.style.bottom = start.useBottom
        ? this.fixPosition(el, Math.round(start.bottom - deltaY), 'bottom') + 'px'
        : 'auto'
      el.style.right = start.useRight
        ? this.fixPosition(el, Math.round(start.right - deltaX), 'right') + 'px'
        : 'auto'
    },

    /** 元件相对容器的盒子，参考线与坐标浮层共用同一坐标系 */
    boxOf(el) {
      return {
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight
      }
    },

    unionOf(elements) {
      return unionBox((elements || []).map(el => this.boxOf(el)))
    },

    /** 开始拖动前记录起始位置、选区外框与参考线 */
    captureMoveStart() {
      this.startPositions = this.mrElements.map(el => {
        const style = window.getComputedStyle(el)
        return {
          top: parseInt(style.top),
          left: parseInt(style.left),
          bottom: parseInt(style.bottom),
          right: parseInt(style.right),
          useTop: el.style.top !== 'auto',
          useLeft: el.style.left !== 'auto',
          useBottom: el.style.bottom !== 'auto',
          useRight: el.style.right !== 'auto'
        }
      })
      this.startBox = this.unionOf(this.mrElements)
      this.guideTargets = this.captureGuideTargets()
    },

    /** 同级元件的边缘与中线、容器四边都作为候选对齐线 */
    captureGuideTargets() {
      const moving = this.mrElements
      const boxes = []

      Array.prototype.forEach.call(this.$el.children, child => {
        if (!child.dataset || !child.dataset.mrEl) return
        if (moving.indexOf(child) !== -1) return
        boxes.push(this.boxOf(child))
      })

      const targets = guideLines(boxes)
      targets.vertical.push(0, this.$el.clientWidth)
      targets.horizontal.push(0, this.$el.clientHeight)
      return targets
    },

    /** 把选区外框与鼠标位置广播给画布浮层（浮层跟随鼠标，不随缩放变形） */
    publishHud(kind) {
      const box = this.unionOf(this.mrElements)
      if (!box) return

      this.$root.$emit('editor-hud', {
        visible: true,
        kind,
        clientX: this.currentAbsPos.x,
        clientY: this.currentAbsPos.y,
        left: Math.round(box.left),
        top: Math.round(box.top),
        width: Math.round(box.width),
        height: Math.round(box.height),
        count: this.mrElements.length
      })
    },

    renderSelectionArea(initPoint, endPoint) {
      const minX = Math.min(initPoint.x, endPoint.x)
      const maxX = Math.max(initPoint.x, endPoint.x)
      const minY = Math.min(initPoint.y, endPoint.y)
      const maxY = Math.max(initPoint.y, endPoint.y)

      this.$refs.selectionArea.style.left = Math.round(minX / this.zoom) + 'px'
      this.$refs.selectionArea.style.top = Math.round(minY / this.zoom) + 'px'
      this.$refs.selectionArea.style.width = Math.round((maxX - minX) / this.zoom) + 'px'
      this.$refs.selectionArea.style.height = Math.round((maxY - minY) / this.zoom) + 'px'
    },

    resizeElementBy(el, offX, offY) {
      const parentCompStyle = window.getComputedStyle(this.getParentMr(el))
      const elCompStyle = window.getComputedStyle(el)

      const parentH = parseInt(parentCompStyle.height)
      const parentW = parseInt(parentCompStyle.width)
      const elMinH = parseInt(elCompStyle.minHeight)
      const elMinW = parseInt(elCompStyle.minWidth)

      let newTop = parseInt(elCompStyle.top)
      let newLeft = parseInt(elCompStyle.left)
      let newRight = parseInt(elCompStyle.right)
      let newBottom = parseInt(elCompStyle.bottom)
      let newHeight = parseInt(elCompStyle.height)
      let newWidth = parseInt(elCompStyle.width)

      let diffX = offX
      let diffY = offY

      if (this.handle.indexOf('t') !== -1) {
        if (newHeight - offY < elMinH) diffY = (newHeight - elMinH)
        else if (newTop + offY < 0) diffY = (0 - newTop)
        newTop += Math.round(diffY / this.zoom)
        newHeight -= Math.round(diffY / this.zoom)
      }
      if (this.handle.indexOf('l') !== -1) {
        if (newWidth - offX < elMinW) diffX = (newWidth - elMinW)
        else if (newLeft + offX < 0) diffX = (0 - newLeft)
        newLeft += Math.round(diffX / this.zoom)
        newWidth -= Math.round(diffX / this.zoom)
      }
      if (this.handle.indexOf('b') !== -1) {
        if (newHeight + offY < elMinH) diffY = (elMinH - newHeight)
        else if (newTop + newHeight + offY > parentH) diffY = (parentH - newTop - newHeight)
        newHeight += Math.round(diffY / this.zoom)
        newBottom -= Math.round(diffY / this.zoom)
      }
      if (this.handle.indexOf('r') !== -1) {
        if (newWidth + offX < elMinW) diffX = (elMinW - newWidth)
        else if (newLeft + newWidth + offX > parentW) diffX = (parentW - newLeft - newWidth)
        newWidth += Math.round(diffX / this.zoom)
        newRight -= Math.round(diffX / this.zoom)
      }

      el.style.height = (el.style.height !== 'auto') ? newHeight + 'px' : 'auto'
      el.style.width = (el.style.width !== 'auto') ? newWidth + 'px' : 'auto'
      el.style.top = (el.style.top !== 'auto') ? newTop + 'px' : 'auto'
      el.style.left = (el.style.left !== 'auto') ? newLeft + 'px' : 'auto'
      el.style.bottom = (el.style.bottom !== 'auto') ? newBottom + 'px' : 'auto'
      el.style.right = (el.style.right !== 'auto') ? newRight + 'px' : 'auto'
    },

    fixPosition(el, val, prop) {
      if (val < 0) return 0

      const parentCompStyle = window.getComputedStyle(this.getParentMr(el))
      const elCompStyle = window.getComputedStyle(el)

      if ((prop === 'top' || prop === 'bottom') && (val + parseInt(elCompStyle.height) > parseInt(parentCompStyle.height))) {
        return parseInt(parentCompStyle.height) - parseInt(elCompStyle.height)
      }
      if ((prop === 'left' || prop === 'right') && (val + parseInt(elCompStyle.width) > parseInt(parentCompStyle.width))) {
        return parseInt(parentCompStyle.width) - parseInt(elCompStyle.width)
      }
      return val
    },

    getParentMr(element) {
      let parentMr = null
      let currentMr = element

      while (parentMr === null) {
        if (currentMr === null || currentMr.parentElement === null) break
        else if (currentMr.dataset.mrContainer) parentMr = currentMr
        else if (currentMr.parentElement.dataset.mrEl) parentMr = currentMr.parentElement

        currentMr = currentMr.parentElement
      }
      return parentMr
    },

    getMouseAbsPoint(e) {
      return { x: e.clientX, y: e.clientY }
    },

    getMouseRelPoint(e) {
      // 以画布（页面容器）左上角为原点、缩放后的坐标系返回鼠标位置；
      // 用 getBoundingClientRect 计算，自动兼容画布滚动与缩放
      const box = this.$el.getBoundingClientRect()
      const style = window.getComputedStyle(this.$el)
      const borderLeft = (parseFloat(style.borderLeftWidth) || 0) * this.zoom
      const borderTop = (parseFloat(style.borderTopWidth) || 0) * this.zoom

      return {
        x: e.clientX - box.left - borderLeft,
        y: e.clientY - box.top - borderTop
      }
    },

    moveStopData() {
      return {
        moveElData: this.mrElements.map(el => {
          return {
            elId: el.childNodes[0].id,
            top: (el.style.top.indexOf('%') !== -1 || el.style.top === 'auto')
              ? el.style.top
              : parseInt(el.style.top),
            left: (el.style.left.indexOf('%') !== -1 || el.style.left === 'auto')
              ? el.style.left
              : parseInt(el.style.left),
            bottom: (el.style.bottom.indexOf('%') !== -1 || el.style.bottom === 'auto')
              ? el.style.bottom
              : parseInt(el.style.bottom),
            right: (el.style.right.indexOf('%') !== -1 || el.style.right === 'auto')
              ? el.style.right
              : parseInt(el.style.right)
          }
        }),
        relMouseX: Math.round(this.currentRelPos.x / this.zoom),
        relMouseY: Math.round(this.currentRelPos.y / this.zoom),
        absMouseX: this.currentAbsPos.x,
        absMouseY: this.currentAbsPos.y
      }
    },

    resizeStopData() {
      return this.mrElements.map(el => {
        return {
          elId: el.childNodes[0].id,
          top: (el.style.top.indexOf('%') !== -1 || el.style.top === 'auto')
            ? el.style.top
            : parseInt(el.style.top),
          left: (el.style.left.indexOf('%') !== -1 || el.style.left === 'auto')
            ? el.style.left
            : parseInt(el.style.left),
          bottom: (el.style.bottom.indexOf('%') !== -1 || el.style.bottom === 'auto')
            ? el.style.bottom
            : parseInt(el.style.bottom),
          right: (el.style.right.indexOf('%') !== -1 || el.style.right === 'auto')
            ? el.style.right
            : parseInt(el.style.right),
          height: (el.style.height.indexOf('%') !== -1 || el.style.height === 'auto')
            ? el.style.height
            : parseInt(el.style.height),
          width: (el.style.width.indexOf('%') !== -1 || el.style.width === 'auto')
            ? el.style.width
            : parseInt(el.style.width)
        }
      })
    },

    selectStopData() {
      return {
        top: parseInt(this.$refs.selectionArea.style.top),
        bottom: parseInt(this.$refs.selectionArea.style.height) + parseInt(this.$refs.selectionArea.style.top),
        left: parseInt(this.$refs.selectionArea.style.left),
        right: parseInt(this.$refs.selectionArea.style.width) + parseInt(this.$refs.selectionArea.style.left),
        additive: this.selectionAdditive
      }
    }
  }
}
</script>

<style scoped>
.mr-container {
  position: relative;
  outline: none;
}

.selection-area {
  position: absolute;
  border: 1px solid #03a9f4;
  background-color: rgba(3, 169, 244, .08);
}

/* 对齐参考线：画在容器内，与元件同一坐标系，自动跟随缩放 */
.guide-layer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
  z-index: 9998;
}

.guide {
  position: absolute;
  background-color: #ff3b7b;
}

.guide--v {
  top: 0;
  width: 1px;
  height: 100%;
}

.guide--h {
  left: 0;
  width: 100%;
  height: 1px;
}
</style>
