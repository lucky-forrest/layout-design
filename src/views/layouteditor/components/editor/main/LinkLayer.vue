<template>
  <div :class="['link-layer', { 'link-layer--active': linkMode }]" @mousedown="onMouseDown">
    <svg class="link-layer__svg" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker
          id="layout-link-arrow"
          markerHeight="7"
          markerWidth="7"
          orient="auto"
          refX="9"
          refY="5"
          viewBox="0 0 10 10">
          <path d="M0 0 L10 5 L0 10 z" fill="#2b6a73"/>
        </marker>
        <marker
          id="layout-link-arrow-active"
          markerHeight="7"
          markerWidth="7"
          orient="auto"
          refX="9"
          refY="5"
          viewBox="0 0 10 10">
          <path d="M0 0 L10 5 L0 10 z" fill="#ff3b7b"/>
        </marker>
      </defs>

      <path
        v-for="item in paths"
        :key="item.link.id"
        :class="['link-path', { 'link-path--active': item.link.id === activeLinkId }]"
        :d="item.d"
        :marker-end="item.link.id === activeLinkId
          ? 'url(#layout-link-arrow-active)'
        : 'url(#layout-link-arrow)'"
        @click.stop="selectLink(item.link)"/>

      <path v-if="rubber" :class="['link-path', 'link-path--rubber']" :d="rubber" marker-end="url(#layout-link-arrow)"/>
    </svg>

    <div v-if="linkMode" class="link-layer__tips">
      <span>从元件拖到另一个元件即可连线</span>
      <span v-if="activeLinkId">
        ·
        <a @click.stop="removeActiveLink">删除选中的连线</a>
      </span>
    </div>
  </div>
</template>

<script>
import shortid from 'shortid'
import elementsFromPoint from '@/polyfills/elementsFromPoint'
import { mapState, mapMutations } from 'vuex'
import { getAbsoluteBox } from '@/helpers/positionDimension'
import { elementLabel } from '@/helpers/nodeInfo'
import { _addLink, _removeLink } from '@/store/types'
import notify from '@/views/layouteditor/components/mixins/notify'

export default {
  name: 'LinkLayer',
  mixins: [notify],
  props: {
    page: {
      type: Object,
      required: true
    },
    zoom: {
      type: Number,
      default: 1
    }
  },
  data: function() {
    return {
      /** 元件绝对盒子快照：{ [id]: box }，拖动结束后重算 */
      boxes: {},
      dragFromId: null,
      rubber: null,
      activeLinkId: null,
      tick: 0
    }
  },
  computed: {
    paths() {
      if (!this.page.links || !this.page.links.length) return []
      // tick 参与计算，保证拖动/缩放后能重算
      void this.tick
      return this.page.links
        .map(link => {
          const from = this.boxes[link.from]
          const to = this.boxes[link.to]
          if (!from || !to) return null
          return { link, d: this.buildPath(from, to) }
        })
        .filter(item => !!item)
    },

    activeLink() {
      if (!this.activeLinkId || !this.page.links) return null
      return this.page.links.find(link => link.id === this.activeLinkId) || null
    },

    ...mapState({
      linkMode: state => state.layoutEditor.linkMode
    })
  },
  watch: {
    /** 元件增删改、连线本身变化、缩放变化都要重算连线 */
    page: {
      deep: true,
      handler() {
        this.measure()
      }
    },
    zoom() {
      this.measure()
    },
    linkMode(value) {
      if (!value) {
        this.dragFromId = null
        this.rubber = null
      }
      this.measure()
    }
  },
  mounted: function() {
    this.$nextTick(this.measure)
    this.$root.$on('editor-hud', this.hudHandler)
    window.addEventListener('resize', this.measure)
  },
  beforeDestroy: function() {
    this.$root.$off('editor-hud', this.hudHandler)
    window.removeEventListener('resize', this.measure)
  },
  methods: {
    hudHandler(payload) {
      // 拖动/缩放结束后元件位置才真正落库，这时再量一次
      if (!payload || payload.visible === false) this.measure()
    },

    /** 重新测量所有元件的绝对盒子 */
    measure() {
      const boxes = {}
      walk(this.page)
      this.boxes = boxes
      this.tick += 1

      function walk(node) {
        (node.children || []).forEach(child => {
          const box = getAbsoluteBox(child.id)
          if (box) boxes[child.id] = box
          walk(child)
        })
      }
    },

    /** 折线路由：从起点边缘出发，中点折一次，进目标边缘 */
    buildPath(from, to) {
      const toRight = (to.left + to.width / 2) >= (from.left + from.width / 2)
      const startX = toRight ? from.left + from.width : from.left
      const startY = from.top + from.height / 2
      const endX = toRight ? to.left : to.left + to.width
      const endY = to.top + to.height / 2
      const midX = startX + (endX - startX) / 2

      return 'M ' + startX + ' ' + startY +
        ' H ' + midX + ' V ' + endY + ' H ' + endX
    },

    /** 把鼠标位置换算成页面局部坐标 */
    toLocal(event) {
      const stage = document.getElementById(this.page.id)
      if (!stage) return null
      const rect = stage.getBoundingClientRect()
      const zoom = this.zoom || 1

      return {
        x: (event.clientX - rect.left) / zoom,
        y: (event.clientY - rect.top) / zoom
      }
    },

    /** 鼠标下真正压着的元件（跳过连线和辅助层） */
    elementAt(event) {
      const list = elementsFromPoint(event.clientX, event.clientY) || []
      for (let i = 0; i < list.length; i += 1) {
        const id = this.resolveId(list[i])
        if (id) return id
      }
      return null
    },

    /**
     * 命中节点对应哪个元件。
     * 元件 id 挂在内容节点上（.view-element），[data-mr-el] 外壳本身没有 id，
     * 所以先看节点自己，再看它所在外壳里第一个登记过盒子的 id 节点。
     */
    resolveId(dom) {
      if (!dom) return null
      if (dom.id && this.boxes[dom.id]) return dom.id

      const wrapper = dom.closest ? dom.closest('[data-mr-el="true"]') : null
      if (!wrapper) return null

      const nodes = wrapper.querySelectorAll('[id]')
      for (let i = 0; i < nodes.length; i += 1) {
        if (this.boxes[nodes[i].id]) return nodes[i].id
      }
      return null
    },

    onMouseDown(event) {
      if (!this.linkMode || event.button !== 0) return
      if (event.target.closest && event.target.closest('.link-path')) return

      const elementId = this.elementAt(event)
      this.activeLinkId = null
      if (!elementId) return

      this.dragFromId = elementId
      event.preventDefault()
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    },

    onMouseMove(event) {
      const local = this.toLocal(event)
      const from = this.boxes[this.dragFromId]
      if (!local || !from) return

      const hoverId = this.elementAt(event)
      const target = (hoverId && hoverId !== this.dragFromId) ? this.boxes[hoverId] : null
      const anchor = target
        ? {
          left: target.left,
          top: target.top,
          width: target.width,
          height: target.height
        }
        : {
          left: local.x,
          top: local.y,
          width: 1,
          height: 1
        }

      this.rubber = this.buildPath(from, anchor)
    },

    onMouseUp(event) {
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)

      const fromId = this.dragFromId
      this.dragFromId = null
      this.rubber = null

      const toId = this.elementAt(event)
      if (!fromId || !toId || fromId === toId) return

      const exists = (this.page.links || []).some(
        link => link.from === fromId && link.to === toId
      )
      if (exists) {
        this.notifyInfo('这条连线已经有了')
        return
      }

      const fromNode = this.findNode(fromId)
      const toNode = this.findNode(toId)
      const id = shortid.generate()

      this._addLink({ page: this.page, id, from: fromId, to: toId })
      this.activeLinkId = id
      this.$nextTick(this.measure)
      this.notifySuccess(
        '已连线：' + this.labelOf(fromNode) + ' → ' + this.labelOf(toNode) +
        '（点连线可删除，可用 Ctrl+Z 撤销）'
      )
    },

    findNode(elementId) {
      let found = null
      const walk = node => {
        (node.children || []).forEach(child => {
          if (child.id === elementId) found = child
          else walk(child)
        })
      }
      walk(this.page)
      return found
    },

    labelOf(node) {
      return node ? (elementLabel(node) || node.name) : '未知元件'
    },

    selectLink(link) {
      if (!this.linkMode) return
      this.activeLinkId = this.activeLinkId === link.id ? null : link.id
    },

    removeActiveLink() {
      if (!this.activeLinkId) return
      this._removeLink({ page: this.page, id: this.activeLinkId })
      this.activeLinkId = null
      this.$nextTick(this.measure)
      this.notifySuccess('已删除这条连线，可用 Ctrl+Z 撤销')
    },

    ...mapMutations([_addLink, _removeLink])
  }
}
</script>

<style scoped>
.link-layer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: visible;
  pointer-events: none;
}

/* 连线模式：接管画布的按下事件，同时让连线本身可点 */
.link-layer--active {
  z-index: 9997;
  pointer-events: auto;
  cursor: crosshair;
}

.link-layer__svg {
  position: absolute;
  left: 0;
  top: 0;
  overflow: visible;
  pointer-events: none;
}

.link-path {
  fill: none;
  stroke: #2b6a73;
  stroke-width: 2;
  stroke-dasharray: none;
  pointer-events: none;
}

.link-layer--active .link-path {
  pointer-events: stroke;
  cursor: pointer;
}

.link-path--active {
  stroke: #ff3b7b;
  stroke-width: 3;
}

.link-path--rubber {
  stroke: #ff3b7b;
  stroke-dasharray: 6,4;
}

.link-layer__tips {
  position: absolute;
  left: 6px;
  top: 6px;
  display: flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, .92);
  box-shadow: 0 1px 6px rgba(0, 0, 0, .16);
  color: #4b6161;
  font-size: 11px;
  cursor: default;
}

.link-layer__tips a {
  color: #ff3b7b;
  cursor: pointer;
}
</style>
