<template>
  <div class="view-element">
    <el-tooltip :open-delay="300" placement="top" effect="light">
      <div slot="content">{{ elemObj.primaryKey }}</div>
      <svgicon
        v-if="elemObj.attrs.src"
        :name="elemObj.attrs.src"
        :style="{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: `translate(-50%,-50%) rotate(${elemObj.attrs.rotate}deg)`
        }"
        width="100%"
        height="100%"
      />
    </el-tooltip>
  </div>
</template>
<script>
import mixins from './view-common'
export default {
  mixins: [mixins],
  methods: {
    layoutEleClickEventHandler($event) {
      this.$emit('layoutEleClickEvent', $event)
    }
  }
}
</script>
