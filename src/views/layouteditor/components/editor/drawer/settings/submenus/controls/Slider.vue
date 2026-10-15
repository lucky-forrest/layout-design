<template>
  <div class="slider__wrapper">
    <span v-if="label" class="slider__label">{{ label }}</span>
    <el-slider
      :min="Number(min)"
      :max="Number(max)"
      :step="step ? Number(step) : 1"
      v-model="currentValue"
      class="slider__control"
    />
    <span class="slider__value">{{ currentValue }}</span>
  </div>
</template>

<script>
export default {
  name: 'Slider',
  props: {
    value: { type: Number, default: 1 },
    min: { type: String, default: '0' },
    max: { type: String, default: '1' },
    step: { type: String, default: null },
    label: { type: String, default: '' },
    icon: { type: String, default: '' }
  },
  computed: {
    currentValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', Math.round(val * 100) / 100)
      }
    }
  }
}
</script>

<style scoped>
.slider__wrapper {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 14px;
}

.slider__label {
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

.slider__control {
  flex: 1;
  min-width: 0;
  margin: 0 10px;
}

.slider__value {
  flex: 0 0 auto;
  min-width: 30px;
  font-size: 12px;
  color: #909399;
  text-align: right;
}
</style>
