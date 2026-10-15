<template>
  <div >
    <el-form
      ref="linkSignalForm"
      :model="linkSignalForm"
      label-width="110px">
      <el-row :gutter="20">
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="Shop"
            prop="shopName">
            <el-select v-model="linkSignalForm.shopName" :disabled="update" placeholder="SHOP" clearable filterable class="filter-item" style="width:100%;" @change="getLineListHandler">
              <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="LineId"
            prop="lineId">
            <el-select v-model="linkSignalForm.lineId" :disabled="update" placeholder="LINE" clearable filterable class="filter-item" style="width:100%;" @change="getEqpListHandler">
              <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineId" :value="item.lineId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="EQP NO"
            prop="equipmentNo">
            <el-select v-model="linkSignalForm.equipmentNo" placeholder="EQP NO" clearable filterable style="width:100%;">
              <el-option v-for="(item,index) in eqpList" :key="index" :label="item.equipmentNo" :value="item.equipmentNo"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="SignalTemp"
            prop="templateName">
            <el-select v-model="linkSignalForm.templateName" placeholder="SignalTemplate" clearable filterable style="width:100%;">
              <el-option v-for="(item,index) in templateNameList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="Block"
            prop="block">
            <el-input v-model="linkSignalForm.block" placeholder="Block" clearable style="width:100%;"/>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="StartAddress"
            prop="startAddress">
            <el-input v-model="linkSignalForm.startAddress" placeholder="StartAddress" clearable style="width:100%;"/>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="Type"
            prop="type">
            <el-input v-model="linkSignalForm.type" placeholder="Type" clearable style="width:100%;"/>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="COUNT"
            prop="count">
            <el-input-number v-model="linkSignalForm.count" :min="1" placeholder="COUNT" clearable style="width:100%;" controls-position="right"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <fieldset class="fieldset">
      <div class="card-footer">
        <el-button :disabled="buttonFlag" type="primary" icon="el-icon-plus" @click="createDataHandler">{{ t('btn.createData') }}</el-button>
        <el-button :disabled="!buttonFlag" type="primary" @click="saveHandler">
          <svg-icon :icon-class="'save'" />
          {{ t('btn.save') }}</el-button>
      </div>
      <el-table
        v-loading="loading"
        :data="pageInfo.dataList"
        highlight-current-row
        stripe
        border>
        <el-table-column label="Type" min-width="100" align="center" prop="type"/>
        <el-table-column label="Block" min-width="100" align="center" prop="blockName"/>
        <el-table-column label="Item" min-width="100" align="center" prop="itemName"/>
        <el-table-column label="Area" min-width="100" align="center" prop="area"/>
        <el-table-column label="Size" min-width="100" align="center" prop="size"/>
        <el-table-column label="EQP NO" min-width="100" align="center" prop="equipmentNo"/>
        <el-table-column label="Address" min-width="100" align="center" prop="startAddress"/>
      </el-table>
      <div class="card-footer">
        <el-pagination
          :total="pageInfo.total"
          :page-size="pageInfo.pageSize"
          :page-sizes="pageInfo.pageSizeList"
          :current-page="pageInfo.pageNo"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </fieldset>
  </div>
</template>
<script>
import { t } from '@/utils'
import { shopList } from '@/config'
import notice from '@/utils/notice'
import { getLineList } from '@/api/eqpmodel/line'
import { createLinkSignal, saveLinkSignal } from '@/api/plcConfig/linkSignal'
import { getEquipMentRecipeByLineId } from '@/api/plcConfig/cassetteMap'
export default {
  name: 'LinkSignalDetail',
  props: {
    detailData: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      buttonFlag: false,
      loading: false,
      update: false,
      eqpList: [],
      templateNameList: [
        { value: 'Upstream', label: 'Upstream' },
        { value: 'Downstream', label: 'Downstream' }
      ],
      linkSignalForm: {
        shopName: '',
        lineId: '',
        equipmentNo: '',
        count: 1,
        block: '',
        templateName: '',
        startAddress: '',
        type: ''
      },
      shopList: shopList,
      allLineList: [],
      lineList: [],
      showAllList: [],
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        pageNo: 1,
        dataList: []
      }
    }
  },
  watch: {
    'linkSignalForm.lineId'() {
      if (!this.linkSignalForm.lineId) {
        this.linkSignalForm.equipmentNo = ''
      }
    }
  },
  created() {
    if (this.detailData.update) {
      this.update = this.detailData.update
      this.linkSignalForm.shopName = this.detailData.shop
      this.linkSignalForm.lineId = this.detailData.lineId
      this.getEquipMentRecipeByLineId()
    }
    this.getLineList()
  },
  methods: {
    t,
    getEqpListHandler() {
      this.equipmentNo = ''
      this.getEquipMentRecipeByLineId()
    },
    getEquipMentRecipeByLineId() {
      return getEquipMentRecipeByLineId({
        lineId: this.linkSignalForm.lineId
      }).then(res => {
        this.eqpList = res.body
      })
    },
    saveHandler() {
      return saveLinkSignal({
        update: this.update,
        shopName: this.linkSignalForm.shopName,
        lineId: this.linkSignalForm.lineId,
        list: this.showAllList
      }).then(res => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.loading = false
          this.buttonFlag = false
          this.$emit('successEvent')
        })
      }).catch(() => {
        this.loading = false
        this.buttonFlag = true
      })
    },
    createDataHandler() {
      this.$refs.linkSignalForm.validate(valid => {
        if (valid) {
          this.loading = true
          const condition = Object.assign(this.linkSignalForm, { update: this.update })
          return createLinkSignal({
            condition: condition,
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize
          }).then(res => {
            this.buttonFlag = true
            this.showAllList = res.body.rows
            this.pageInfo.total = res.body.total
            this.getDataListByPage()
            this.loading = false
          }).catch(() => {
            this.loading = false
            this.buttonFlag = false
          })
        } else {
          this.$message({
            message: 'Do not fill in blanks!',
            type: 'error'
          })
          return false
        }
      })
    },
    getLineListHandler() {
      this.linkSignalForm.lineId = ''
      this.lineList = this.allLineList.filter(({ shopName }) => { return this.linkSignalForm.shopName === shopName })
    },
    getLineList() {
      return getLineList({
        condition: {
          shopName: this.linkSignalForm.shopName
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.allLineList = res.body.rows
      })
    },
    getDataListByPage() {
      this.loading = true
      this.pageInfo.dataList = this.$lodash.slice(this.showAllList, (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize, this.pageInfo.pageNo * this.pageInfo.pageSize)
      this.loading = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getDataListByPage()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getDataListByPage()
    }
  }
}
</script>
<style scoped>
  .fieldset {
    padding: 10px;
    min-width: 100px;
    height: 100%;
    border: 1px solid #e3e3e3;
    border-radius: 5px;
  }
</style>

