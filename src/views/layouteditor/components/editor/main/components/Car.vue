<template>
  <div class="view-element">
    <div class="car-item-road">
      <el-tooltip :content="'旋风小王子'" :open-delay="500" placement="top">
        <svgicon :icon="'system/elements/car'" class="car" width="24" height="24" color="green"/>
      </el-tooltip>
    </div>
    <div class="car-item-grid">
      <div class="grid-row first-row">
        <el-tooltip v-for="index in parseInt(elemObj.attrs.col)" :key="index" :content="`${index}`" :open-delay="500" placement="top">
          <div :style="{'width':`${ 100/parseInt(elemObj.attrs.col)}%`}" class="row-cell"/>
        </el-tooltip>
      </div>
      <div class="grid-row second-row">
        <el-tooltip v-for="index in parseInt(elemObj.attrs.col)" :key="index" :content="`${index+parseInt(elemObj.attrs.col)}`" :open-delay="500" placement="top">
          <div :style="{'width':`${ 100/parseInt(elemObj.attrs.col)}%`}" class="row-cell"/>
        </el-tooltip>
      </div>
    </div>
    <div class="car-item-road">
      <el-tooltip :content="'超酷卡卡'" :open-delay="500" placement="top">
        <svgicon :icon="'system/elements/car'" class="car" width="24" height="24" color="red"/>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import '@/assets/design/icons/system/elements/'
import mixins from './view-common'
export default {
  mixins: [mixins]
}
</script>
<style lang="scss" scoped>
.view-element {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: stretch;
  .car-item-road{
    position: relative;
    height:30px;
    line-height: 30px;
    background-color:rgba(#000,.3);
    .car{
      position: absolute;
      top:5px;
      left:200px;
      vertical-align: middle;
    }
  }
  .car-item-grid{
    flex:1;
    display: flex;
    flex-direction:column;
    justify-content: center;
    height:100%;
    border-top: 3px dashed #e3e3e3;
    border-bottom: 3px dashed #e3e3e3;
    .grid-row{
      display: flex;
      flex-flow: row nowrap;
      width:100%;
      .row-cell{
        width:1.25%;
        height:20px;
        border-right:1px solid black;
        &:hover{
          cursor: pointer;
          background-color:greenyellow;
        }
      }
    }
    .first-row{
      border-top:1px solid black;
      .row-cell{
        border-bottom:1px solid black;
      }
      .row-cell:first-child{
        border-left:1px solid black;
      }
    }
    .second-row{
      border-bottom:1px solid black;
      .row-cell:first-child{
        border-left:1px solid black;
      }
    }
  }
}
</style>
