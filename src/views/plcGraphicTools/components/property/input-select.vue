<template>
  <el-tooltip :content="label" placement="top-start" effect="light" open-delay="500">
    <el-form-item :label="label" style="overflow: hidden;text-overflow: ellipsis;">
      <el-select v-model="data.value" filterable allow-create clearable>
        <el-option v-for="(item, index) in data.constantItems" :key="index" :value="item.key" :label="`${item.key} : ${item.value}`"/>
      </el-select>
    </el-form-item>
  </el-tooltip>
</template>
<script>
import common from './common'
export default {
  mixins: [common],
  computed: {
    value: {
      get() {
        return this.data.value
      },
      set(val) {
        this.data.value = val
      }
    }
  },
  watch: {
    value($event) {
      this.$emit('componentEvent', $event)
    }
  }
}
</script>
