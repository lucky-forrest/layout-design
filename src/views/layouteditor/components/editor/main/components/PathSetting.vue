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
        <el-button :disabled="pathDataList.length===0" type="primary" @click="saveHandler">保存</el-button>
      </el-button-group>
    </div>
    <el-popover v-model="showInfo" placement="top-start" title="更新索引" width="200" >
      <template v-slot:content>
        <el-input v-model.number="currPoint.index" placeholder="请输入索引">
          <el-button slot="append" type="primary" icon="el-icon-document-checked" class="btn-save" @click="updatePointHandler"/>
        </el-input>
      </template>
      <span slot="reference" :style="{position: 'absolute',left:`${currPoint.pointX}px`,top:`${currPoint.pointY}px`}"/>
    </el-popover>
  </div>
</template>

<script>
import { updateEgglement } from '@/store/types'
import { mapState, mapMutations } from 'vuex'
import mixins from './view-common'
import Point from './point'
import SVG from 'svg.js'
export default {
  mixins: [mixins],
  data() {
    return {
      draw: null,
      showInfo: false,
      currPoint: {},
      lineWidth: 10,
      lineHeight: 10,
      pathDataList: []
    }
  },
  computed: {
    btnDisable() {
      return !Array.isArray(this.pathDataList) || this.pathDataList.length === 0
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
      const pointList = Object.entries(this.elemObj.attrs.pathList || {}) || []
      pointList.forEach(([index, [pointX, pointY]]) => {
        this.createPoint(pointX, pointY, index)
      })
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
    createPoint(pointX, pointY, index) {
      const isExistsIndex = this.pathDataList.findIndex(p => p.pointX === pointX && p.pointY === pointY)
      if (isExistsIndex >= 0) {
        this.currPoint = this.pathDataList[isExistsIndex]
        this.showInfo = true
      } else {
        this.pathDataList.push(new Point(pointX, pointY, index, this.draw))
      }
    },
    clickHandler($event) {
      const targetDom = $event.target
      const { offsetLeft, offsetTop, offsetWidth, offsetHeight } = targetDom
      const offsetX = offsetWidth / 2
      const offsetY = offsetHeight / 2
      const pointX = offsetLeft + offsetX
      const pointY = offsetTop + offsetY
      const index = this.pathDataList.length === 0 ? '1' : `${Math.max(...this.pathDataList.map(p => Number(p.index))) + 1}`
      this.createPoint(pointX, pointY, index)
    },
    clearHandler() {
      const removePoint = this.pathDataList.pop()
      removePoint.remove()
    },
    saveHandler() {
      this.updateEgglement({
        egglement: this.elemObj,
        attrs: {
          row: this.elemObj.attrs.row,
          col: this.elemObj.attrs.col,
          pathList: this.pathDataList.reduce((o, item) => {
            o[item.index] = [item.pointX, item.pointY]
            return o
          }, {})
        }
      })
    },
    updatePointHandler() {
      this.currPoint.update(`${this.currPoint.index}`)
      this.showInfo = false
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
/deep/.el-input-group__append{
  border:1px solid #409EFF !important;
  .btn-save {
    border-radius:0 4px 4px 0;
    color:#fff !important;
    background: #409EFF !important;
  }
}
</style>
