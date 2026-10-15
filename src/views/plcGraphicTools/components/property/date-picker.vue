<template>
  <el-form-item :label="label" :prop="label">
    <el-date-picker
      v-model="value"
      format="yyyy-MM-dd HH:mm"
      value-format="yyMMddHHmmss"
      type="datetime"
      placeholder="选择日期时间"/>
  </el-form-item>
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
  }
}
</script>
