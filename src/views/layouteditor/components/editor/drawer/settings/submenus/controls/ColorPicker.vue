<template>
  <div class="color-picker__wrapper" @mouseleave="isMouseOut = true" @mouseenter="isMouseOut = false">
    <span v-if="label" class="color-picker__label">{{ label }}</span>
    <div ref="anchor" class="color-picker__anchor" @click.capture="togglePicker">
      <div :style="anchorStyle" class="anchor__color-display"/>
      <span :title="color" class="anchor__value">{{ color }}</span>
    </div>
    <color-chrome
      v-show="isPickerOpen"
      ref="menu"
      :value="color"
      :style="menuStyle"
      class="color-picker__menu"
      @input="newColor => onColorChange(newColor)"/>
  </div>
</template>

<script>
import tinycolor from 'tinycolor2'
import { Chrome } from 'vue-color'

/** 弹层相对锚点左边缘的水平偏移：略向左探出，避免顶到窗口右缘 */
const MENU_OFFSET_X = -12
/** 锚点与弹层之间的间距（px） */
const MENU_GAP = 6
/** 弹层与视口边缘之间至少保留的距离（px） */
const VIEWPORT_PADDING = 8
/** 弹层显示前量不到真实尺寸，用 vue-color Chrome 的固有尺寸兜底 */
const MENU_FALLBACK_WIDTH = 225
const MENU_FALLBACK_HEIGHT = 240

export default {
  name: 'ColorPicker',
  components: { 'color-chrome': Chrome },
  props: {
    color: { type: String, default: '#000000' },
    label: { type: String, default: '' },
    icon: { type: String, default: '' }
  },
  data: function() {
    return {
      isPickerOpen: false,
      isMouseOut: false,
      // 打开瞬间的兜底位置，真正的坐标由 positionMenu 计算
      menuStyle: {
        left: MENU_OFFSET_X + 'px',
        top: '34px'
      }
    }
  },
  computed: {
    anchorStyle() {
      return {
        'background-color': tinycolor(this.color).toRgbString()
      }
    }
  },
  watch: {
    'isPickerOpen': function(val) {
      if (val === true) {
        document.documentElement.addEventListener('click', this.onDocumentClick, true)
        window.addEventListener('resize', this.onViewportChange)
        document.addEventListener('scroll', this.onViewportChange, true)
      } else {
        document.documentElement.removeEventListener('click', this.onDocumentClick, true)
        window.removeEventListener('resize', this.onViewportChange)
        document.removeEventListener('scroll', this.onViewportChange, true)
      }
    }
  },
  beforeDestroy: function() {
    // 弹层是视口定位的，组件销毁时必须摘掉监听，避免残留句柄
    document.documentElement.removeEventListener('click', this.onDocumentClick, true)
    window.removeEventListener('resize', this.onViewportChange)
    document.removeEventListener('scroll', this.onViewportChange, true)
  },
  methods: {
    togglePicker() {
      if (this.isPickerOpen) {
        this.isPickerOpen = false
        return
      }
      this.positionMenu()
      this.isPickerOpen = true
      // v-show 显示之后才量得到真实尺寸，再校正一次，避免贴边时被视口切掉
      this.$nextTick(this.positionMenu)
    },

    onColorChange(newColor) {
      this.$emit('input', tinycolor(newColor.hsl).toRgbString())
    },

    onDocumentClick() {
      if (this.isMouseOut) this.isPickerOpen = false
    },

    onViewportChange() {
      if (this.isPickerOpen) this.positionMenu()
    },

    /**
     * 设置面板的折叠区（menu-toggle__content）以及左抽屉都是 overflow:hidden 的，
     * 绝对定位的弹层会被裁得只剩一条边，点不到色域。
     * 这里改用视口定位，把坐标按锚点当前位置实时算出来，让弹层跳出裁剪。
     */
    positionMenu() {
      const anchor = this.$refs.anchor
      if (!anchor) return

      const menu = this.$refs.menu
      const menuEl = menu && menu.$el
      const rect = anchor.getBoundingClientRect()
      const width = (menuEl && menuEl.offsetWidth) || MENU_FALLBACK_WIDTH
      const height = (menuEl && menuEl.offsetHeight) || MENU_FALLBACK_HEIGHT
      const viewWidth = window.innerWidth
      const viewHeight = window.innerHeight

      // 水平：先按原偏移对齐锚点，再夹进视口
      let left = Math.min(rect.left + MENU_OFFSET_X, viewWidth - width - VIEWPORT_PADDING)
      left = Math.max(VIEWPORT_PADDING, left)

      // 垂直：优先在锚点下方展开，下方放不下就翻到上方，上下都不够就贴住视口
      let top = rect.bottom + MENU_GAP
      if (top + height > viewHeight - VIEWPORT_PADDING) {
        const above = rect.top - MENU_GAP - height
        top = (above >= VIEWPORT_PADDING)
          ? above
          : Math.max(VIEWPORT_PADDING, viewHeight - height - VIEWPORT_PADDING)
      }

      this.menuStyle = {
        left: Math.round(left) + 'px',
        top: Math.round(top) + 'px'
      }
    }
  }
}
</script>

<style scoped>
.color-picker__wrapper {
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 14px;
}

.color-picker__label {
  flex: 0 0 56px;
  min-width: 0;
  box-sizing: border-box;
  padding-right: 8px;
  font-size: 12px;
  color: #606266;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.color-picker__anchor {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.anchor__color-display {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  margin-right: 8px;
  box-sizing: border-box;
}

.anchor__value {
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.color-picker__menu {
  /* 视口定位：坐标由 positionMenu 实时计算，跳出抽屉与折叠区的 overflow 裁剪 */
  top: 0;
  left: 0;
  position: fixed;
  z-index: 1030;
}
</style>
