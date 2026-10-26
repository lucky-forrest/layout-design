<template>
  <div class="state-menu">
    <span class="state-menu__label">状态预览</span>
    <el-select
      :value="previewState"
      size="mini"
      class="state-menu__select"
      @change="onChange">
      <el-option
        v-for="item in states"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <span
      :title="tip"
      :class="['state-menu__dot', { 'state-menu__dot--alarm': previewState === 'alarm' }]"
      :style="{ backgroundColor: dotColor }"/>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { PREVIEW_STATES } from '@/helpers/stateColor'
import { _setPreviewState } from '@/store/types'

export default {
  name: 'StateMenu',
  data: function() {
    return {
      states: PREVIEW_STATES
    }
  },
  computed: {
    dotColor() {
      if (this.previewState === 'alarm') return '#c24648'
      if (this.previewState === 'offline') return '#9aa3a3'
      return '#3e9a54'
    },
    tip() {
      return this.previewState === 'normal'
        ? '绑定状态色的元件按「正常」配色显示'
        : '当前是模拟状态，导出图片也会是这套配色，交付前请切回「正常」'
    },
    ...mapState({
      previewState: state => state.layoutEditor.previewState
    })
  },
  methods: {
    onChange(value) {
      this._setPreviewState(value)
    },
    ...mapMutations([_setPreviewState])
  }
}
</script>

<style scoped>
.state-menu {
  display: flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, .92);
  box-shadow: 0 1px 6px rgba(0, 0, 0, .16);
}

.state-menu__label {
  margin-right: 6px;
  color: #4b6161;
  font-size: 11px;
  white-space: nowrap;
}

.state-menu__select {
  width: 76px;
}

.state-menu__dot {
  width: 8px;
  height: 8px;
  margin-left: 6px;
  border-radius: 50%;
  transition: background-color .25s ease;
}

/* 模拟告警状态：圆点柔光脉冲，提示当前导出会是告警配色 */
.state-menu__dot--alarm {
  animation: state-alarm-pulse 1s ease-in-out infinite;
}

@keyframes state-alarm-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(194, 70, 72, .6); }
  50% { box-shadow: 0 0 0 5px rgba(194, 70, 72, 0); }
}
</style>
