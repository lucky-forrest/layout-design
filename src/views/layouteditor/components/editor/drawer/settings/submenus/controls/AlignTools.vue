<template>
  <div class="align-tools">
    <div class="align-row">
      <span class="align-label">对齐</span>
      <button
        v-tooltip="item.label"
        v-for="item in alignModes"
        :key="item.mode"
        :disabled="!canAlign"
        class="align-btn"
        type="button"
        @click="align(item.mode)">
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path :d="item.path" fill="currentColor"/>
        </svg>
      </button>
    </div>

    <div class="align-row">
      <span class="align-label">分布</span>
      <button
        v-tooltip="item.label"
        v-for="item in distributeModes"
        :key="item.axis"
        :disabled="!canDistribute"
        class="align-btn"
        type="button"
        @click="distribute(item.axis)">
        <svg viewBox="0 0 16 16" width="14" height="14">
          <path :d="item.path" fill="currentColor"/>
        </svg>
      </button>
      <span class="align-tip">需选中 ≥ 3 个</span>
    </div>

    <div class="align-row">
      <span class="align-label">尺寸</span>
      <button
        v-tooltip="'全部改成第一个元件的宽度'"
        :disabled="!canDistribute"
        class="align-text-btn"
        type="button"
        @click="equalize('width')">统一宽</button>
      <button
        v-tooltip="'全部改成第一个元件的高度'"
        :disabled="!canDistribute"
        class="align-text-btn"
        type="button"
        @click="equalize('height')">统一高</button>
    </div>

    <div class="align-row">
      <span class="align-label">基准</span>
      <button
        :class="['align-text-btn', { 'align-text-btn--on': reference === 'selection' }]"
        type="button"
        @click="reference = 'selection'">选区</button>
      <button
        v-tooltip="'以当前层级的页面/容器为基准对齐'"
        :class="['align-text-btn', { 'align-text-btn--on': reference === 'canvas' }]"
        type="button"
        @click="reference = 'canvas'">画布</button>
    </div>

    <div class="align-row">
      <span class="align-label">元件</span>
      <button
        v-tooltip="'锁定后不可选中、不可拖动（按住 Alt 可临时选中）'"
        class="align-text-btn"
        type="button"
        @click="toggleFlag('locked', true)">锁定</button>
      <button
        class="align-text-btn"
        type="button"
        @click="toggleFlag('locked', false)">解锁</button>
      <button
        v-tooltip="'仅编辑态隐藏，导出图片与清单仍然包含'"
        class="align-text-btn"
        type="button"
        @click="toggleFlag('hidden', true)">隐藏</button>
      <button
        class="align-text-btn"
        type="button"
        @click="toggleFlag('hidden', false)">显示</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  alignElements,
  distributeElements,
  equalizeElements,
  setElementsFlag
} from '@/store/types'
import notify from '@/views/layouteditor/components/mixins/notify'

/** 六个对齐图标的路径：一条基准线 + 两个方块 */
const ALIGN_MODES = [
  { mode: 'left', label: '左对齐', path: 'M2 1h1.5v14H2z M5 3h9v3.5H5z M5 9.5h6v3.5H5z' },
  { mode: 'hcenter', label: '水平居中', path: 'M7.25 1h1.5v14h-1.5z M3.5 3h9v3.5h-9z M5 9.5h6v3.5H5z' },
  { mode: 'right', label: '右对齐', path: 'M12.5 1H14v14h-1.5z M2 3h9v3.5H2z M5 9.5h6v3.5H5z' },
  { mode: 'top', label: '顶对齐', path: 'M1 2h14v1.5H1z M3 5h3.5v9H3z M9.5 5H13v6H9.5z' },
  { mode: 'vcenter', label: '垂直居中', path: 'M1 7.25h14v1.5H1z M3 3h3.5v9H3z M9.5 5H13v6H9.5z' },
  { mode: 'bottom', label: '底对齐', path: 'M1 12.5h14V14H1z M3 2h3.5v9H3z M9.5 5H13v6H9.5z' }
]

const DISTRIBUTE_MODES = [
  { axis: 'x', label: '横向等距（首尾不动）', path: 'M1 1h1.5v14H1z M13.5 1H15v14h-1.5z M6.5 4h3v8h-3z' },
  { axis: 'y', label: '纵向等距（首尾不动）', path: 'M1 1h14v1.5H1z M1 13.5h14V15H1z M4 6.5h8v3H4z' }
]

/** 对齐方式对应的提示语 */
const ALIGN_DONE = {
  left: '已左对齐',
  hcenter: '已水平居中',
  right: '已右对齐',
  top: '已顶对齐',
  vcenter: '已垂直居中',
  bottom: '已底对齐'
}

export default {
  name: 'AlignTools',
  mixins: [notify],
  data: function() {
    return {
      alignModes: ALIGN_MODES,
      distributeModes: DISTRIBUTE_MODES,
      reference: 'selection'
    }
  },
  computed: {
    count() {
      return this.selectedElements.length
    },
    canAlign() {
      return this.count >= 2 || this.reference === 'canvas'
    },
    canDistribute() {
      return this.count >= 3
    },
    ...mapState({
      selectedElements: state => state.layoutEditor.selectedElements || []
    })
  },
  methods: {
    align(mode) {
      const result = this.alignElements({ mode, reference: this.reference })
      this.report(result, ALIGN_DONE[mode] || '已对齐')
    },

    distribute(axis) {
      const result = this.distributeElements({ axis })
      this.report(result, axis === 'x' ? '已横向等距分布' : '已纵向等距分布')
    },

    equalize(prop) {
      const result = this.equalizeElements({ prop })
      this.report(result, prop === 'width' ? '已统一宽度' : '已统一高度')
    },

    toggleFlag(flag, value) {
      const result = this.setElementsFlag({ flag, value })
      if (result.ok) {
        const name = flag === 'locked' ? '锁定' : '隐藏'
        this.notifySuccess('已' + (value ? '' : '取消') + name + ' ' + result.count + ' 个元件')
      } else {
        this.notifyWarning(result.error)
      }
    },

    report(result, successText) {
      if (result && result.ok) this.notifySuccess(successText)
      else this.notifyWarning((result && result.error) || '操作没有生效')
    },

    ...mapActions([alignElements, distributeElements, equalizeElements, setElementsFlag])
  }
}
</script>

<style scoped>
.align-tools {
  padding: 10px 20px 4px;
  border-bottom: 1px solid rgba(0, 0, 0, .06);
}

.align-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  min-height: 24px;
}

.align-label {
  flex: 0 0 40px;
  padding-right: 6px;
  color: #606266;
  font-size: 12px;
  text-align: right;
}

.align-tip {
  padding-left: 6px;
  color: #a8b1b1;
  font-size: 10px;
}

.align-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 24px;
  margin-right: 2px;
  padding: 0;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: transparent;
  color: #4b6161;
  cursor: pointer;
  outline: none;
}

.align-btn:hover:enabled {
  background-color: rgba(43, 106, 115, .1);
  border-color: rgba(43, 106, 115, .28);
}

.align-btn:disabled {
  color: #c8d0d0;
  cursor: not-allowed;
}

.align-text-btn {
  height: 22px;
  margin-right: 4px;
  padding: 0 7px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  color: #4b6161;
  font-size: 11px;
  line-height: 20px;
  cursor: pointer;
  outline: none;
  white-space: nowrap;
}

.align-text-btn:hover:enabled {
  border-color: #2b6a73;
  color: #2b6a73;
}

.align-text-btn:disabled {
  color: #c8d0d0;
  cursor: not-allowed;
}

.align-text-btn--on {
  border-color: #2b6a73;
  background-color: rgba(43, 106, 115, .1);
  color: #2b6a73;
}
</style>
