<template>
  <div>
    <menu-toggle menu-header="General">
      <dim-pos
        :height="h"
        :width="w"
        :has-pos="false"
        @change="({type, value}) => emitChanges(type, value)"/>
      <div class="menu">
        <slider
          :value="sty['opacity'] || 1"
          label="Opacity"
          icon="system/editor/opacity"
          min="0"
          max="1"
          @change="currentValue => onStyleChanges('opacity', currentValue)"/>
        <color-picker
          :color="sty['background-color']"
          label="Background color"
          icon="system/editor/bg_color"
          @input="newColor => onStyleChanges('background-color', newColor)"/>
      </div>
    </menu-toggle>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import Slider from './controls/Slider'
import ColorPicker from './controls/ColorPicker'
import MenuToggle from '@/views/layouteditor/components/editor/common/MenuToggle'
import DimPos from './controls/DimPos'

export default {
  name: 'PageSettings',
  components: {
    Slider,
    ColorPicker,
    MenuToggle,
    DimPos
  },
  /* eslint-disable */
  props: ['height', 'width', 'styles','attrs'],
  data: function() {
    return {
      h: this.height,
      w: this.width,
      sty: cloneDeep(this.styles),
      att: cloneDeep(this.attrs),
    }
  },
  watch: {
    'height'(val) { this.h = val.toString() },
    'width'(val) { this.w = val.toString() },
    'styles'(val) { this.sty = cloneDeep(val) },
    'attrs'(val) { this.att = cloneDeep(val) },
  },
  methods: {
    onStyleChanges(prop, value) {
      this.sty[prop] = value
      this.emitChanges('styles', this.sty)
    },
    onAttrsChanges(prop, value) {
      this.att[prop] = value
      this.emitChanges('attrs', this.att)
    },
    emitChanges(type, value) {
      this.$emit('propchange', { type, value })
    }
  }
}
</script>

<style lang="scss" scoped>
  .menu {
    width: 100%;
    height: 100%;
    margin: 1px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  .inline-form {
    margin-bottom:10px;
    padding: 0 20px;
    font-size:9px;
    color:rgba(0, 0, 0, 0.6);
    label {
      font-size: 9px;
      color: #666;
      font-weight: normal;
    }
  }

  .inline-form>:last-child {
    width: 100%;
    border-collapse:collapse;
    th,td{
      padding:0 0 0 10px;
      line-height: 25px;
      border: 1px solid #e3e3e3;
    }
  }
</style>
