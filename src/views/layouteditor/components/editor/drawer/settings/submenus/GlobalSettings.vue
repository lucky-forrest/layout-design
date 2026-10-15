<template>
  <div>
    <menu-toggle menu-header="常规">
      <dim-pos
        :top="t"
        :bottom="b"
        :left="l"
        :right="r"
        :has-dim="false"
        @change="({type, value}) => emitChanges(type, value)"/>
      <stack-order
        :z-index="z"
        @change="newValue => emitChanges('zIndex', newValue)"/>
    </menu-toggle>
  </div>
</template>

<script>
import MenuToggle from '@/views/layouteditor/components/editor/common/MenuToggle'
import StackOrder from './controls/StackOrder'
import DimPos from './controls/DimPos'

export default {
  name: 'GlobalSettings',
  components: { MenuToggle, StackOrder, DimPos },
  /* eslint-disable */
  props: ['top', 'left', 'bottom', 'right', 'zIndex'],
  data: function() {
    return {
      t: this.top,
      l: this.left,
      b: this.bottom,
      r: this.right,
      z: this.zIndex
    }
  },
  watch: {
    'top'(val) { this.t = val.toString() },
    'left'(val) { this.l = val.toString() },
    'bottom'(val) { this.b = val.toString() },
    'right'(val) { this.r = val.toString() },
    'zIndex'(val) { this.z = val }
  },
  methods: {
    emitChanges(type, value) {
      this.$emit('propchange', { type, value })
    }
  }
}
</script>
