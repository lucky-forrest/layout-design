<template>
  <div class="app-container">
    <el-form label-width="100px">
      <el-form-item label="FileName" prop="fileName">
        <el-input v-model="fileName" :placeholder="t('tip.pleaseInputFileName')" class="el-input" clearable />
      </el-form-item>
    </el-form>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler()">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="closeHandler">
        <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'FileDetail',
  data() {
    return {
      fileName: '',
      loading: false
    }
  },
  methods: {
    t,
    saveHandler() {
      if (this.fileName) {
        this.$emit('successEvent', this.fileName, 'newMessageFile')
      } else {
        notice.error(this.t('tip.pleaseInputFileName'))
      }
    },
    closeHandler() {
      this.$emit('cancelEvent', 'showFileDetail')
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input,.el-input-number{
    width:100%;
    margin: 0 10px;
  }
</style>
