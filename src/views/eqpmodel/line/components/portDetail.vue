<template>
  <div class="app-container">
    <el-form ref="dataDetail" :model="dataDetail.portInfo" label-width="150px">
      <el-row :gutter="20">
        <el-col :sm="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="LineId" prop="lineId">
            <el-input v-model="dataDetail.portInfo.lineId" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="ServerName" prop="serverName">
            <el-input v-model="dataDetail.portInfo.serverName" :placeholder="t('tip.pleaseInput')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="EquipmentNo"
            prop="equipmentNo">
            <el-input v-model="dataDetail.portInfo.equipmentNo" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="EquipmentId" prop="equipmentId">
            <el-input v-model="dataDetail.portInfo.equipmentId" :placeholder="t('tip.pleaseInput')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="PortNo" prop="portNo">
            <el-input-number
              v-model="dataDetail.portInfo.portNo"
              :placeholder="t('tip.pleaseInput')"
              :precision="0"
              :min="0"
              :max="65535"
              :disabled="true"
              controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="PortId" prop="portId">
            <el-input v-model="dataDetail.portInfo.portId" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="MaxCount" prop="maxCount">
            <el-input-number
              v-model="dataDetail.portInfo.maxCount"
              :placeholder="t('tip.pleaseInput')"
              :precision="0"
              :min="0"
              :max="65535"
              controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="Attribute" prop="attribute">
            <el-select v-model="dataDetail.portInfo.attribute" :placeholder="t('tip.pleaseSelect')">
              <el-option
                v-for="(item,index) in attributeList"
                :key="index"
                :label="item.dataName"
                :value="item.dataName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="CassetteType"
            prop="cassetteType">
            <el-select v-model="dataDetail.portInfo.cassetteType" :placeholder="t('tip.pleaseSelect')">
              <el-option
                v-for="(item,index) in cassetteTypeList"
                :key="index"
                :label="item.dataName"
                :value="item.dataName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="ProcessStartType"
            prop="processStartType">
            <el-input v-model="dataDetail.portInfo.processStartType" :placeholder="t('tip.pleaseInput')" autofocus clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="MappingEnabled" prop="mappingEnabled">
            <el-switch v-model="dataDetail.portInfo.mappingEnabled" active-color="#13ce66" inactive-color="#ff4949" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-bottom:10px;text-align:right;">
      <el-button type="primary" @click="saveHandler('dataDetail')">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { t } from '@/utils'
import notice from '@/utils/notice'
import { getDropDownList } from '@/api/eqpmodel/dropDown'
export default {
  name: 'PortDetail',
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
      loading: false,
      isEdit: false,
      attributeList: [],
      cassetteTypeList: []
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      return getDropDownList({ condition: {}, pageNo: 1, pageSize: Number.MAX_VALUE }).then(res => {
        this.attributeList = res.body.rows.filter(ele => ele.dataType.toUpperCase() === 'PORTATTRIBUTE')
        this.cassetteTypeList = res.body.rows.filter(ele => ele.dataType.toUpperCase() === 'CASSETTETYPE')
      })
    })
  },
  methods: {
    t,
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.$emit('updateEvent', { eventType: 'port', target: this.dataDetail.eqpInfo })
          })
        }
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .el-input,
  .el-select,
  .el-input-number {
    width: 100%;
  }

</style>
