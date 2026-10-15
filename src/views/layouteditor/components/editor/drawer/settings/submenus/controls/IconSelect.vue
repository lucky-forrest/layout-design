<template>
  <div class="icon-select__wrapper">
    <span v-if="label" class="icon-select__label">{{ label }}</span>
    <el-select
      v-model="currentValue"
      :popper-append-to-body="true"
      class="icon-select__control">
      <slot/>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'IconSelect',
  /* eslint-disable */
  props: ['value', 'label', 'icon'],
  computed: {
    currentValue: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('change', val)
      }
    }
  }
}
</script>

<style scoped>
.icon-select__wrapper {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 14px;
}

.icon-select__label {
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

.icon-select__control {
  flex: 1;
  min-width: 0;
  width: 100%;
}
</style>
