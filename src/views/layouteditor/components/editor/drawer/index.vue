<template>
  <nav class="navigation">
    <div class="tab-bar">
      <a :class="['tab', { 'tab--active': showElements }]" title="元素" @click="toggleTab('elements')">
        <svgicon
          :color="showElements ? '#2b6a73' : 'rgba(0,0,0,.38)'"
          icon="system/widgets"
          width="24"
          height="24"/>
      </a>
      <a :class="['tab', { 'tab--active': showSettings }]" title="设置" @click="toggleTab('settings')">
        <svgicon
          :color="showSettings ? '#2b6a73' : 'rgba(0,0,0,.38)'"
          icon="system/settings"
          width="24"
          height="24"/>
      </a>
      <a :class="['tab', { 'tab--active': showLayers }]" title="图层" @click="toggleTab('layers')">
        <svgicon
          :color="showLayers ? '#2b6a73' : 'rgba(0,0,0,.38)'"
          icon="system/layers"
          width="24"
          height="24"/>
      </a>
      <div :style="{'left': indiLeft, 'right': indiRight}" class="tab-indicator"/>
    </div>

    <div class="tab-content">
      <ElementsMenu v-show="showElements"/>
      <layers-menu v-show="showLayers"/>
      <settings-menu v-show="showSettings"/>
    </div>
  </nav>
</template>

<script>
import ElementsMenu from './ElementsMenu'
import LayersMenu from './LayersMenu'
import SettingsMenu from './settings/SettingsMenu'
import '@/assets/design/icons/system/widgets'
import '@/assets/design/icons/system/layers'
import '@/assets/design/icons/system/settings'

/** 每个页签占用的宽度：抽屉宽 240px ÷ 页签数 */
export const TAB_WIDTH = 80

const TAB_INDEX = {
  elements: 0,
  settings: 1,
  layers: 2
}

export default {
  name: 'DrawerPanel',
  components: {
    ElementsMenu,
    LayersMenu,
    SettingsMenu
  },
  data: function() {
    return {
      showElements: true,
      showLayers: true,
      showSettings: true,
      activeTabX: 0
    }
  },
  computed: {
    indiLeft() {
      return this.activeTabX + 'px'
    },
    indiRight() {
      return (240 - (this.activeTabX + TAB_WIDTH)) + 'px'
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.showElements = true
      this.showLayers = false
      this.showSettings = false
    })
  },
  methods: {
    toggleTab(name) {
      this.showElements = name === 'elements'
      this.showLayers = name === 'layers'
      this.showSettings = name === 'settings'
      this.activeTabX = TAB_WIDTH * TAB_INDEX[name]

      if (name === 'settings') this.$root.$emit('show-settings')
    }
  }
}
</script>

<style scoped>
.navigation {
  top: 0;
  right: 0;
  z-index: 1005;
  width: 240px;
  height: 100%;
  max-height: 100%;
  background: #fafafa;
  display: flex;
  flex-shrink: 0;
  flex-wrap: nowrap;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;
  position: absolute;
  overflow: hidden;
  /* 面板是「停靠」在右侧的，边界贴着主区域：
     用 1px 实线做分隔（原先打在窗口外沿的 border-right 实际上看不见），
     投影收窄成朝左的一层，避免在画布上拖出一条模糊的灰影 */
  border-left: 1px solid #e0e0e0;
  box-shadow: -6px 0 16px -10px rgba(0, 0, 0, 0.28);
}

/* DRAWER DOES NOT DISPLAY IN DEVICES SMALLER THAN 1024px */
@media screen and (max-width: 1024px) {
  .navigation {
    display: none;
  }
}

.tab {
  display: flex;
  justify-content: center;
  flex: 1;
  padding-top: 20px;
  height: 64px;
  cursor: pointer;
  transition: background-color .15s ease;
}
.tab:hover {
  background-color: rgba(43, 106, 115, .08);
}
.tab--active {
  background-color: rgba(43, 106, 115, .12);
}
.tab--active:hover {
  background-color: rgba(43, 106, 115, .16);
}
.tab-bar {
  display: flex;
  width: 100%;
  z-index: 1;
  /* border-bottom: 1px solid rgba(0,0,0,0.12); */
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);
}
.tab-indicator {
  top: 63px;
  height: 2px;
  position: absolute;
  background-color: #2b6a73;
  transition: all .2s cubic-bezier(.4,0,.4,1).01s;
}
.tab-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  margin-top: 1px;
}
</style>
