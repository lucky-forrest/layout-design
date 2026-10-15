<template>
  <div class="view-element">
    <svgicon
      v-if="elemObj.attrs.src"
      :name="elemObj.attrs.src"
      :style="{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: `translate(-50%,-50%) rotate(${elemObj.attrs.rotate}deg)`
      }"
      :width="`${elemObj.width}`.replace(/px/,'px')"
      :height="`${elemObj.height}`.replace(/px/,'px')" />
  </div>
</template>
<script>
import '@/assets/design/icons'
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

