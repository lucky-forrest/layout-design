<template>
  <el-tooltip :open-delay="300" placement="top" effect="light">
    <div slot="content">{{ elemObj.primaryKey }}</div>
    <div :style="{'background-color':portStatus}" class="view-element">
      <svgicon
        v-if="elemObj.attrs.src"
        :name="elemObj.attrs.src"
        :style="{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%,-50%) rotate(${elemObj.attrs.rotate}deg)`
        }"
        :color="`${portStatus} r-#000`"
        width="100%"
        height="100%"
      />
    </div>
  </el-tooltip>
</template>

<script>
import '@/assets/design/icons'
import mixins from './view-common'
export default {
  mixins: [mixins],
  /* 未绑定状态键时使用的默认底色 */
  stateColorDefaults: {
    backgroundColor: '#C24648'
  },
  computed: {
    portStatus() {
      return this.stateColors.backgroundColor
    }
  }
}
</script>
<style lang="scss" scoped>
.view-element {
  border: 1px solid #000;
  border-radius: 2px;
}
</style>
