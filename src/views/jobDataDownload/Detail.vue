<template>
  <div v-loading="loading" class="jobData-form">
    <el-form :model="formData" label-width="120px" label-position="top">
      <el-row :gutter="10">
        <el-col :lg="6" :md="8" :sm="12" >
          <el-form-item label="SlotStart" prop="slotStart">
            <el-input-number v-model="formData.slotStart" :min="1" :percision="0"/>
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12" >
          <el-form-item label="SlotEnd" prop="slotEnd">
            <el-input-number v-model="formData.slotEnd" :min="1" :percision="0"/>
          </el-form-item>
        </el-col>
        <el-col v-for="(item,index) in data" :lg="6" :md="8" :sm="12" :key="index">
          <el-form-item :label="item.name" :prop="item.name">
            <custom-field :field="item" :job-data="formData"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler">
      <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}</el-button>
      <el-button type="primary" @click="cancelHandler">
      <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}</el-button>
    </div>
  </div>
</template>
<script>
import CustomField from '@/views/jobDataDownload/components/CustomField'
import { t } from '@/utils'
export default {
  name: 'CommonSetting',
  components: {
    CustomField
  },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        slotStart: 1,
        slotEnd: 100
      }
    }
  },
  created() {
    this.formData = this.data.reduce((formData, item) => {
      this.$set(formData, item.name, item.defaultValue)
      return formData
    }, this.formData)
  },
  methods: {
    t,
    saveHandler(formName) {
      this.$emit('successEvent', this.formData)
    },
    cancelHandler() {
      this.$emit('cancelEvent')
    }
  }
}
</script>
<style lang="scss">
  .jobData-form{
    .el-input,
    .el-input-number,
    .el-select,
    .el-input-number--mini {
      width:100%;
    }
  }
</style>
