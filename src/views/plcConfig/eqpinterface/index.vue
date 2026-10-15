<template>
  <div class="app-container">
    <div class="filter-container">
      <shop-line-filter :shop-val="shop" :line-val="lineId" :disabled="shopLine" @changeEvent="changeHandler">
        <el-col :lg="6" :md="8" :sm="24" style="white-space:nowrap;">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
        </el-col>
      </shop-line-filter>
    </div>
    <el-table :data="pageInfo.dataList">
      <el-table-column :index="indexHandler" type="index" align="center" label="#" fixed/>
      <el-table-column label="Shop" width="150" prop="shopName" align="center"/>
      <el-table-column label="LineId" width="150" prop="lineId" align="center"/>
      <el-table-column label="EQP Name" width="150" prop="eqpName" align="center"/>
      <el-table-column label="Interface Name" width="150" prop="eqpInterfaceName" align="center"/>
      <el-table-column label="Local">
        <el-table-column prop="fromEqpNo" label="From" width="120" align="center"/>
        <el-table-column prop="toEqpNo" label="To" width="120" align="center"/>
      </el-table-column>
      <el-table-column label="Self Equipment">
        <el-table-column prop="selfEqpPathNo" label="Path No" width="120" align="center"/>
        <el-table-column prop="selfEqpBitNoStart" label="Bit Number Start" width="150" align="center"/>
        <el-table-column prop="selfEqpBitNoEnd" label="Bit Number End" width="150" align="center"/>
        <el-table-column prop="selfEqpJobDataStart" label="JobData Start" width="120" align="center"/>
        <el-table-column prop="selfEqpJobDataEnd" label="JobData End" width="120" align="center"/>
        <el-table-column prop="selfEqpEventRpt" label="Event Report" width="120" align="center"/>
      </el-table-column>
      <el-table-column label="Other Equipment">
        <el-table-column prop="otherEqpPathNo" label="Path No" width="120" align="center"/>
        <el-table-column prop="otherEqpBitNoStart" label="Bit Number Start" width="150" align="center"/>
        <el-table-column prop="otherEqpBitNoEnd" label="Bit Number End" width="150" align="center"/>
        <el-table-column prop="otherEqpJobDataStart" label="JobData Start" width="120" align="center"/>
        <el-table-column prop="otherEqpJobDataEnd" label="JobData End" width="120" align="center"/>
        <el-table-column prop="otherEqpEventRpt" label="Event Report" width="120" align="center"/>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="160" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" @click="editHandler(curr.row)"/>
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="removeHandler(curr.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-pagination
        :total="pageInfo.total"
        :page-size="pageInfo.pageSize"
        :page-sizes="pageInfo.pageSizeList"
        :current-page="pageInfo.currPage"
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
      width="800px"
      top="8vh"
      title="EQP Interface Detail"
    >
      <detail v-if="showDetail" :detail-data="rowData" style="padding: 10px 20px" @successEvent="successHandler" @cancelEvent="cancelHandler"/>
    </el-dialog>
  </div>
</template>
<script>
import { saveEqpInterface, deleteEqpInterface, getEqpDetail } from '@/api/plcConfig/eqpInterface'
import ShopLineFilter from '@/components/ShopLineFilter'
import notice from '@/utils/notice'
import detail from './detail'
import { t } from '@/utils'
export default {
  name: 'EqpInterface',
  components: { detail, ShopLineFilter },
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
      showDetail: false,
      showNextBtn: false,
      update: false,
      shopLine: false,
      shop: '',
      lineId: '',
      filter: {},
      rowData: {},
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        currPage: 1,
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
    this.$nextTick(() => {
      if (this.detailData.isShowBtn) {
        this.showNextBtn = this.detailData.isShowBtn
        this.shop = this.detailData.row.shopName
        this.shopLine = this.detailData.shopLine
        this.lineId = this.detailData.row.lineId
        this.update = true
        this.getEqpDetail()
      }
    })
  },
  methods: {
    t,
    getEqpDetail() {
      const condition = {
        shopName: this.shop,
        lineId: this.lineId,
        update: this.update
      }
      return getEqpDetail({
        condition: condition,
        pageNo: this.pageInfo.currPage,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.dataList = res.body.rows
        this.pageInfo.total = res.body.total
        this.pageInfo.dataList.forEach(curr => {
          this.$set(curr, 'update', this.update)
        })
      })
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getEqpDetail()
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getEqpDetail()
    },
    nextHandler(type) {
      if (type === 'next') {
        this.$emit('successEvent', 'cassetteMap', this.pageInfo.dataList)
      } else {
        this.$emit('successEvent', 'bitEdit')
      }
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      this.shop = this.filter.shop
      this.lineId = this.filter.lineId
    },
    searchHandler() {
      this.getEqpDetail()
    },
    addHandler() {
      this.showDetail = true
      this.rowData = {
        update: this.update,
        shop: this.shop,
        lineId: this.lineId
      }
    },
    editHandler(row) {
      this.showDetail = true
      this.rowData = row
    },
    removeHandler(row) {
      this.deleteEqpInterface(row)
    },
    successHandler(interfaceForm) {
      notice.success(this.t('tip.saveSuccess'))
      this.showDetail = false
      this.saveEqpInterface(interfaceForm)
    },
    cancelHandler() {
      this.showDetail = false
    },
    saveEqpInterface(interfaceForm) {
      return saveEqpInterface(interfaceForm).then(res => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.getEqpDetail()
        })
      })
    },
    deleteEqpInterface(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        return deleteEqpInterface(row).then(res => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getEqpDetail()
          })
        })
      })
    },
    indexHandler(index) {
      return index + 1
    }
  }
}
</script>

