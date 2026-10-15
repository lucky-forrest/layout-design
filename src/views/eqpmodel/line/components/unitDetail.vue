<template>
  <div class="app-container">
    <el-form ref="dataDetail" :model="dataDetail.unitInfo" label-width="150px">
      <el-row :gutter="20">
        <el-col :sm="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="LineId" prop="lineId">
            <el-input v-model="dataDetail.unitInfo.lineId" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="ServerName" prop="serverName">
            <el-input v-model="dataDetail.unitInfo.serverName" :placeholder="t('tip.pleaseInput')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="EquipmentNo"
            prop="equipmentNo">
            <el-input v-model="dataDetail.unitInfo.equipmentNo" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12">
          <el-form-item label="EquipmentId" prop="equipmentId">
            <el-input v-model="dataDetail.unitInfo.equipmentId" :placeholder="t('tip.pleaseInput')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseUnitNo')}]" label="UnitNo" prop="unitNo" >
            <el-input-number v-model="dataDetail.unitInfo.unitNo" :precision="0" :min="0" :max="65535" :disabled="true" controls-position="right" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseUnitId')}]" label="UnitId" prop="unitId" >
            <el-input v-model="dataDetail.unitInfo.unitId" :placeholder="t('tip.pleaseUnitId')" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="Name" prop="name">
            <el-input v-model="dataDetail.unitInfo.name" :placeholder="t('tip.pleaseName')" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="UnitType" prop="unitType">
            <el-select v-model="dataDetail.unitInfo.unitType" :placeholder="t('tip.pleaseSelect')" clearable filterable class="filter-item">
              <el-option v-for="(item,index) in unitTypeList" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="Attribute" prop="attribute">
            <el-select v-model="dataDetail.unitInfo.attribute" :placeholder="t('tip.pleaseSelect')" clearable filterable class="filter-item">
              <el-option v-for="(attribute,index) in attributeList" :key="index" :label="attribute.dataName" :value="attribute.dataName"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="PostitionPlcTrxNo" prop="postitionPlcTrxNo" >
            <el-input-number v-model="dataDetail.unitInfo.postitionPlcTrxNo" :precision="0" controls-position="right" clearable/>
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
      cassetteTypeList: [],
      unitTypeList: ['Unit', 'Vcr', 'Tp']
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
            this.$emit('updateEvent', { eventType: 'unit', target: this.dataDetail.eqpInfo })
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
