<template>
  <div class="app-container">
    <el-form ref="dataDetail" :model="dataDetail.lineInfo" label-width="120px">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="ShopType" prop="shopName">
            <el-select v-model="dataDetail.lineInfo.shopName" :placeholder="t('tip.pleaseSelectShopType')" :disabled="true" filterable>
              <el-option v-for="(item,index) in shopTypeList" :key="index" :label="item.dataName" :value="item.dataName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="ServerName" prop="serverName">
            <el-input v-model="dataDetail.lineInfo.serverName" :placeholder="t('tip.pleaseInput')" :disabled="true" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="LineId" prop="lineId">
            <el-input v-model="dataDetail.lineInfo.lineId" :placeholder="t('tip.pleaseInput')" :disabled="true" autofocus clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="LineType" prop="lineType">
            <el-input v-model="dataDetail.lineInfo.lineType" :disabled="true" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="LineName" prop="lineName">
            <el-input v-model="dataDetail.lineInfo.lineName" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="ServerIp" prop="ip">
            <el-input v-model="dataDetail.lineInfo.ip" :placeholder="t('tip.pleaseInput')" clearable>
              <template slot="append">0.0.0.0</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="Port1" prop="port">
            <el-input-number v-model="dataDetail.lineInfo.port" :precision="0" :controls-position="'right'" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="Port2" prop="port2">
            <el-input-number v-model="dataDetail.lineInfo.port2" :precision="0" :controls-position="'right'" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Descript" prop="info">
            <el-input v-model="dataDetail.lineInfo.info" :placeholder="t('tip.pleaseInput')" :row="3" type="textarea" clearable />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-bottom:10px;text-align:right;">
      <el-button type="primary" @click="saveHandler('dataDetail')">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
    </div>
    <el-table :data="dataList" stripe border>
      <!-- <el-table-column min-width="120px" label="LineId" prop="lineId" fixed /> -->
      <el-table-column min-width="120px" label="EquipmentNo" prop="equipmentNo" fixed />
      <el-table-column min-width="120px" label="EquipmentId" prop="equipmentId" />
      <el-table-column min-width="120px" label="ServerName" prop="serverName" />
      <el-table-column min-width="120px" label="Name" prop="name" />
      <el-table-column min-width="120px" label="Attribute" prop="attribute" />
      <el-table-column min-width="120px" label="RecipeIndex" prop="recipeIndex" />
      <el-table-column min-width="120px" label="RecipeLength" prop="recipeLength" />
      <el-table-column min-width="150px" label="RecipeSequence" prop="recipeSequence" />
      <el-table-column min-width="120px" label="UnitCount" prop="unitCount" />
      <el-table-column min-width="120px" label="VcrType" prop="vcrType" />
      <el-table-column min-width="120px" label="TouchPanel" prop="touchPanel" />
      <el-table-column min-width="160px" label="ProcessdateSource" prop="processdateSource" />
      <el-table-column min-width="120px" label="ReportMode" prop="reportMode" />
      <el-table-column :label="t('column.operate')" width="150" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" @click="editHandler(curr.row)" />
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="removeHandler(curr.row)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getDropDownList } from '@/api/eqpmodel/dropDown'
import notice from '@/utils/notice'
import { shopList } from '@/config'
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
      shopList: shopList,
      lineTypeList: [],
      shopTypeList: []
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      getDropDownList({ condition: {}}).then(res => {
        this.shopTypeList = res.body.rows.filter(ele => ele.dataType.toUpperCase() === 'SHOP')
        this.lineTypeList = res.body.rows.filter(ele => ele.dataType.toUpperCase() === 'LINETYPE')
      })
    })
  },
  methods: {
    t,
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.$emit('updateEvent', { eventType: 'lineType', target: this.dataDetail.lineInfo })
          })
        }
      })
    },
    editHandler(row) {
      this.$emit('editEvent', { eventType: 'equipment', target: row })
    },
    removeHandler(row) {
      this.$emit('removeEvent', { eventType: 'equipment', target: row })
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
