<template>
  <el-button type="primary" class="view-element">
    {{ elemObj.primaryKey }}
  </el-button>
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

