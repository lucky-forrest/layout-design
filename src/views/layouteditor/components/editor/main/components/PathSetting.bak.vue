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
        <el-button type="primary">&nbsp;&nbsp;</el-button>
        <el-button :disabled="btnDisable" type="primary" @click="clearHandler">清除</el-button>
        <el-button :disabled="btnDisable" type="primary" @click="addHandler">新建</el-button>
        <el-button :disabled="pathDataList.length===0" type="primary" @click="saveHandler">保存</el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import { updateEgglement } from '@/store/types'
import { mapState, mapMutations } from 'vuex'
import mixins from './view-common'
import { cloneDeep } from 'lodash'
import SVG from 'svg.js'
export default {
  mixins: [mixins],
  data() {
    return {
      draw: null,
      lineWidth: 10,
      lineHeight: 10,
      pathDataList: [],
      layer: {}
    }
  },
  computed: {
    btnDisable() {
      return !Array.isArray(this.layer.data) || this.layer.data.length === 0
    },
    ...mapState({
      selectedElements: state => state.layoutEditor.selectedElements
    }),
    selectedItem() {
      return this.selectedElements[0]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.draw = SVG('draw-container').size('100%', '100%')
      this.layer = this.getLayer()
    })
  },
  methods: {
    ...mapMutations([updateEgglement]),
    getItemStyle(item, { col, row } = {}) {
      return {
        'width': `${100 / col}%`,
        'border-right': item % col === 0 ? 'none' : '1px dashed black',
        'border-bottom': item > parseInt(row - 1) * parseInt(col) ? 'none' : '1px dashed black'
      }
    },
    clickHandler($event) {
      const targetDom = $event.target
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = targetDom
      const offsetX = offsetWidth / 2
      const offsetY = offsetHeight / 2
      const pointX = offsetLeft + offsetX
      const pointY = offsetTop + offsetY
      // 缓存当前位置信息
      this.layer.data.push([pointX, pointY])
      // 绘制图形
      this.drawShape(this.layer)
    },
    clearHandler() {
      this.layer.data.pop()
      // 绘制图形
      this.drawShape(this.layer)
    },
    addHandler() {
      this.pathDataList.push(cloneDeep(this.layer))
      this.repaint()
    },
    saveHandler() {
      Object.assign(this.elemObj.attrs, { pathList: this.pathDataList })
      const pathList = this.pathDataList.map((item, index) => {
        return {
          pathNo: index + 1,
          data: item.data
        }
      })
      this.updateEgglement({
        egglement: this.elemObj,
        attrs: {
          row: this.elemObj.attrs.row,
          col: this.elemObj.attrs.col,
          pathList
        }
      })
    },
    repaint() {
      this.pathDataList.forEach((layer, index) => {
        this.drawShape({ ...layer, color: '#666' })
      })
      this.layer = this.getLayer(this.pathDataList.length)
    },
    getLayer(pathNo = '') {
      return {
        id: `layer${pathNo}`,
        data: [],
        color: 'deeppink',
        pointInstance: null,
        lineInstance: null
      }
    },
    drawShape(layer) {
      this.drawCircle(layer)
      // this.drawPolyline(layer)
    },
    drawCircle(layer) {
      if (!layer.pointInstance) {
        layer.pointInstance = this.draw.group().attr({ id: layer.id })
      } else {
        // 清除所有的点信息
        SVG.get(layer.id).clear()
      }
      // 重新绘制红点
      layer.data.forEach(([pointX, pointY], index) => {
        // 定义点的半径
        const circleW = 20
        const circleX = pointX - circleW / 2
        const circleY = pointY - circleW / 2
        const circle = this.draw.circle(circleW).fill(layer.color).move(circleX, circleY)
        this.draw.text(`${index + 1}`).move(circleX + 5, pointY).font({ size: '9px' })
        layer.pointInstance.add(circle)
      })
    },
    drawPolyline(layer) {
      if (!layer.lineInstance) {
        layer.lineInstance = this.draw.polyline(layer.data).stroke({ width: 5, color: layer.color }).fill('none')
      } else {
        layer.lineInstance = layer.lineInstance.animate(200).plot(layer.data).stroke({ width: 5, color: layer.color }).fill('none')
      }
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
  }
}
</style>
