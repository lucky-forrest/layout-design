<template>
  <div class="app-container">
    <el-form ref="alarmForm" :model="alarmForm" label-width="150px">
      <el-row :gutter="20">
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="LineId"
            prop="lineId" >
            <el-select v-model="alarmForm.lineId" :placeholder="t('tip.pleaseSelectLineId')" :disabled="isEdit" clearable>
              <el-option v-for="(item,index) in lineList" :key="index" :value="item.lineId" :label="item.lineId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="ServerName"
            prop="serverName" >
            <el-input v-model="alarmForm.serverName" :placeholder="t('tip.pleaseInput')" :disabled="true" clearable/>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="EquipmentNo"
            prop="equipmentNo">
            <el-select v-model="alarmForm.equipmentNo" :placeholder="t('tip.pleaseSelectEquipmentNo')" :disabled="isEdit" clearable>
              <el-option v-for="(item,index) in equipmentList" :key="index" :value="item" :label="item"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="UnitNo"
            prop="unitNo" >
            <el-select v-model="alarmForm.unitNo" :placeholder="t('tip.pleaseSelect')" clearable>
              <el-option v-for="(item,index) in unitNoList" :key="index" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="AlarmId"
            prop="alarmId" >
            <el-input v-model="alarmForm.alarmId" :placeholder="t('tip.pleaseInput')" clearable/>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="AlarmLevel"
            prop="alarmLevel" >
            <el-select :placeholder="t('tip.pleaseSelectAlarmLevel')" v-model="alarmForm.alarmLevel" clearable filterable class="filter-item">
              <el-option v-for="(alarmLevel,index) in alarmLevels" :key="index" :label="alarmLevel.label" :value="alarmLevel.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="AlarmCode"
            prop="alarmCode" >
            <el-input v-model="alarmForm.alarmCode" :placeholder="t('tip.pleaseInput')" clearable/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" >
          <el-form-item
            label="AlarmText"
            prop="alarmText" >
            <el-input v-model="alarmForm.alarmText" :placeholder="t('tip.pleaseInput')" type="textarea" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top:10px;text-align:center;">
      <el-button :loading="loading" type="primary" @click="saveHandler('alarmForm')">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="cancelHandler">
        <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.cancel') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { t } from '@/utils'
import { getAlarmList } from '@/api/eqpmodel/alarm'
import { getUnitList } from '@/api/eqpmodel/unit'
import { getLineList } from '@/api/eqpmodel/line'
import { alarmLevelList } from '@/config/dropdown'
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import notice from '@/utils/notice'
export default {
  name: 'AlarmDetail',
  props: {
    currAlarm: {
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
      alarmLevels: alarmLevelList,
      lineList: [],
      equipmentList: [],
      unitNoList: [],
      alarmForm: {
        lineId: '',
        equipmentNo: ''
      }
    }
  },
  watch: {
    'alarmForm.lineId'(value) {
      if (!this.isEdit) {
        this.alarmForm.equipmentNo = ''
        if (value) {
          this.alarmForm.serverName = value
          getEquipmentList({ condition: { lineId: value }}).then(res => {
            this.equipmentList = new Set([])
            res.body.rows.forEach(ele => {
              this.equipmentList.add(ele.equipmentNo)
            })
            this.equipmentList = [...this.equipmentList]
          })
        } else {
          this.equipmentList = []
        }
      }
    },
    'alarmForm.equipmentNo'(value) {
      if (value) {
        getUnitList({ condition: { lineId: this.alarmForm.lineId, equipmentNo: value }}).then(res => {
          this.unitNoList = new Set([])
          res.body.rows.forEach(ele => {
            this.unitNoList.add(ele.unitNo)
          })
          this.unitNoList = [...this.unitNoList]
        })
      } else {
        this.unitNoList = []
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.alarmForm = Object.assign({}, this.alarmForm, this.currAlarm)
      this.isEdit = !!this.alarmForm.objectId
      getLineList({ condition: {}}).then(res => {
        this.lineList = res.body.rows
      })
    })
  },
  methods: {
    t,
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            getAlarmList({ condition: { lineId: this.alarmForm.lineId, equipmentNo: this.alarmForm.equipmentNo }}).then(res => {
              const temp = res.body.rows.find(ele => ele.alarmId === this.alarmForm.alarmId)
              if (temp) {
                notice.error(`alarmId:${this.alarmForm.alarmId} is exist in equipmentNo:${this.alarmForm.equipmentNo}`)
              } else {
                this.$emit('saveEvent', this.alarmForm, this.isEdit)
              }
            })
          } else {
            this.$emit('saveEvent', this.alarmForm, this.isEdit)
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
