<template>
  <div :style="{'flex-direction':direction==='left'?'row':'row-reverse'}" class="view-element">
    <div class="left">
      <div class="left-content">
        <div class="count">0</div>
      </div>
    </div>
    <div class="right">
      <div class="right-content">
        <div class="right-content-bg" />
        <template >
          <div
            v-for="(item,index) in parseInt(elemObj.attrs.col)"
            :key="index"
            :style="{'width':`${ 100/parseInt(elemObj.attrs.col)}%`}"
            class="cell"
          >
            <div />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import mixins from './view-common'
export default {
  mixins: [mixins],
  data() {
    return {
      eqpName: 'Loader'
    }
  },
  computed: {
    direction() {
      return this.elemObj.attrs.direction || 'left'
    }
  }
}
</script>
<style lang="scss" scoped>
.view-element {
  display: flex;
  justify-content: center;
  flex-flow: row nowrap;
  .left {
    width: 85px;
    padding: 10px;
    .left-content {
      position: relative;
      height: 100%;
      text-align: center;
      border-radius: 5px;
      background-color: #e3e3e3;

      .count {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        line-height: 30px;
        border: 1px solid #e3e3e3;
        border-radius: 50%;
        background-color: #fff;
      }
    }
  }
  .right {
    flex: 1;
    padding: 15px 0;
    .right-content {
      position: relative;
      display: flex;
      flex-flow: row nowrap;
      justify-content: flex-end;
      width: 100%;
      height: 100%;
      .right-content-bg {
        position: absolute;
        left: 0;
        top: 10px;
        width: 100%;
        height: 8px;
        border: 1px solid #e3e3e3;
      }
      .cell {
        height: 100%;
        padding: 5px;
        div {
          width: 100%;
          height: 100%;
          background: #e3e3e3;
          position: relative;
        }
      }
    }
  }
}
</style>
