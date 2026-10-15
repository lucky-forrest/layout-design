<template>
  <div class="view-element">
    <stage-el
      v-for="item in (elemObj.children||[])"
      :key="item.id"
      :elem="item"
      @layoutEleClickEvent="layoutEleClickEventHandler"
    />
  </div>
</template>
<script>
import StageEl from '@/views/layouteditor/components/editor/main/StageEl'
import mixins from './view-common'
export default {
  filters: {
    formatType() {
      return 'eqpRedAlive'
    }
  },
  components: { StageEl },
  mixins: [mixins],
  methods: {
    layoutEleClickEventHandler($event) {
      this.$emit('layoutEleClickEvent', $event)
    }
  }
}
</script>
<style lang="scss" scoped>
.view-element {
  width: 100%;
  height: 100%;
}
</style>
