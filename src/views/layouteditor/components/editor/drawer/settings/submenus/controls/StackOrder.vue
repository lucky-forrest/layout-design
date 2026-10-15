<template>
  <div class="wrapper">
    <span class="label">层级</span>
    <div class="icon-bar">
      <svgicon
        v-tooltip="'自动'"
        icon="system/editor/flip_auto"
        width="18"
        height="18"
        @click.native="$emit('change', 'auto')"/>
      <svgicon
        v-tooltip="'上移一层'"
        icon="system/editor/flip_front"
        width="18"
        height="18"
        @click.native="$emit('change', (zIndex !== 'auto') ? (zIndex + 1) : 1)"/>
      <svgicon
        v-tooltip="'下移一层'"
        icon="system/editor/flip_back"
        width="18"
        height="18"
        @click.native="$emit('change', (zIndex !== 'auto' && zIndex > 0) ? (zIndex - 1) : 0)"/>
    </div>
    <span class="value">{{ zIndex }}</span>
  </div>
</template>

<script>
export default {
  name: 'StackOrder',
  /* eslint-disable */
  props: ['zIndex']
}
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 14px;
}

.label {
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

.icon-bar {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.icon-bar svg {
  cursor: pointer;
  fill: rgba(0, 0, 0, 0.54);
}

.icon-bar svg:hover {
  fill: rgba(0, 0, 0, 0.87);
}

.value {
  flex: 0 0 auto;
  min-width: 30px;
  font-size: 12px;
  color: #909399;
  text-align: right;
}
</style>
