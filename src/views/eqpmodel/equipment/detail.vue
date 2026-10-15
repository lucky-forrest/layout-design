<template>
  <div class="app-container">
    <el-form ref="equipmentForm" :model="equipmentForm" label-width="150px">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="LineId" prop="lineId">
            <el-input v-model="equipmentForm.lineId" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="ServerName" prop="serverName">
            <el-input v-model="equipmentForm.serverName" :placeholder="t('tip.pleaseInput')" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="EquipmentNo"
            prop="equipmentNo">
            <el-input v-model="equipmentForm.equipmentNo" :placeholder="t('tip.pleaseInput')" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="Attribute" prop="attribute">
            <el-select v-model="equipmentForm.attribute" :placeholder="t('tip.pleaseSelect')" clearable>
              <el-option
                v-for="(item,index) in attributeList"
                :key="index"
                :label="item.dataName"
                :value="item.dataName" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="EquipmentId" prop="equipmentId">
            <el-input v-model="equipmentForm.equipmentId" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="Name" prop="name">
            <el-input v-model="equipmentForm.name" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="RecipeIndex" prop="recipeIndex">
            <el-input-number
              v-model="equipmentForm.recipeIndex"
              :placeholder="t('tip.pleaseInput')"
              :min="0"
              :max="20"
              :precision="0"
              clearable
              controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="RecipeLength"
            prop="recipeLength">
            <el-input-number
              v-model="equipmentForm.recipeLength"
              :placeholder="t('tip.pleaseInput')"
              :precision="0"
              clearable
              controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="RecipeSeq"
            prop="recipeSequence">
            <el-input-number
              v-model="equipmentForm.recipeSequence"
              :min="0"
              :max="65535"
              :precision="0"
              controls-position="right"
              clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="ReportMode" prop="reportMode">
            <el-select v-model="equipmentForm.reportMode" :placeholder="t('tip.pleaseSelect')" clearable>
              <el-option
                v-for="(item,index) in modelingFields.reportMode"
                :key="index"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="VcrType" prop="vcrType">
            <el-select v-model="equipmentForm.vcrType" :placeholder="t('tip.pleaseSelect')" clearable>
              <el-option
                v-for="(item,index) in modelingFields.vcrType"
                :key="index"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item
            label="ProcessdateSource"
            prop="processdateSource">
            <el-select v-model="equipmentForm.processdateSource" :placeholder="t('tip.pleaseSelect')" clearable>
              <el-option
                v-for="(item,index) in modelingFields.dataSources"
                :key="index"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="TouchPanel" prop="touchPanel">
            <el-input v-model="equipmentForm.touchPanel" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler('equipmentForm')">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="closeHandler">
        <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { getDropDownList } from '@/api/eqpmodel/dropDown'
import { modelingFields } from '@/config/table'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'EquipmentDetail',
  props: {
    currEquipment: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      attributeList: [],
      modelingFields: modelingFields,
      equipmentForm: { }
    }
  },
  watch: {
    'equipmentForm.lineId'(value) {
      if (!this.isEdit) {
        this.equipmentForm.serverName = value
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.equipmentForm = Object.assign({}, this.equipmentForm, this.currEquipment)
      this.isEdit = !!this.equipmentForm.objectId
      getDropDownList({ condition: {}}).then(res => {
        this.attributeList = res.body.rows.filter(ele => ele.dataType === 'EquipmentAttribute')
      })
    })
  },
  methods: {
    t,
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.$emit('successEvent', this.equipmentForm, this.isEdit)
          })
        }
      })
    },
    closeHandler() {
      this.$emit('cancelEvent', 'lineDetail')
    }
  }
}

</script>
<style lang="scss" scoped>
  .el-input,
  .el-input-number,
  .el-select {
    width: 100%
  }

</style>
