<template>
  <el-form ref="dataDetail" :model="dataDetail" :rules="rules" label-width="120px">
    <el-row :gutter="10" style="padding:10px 10px;">
      <el-col :span="24" >
        <el-form-item label="ItemName" prop="itemName">
          <el-input v-model="dataDetail.itemName" :placeholder="t('tip.pleaseInput')" clearable />
        </el-form-item>
      </el-col>
      <el-col :span="24" >
        <el-form-item label="ItemCount" prop="count">
          <el-input-number
            v-model="dataDetail.count"
            :precision="0"
            :disabled="dataDetail.type==='LIST'"
            controls-position="right"
            clearable
            style="width:calc(100% - 80px);" />
          <el-checkbox v-model="dataDetail.fixed">Fixed</el-checkbox>
        </el-form-item>
      </el-col>
      <el-col :span="24" >
        <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="ItemType" prop="type">
          <el-radio-group v-model="dataDetail.type" :disabled="dataDetail.type==='LIST'&&dataDetail.children.length>0">
            <el-radio v-for="(item,index) in nodeTypeList" :key="index" :label="item.label">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="24" >
        <el-form-item label="ItemValue" prop="value">
          <el-input
            v-model="dataDetail.value"
            :maxlength="dataDetail.count"
            :placeholder="t('tip.pleaseInput')"
            :disabled="dataDetail.type==='LIST'"
            clearable/>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { nodeTypeList } from '@/config'
import { t } from '@/utils'
export default {
  name: 'NodeForm',
  props: {
    dataDetail: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      nodeTypeList: nodeTypeList,
      rules: {
        value: [{ max: this.dataDetail.count }]
      }
    }
  },
  watch: {
    dataDetail: {
      deep: true,
      handler: function(currVal) {
        if (this.dataDetail.type === 'LIST') {
          Object.assign(currVal, { value: '', count: this.dataDetail.children.length })
        }
        this.rules = Object.assign({}, this.rules, { value: [{ max: currVal.count }] })
        this.$refs['dataDetail'].validate(valid => {
          if (valid) {
            this.$emit('updateNodeEvent', currVal, 'data')
          }
        })
      }
    }
  },
  methods: {
    t
  }
}
</script>
<style lang="scss" scoped>
  .el-input {
    width:100%;
  }
  .el-radio-group{
    .el-radio{
      width:80px;
      height:25px;
    }
  }
</style>
