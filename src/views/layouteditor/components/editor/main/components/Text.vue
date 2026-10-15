<template>
  <span class="view-element">
    {{ elemObj.primaryKey }}
  </span>
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
<style lang="scss" scoped>
  .view-element{
    font: italic bold 12px/20px arial,sans-serif !important;
    cursor: default;
  }
</style>
