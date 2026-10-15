<template>
  <div class="icon-bar">
    <span v-if="label" class="icon-bar__label">{{ label }}</span>
    <div class="icon-bar__items">
      <svgicon
        :color="isAlignedLeft ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
        icon="system/editor/align_left"
        width="18"
        height="18"
        @click.native="onToggleProp('left', isAlignedLeft)"/>
      <svgicon
        :color="isAlignedRight ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
        icon="system/editor/align_right"
        width="18"
        height="18"
        @click.native="onToggleProp('right', isAlignedRight)"/>
      <svgicon
        :color="isCentered ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
        icon="system/editor/align_center"
        width="18"
        height="18"
        @click.native="onToggleProp('center', isCentered)"/>
      <svgicon
        :color="isJustified ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
        icon="system/editor/align_justify"
        width="18"
        height="18"
        @click.native="onToggleProp('justify', isJustified)"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextAlign',
  /* eslint-disable */
  props: ['textAlign', 'label'],
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
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 14px;
}

.icon-bar__label {
  flex: 0 0 56px;
  min-width: 0;
  box-sizing: border-box;
  padding-right: 8px;
  font-size: 12px;
  color: #606266;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.icon-bar__items {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.icon-bar svg {
  cursor: pointer;
}
</style>
