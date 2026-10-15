<template>
  <div class="app-container">
    <el-form ref="portForm" :model="portForm" :rules="rules" label-width="150px">
      <el-row :gutter="20">
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="LineId"
            prop="lineId" >
            <el-select v-model="portForm.lineId" :placeholder="t('tip.pleaseSelectLineId')" :disabled="isEdit" clearable>
              <el-option v-for="(item,index) in lineList" :key="index" :value="item.lineId" :label="item.lineId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="EquipmentNo"
            prop="equipmentNo">
            <el-select v-model="portForm.equipmentNo" :placeholder="t('tip.pleaseSelectEquipmentNo')" :disabled="isEdit" clearable>
              <el-option v-for="(item,index) in equipmentList" :key="index" :value="item.equipmentNo" :label="item.equipmentNo"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="ServerName"
            prop="serverName" >
            <el-input v-model="portForm.serverName" :placeholder="t('tip.pleaseInput')" :disabled="true" clearable/>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="EquipmentId"
            prop="equipmentId" >
            <el-input v-model="portForm.equipmentId" :placeholder="t('tip.pleaseInput')" :disabled="true" clearable/>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            label="PortNo"
            prop="portNo" >
            <el-input-number v-model="portForm.portNo" :placeholder="t('tip.pleaseInput')" :min="0" :max="Number.MaxValue" controls-position="right"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="PortId"
            prop="portId" >
            <el-input v-model="portForm.portId" :placeholder="t('tip.pleaseInput')" clearable/>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            label="MaxCount"
            prop="maxCount" >
            <el-input-number v-model="portForm.maxCount" :placeholder="t('tip.pleaseInput')" :min="0" :max="Number.MaxValue" controls-position="right"/>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="Attribute"
            prop="attribute" >
            <el-select v-model="portForm.attribute" :placeholder="t('tip.pleaseSelect')">
              <el-option v-for="(item,index) in attributeList" :key="index" :label="item.dataName" :value="item.dataName"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="CassetteType"
            prop="cassetteType" >
            <el-select v-model="portForm.cassetteType" :placeholder="t('tip.pleaseSelect')">
              <el-option v-for="(item,index) in cassetteTypeList" :key="index" :label="item.dataName" :value="item.dataName"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="ProcessStartType"
            prop="processStartType" >
            <el-input v-model="portForm.processStartType" :placeholder="t('tip.pleaseInput')" autofocus clearable/>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item label="MappingEnabled" prop="mappingEnabled" >
            <el-switch v-model="portForm.mappingEnabled" active-color="#13ce66" inactive-color="#ff4949"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler('portForm')">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="cancelHandler">
        <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { t } from '@/utils'
import { getLineList } from '@/api/eqpmodel/line'
import { getPortList } from '@/api/eqpmodel/port'
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import { getDropDownList } from '@/api/eqpmodel/dropDown'
import notice from '@/utils/notice'
export default {
  name: 'PortDetail',
  props: {
    currPort: {
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
      cassetteTypeList: [],
      portForm: {
        lineId: '',
        equipmentNo: '',
        equipmentId: ''
      },
      equipmentList: [],
      lineList: [],
      rules: {
        portNo: [
          { required: true, message: this.t('tip.pleaseInput'), trigger: 'blur' }
        ],
        maxCount: [
          { required: true, message: this.t('tip.pleaseInput'), trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'portForm.lineId'(value) {
      if (!this.isEdit) {
        this.portForm.equipmentNo = ''
        if (value) {
          this.portForm.serverName = value
          getEquipmentList({ condition: { lineId: value }}).then(res => {
            this.equipmentList = new Set([])
            res.body.rows.forEach(ele => {
              this.equipmentList.add({ equipmentNo: ele.equipmentNo })
            })
            this.equipmentList = [...this.equipmentList]
          })
        } else {
          this.equipmentList = []
        }
      }
    },
    'portForm.equipmentNo'(value) {
      if (value) {
        getEquipmentList({ condition: { lineId: this.portForm.lineId, equipmentNo: value }}).then(res => {
          const temp = res.body.rows[0]
          this.portForm.equipmentId = temp.equipmentId
        })
      } else {
        this.portForm.equipmentId = ''
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.portForm = Object.assign({}, this.portForm, this.currPort)
      this.isEdit = !!this.portForm.objectId
      getLineList({ condition: {}}).then(res => {
        this.lineList = res.body.rows
        getDropDownList({ condition: {}}).then(res => {
          this.attributeList = res.body.rows.filter(ele => ele.dataType.toUpperCase() === 'PORTATTRIBUTE')
          this.cassetteTypeList = res.body.rows.filter(ele => ele.dataType.toUpperCase() === 'CASSETTETYPE')
        })
      })
    })
  },
  methods: {
    t,
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            getPortList({ condition: { lineId: this.portForm.lineId, equipmentNo: this.portForm.equipmentNo }}).then(res => {
              const ele = res.body.rows.find(ele => Number(ele.portNo) === this.portForm.portNo || ele.portId === this.portForm.portId)
              if (ele) {
                notice.error(`portNo:${this.portForm.portNo} or portId:${this.portForm.portId} is exist in equipmentNo:${this.portForm.equipmentNo}`)
                return
              }
              this.$emit('saveEvent', this.portForm, this.isEdit)
            })
          } else {
            this.$emit('saveEvent', this.portForm, this.isEdit)
          }
        }
      })
    },
    cancelHandler() {
      this.$emit('cancelEvent', 'statusDetail')
    },
    getEquipmentList(data) {
      return new Promise((resolve, reject) => {
        try {
          return getEquipmentList(data).then(res => {
            this.equipmentList = res.body.rows
            resolve()
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input,.el-select,.el-input-number{
    width:100%;
  }
</style>
