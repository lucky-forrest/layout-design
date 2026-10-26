/* eslint-disable vue/require-default-prop */
<template>
  <div class="action-bar__wrapper">
    <button v-tooltip.right="'放大'" :disabled="!canZoomIn" class="action-btn" @click="zoomIn">
      <svgicon
        :color="canZoomIn ? '#fff' : 'rgba(255,255,255,.5)'"
        icon="system/editor/zoom_in"
        width="24"
        height="24"
      />
    </button>

    <div :key="Math.round(zoom * 100)" class="zoom-value">{{ Math.round(zoom * 100) + '%' }}</div>

    <button v-tooltip.right="'缩小'" :disabled="!canZoomOut" class="action-btn" @click="zoomOut">
      <svgicon
        :color="canZoomOut ? '#fff' : 'rgba(255,255,255,.5)'"
        icon="system/editor/zoom_out"
        width="24"
        height="24"
      />
    </button>

    <div class="action-bar__divider"/>

    <button
      v-tooltip.right="'适应画布'"
      class="action-btn action-btn--text"
      @click="$emit('fit')">
      适应
    </button>

    <button
      v-tooltip.right="'实际大小 100%'"
      class="action-btn action-btn--text"
      @click="$emit('reset')">
      100%
    </button>

    <button
      v-tooltip.right="hasSelection ? '缩放到选中元件' : '先选中元件再缩放到选中'"
      :disabled="!hasSelection"
      class="action-btn action-btn--text"
      @click="hasSelection && $emit('zoomToSelection')">
      选中
    </button>
  </div>
</template>

<script>
import '@/assets/design/icons/system/editor/zoom_in'
import '@/assets/design/icons/system/editor/zoom_out'
import { MIN_ZOOM, MAX_ZOOM, ZOOM_STEP, clampZoom } from '@/helpers/zoom'

export default {
  name: 'ZoomMenu',
  props: {
    zoom: {
      type: Number,
      default: 1
    },
    hasSelection: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    canZoomIn() {
      return this.zoom < MAX_ZOOM
    },
    canZoomOut() {
      return this.zoom > MIN_ZOOM
    }
  },
  methods: {
    zoomIn() {
      this.$emit('zoomChange', clampZoom(this.zoom * ZOOM_STEP))
    },
    zoomOut() {
      this.$emit('zoomChange', clampZoom(this.zoom / ZOOM_STEP))
    }
  }
}
</script>

<style scoped>
.action-bar__wrapper {
  width: 48px;
  z-index: 1000;
  display: block;
  align-items: center;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.78);
  border-radius: 50px;
  opacity: 0.25;
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.action-bar__wrapper:hover {
  opacity: 1;
}

.action-btn {
  height: 36px;
  width: 36px;
  min-width: 28px;
  min-height: 28px;
  padding: 1px;
  margin: 6px 0;
  border-radius: 100%;

  background-color: transparent;
  border: 0px none;
  user-select: none;
  outline: none;
}
.action-btn:hover:not(:disabled) {
  background-color: rgba(238, 238, 238, 0.12);
}
.action-btn:active:not(:disabled) {
  background-color: rgba(238, 238, 238, 0.38);
}
.action-btn:focus-visible {
  outline: 2px solid rgba(255, 255, 255, .9);
  outline-offset: 2px;
}
.action-btn * {
  vertical-align: middle;
}
.action-btn .vue-svg-icon {
  transition: transform .16s cubic-bezier(0.4, 0, 0.2, 1);
}
.action-btn:hover:not(:disabled) .vue-svg-icon {
  transform: scale(1.12);
}
.action-btn:active:not(:disabled) .vue-svg-icon {
  transform: scale(.88);
}
.action-btn:disabled {
  cursor: not-allowed;
}

.action-btn--text {
  height: 26px;
  margin: 3px 0;
  font-size: 11px;
  line-height: 24px;
  color: #fff;
}
.action-btn--text:disabled {
  color: rgba(255, 255, 255, 0.4);
}

.action-bar__divider {
  width: 24px;
  height: 1px;
  margin: 6px auto;
  background-color: rgba(255, 255, 255, 0.24);
}

.zoom-value {
  text-align: center;
  color: #fff;
  font-size: small;
  animation: zoom-pop .22s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes zoom-pop {
  0% { transform: scale(.9); }
  100% { transform: scale(1); }
}
</style>
