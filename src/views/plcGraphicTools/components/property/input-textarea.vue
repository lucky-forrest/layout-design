<template>
  <el-form-item :label="label" :prop="prop">
    <el-input v-model="data.value" type="textarea"/>
  </el-form-item>
</template>
<script>
import common from './common'
export default {
  mixins: [common]
}
</script>
