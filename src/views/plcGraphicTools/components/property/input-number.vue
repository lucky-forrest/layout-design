<template>
  <el-tooltip :content="label" placement="top-start" effect="light" open-delay="500">
    <el-form-item :label="label" :prop="label" style="overflow: hidden;text-overflow: ellipsis;">
      <el-input-number v-model="value" :min="0" :max="65535" :precision="0" controls-position="right"/>
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
        return Number.parseInt(this.data.value, 10)
      },
      set(val) {
        this.data.value = val ? `${val}` : '0'
      }
    }
  }
}
</script>
