<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :md="4">
          <el-select v-model="shop" :placeholder="t('tip.pleaseSelectShop')" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in shopList" :key="index" :label="item" :value="item"/>
          </el-select>
        </el-col>
        <el-col :md="4">
          <el-select v-model="lineId" :placeholder="t('tip.pleaseSelectLineId')" class="filter-item" clearable>
            <el-option v-for="(lineId,index) in lineList" :key="index" :label="lineId" :value="lineId"/>
          </el-select>
        </el-col>
        <el-col :md="4">
          <el-select v-model="equipmentNo" :placeholder="t('tip.pleaseSelectEquipmentNo')" class="filter-item" clearable>
            <el-option v-for="(equipmentNo,index) in equipmentList" :key="index" :label="equipmentNo" :value="equipmentNo"/>
          </el-select>
        </el-col>
        <el-col :sm="8" :lg="8">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="loading"
      :data="showTableList"
      highlight-current-row
      stripe
      border>
      <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
      <el-table-column label="ConnectionName" min-width="100" align="center" prop="connectionName"/>
      <el-table-column label="NewWork" min-width="100" align="center" prop="netWork"/>
      <el-table-column label="Server" min-width="100" align="center" prop="service"/>
      <el-table-column label="Daemon" min-width="100" align="center" prop="daemon"/>
      <el-table-column label="SelfSubject" min-width="100" align="center" prop="selfSubject"/>
      <el-table-column label="TargetSubject" min-width="100" align="center" prop="targetSubject"/>
      <el-table-column label="TimeOut(s)" min-width="100" align="center" prop="timeout"/>
      <el-table-column :label="t('column.operate')" width="280" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" type="primary" @click="editHandler(curr.row)">
            {{ t('btn.edit') }}
          </el-button>
          <el-button v-authorize="'update'" type="primary" @click="connTestHandler(curr.row)">
            {{ t('btn.connTest') }}
          </el-button>
          <el-button v-authorize="'update'" type="danger" @click="removeHandler(curr.row)">
            {{ t('btn.remove') }}
          </el-button>
        </template>
      </el-table-column>
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
  </div>
</template>
<script>
import { getShopList } from '@/api/plcConfig/selectList'
import {
  t
} from '@/utils'
export default {
  name: 'PLCConnection',
  data() {
    return {
      loading: false,
      shop: '',
      shopList: [],
      lineId: '',
      lineList: [],
      equipmentNo: '',
      equipmentList: [],
      showTableList: [],
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
    shop() {
      if (this.shop) {
        this.getLineNameList()
      } else {
        this.lineList.splice(0, this.lineList.length)
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.getShopList()
    })
  },
  methods: {
    t,
    getShopList() {
      return getShopList({ dataType: 'Shop' }).then(res => {
        this.shopList = res.body
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchHandler() {

    },
    addHandler() {

    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

