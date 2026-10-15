<template>
  <el-tooltip :content="label" placement="top-start" effect="light" open-delay="500">
    <el-form-item :label="label" :prop="label" style="overflow: hidden;text-overflow: ellipsis;">
      <el-switch
        v-model="value"
        :active-value="'1'"
        :inactive-value="'0'"
        active-color="green"
        inactive-color="red"/>
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
        this.data.value = `${val}`
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
