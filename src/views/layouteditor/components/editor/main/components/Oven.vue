<template>
  <el-tooltip :open-delay="300" placement="top" effect="light">
    <div slot="content">{{ elemObj.primaryKey }}</div>
    <div :style="{'background-color':portStatus}" class="view-element">
      <!-- <div class="temperature">{{ elemObj.attrs.nickName }}</div> -->
    </div>
  </el-tooltip>
</template>

<script>
import mixins from './view-common'
export default {
  mixins: [mixins],
  computed: {
    portStatus() {
      return '#C24648'
    }
  },
  created() {
    console.log(this.elemObj.attrs.nickName)
  }
}
</script>
<style lang="scss" scoped>
.view-element {
  position: relative;
  border: 1px solid #000;
  border-radius: 2px;
  .temperature{
    position: absolute;
    left:50%;
    bottom:5px;
    transform: translateX(-50%);
    padding:0 5px;
    border:1px solid #fff;
    border-radius:5px;
  }
}
</style>
