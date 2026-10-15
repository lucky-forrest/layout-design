<template>
  <div :class="['ruler', 'ruler--' + axis]">
    <div :style="trackStyle" class="ruler__track"/>
    <div v-if="band" :style="bandStyle" class="ruler__band"/>
    <span
      v-for="mark in marks"
      :key="mark.value"
      :style="markStyle(mark)"
      class="ruler__mark">{{ mark.value }}</span>
  </div>
</template>

<script>
/**
 * 画布标尺：只显示，不接收事件。
 * 刻度用 CSS 渐变画（跟随滚动/缩放平移），数字按可视范围生成，避免大量 DOM。
 */
export default {
  name: 'Ruler',
  props: {
    axis: {
      type: String,
      default: 'x'
    },
    zoom: {
      type: Number,
      default: 1
    },
    /** 画布滚动量（px），与 canvas-main 的 scrollLeft / scrollTop 一致 */
    scroll: {
      type: Number,
      default: 0
    },
    /** 标尺可见长度（px） */
    length: {
      type: Number,
      default: 0
    },
    /** 页面在该方向上的尺寸（页面坐标 px） */
    size: {
      type: Number,
      default: 0
    },
    /** 当前选中范围在标尺上的像素位置 { start, end } */
    band: {
      type: Object,
      default: null
    }
  },
  computed: {
    horizontal() {
      return this.axis !== 'y'
    },

    /** 数字刻度间隔（页面坐标），随缩放自适应 */
    step() {
      if (this.zoom >= 1.2) return 50
      if (this.zoom >= 0.6) return 100
      if (this.zoom >= 0.3) return 200
      return 500
    },

    minorStep() {
      return Math.max(4, Math.round((this.step / 5) * this.zoom))
    },

    majorStep() {
      return Math.max(12, Math.round(this.step * this.zoom))
    },

    trackStyle() {
      const minor = this.minorStep
      const major = this.majorStep
      const direction = this.horizontal ? 'to right' : 'to bottom'

      return {
        backgroundImage: [
          'linear-gradient(' + direction + ', rgba(0, 0, 0, .30) 0 1px, transparent 1px)',
          'linear-gradient(' + direction + ', rgba(0, 0, 0, .13) 0 1px, transparent 1px)'
        ].join(','),
        backgroundSize: [
          major + 'px ' + major + 'px',
          minor + 'px ' + minor + 'px'
        ].join(','),
        backgroundPosition: this.horizontal
          ? -(this.scroll % major) + 'px 0, ' + -(this.scroll % minor) + 'px 0'
          : '0 ' + -(this.scroll % major) + 'px, 0 ' + -(this.scroll % minor) + 'px',
        backgroundRepeat: 'repeat'
      }
    },

    marks() {
      const list = []
      if (!this.size) return list

      const step = this.step
      const visibleFrom = this.scroll / this.zoom - step
      const visibleTo = (this.scroll + this.length) / this.zoom + step

      for (let value = 0; value <= this.size; value += step) {
        if (value < visibleFrom || value > visibleTo) continue
        list.push({
          value,
          pos: Math.round(value * this.zoom - this.scroll)
        })
      }
      return list
    },

    bandStyle() {
      if (!this.band) return {}
      const start = Math.round(this.band.start)
      const end = Math.round(this.band.end)
      return this.horizontal
        ? { left: start + 'px', width: Math.max(1, end - start) + 'px' }
        : { top: start + 'px', height: Math.max(1, end - start) + 'px' }
    }
  },
  methods: {
    markStyle(mark) {
      return this.horizontal
        ? { left: mark.pos + 'px' }
        : { top: mark.pos + 'px' }
    }
  }
}
</script>

<style scoped>
.ruler {
  position: absolute;
  z-index: 12;
  overflow: hidden;
  background-color: #f4f6f6;
  user-select: none;
  pointer-events: none;
}

.ruler--x {
  top: 0;
  left: 24px;
  right: 10px;
  height: 24px;
  border-bottom: 1px solid #e0e4e4;
}

.ruler--y {
  left: 0;
  top: 24px;
  bottom: 10px;
  width: 24px;
  border-right: 1px solid #e0e4e4;
}

.ruler__track {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.ruler__mark {
  position: absolute;
  color: #7b8a8a;
  font-size: 9px;
  line-height: 11px;
  white-space: nowrap;
}

.ruler--x .ruler__mark {
  top: 11px;
  padding-left: 3px;
}

.ruler--y .ruler__mark {
  left: 2px;
  padding-top: 3px;
  writing-mode: vertical-rl;
}

.ruler__band {
  position: absolute;
  background-color: rgba(3, 169, 244, .3);
}

.ruler--x .ruler__band {
  top: 0;
  bottom: 0;
}

.ruler--y .ruler__band {
  left: 0;
  right: 0;
}
</style>
