<template>
  <div class="app-container">
    <el-form ref="dataDetail" :model="dataDetail.eqpInfo" label-width="150px">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="LineId" prop="lineId">
            <el-input v-model="dataDetail.eqpInfo.lineId" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="ServerName" prop="serverName">
            <el-input v-model="dataDetail.eqpInfo.serverName" :placeholder="t('tip.pleaseInput')" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="EquipmentNo" prop="equipmentNo">
            <el-input v-model="dataDetail.eqpInfo.equipmentNo" :placeholder="t('tip.pleaseInput')" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="Attribute" prop="attribute">
            <el-select v-model="dataDetail.eqpInfo.attribute" :placeholder="t('tip.pleaseSelect')" clearable>
              <el-option v-for="(item,index) in attributeList" :key="index" :label="item.dataName" :value="item.dataName" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="EquipmentId" prop="equipmentId">
            <el-input v-model="dataDetail.eqpInfo.equipmentId" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="Name" prop="name">
            <el-input v-model="dataDetail.eqpInfo.name" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="RecipeIndex" prop="recipeIndex">
            <el-input-number v-model="dataDetail.eqpInfo.recipeIndex" :placeholder="t('tip.pleaseInput')" :min="0" :max="20" :precision="0" clearable controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="RecipeLength" prop="recipeLength">
            <el-input-number v-model="dataDetail.eqpInfo.recipeLength" :placeholder="t('tip.pleaseInput')" :precision="0" clearable controls-position="right" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="RecipeSeq" prop="recipeSequence">
            <el-input-number v-model="dataDetail.eqpInfo.recipeSequence" :min="0" :max="65535" :precision="0" controls-position="right" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="ReportMode" prop="reportMode">
            <el-select v-model="dataDetail.eqpInfo.reportMode" :placeholder="t('tip.pleaseSelect')" clearable>
              <el-option v-for="(item,index) in modelingFields.reportMode" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="VcrType" prop="vcrType">
            <el-select v-model="dataDetail.eqpInfo.vcrType" :placeholder="t('tip.pleaseSelect')" clearable>
              <el-option v-for="(item,index) in modelingFields.vcrType" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="ProcessdateSource" prop="processdateSource">
            <el-select v-model="dataDetail.eqpInfo.processdateSource" :placeholder="t('tip.pleaseSelect')" clearable>
              <el-option v-for="(item,index) in modelingFields.dataSources" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="TouchPanel" prop="touchPanel">
            <el-input v-model="dataDetail.eqpInfo.touchPanel" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-bottom:10px;text-align:right;">
      <el-button type="primary" @click="saveHandler('dataDetail')">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
    </div>
    <el-tabs v-model="dataDetail.activeTab" type="border-card">
      <el-tab-pane label="PortList" name="portList">
        <el-table key="port" ref="portList" :data="dataDetail.portList" :default-sort="{prop:'portNo',order:'ascending'}" border>
          <el-table-column label="PortNo" min-width="120" prop="portNo" align="center" fixed />
          <el-table-column label="PortId" min-width="120" prop="portId" align="center" />
          <el-table-column label="MaxCount" min-width="120" prop="maxCount" align="center" />
          <el-table-column label="Attribute" min-width="120" prop="attribute" align="center" />
          <el-table-column label="ProcessStartType" min-width="150" prop="processStartType" align="center" />
          <el-table-column label="MappingEnable" min-width="150" align="center">
            <template slot-scope="curr">
              <span v-if="curr.row.mappingEnabled" style="font-size:20px;color:green;">
                <svg-icon :icon-class="'ok'" />
              </span>
              <span v-else style="font-size:20px;color:red;">
                <svg-icon :icon-class="'disable'" />
              </span>
            </template>
          </el-table-column>
          <el-table-column label="CassetteType" min-width="120" prop="cassetteType" align="center" />
          <el-table-column :label="t('column.operate')" width="150" align="center" fixed="right">
            <template slot-scope="curr">
              <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" @click="editHandler(curr.row,'portInfo')" />
              <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="removeHandler(curr.row,'port')" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="UnitList" name="unitList">
        <el-table key="unitShowList" :data="dataDetail.unitList" :default-sort="{prop:'unitNo',order:'ascending'}" stripe border>
          <el-table-column label="UnitNo" min-width="100" prop="unitNo" fixed />
          <el-table-column label="UnitId" min-width="100" prop="unitId" />
          <el-table-column label="UnitType" min-width="100" prop="unitType" />
          <el-table-column label="Attribute" min-width="100" prop="attribute" />
          <el-table-column label="Name" min-width="100" prop="name" />
          <el-table-column label="PositionPlcTrxNo" min-width="150" prop="postitionPlcTrxNo" />
          <el-table-column label="Operate" width="150" align="center" fixed="right">
            <template slot-scope="curr">
              <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" @click="editHandler(curr.row,'unitInfo')" />
              <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="removeHandler(curr.row,'unit')" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getDropDownList } from '@/api/eqpmodel/dropDown'
import { modelingFields } from '@/config/table'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  props: {
    dataDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    dataList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      modelingFields: modelingFields,
      attributeList: []
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      return getDropDownList({ condition: {}}).then(res => {
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
            this.$emit('updateEvent', { eventType: 'line', target: this.dataDetail.eqpInfo })
          })
        }
      })
    },
    editHandler(row, type) {
      this.$emit('editEvent', { eventType: type, target: row })
    },
    removeHandler(row, type) {
      this.$emit('removeEvent', { eventType: type, target: row })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-select,
  .el-input,
  .el-input-number {
    width: 100%;
  }

</style>
