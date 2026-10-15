<template>
  <div class="nodata-container">
    <img :src="nodataFile" height="400px" width="100%">
    <h1>{{ data }}</h1>
  </div>
</template>
<script>
import nodataFile from '@/assets/images/nodata-file.svg'
export default {
  name: 'NoData',
  props: {
    data: {
      type: String,
      default: '暂无任何数据'
    }
  },
  data() {
    return {
      nodataFile
    }
  }
}
</script>
<style lang="scss">
.nodata-container {
  width: 100%;
  height: 100%;
  padding:20px;
  text-align: center;
  h1 {
    color: #666;
  }
}
</style>
