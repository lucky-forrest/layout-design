<template>
  <div class="icon-bar">
    <span v-if="label" class="icon-bar__label">{{ label }}</span>
    <div class="icon-bar__items">
      <svgicon
        :color="isBold ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
        icon="system/editor/bold"
        width="18"
        height="18"
        @click.native="onToggleProp('font-weight', 'bold', isBold)"/>
      <svgicon
        :color="isItalic ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
        icon="system/editor/italic"
        width="18"
        height="18"
        @click.native="onToggleProp('font-style', 'italic', isItalic)"/>
      <svgicon
        :color="isUnderlined ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
        icon="system/editor/underline"
        width="18"
        height="18"
        @click.native="onToggleProp('text-decoration', 'underline', isUnderlined)"/>
      <svgicon
        :color="isStriked ? 'rgba(0,0,0,.87)' : 'rgba(0,0,0,.38)'"
        icon="system/editor/strikethrough"
        width="18"
        height="18"
        @click.native="onToggleProp('text-decoration', 'line-through', isStriked)"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FontStyle',
  /* eslint-disable */
  props: ['fontWeight', 'fontStyle', 'textDecoration', 'label'],
  computed: {
    isBold() { return (this.fontWeight === 'bold') },
    isItalic() { return (this.fontStyle === 'italic') },
    isUnderlined() { return (this.textDecoration === 'underline') },
    isStriked() { return (this.textDecoration === 'line-through') }
  },
  methods: {
    onToggleProp(prop, val, isOn) {
      this.$emit('change', { prop, value: (isOn ? 'inherit' : val) })
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
