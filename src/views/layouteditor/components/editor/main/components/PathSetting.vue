<template>
  <div class="view-element">
    <div id="draw-container"/>
    <div class="draw-grid">
      <template v-if="elemObj.attrs.col">
        <div
          v-for="item in (parseInt(elemObj.attrs.row)*parseInt(elemObj.attrs.col))"
          :style="getItemStyle(item,elemObj.attrs)"
          :key="item"
          class="cell"
          @click="clickHandler"/>
      </template>
    </div>
    <div class="draw-tools">
      <el-button-group>
        <el-button :disabled="!points.length" type="primary" @click="undoHandler">撤销</el-button>
        <el-button :disabled="selectedIndex < 0" type="primary" @click="removeSelectedHandler">删除该点</el-button>
        <el-button :disabled="!points.length" type="primary" @click="clearHandler">清空</el-button>
        <el-button :disabled="!dirty" type="primary" @click="saveHandler">保存</el-button>
      </el-button-group>
      <span :class="['draw-state', { 'draw-state--dirty': dirty }]">
        {{ dirty ? '有未保存的改动' : '与布局一致' }}
      </span>
    </div>
    <p class="draw-hint">
      点格子加一个点 · 拖圆点调位置 · 相邻点自动连线 · 序号自动重排 ·
      改完点「保存」写入布局（可 Ctrl+Z 撤销）
    </p>
  </div>
</template>

<script>
import { updateElement } from '@/store/types'
import { mapState, mapMutations } from 'vuex'
import mixins from './view-common'
import Point from './point'
import SVG from 'svg.js'
import notify from '@/views/layouteditor/components/mixins/notify'

export default {
  mixins: [mixins, notify],
  data() {
    return {
      draw: null,
      /** 路径点，顺序即路径顺序：[{ x, y }] */
      points: [],
      /** 已实例化的 svg 点，与 points 一一对应 */
      shapes: [],
      /** 连线 */
      line: null,
      selectedIndex: -1,
      dirty: false
    }
  },
  computed: {
    ...mapState({
      editorZoom: state => state.layoutEditor.editorZoom
    })
  },
  watch: {
    /** 撤销/重做或属性面板改数据后，画布跟着重画（双向同步） */
    'elemObj.attrs.pathList': {
      deep: true,
      handler() {
        const incoming = this.readPoints()
        if (this.serialize(incoming) === this.serialize(this.points)) return
        this.points = incoming
        this.dirty = false
        this.selectedIndex = -1
        this.render()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.draw = SVG('draw-container').size('100%', '100%')
      // 画布层不吃鼠标事件，只有圆点可交互，避免挡住格子点击
      this.draw.attr('pointer-events', 'none')
      this.points = this.readPoints()
      this.render()
    })
  },
  beforeDestroy() {
    if (this.dirty) {
      this.notifyWarning('路径规划的改动还没保存，记得点「保存」')
    }
  },
  methods: {
    ...mapMutations([updateElement]),

    getItemStyle(item, { col, row } = {}) {
      return {
        'width': `${100 / col}%`,
        'border-right': item % col === 0 ? 'none' : '1px dashed black',
        'border-bottom': item > parseInt(row - 1) * parseInt(col) ? 'none' : '1px dashed black'
      }
    },

    /** 从元件属性读出路径点（按索引数值排序，索引错乱也能纠正） */
    readPoints() {
      const list = this.elemObj.attrs && this.elemObj.attrs.pathList
      if (!list || typeof list !== 'object') return []

      return Object.keys(list)
        .sort((a, b) => Number(a) - Number(b))
        .map(key => {
          const point = list[key] || []
          return { x: Number(point[0]) || 0, y: Number(point[1]) || 0 }
        })
    },

    /** 只比坐标，用来判断外部数据是否真的变了 */
    serialize(points) {
      return (points || []).map(p => Math.round(p.x) + ',' + Math.round(p.y)).join('|')
    },

    /** 重画：连线 + 所有圆点 */
    render() {
      if (!this.draw) return

      this.shapes.forEach(shape => shape.remove())
      this.shapes = []
      if (this.line) {
        this.line.remove()
        this.line = null
      }

      if (this.points.length > 1) {
        this.line = this.draw
          .polyline(this.points.map(p => [p.x, p.y]))
          .fill('none')
          .stroke({ color: '#ff3b7b', width: 2, dasharray: '6,4' })
        this.line.attr('pointer-events', 'none')
      }

      this.points.forEach((item, index) => {
        const shape = new Point(item.x, item.y, index + 1, this.draw, {
          zoom: this.editorZoom,
          onSelect: () => this.selectHandler(index),
          onDrag: (point, x, y) => this.dragHandler(index, x, y),
          onDragEnd: () => this.dragEndHandler()
        })
        this.shapes.push(shape)
      })

      this.refreshActive()
    },

    /** 拖动过程中只更新坐标与连线，不重建节点 */
    dragHandler(index, x, y) {
      if (!this.points[index]) return
      this.points[index].x = x
      this.points[index].y = y
      this.dirty = true
      this.updateLine()
    },

    dragEndHandler() {
      this.dirty = true
      this.updateLine()
    },

    updateLine() {
      if (!this.line) return
      this.line.plot(this.points.map(p => [p.x, p.y]))
    },

    selectHandler(index) {
      this.selectedIndex = index
      this.refreshActive()
    },

    refreshActive() {
      this.shapes.forEach((shape, index) => {
        shape.setActive(index === this.selectedIndex)
      })
    },

    /** 新增点：落在格子中心，序号排在最后 */
    clickHandler($event) {
      const targetDom = $event.target
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = targetDom

      this.points.push({
        x: offsetLeft + offsetWidth / 2,
        y: offsetTop + offsetHeight / 2
      })
      this.selectedIndex = this.points.length - 1
      this.dirty = true
      this.render()
    },

    undoHandler() {
      if (!this.points.length) return
      this.points.pop()
      this.selectedIndex = -1
      this.dirty = true
      this.render()
    },

    removeSelectedHandler() {
      if (this.selectedIndex < 0) return
      this.points.splice(this.selectedIndex, 1)
      this.selectedIndex = this.points.length ? Math.min(this.selectedIndex, this.points.length - 1) : -1
      this.dirty = true
      this.render()
    },

    clearHandler() {
      if (!this.points.length) return
      this.$confirm('清空这一页路径上的全部点？', '清空路径', {
        type: 'warning',
        confirmButtonText: '清空',
        cancelButtonText: '取消'
      }).then(() => {
        this.points = []
        this.selectedIndex = -1
        this.dirty = true
        this.render()
        this.saveHandler()
      }).catch(() => {})
    },

    /** 写入元件属性：索引按当前顺序重排为 1..n */
    saveHandler() {
      const pathList = this.points.reduce((result, item, index) => {
        result[index + 1] = [Math.round(item.x), Math.round(item.y)]
        return result
      }, {})

      this.updateElement({
        element: this.elemObj,
        attrs: {
          row: this.elemObj.attrs.row,
          col: this.elemObj.attrs.col,
          pathList
        }
      })
      this.dirty = false
      this.notifySuccess('路径已保存，共 ' + this.points.length + ' 个点')
    }
  }
}
</script>
<style lang="scss" scoped>
.view-element {
  height: 100%;
  #draw-container {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .draw-grid{
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    border: 1px solid #000;
    .cell {
      margin: 0;
      width: 15%;
      padding: 1px;
      text-align: center;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
  .draw-tools {
    position: absolute;
    top:4px;
    right:5px;
    display: flex;
    align-items: center;
  }
  .draw-state {
    margin-left: 8px;
    padding: 1px 6px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, .9);
    color: #7d8a8a;
    font-size: 11px;
    white-space: nowrap;
  }
  .draw-state--dirty {
    color: #b0661a;
    background-color: rgba(255, 236, 214, .95);
  }
  .draw-hint {
    position: absolute;
    left: 6px;
    bottom: 2px;
    margin: 0;
    padding: 1px 6px;
    border-radius: 3px;
    background-color: rgba(255, 255, 255, .86);
    color: #7d8a8a;
    font-size: 10px;
    white-space: nowrap;
    pointer-events: none;
  }
}
</style>
