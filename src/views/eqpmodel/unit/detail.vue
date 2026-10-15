<template>
  <div v-loading="loading" class="app-container">
    <el-form ref="unitForm" :model="unitForm" label-width="150px">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="LineId" prop="lineId">
            <el-select v-model="unitForm.lineId" :placeholder="t('tip.pleaseSelectLineId')" :disabled="isEdit" clearable>
              <el-option v-for="(item,index) in lineList" :key="index" :value="item.lineId" :label="item.lineId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item
            label="ServerName"
            prop="serverName" >
            <el-input v-model="unitForm.serverName" :placeholder="t('tip.pleaseInput')" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="EquipmentNo" prop="equipmentNo">
            <el-select v-model="unitForm.equipmentNo" :placeholder="t('tip.pleaseSelect')" :disabled="isEdit" clearable>
              <el-option v-for="(item,index) in equipmentList" :key="index" :value="item.equipmentNo" :label="item.equipmentNo"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item
            label="EquipmentId"
            prop="equipmentId" >
            <el-input v-model="unitForm.equipmentId" :placeholder="t('tip.pleaseInput')" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseUnitId')}]" label="UnitId" prop="unitId" >
            <el-input v-model="unitForm.unitId" :placeholder="t('tip.pleaseUnitId')" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="Name" prop="name">
            <el-input v-model="unitForm.name" :placeholder="t('tip.pleaseName')" :disabled="true" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseUnitNo')}]" label="UnitNo" prop="unitNo" >
            <el-input-number v-model="unitForm.unitNo" :precision="0" controls-position="right" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="UnitType" prop="unitType">
            <el-select v-model="unitForm.unitType" :placeholder="t('tip.pleaseSelect')" clearable filterable class="filter-item">
              <el-option v-for="(item,index) in unitTypeList" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="PostitionPlcTrxNo" prop="postitionPlcTrxNo" >
            <el-input-number v-model="unitForm.postitionPlcTrxNo" :precision="0" controls-position="right" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="Attribute" prop="attribute">
            <el-select v-model="unitForm.attribute" :placeholder="t('tip.pleaseSelect')" clearable filterable class="filter-item">
              <el-option v-for="(attribute,index) in attributeList" :key="index" :label="attribute.dataName" :value="attribute.dataName"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler('unitForm')">
      <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}</el-button>
      <el-button :loading="loading" type="primary" @click="cancelHandler">
      <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.close') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import { getDropDownList } from '@/api/eqpmodel/dropDown'
import { getUnitList } from '@/api/eqpmodel/unit'
import { getLineList } from '@/api/eqpmodel/line'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'UnitDetail',
  props: {
    currUnit: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      attributeList: [],
      unitTypeList: ['Unit', 'VCR', 'TP'],
      equipmentList: [],
      lineList: [],
      unitForm: {
        lineId: '',
        equipmentNo: '',
        equipmentId: ''
      }
    }
  },
  watch: {
    'unitForm.lineId'(value) {
      if (!this.isEdit) {
        this.unitForm.equipmentNo = ''
        if (value) {
          this.unitForm.serverName = value
          getEquipmentList({ condition: { lineId: value }}).then(res => {
            this.equipmentList = new Set([])
            res.body.rows.forEach(ele => {
              this.equipmentList.add({ equipmentNo: ele.equipmentNo })
            })
            this.equipmentList = [...this.equipmentList]
            this.unitForm.name = value
          })
        } else {
          this.equipmentList = []
        }
      }
    },
    'unitForm.equipmentNo'(value) {
      if (value) {
        getEquipmentList({ condition: { lineId: this.unitForm.lineId, equipmentNo: value }}).then(res => {
          const temp = res.body.rows.find(ele => ele.lineId === this.unitForm.lineId && ele.equipmentNo === value)
          this.unitForm.equipmentId = temp.equipmentId
        })
      } else {
        this.unitForm.equipmentId = ''
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.unitForm = Object.assign({}, this.unitForm, this.currUnit)
      this.isEdit = !!this.unitForm.objectId
      getLineList({ condition: {}}).then(res => {
        this.lineList = res.body.rows
        getDropDownList({ condition: {}}).then(res => {
          this.attributeList = res.body.rows.filter(ele => ele.dataType.toUpperCase() === 'UNITATTRIBUTE')
        })
      })
    })
  },
  methods: {
    t,
    getEquipmentList(data) {
      return new Promise((resolve, reject) => {
        try {
          this.isloading = true
          return getEquipmentList(data).then(res => {
            this.isloading = false
            this.equipmentList = res.body.rows
            resolve()
          }).catch(err => {
            this.isloading = false
            reject(err)
          })
        } catch (error) {
          this.isloading = false
          reject(error)
        }
      })
    },
    saveHandler(unitForm) {
      this.$refs.unitForm.validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            getUnitList({ condition: { lineId: this.unitForm.lineId, equipmentNo: this.unitForm.equipmentNo }}).then(res => {
              const ele = res.body.rows.find(ele => Number(ele.unitNo) === this.unitForm.unitNo || ele.unitId === this.unitForm.unitId)
              if (ele) {
                notice.error(`unitNo:${this.unitForm.unitNo} or unitId:${this.unitForm.unitId} is exist in equipmentNo:${this.unitForm.equipmentNo}`)
                return
              }
              this.$emit('saveEvent', this.unitForm, this.isEdit)
            })
          } else {
            this.$emit('saveEvent', this.unitForm, this.isEdit)
          }
        }
      })
    },
    cancelHandler() {
      this.$emit('cancelEvent')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input,.el-select,.el-input-number{
    width:100%;
  }
.fieldset{
    margin-bottom:10px;
    border: 1px solid #dcdfe6;
    legend{
      font-weight: bold;
    }
  }
</style>

