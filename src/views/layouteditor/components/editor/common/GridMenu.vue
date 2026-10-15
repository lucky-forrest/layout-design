<template>
  <div class="grid-menu">
    <el-tooltip :content="visible ? '隐藏网格' : '显示网格'" placement="bottom">
      <button
        :class="['grid-btn', { 'grid-btn--on': visible }]"
        type="button"
        @click="toggle('visible')">
        网格
      </button>
    </el-tooltip>
    <el-tooltip
      content="拖动时自动吸附到相邻元件的边缘/中心线与网格线上；按住 Alt 可临时关闭"
      placement="bottom">
      <button
        :class="['grid-btn', { 'grid-btn--on': snap }]"
        type="button"
        @click="toggle('snap')">
        吸附
      </button>
    </el-tooltip>
    <el-select
      :value="size"
      class="grid-size"
      size="mini"
      @change="onSizeChange">
      <el-option
        v-for="option in sizes"
        :key="option"
        :label="option + ' px'"
        :value="option"/>
    </el-select>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { _updateGrid } from '@/store/types'
import { GRID_SIZES } from '@/helpers/grid'

export default {
  name: 'GridMenu',
  data: function() {
    return {
      sizes: GRID_SIZES
    }
  },
  computed: {
    ...mapState({
      grid: state => state.layoutEditor.grid
    }),
    visible() {
      return !!(this.grid && this.grid.visible)
    },
    snap() {
      return !!(this.grid && this.grid.snap)
    },
    size() {
      return (this.grid && this.grid.size) || GRID_SIZES[1]
    }
  },
  methods: {
    toggle(flag) {
      const next = {}
      next[flag] = !(flag === 'visible' ? this.visible : this.snap)
      this._updateGrid(next)
    },
    onSizeChange(size) {
      this._updateGrid({ size })
    },
    ...mapMutations([_updateGrid])
  }
}
</script>

<style scoped>
.grid-menu {
  display: flex;
  align-items: center;
  padding: 2px 6px;
  border: 1px solid #e0e4e4;
  border-radius: 15px;
  background-color: rgba(255, 255, 255, .92);
}

.grid-btn {
  height: 20px;
  padding: 0 8px;
  margin: 0 1px;
  border: 0 none;
  border-radius: 10px;
  background-color: transparent;
  color: #6b7a7a;
  font-size: 12px;
  line-height: 20px;
  cursor: pointer;
  outline: none;
}

.grid-btn:hover {
  background-color: rgba(43, 106, 115, .08);
}

.grid-btn--on {
  background-color: rgba(43, 106, 115, .12);
  color: #2b6a73;
  font-weight: 600;
}

.grid-size {
  width: 76px;
  margin-left: 4px;
}

.grid-size >>> .el-input__inner {
  height: 22px;
  line-height: 22px;
  padding: 0 20px 0 6px;
  border-radius: 11px;
  font-size: 12px;
}
</style>
