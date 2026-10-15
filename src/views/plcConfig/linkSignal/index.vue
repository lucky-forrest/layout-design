<template>
  <div class="app-container">
    <div class="filter-container">
      <shop-line-filter :shop-val="shop" :line-val="lineId" :disabled="shopLine" @changeEvent="changeHandler">
        <el-col :lg="8" :md="8" :sm="24" style="white-space:nowrap;">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
        </el-col>
      </shop-line-filter>
    </div>
    <el-table
      v-loading="loading"
      :data="pageInfo.dataList"
      highlight-current-row
      stripe
      border>
      <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
      <el-table-column label="Shop" min-width="90" align="center" prop="shopName"/>
      <el-table-column label="LineId" min-width="100" align="center" prop="lineId"/>
      <el-table-column label="Type" min-width="100" align="center" prop="type"/>
      <el-table-column label="Block" min-width="100" align="center" prop="blockName"/>
      <el-table-column label="ItemName" min-width="100" align="center" prop="itemName"/>
      <el-table-column label="Area" min-width="65" align="center" prop="area"/>
      <el-table-column label="Size" min-width="65" align="center" prop="size"/>
      <el-table-column label="EQP NO" min-width="80" align="center" prop="equipmentNo"/>
      <el-table-column label="Address" min-width="80" align="center" prop="startAddress"/>
      <el-table-column :label="t('column.operate')" width="80" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="deleteHandler(curr.row)"/>
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
    <div v-if="showNextBtn" class="card-footer">
      <el-button type="primary" @click="nextHandler('back')">{{ t('btn.back') }}</el-button>
      <el-button type="primary" @click="nextHandler('next')">{{ t('btn.next') }}</el-button>
    </div>
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1000px"
      top="8vh"
      title="Function Form"
      append-to-body>
      <Detail v-if="showDetail" :detail-data="detail" @successEvent="successHandler"/>
    </el-dialog >
  </div>
</template>
<script>
import { getLinkSignalListByPage, deleteLinkSignalById } from '@/api/plcConfig/linkSignal'
import ShopLineFilter from '@/components/ShopLineFilter'
import notice from '@/utils/notice'
import Detail from './detail'
import {
  t
} from '@/utils'
export default {
  name: 'LinkSignal',
  components: { ShopLineFilter, Detail },
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
      loading: false,
      showDetail: false,
      showNextBtn: false,
      update: false,
      shopLine: false,
      shop: '',
      lineId: '',
      filter: {},
      detail: {},
      version: '',
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        pageNo: 1,
        dataList: []
      }
    }
  },
  created() {
    if (this.detailData.isShowBtn) {
      this.shop = this.detailData.row.shopName
      this.lineId = this.detailData.row.lineId
      this.shopLine = this.detailData.shopLine
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      if (this.detailData.isShowBtn) {
        this.showNextBtn = this.detailData.isShowBtn
        this.shop = this.detailData.row.shopName
        this.lineId = this.detailData.row.lineId
        this.shopLine = this.detailData.shopLine
        this.version = this.detailData.row.version
        this.factoryName = this.detailData.row.factoryName
        this.update = true
        this.getLinkSignalListByPage()
      }
    })
  },
  methods: {
    t,
    successHandler() {
      this.getLinkSignalListByPage()
    },
    deleteHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        row.update = this.update
        return deleteLinkSignalById(row).then(res => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.loading = false
            this.getLinkSignalListByPage()
          })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      this.shop = this.filter.shop
      this.lineId = this.filter.lineId
    },
    getLinkSignalListByPage() {
      const condition = {
        shopName: this.shop,
        lineId: this.lineId,
        version: this.version,
        update: this.update
      }
      return getLinkSignalListByPage({
        condition: condition,
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.dataList = res.body.rows
        this.pageInfo.total = res.body.total
      })
    },
    nextHandler(type) {
      if (type === 'next') {
        this.$emit('successEvent', 'constants', this.pageInfo.dataList)
      } else {
        this.$emit('successEvent', 'cassetteMap')
      }
    },
    searchHandler() {
      this.getLinkSignalListByPage()
    },
    addHandler() {
      this.showDetail = true
      this.detail.update = this.update
      this.detail.shop = this.shop
      this.detail.lineId = this.lineId
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getLinkSignalListByPage()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getLinkSignalListByPage()
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}
</script>
<style lang="scss" scoped>
</style>

