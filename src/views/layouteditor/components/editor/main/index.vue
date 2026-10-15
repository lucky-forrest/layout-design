<template>
  <div class="canvas-wrapper">
    <div
      id="canvas-main"
      class="canvas-main"
      @click.self="selectParent"
      @scroll="scrollHandler">
      <stage v-if="selectedPage" :page="selectedPage" :zoom="zoom" />
    </div>

    <ruler
      :axis="'x'"
      :zoom="zoom"
      :scroll="scrollLeft"
      :length="viewport.width"
      :size="pageSize.width"
      :band="bandX"/>
    <ruler
      :axis="'y'"
      :zoom="zoom"
      :scroll="scrollTop"
      :length="viewport.height"
      :size="pageSize.height"
      :band="bandY"/>

    <grid-menu class="grid-menu"/>
    <state-menu class="state-menu"/>

    <div v-if="scaleLegend" :title="scaleLegend.title" class="scale-legend">
      <span :style="{ width: scaleLegend.px + 'px' }" class="scale-legend__bar"/>
      <span class="scale-legend__text">{{ scaleLegend.text }}</span>
    </div>

    <div v-if="scopeTrail.length" class="scope-bar">
      <a class="scope-crumb" title="返回页面层级" @click="exitScope">页面</a>
      <span v-for="node in scopeTrail" :key="node.id" class="scope-node">
        <span class="scope-sep">/</span>
        <span v-if="node.id === editorScopeId" class="scope-crumb scope-crumb--current">
          {{ scopeLabel(node) }}
        </span>
        <a
          v-else
          :title="'回到 ' + scopeLabel(node)"
          class="scope-crumb"
          @click="setScope(node.id)">
          {{ scopeLabel(node) }}
        </a>
      </span>
      <span class="scope-hint">双击容器进入下一层，Esc 返回上一层</span>
    </div>

    <div v-if="hud.visible" :style="hudStyle" class="drag-hud">
      <span class="drag-hud__row">X {{ hud.left }} · Y {{ hud.top }}</span>
      <span class="drag-hud__row drag-hud__row--strong">
        {{ hud.width }} × {{ hud.height }} px
      </span>
      <span v-if="hudMm" class="drag-hud__row drag-hud__row--dim">{{ hudMm }}</span>
      <span v-if="hud.count > 1" class="drag-hud__row drag-hud__row--dim">
        共 {{ hud.count }} 个元件
      </span>
    </div>

    <zoom-menu
      :zoom="zoom"
      :has-selection="hasSelection"
      class="zoom-menu"
      @zoomChange="zoomHandler"
      @fit="fitHandler"
      @reset="resetZoomHandler"
      @zoomToSelection="zoomToSelectionHandler"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import {
  _changeActivePage,
  _rebaseActivePage,
  _updateEditorZoom,
  _setEditorScope,
  _clearSelectedElements,
  getPageIndexById
} from '@/store/types'
import { getAbsoluteBox } from '@/helpers/positionDimension'
import { getNodeBoxSize } from '@/helpers/positionDimension'
import { getChildNode } from '@/helpers/recursiveMethods'
import { clampZoom } from '@/helpers/zoom'
import { getMmPerPx, scaleBar } from '@/helpers/scale'
import { exportNodeToPng } from '@/helpers/canvasExport'

import ZoomMenu from '@/views/layouteditor/components/editor/common/ZoomMenu'
import Ruler from '@/views/layouteditor/components/editor/common/Ruler'
import GridMenu from '@/views/layouteditor/components/editor/common/GridMenu'
import StateMenu from '@/views/layouteditor/components/editor/common/StateMenu'
import resize from '@/views/layouteditor/components/mixins/resize'
import notify from '@/views/layouteditor/components/mixins/notify'
import Stage from './Stage'

/** 缩放到选中时四周保留的留白（px） */
const FOCUS_PADDING = 80

export default {
  name: 'CanvasMain',
  components: {
    Stage,
    ZoomMenu,
    Ruler,
    GridMenu,
    StateMenu
  },
  mixins: [resize, notify],
  data: function() {
    return {
      scrollLeft: 0,
      scrollTop: 0,
      viewport: { width: 0, height: 0 },
      /** 拖动/缩放过程中跟随鼠标的坐标尺寸浮层 */
      hud: { visible: false }
    }
  },
  computed: {
    ...mapState({
      selectedPage: state => {
        return state.layoutEditor.selectedPage
      },
      pages: state => (state ? state.layoutEditor.project.pages : []),
      zoom: state => state.layoutEditor.editorZoom,
      selectedElements: state => state.layoutEditor.selectedElements || [],
      editorScopeId: state => state.layoutEditor.editorScopeId
    }),
    ...mapGetters([getPageIndexById]),

    hasSelection() {
      return this.selectedElements.length > 0
    },

    /** 页面尺寸（页面坐标 px），标尺与比例尺都用它 */
    pageSize() {
      if (!this.selectedPage) return { width: 0, height: 0 }
      const size = getNodeBoxSize(this.selectedPage)
      return { width: size.width || 0, height: size.height || 0 }
    },

    /** 选中范围在横向标尺上的位置 */
    bandX() {
      return this.selectionBand('x')
    },

    /** 选中范围在纵向标尺上的位置 */
    bandY() {
      return this.selectionBand('y')
    },

    hudStyle() {
      return {
        left: (this.hud.clientX || 0) + 16 + 'px',
        top: (this.hud.clientY || 0) + 18 + 'px'
      }
    },

    /** 浮层里的毫米换算，只有设置了页面实际尺寸才显示 */
    hudMm() {
      if (!this.hud.visible) return ''
      const ratio = getMmPerPx(this.selectedPage)
      if (!ratio) return ''
      return Math.round(this.hud.width * ratio) + ' × ' +
        Math.round(this.hud.height * ratio) + ' mm'
    },

    /** 比例尺图例 */
    scaleLegend() {
      const bar = scaleBar(this.selectedPage, 120)
      if (!bar) return null
      return {
        px: bar.px,
        text: bar.mm + ' mm',
        title: '按页面填写的实际尺寸换算，导出设备清单时坐标同样按这个比例给出毫米'
      }
    },

    /** 从页面到当前进入容器的层级路径，用于面包屑 */
    scopeTrail() {
      const trail = []
      if (!this.editorScopeId || !this.selectedPage) return trail

      const parts = String(this.editorScopeId).split('.')
      // parts[0] 是页面 id，容器层级从 parts[1] 开始
      let path = parts[0]
      for (let index = 1; index < parts.length; index++) {
        path = path + '.' + parts[index]
        const node = getChildNode(this.selectedPage, path)
        if (!node) break
        trail.push(node)
      }
      return trail
    }
  },
  watch: {
    // After a redo/undo action this will apply
    selectedPage: function(val) {
      this.selectFallbackPage(val)
      this.$nextTick(this.measureViewport)
    },
    zoom: function() {
      this.$nextTick(this.measureViewport)
    }
  },
  created: function() {
    this.selectFallbackPage(this.selectedPage)
  },
  mounted: function() {
    this.measureViewport()
    window.addEventListener('resize', this.measureViewport)
    this.$root.$on('editor-hud', this.hudHandler)
    this.$root.$on('export-png', this.exportPngHandler)
    this.$root.$on('reveal-element', this.revealHandler)
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.measureViewport)
    this.$root.$off('editor-hud', this.hudHandler)
    this.$root.$off('export-png', this.exportPngHandler)
    this.$root.$off('reveal-element', this.revealHandler)
  },
  methods: {
    selectFallbackPage(page) {
      if (!page && this.pages.length > 0) {
        this._changeActivePage(this.pages[0])
      } else {
        this._rebaseActivePage(this.getPageIndexById(page.id))
      }
    },

    zoomHandler(zoomValue) {
      this.isZoomAuto = false
      this._updateEditorZoom(zoomValue)
    },

    /** 适应画布：重新交回自动适配，并立即执行一次 */
    fitHandler() {
      this.isZoomAuto = true
      this.resizeHandler()
    },

    resetZoomHandler() {
      this.isZoomAuto = false
      this._updateEditorZoom(1)
      this.scrollToOrigin()
    },

    zoomToSelectionHandler() {
      const boxes = this.selectedElements
        .map(el => getAbsoluteBox(el.id))
        .filter(box => !!box)
      if (!boxes.length) return

      const minLeft = Math.min(...boxes.map(box => box.left))
      const maxRight = Math.max(...boxes.map(box => box.left + box.width))
      const minTop = Math.min(...boxes.map(box => box.top))
      const maxBottom = Math.max(...boxes.map(box => box.top + box.height))

      const container = document.getElementById('canvas-main')
      if (!container) return

      const zoom = clampZoom(Math.min(
        (container.clientWidth - FOCUS_PADDING) / Math.max(1, maxRight - minLeft),
        (container.clientHeight - FOCUS_PADDING) / Math.max(1, maxBottom - minTop)
      ))

      this.isZoomAuto = false
      this._updateEditorZoom(zoom)
      this.$nextTick(() => this.centerOn(
        (minLeft + maxRight) / 2,
        (minTop + maxBottom) / 2
      ))
    },

    /** 把页面坐标系中的点滚动到画布可视区域中央 */
    centerOn(pageLeft, pageTop) {
      const container = document.getElementById('canvas-main')
      if (!container) return
      container.scrollLeft = Math.max(
        0,
        pageLeft * this.zoom - container.clientWidth / 2
      )
      container.scrollTop = Math.max(
        0,
        pageTop * this.zoom - container.clientHeight / 2
      )
    },

    scrollToOrigin() {
      const container = document.getElementById('canvas-main')
      if (!container) return
      container.scrollLeft = 0
      container.scrollTop = 0
    },

    scopeLabel(node) {
      if (!node) return ''
      const nickName = node.attrs && node.attrs.nickName
      const primaryKey = node.primaryKey
        ? String(node.primaryKey).replace(/^\w+_/, '')
        : ''
      return nickName || primaryKey || node.name || '容器'
    },

    /** 进入/退出某一层级；传 null 表示回到页面层级 */
    setScope(elementId) {
      if (elementId === this.editorScopeId) return
      this._setEditorScope(elementId)
      this._clearSelectedElements()
    },

    exitScope() {
      this.setScope(null)
    },

    /** 点击页面外的画布空白：先退出容器层级，否则清空选中 */
    selectParent() {
      if (this.editorScopeId) {
        this.exitScope()
      } else if (this.hasSelection) {
        this._clearSelectedElements()
      }
    },

    /** 选中范围在标尺上的投影：横向取左右端，纵向取上下端 */
    selectionBand(axis) {
      if (!this.selectedElements.length) return null

      const boxes = this.selectedElements
        .map(el => getAbsoluteBox(el.id))
        .filter(box => !!box)
      if (!boxes.length) return null

      const offset = axis === 'x' ? this.scrollLeft : this.scrollTop
      const from = axis === 'x'
        ? Math.min.apply(null, boxes.map(box => box.left))
        : Math.min.apply(null, boxes.map(box => box.top))
      const to = axis === 'x'
        ? Math.max.apply(null, boxes.map(box => box.left + box.width))
        : Math.max.apply(null, boxes.map(box => box.top + box.height))

      return {
        start: from * this.zoom - offset,
        end: to * this.zoom - offset
      }
    },

    scrollHandler(e) {
      this.scrollLeft = e.target.scrollLeft
      this.scrollTop = e.target.scrollTop
    },

    /** 标尺要跟着滚动条与画布尺寸走 */
    measureViewport() {
      const container = document.getElementById('canvas-main')
      if (!container) return

      this.viewport = {
        width: container.clientWidth,
        height: container.clientHeight
      }
      this.scrollLeft = container.scrollLeft
      this.scrollTop = container.scrollTop
    },

    hudHandler(payload) {
      this.hud = payload && payload.visible
        ? payload
        : { visible: false }
    },

    /** 图层面板点选后，把元件滚动进可视区（只移动需要的距离） */
    revealHandler(elementId) {
      this.$nextTick(() => {
        const container = document.getElementById('canvas-main')
        const box = getAbsoluteBox(elementId)
        if (!container || !box) return

        const margin = 60
        const left = box.left * this.zoom
        const top = box.top * this.zoom
        const right = (box.left + box.width) * this.zoom
        const bottom = (box.top + box.height) * this.zoom

        if (left - margin < container.scrollLeft) {
          container.scrollLeft = Math.max(0, left - margin)
        } else if (right + margin > container.scrollLeft + container.clientWidth) {
          container.scrollLeft = right + margin - container.clientWidth
        }

        if (top - margin < container.scrollTop) {
          container.scrollTop = Math.max(0, top - margin)
        } else if (bottom + margin > container.scrollTop + container.clientHeight) {
          container.scrollTop = bottom + margin - container.clientHeight
        }

        this.measureViewport()
      })
    },

    /** 导出当前页 PNG（缩放倍率与是否带网格由调用方给） */
    exportPngHandler(options) {
      const opts = options || {}
      const page = this.selectedPage
      if (!page) {
        this.notifyError('还没有可导出的页面')
        return
      }

      const stage = document.getElementById(page.id)
      if (!stage) {
        this.notifyError('画布还没准备好，请稍后再试')
        return
      }

      const fileName = String(page.name || 'layout').replace(
        /[^a-zA-Z0-9-_\u4e00-\u9fa5]+/g,
        '-'
      )

      const bg = page.attrs && page.attrs.background

      if (this.previewState && this.previewState !== 'normal') {
        this.notifyWarning('当前是「模拟状态」预览，导出的图片也会是这套配色')
      }

      this.notifyInfo('正在生成图片...')
      exportNodeToPng(stage, {
        format: opts.format || 'png',
        scale: opts.scale || 1,
        withGrid: !!opts.withGrid,
        gridSize: (this.grid && this.grid.size) || 20,
        withBackground: !bg || bg.inExport !== false,
        background: (page.styles && page.styles['background-color']) || '#ffffff',
        fileName
      }).then(result => {
        if (!result.ok) {
          this.notifyError(result.error || '导出图片失败')
        } else if (result.format === 'png') {
          this.notifySuccess('图片已开始下载（' + result.width + '×' + result.height + '）')
        } else {
          this.notifySuccess('矢量图已开始下载（SVG，可无损缩放）')
        }
      })
    },

    ...mapMutations([
      _changeActivePage,
      _rebaseActivePage,
      _updateEditorZoom,
      _setEditorScope,
      _clearSelectedElements
    ])
  }
}
</script>

<style scoped>
.canvas-wrapper {
  position: relative;
  height: 100%;
  /* 建立 BFC：兜住 .canvas-main 的 10px 外边距，
     否则该外边距会溢出到 .edit-view 并触发全局纵向滚动条 */
  overflow: hidden;
}

.canvas-main {
  position: relative;
  margin: 24px 10px 10px 24px;
  height: calc(100% - 34px);
  overflow: auto;
}

.grid-menu {
  position: absolute;
  top: 6px;
  right: 24px;
  z-index: 14;
}

.state-menu {
  position: absolute;
  top: 6px;
  left: 34px;
  z-index: 14;
}

.scale-legend {
  position: absolute;
  left: 34px;
  bottom: 14px;
  z-index: 12;
  display: flex;
  align-items: center;
  padding: 2px 8px;
  border: 1px solid #e0e4e4;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, .9);
  color: #4a5a5a;
  font-size: 11px;
  line-height: 16px;
  pointer-events: none;
}

.scale-legend__bar {
  display: inline-block;
  height: 6px;
  margin-right: 6px;
  border: 1px solid #4a5a5a;
  border-top: 0 none;
}

.drag-hud {
  position: fixed;
  z-index: 3000;
  display: flex;
  flex-direction: column;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(32, 42, 42, .86);
  color: #fff;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  pointer-events: none;
}

.drag-hud__row--strong {
  font-size: 12px;
  font-weight: 600;
}

.drag-hud__row--dim {
  color: rgba(255, 255, 255, .62);
}

@media (max-width: 900px) {
  .grid-menu {
    display: none;
  }
}

.zoom-menu {
  position: absolute;
  bottom: 50px;
  right: 24px;
  padding: 0 6px;
}

.scope-bar {
  position: absolute;
  top: 16px;
  left: 18px;
  z-index: 10;
  max-width: calc(100% - 36px);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  box-sizing: border-box;
  padding: 4px 12px;
  border-radius: 15px;
  background-color: rgba(0, 0, 0, 0.72);
  color: #fff;
  font-size: 12px;
  line-height: 20px;
}

.scope-crumb {
  color: #fff;
  cursor: pointer;
  text-decoration: none;
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.scope-node {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.scope-crumb:hover {
  text-decoration: underline;
}

.scope-crumb--current {
  color: #8fd6df;
  cursor: default;
}

.scope-sep {
  padding: 0 6px;
  color: rgba(255, 255, 255, 0.5);
}

.scope-hint {
  padding-left: 12px;
  color: rgba(255, 255, 255, 0.55);
}
</style>
