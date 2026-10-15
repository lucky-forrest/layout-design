<template>
  <div>
    <align-tools/>
    <menu-toggle>
      <menu-toggle menu-header="常规">
        <dim-pos
          :height="h"
          :width="w"
          :top="t"
          :bottom="b"
          :left="l"
          :right="r"
          @change="({type, value}) => emitChanges(type, value)"/>
        <slider
          :value="sty['opacity'] || 1"
          label="不透明度"
          min="0"
          max="1"
          @change="currentValue => onStyleChanges('opacity', currentValue)"/>
        <stack-order
          :z-index="z"
          @change="newValue => emitChanges('zIndex', newValue)"/>
      </menu-toggle>
    </menu-toggle>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import MenuToggle from '@/views/layouteditor/components/editor/common/MenuToggle'
import Slider from './controls/Slider'
import StackOrder from './controls/StackOrder'
import DimPos from './controls/DimPos'
import AlignTools from './controls/AlignTools'

export default {
  name: 'ComponentSettings',
  components: { MenuToggle, Slider, StackOrder, DimPos, AlignTools },
  /* eslint-disable */
  props: ['height', 'width', 'top', 'left', 'bottom', 'right', 'zIndex', 'styles'],
  data: function() {
    return {
      h: this.height,
      w: this.width,
      t: this.top,
      l: this.left,
      b: this.bottom,
      r: this.right,
      z: this.zIndex,
      sty: cloneDeep(this.styles),
      borderSelected: ''
    }
  },
  watch: {
    'height'(val) { this.h = val.toString() },
    'width'(val) { this.w = val.toString() },
    'top'(val) { this.t = val.toString() },
    'left'(val) { this.l = val.toString() },
    'bottom'(val) { this.b = val.toString() },
    'right'(val) { this.r = val.toString() },
    'zIndex'(val) { this.z = val },
    'styles'(val) { this.sty = cloneDeep(val) }
  },
  methods: {
    onStyleChanges(prop, value) {
      this.sty[prop] = value
      this.emitChanges('styles', this.sty)
    },

    emitChanges(type, value) {
      this.$emit('propchange', { type, value })
    }
  }
}
</script>
