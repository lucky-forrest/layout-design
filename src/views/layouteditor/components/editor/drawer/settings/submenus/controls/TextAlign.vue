
<template>
  <div class="icon-bar">
    <svgicon
      :color="isAlignedLeft ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
      icon="system/editor/align_left"
      width="22"
      height="22"
      @click.native="onToggleProp('left', isAlignedLeft)"/>
    <svgicon
      :color="isAlignedRight ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
      icon="system/editor/align_right"
      width="22"
      height="22"
      @click.native="onToggleProp('right', isAlignedRight)"/>
    <svgicon
      :color="isCentered ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
      icon="system/editor/align_center"
      width="22"
      height="22"
      @click.native="onToggleProp('center', isCentered)"/>
    <svgicon
      :color="isJustified ?'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
      icon="system/editor/align_justify"
      width="22"
      height="22"
      @click.native="onToggleProp('justify', isJustified)"/>
  </div>
</template>

<script>
export default {
  name: 'TextAlign',
  /* eslint-disable */
  props: ['textAlign'],
  computed: {
    isAlignedLeft() { return (this.textAlign === 'left') },
    isAlignedRight() { return (this.textAlign === 'right') },
    isCentered() { return (this.textAlign === 'center') },
    isJustified() { return (this.textAlign === 'justify') }
  },
  methods: {
    onToggleProp(val, isOn) {
      this.$emit('change', isOn ? 'inherit' : val)
    }
  }
}
</script>

<style scoped>
.icon-bar {
  margin: 16px 20px 8px;
  user-select: none;
  text-align: center;
  display: flex;
  justify-content: space-between;
}
  .icon-bar svg {
    cursor: pointer;
  }
</style>
