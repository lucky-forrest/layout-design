<template>
  <div >
    <el-form
      ref="cassetteMapForm"
      :model="cassetteMapForm"
      label-width="110px">
      <el-row :gutter="20">
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="Shop"
            prop="shopName">
            <el-select v-model="cassetteMapForm.shopName" :disabled="update" placeholder="SHOP" clearable filterable class="filter-item" style="width:100%;" @change="getLineListHandler">
              <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="LineId"
            prop="lineId">
            <el-select v-model="cassetteMapForm.lineId" :disabled="update" placeholder="LINE" clearable filterable class="filter-item" style="width:100%;" @change="getEqpListHandler">
              <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineId" :value="item.lineId"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseSelect')}]"
            label="EQP NO"
            prop="equipmentNo">
            <el-select v-model="cassetteMapForm.equipmentNo" placeholder="EQP NO" clearable filterable style="width:100%;">
              <el-option v-for="(item,index) in eqpList" :key="index" :label="item.equipmentNo" :value="item.equipmentNo"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="StartAddress"
            prop="startAddress">
            <el-input v-model="cassetteMapForm.startAddress" placeholder="StartAddress" clearable style="width:100%;"/>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="PortCount"
            prop="portCount">
            <el-input-number v-model="cassetteMapForm.portCount" :min="1" placeholder="Port Count" clearable style="width:100%;" controls-position="right"/>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="SlotCount"
            prop="slotCount">
            <el-input-number v-model="cassetteMapForm.slotCount" :min="1" placeholder="SlotCount" clearable style="width:100%;" controls-position="right"/>
          </el-form-item>
        </el-col>
        <el-col :sm="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="SIZE">
            <el-input-number v-model="cassetteMapForm.size" :min="1" placeholder="SIZE" clearable style="width:100%;" controls-position="right"/>
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
        <el-table-column label="Port" min-width="100" align="center" prop="portName"/>
        <el-table-column label="Type" min-width="100" align="center" prop="type"/>
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
import { saveCassetteMap, createCassetteMap, getEquipMentRecipeByLineId } from '@/api/plcConfig/cassetteMap'
export default {
  name: 'CassetteMapDetail',
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
      cassetteMapForm: {
        shopName: '',
        lineId: '',
        equipmentNo: '',
        size: 1,
        portCount: 1,
        startAddress: '',
        slotCount: 1
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
    'cassetteMapForm.lineId'() {
      if (!this.cassetteMapForm.lineId) {
        this.cassetteMapForm.equipmentNo = ''
      }
    }
  },
  created() {
    if (this.detailData.update) {
      this.update = this.detailData.update
      this.cassetteMapForm.shopName = this.detailData.shop
      this.cassetteMapForm.lineId = this.detailData.lineId
      this.getEquipMentRecipeByLineId()
    }
    this.getLineList()
  },
  methods: {
    t,
    getEqpListHandler() {
      this.getEquipMentRecipeByLineId()
    },
    getEquipMentRecipeByLineId() {
      return getEquipMentRecipeByLineId({
        lineId: this.cassetteMapForm.lineId
      }).then(res => {
        this.eqpList = res.body
      })
    },
    saveHandler() {
      this.loading = true
      return saveCassetteMap({
        update: this.update,
        shopName: this.cassetteMapForm.shopName,
        lineId: this.cassetteMapForm.lineId,
        list: this.showAllList
      }).then(res => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.$emit('successEvent')
          this.buttonFlag = false
          this.loading = false
        })
      }).catch(() => {
        this.buttonFlag = true
        this.loading = false
      })
    },
    createDataHandler() {
      this.$refs.cassetteMapForm.validate(valid => {
        if (valid) {
          this.loading = true
          const condition = Object.assign(this.cassetteMapForm, { update: this.update })
          return createCassetteMap({
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
            this.buttonFlag = false
            this.loading = false
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
      this.cassetteMapForm.lineId = ''
      this.lineList = this.allLineList.filter(({ shopName }) => { return this.cassetteMapForm.shopName === shopName })
    },
    getLineList() {
      return getLineList({
        condition: {
          shopName: this.cassetteMapForm.shopName
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

