<template>
  <el-tooltip :content="label" placement="top-start" effect="light" open-delay="500">
    <el-form-item :label="label" :prop="label" style="overflow: hidden;text-overflow: ellipsis;">
      <el-input v-model="value" :maxlength="(points === 0) ? 1 : points * 16" clearable/>
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
        return this.getTargetValue(this.data.value, this.points)
      },
      set(val) {
        this.data.value = `${val}`
      }
    }
  },
  methods: {
    getTargetValue(num, points) {
      return this.type === 'B' ? this.$lodash.padEnd(num || 0, (points * 16 - `${num || 0}`.length), 0) : num
    }
  }
}
</script>
