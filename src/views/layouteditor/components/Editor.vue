<template>
  <div class="layout-container">
    <div class="edit-view">
      <div v-show="loading" class="linear-loader">
        <div class="linear-loader__bar"/>
      </div>
      <header-bar :scroll0="notScrolled"/>
      <drawer-panel/>
      <main id="main" role="main" @scroll="scrollFunction">
        <canvas-main/>
      </main>
      <page-dialog/>
      <load-dialog/>
      <confirm-dialog/>
      <block-loader/>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { checkLastSaved, rebaseSelectedElements } from '@/store/types'
import { TOAST_EVENT } from '@/views/layouteditor/components/mixins/notify'

import HeaderBar from '@/views/layouteditor/components/editor/header'
import DrawerPanel from '@/views/layouteditor/components/editor/drawer'
import CanvasMain from '@/views/layouteditor/components/editor/main'
import BlockLoader from '@/views/layouteditor/components/editor/common/loader/BlockLoader'
import PageDialog from '@/views/layouteditor/components/editor/dialogs/PageDialog'
import LoadDialog from '@/views/layouteditor/components/editor/dialogs/LoadDialog'
import ConfirmDialog from '@/views/layouteditor/components/editor/dialogs/ConfirmDialog'

export default {
  name: 'Editor',
  components: { HeaderBar, DrawerPanel, CanvasMain, BlockLoader, PageDialog, LoadDialog, ConfirmDialog },
  data: function() {
    return {
      notScrolled: true
    }
  },
  computed: {
    ...mapState({
      loading: state => state.layoutEditor.isLoading,
      hasChanges: state => state ? state.layoutEditor.hasChanges : false
    })
  },
  created: function() {
    this.$root.$on('rebaseState', this.rebaseState)
  },
  mounted: function() {
    // 全局轻提示的唯一出口：各业务组件通过 $root 抛出 toast 事件
    this.$root.$on(TOAST_EVENT, this.toastHandler)
    window.addEventListener('beforeunload', this.beforeUnloadHandler)
  },
  beforeDestroy: function() {
    this.$root.$off('rebaseState', this.rebaseState)
    this.$root.$off(TOAST_EVENT, this.toastHandler)
    window.removeEventListener('beforeunload', this.beforeUnloadHandler)
  },
  methods: {
    scrollFunction(e) {
      this.notScrolled = (e.target.scrollTop === 0)
    },
    rebaseState() {
      this.checkLastSaved()
      this.rebaseSelectedElements()
    },

    toastHandler(payload) {
      if (!payload || !payload.message) return
      this.$message({
        type: payload.type || 'info',
        message: payload.message,
        duration: payload.duration || 2000,
        showClose: false
      })
    },

    /** 有未保存改动时，刷新或关闭页面前提醒一次 */
    beforeUnloadHandler(e) {
      if (!this.hasChanges) return
      e.preventDefault()
      e.returnValue = ''
      return ''
    },

    ...mapActions([rebaseSelectedElements, checkLastSaved])
  }
}
</script>

<style>
.layout-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.edit-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  /* 编辑器是全屏外壳：滚动交给内部容器（画布 / 右侧面板），
     外壳本身绝不滚动，否则出现的纵向滚动条会占掉 15px 宽度，
     把顶部工具栏挤到右侧面板左边，形成一条白色缝隙 */
  overflow: hidden;
}

#main {
  height: 100%;
  min-height: 0;
  position: relative;
  flex-grow: 1;
  margin-right: 240px;
}

/* IN DEVICES SMALLER THAN 1024px -> NO DRAWER (so remove margins) */
@media screen and (max-width: 1024px) {
  #main {
    margin: 0px;
  }
}

dialog {
  width: 320px !important;
  border: none !important;
  box-shadow:
    0 9px 46px 8px rgba(0,0,0,.14),
    0 11px 15px -7px rgba(0,0,0,.12),
    0 24px 38px 3px rgba(0,0,0,.2);
}

dialog, dialog::backdrop {
  animation-name: anim-open;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

@keyframes anim-open {
	0% { opacity: 0; transform: scale3d(1.1, 1.1, 1); }
	100% { opacity: 1; transform: scale3d(1, 1, 1); }
}
.vue-tooltip.tooltip {
  padding:2px 10px;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-size: 12px;
  z-index: 1010;
  color:#fff;
  border-radius: 3px;
  background-color: #616161;
  box-shadow:
    0 1px 3px rgba(0,0,0,0.12),
    0 1px 2px rgba(0,0,0,0.24);
}
.vue-tooltip.tooltip .tooltip-arrow {
  border-color: #616161 !important;
}

/* recommended css code for vue-svgicon */
.svg-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    color: inherit;
    vertical-align: middle;
    fill: none;
    stroke: currentColor;
}

/* 系统开启了「减少动态效果」时，关闭非必要的动画与过渡 */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
</style>

<style scoped>
.linear-loader {
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  height: 2px !important;
  position: absolute !important;
  overflow: hidden;
  background-color: rgba(43, 106, 115, 0.2);
}
.linear-loader__bar {
  width: 100%;
  height: 100%;
  background-color: #2b6a73;
  transform-origin: 0 0;
  animation: linear-loader-indeterminate 1.5s infinite linear;
}
@keyframes linear-loader-indeterminate {
  0% { transform: translateX(-100%) scaleX(0.6); }
  50% { transform: translateX(0) scaleX(0.4); }
  100% { transform: translateX(100%) scaleX(0.6); }
}
</style>
