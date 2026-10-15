<template>
  <div class="app-container">
    <div class="filter-container">
      <shop-line-filter :shop-val="shop" :line-val="lineId" :disabled="shopLine" @changeEvent="changeHandler" >
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item label="ConstansName">
            <el-input v-model="constantsName" placeholder="ConstantsName" clearable filterable class="filter-item" />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="24" :sm="24" style="white-space:nowrap;">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <!-- <el-button v-authorize="'add'" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
          <el-button type="primary"><svg-icon icon-class="import" />{{ t('btn.import') }}</el-button>
          <el-button type="primary"><svg-icon icon-class="excel" />{{ t('btn.export') }}</el-button>-->
        </el-col>
      </shop-line-filter>

    </div>
    <el-table :data="pageInfo.dataList" stripe border>
      <el-table-column label="#" min-width="100" align="center" type="expand">
        <template slot-scope="curr">
          <!-- <el-button v-authorize="'update'" type="primary" icon="el-icon-edit"  @click="showExpandList(curr.row)"/> -->
          <el-table :data="curr.row.constants" stripe style="width:60%;padding:0px;">
            <el-table-column label="Key" min-width="100" prop="dataKey" align="center" />
            <el-table-column label="Value" min-width="100" prop="dataValue" align="center" />
            <el-table-column label="Descript" min-width="100" prop="dataDesc" align="center" />
          </el-table>
        </template>
      </el-table-column>
      <!-- <el-table-column :index="indexHandler" type="index" align="center" label="#" fixed/> -->
      <el-table-column label="LineId" min-width="100" prop="lineId" align="center" />
      <el-table-column label="ConstantsName" min-width="100" prop="constantsName" align="center" />
      <el-table-column label="DefaultValue" min-width="100" prop="defaultValue" align="center" />
      <el-table-column :label="t('column.operate')" width="160" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button
            v-authorize="'update'"
            type="primary"
            icon="el-icon-edit"
            @click="editHandler(curr.row)"
          />
          <el-button
            v-authorize="'remove'"
            type="danger"
            icon="el-icon-delete"
            @click="removeHandler(curr.row)"
          />
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
        @current-change="handleCurrentChange"
      />
    </div>
    <div class="card-footer">
      <el-button v-if="showNextBtn" type="primary" @click="nextHandler('back')">{{ t('btn.back') }}</el-button>
      <el-button v-if="showNextBtn" type="primary" @click="nextHandler('next')">{{ t('btn.next') }}</el-button>
    </div>
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="700px"
      top="8vh"
      title="ContainsDetail"
      append-to-body
    >
      <add v-if="showDetail" :detail-data="currConstants" @successEvent="handleSuccess" @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>
<script>
import {
  getConstantsList,
  updateConstants,
  saveConstants,
  deleteConstants
} from '@/api/plcConfig/constants'
import ShopLineFilter from '@/components/ShopLineFilter'
import notice from '@/utils/notice'
import { t } from '@/utils'
import add from './add'

export default {
  name: 'Constants',
  components: {
    add,
    ShopLineFilter
  },
  props: {
    detailData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      showNextBtn: false,
      update: false,
      shopLine: false,
      factoryNname: '',
      filter: {},
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        currPage: 1,
        dataList: []
      },
      constants: [],
      showDataList: [],
      shop: '',
      lineId: '',
      constantsName: '',
      showDetail: false,
      currConstants: '',
      showExpand: false
    }
  },
  watch: {
    constantsName() {
      this.getConstantsList()
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
        this.version = this.detailData.row.version
        this.update = true
        this.getConstantsList()
      }
    })
  },
  methods: {
    t,
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      this.shop = this.filter.shop
      this.lineId = this.filter.lineId
      if (this.lineId) {
        this.getConstantsList()
      }
    },
    nextHandler(type) {
      if (type === 'next') {
        this.$emit('successEvent', 'editAddress', this.pageInfo.dataList)
      } else {
        this.$emit('successEvent', 'linkSignal')
      }
    },
    saveConstants() {
      this.loading = true
      return saveConstants(this.pageInfo.dataList)
        .then(res => {
          this.$message({
            message: '保存成功！',
            type: 'success'
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getConstantsList() {
      this.loading = true
      return getConstantsList({
        condition: {
          shopName: this.shop,
          lineId: this.lineId,
          constantsName: this.constantsName,
          version: this.version,
          update: this.update
        },
        pageNo: this.pageInfo.currPage,
        pageSize: this.pageInfo.pageSize
      })
        .then(res => {
          this.pageInfo.dataList = res.body.rows
          this.pageInfo.total = res.body.total
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    indexHandler(index) {
      return index + 1
    },
    searchHandler() {
      this.getConstantsList()
    },
    addHandler() {
      this.showDetail = true
      this.currConstants = {
        shopName: '',
        blockName: '',
        lineId: '',
        constantsName: '',
        defaultValue: '',
        constants: []
      }
    },
    editHandler(row) {
      this.showDetail = true
      this.currConstants = Object.assign(row, { update: this.update })
    },
    removeHandler(curr) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        curr.constants.forEach(row => {
          row.update = this.update
          return deleteConstants(row).then(res => {
            notice.success(this.t('tip.removeSuccess'))
            this.getConstantsList()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        })
      })
    },
    handleSuccess(word) {
      this.showDetail = false
      return updateConstants(word)
        .then(res => {
          notice.success(this.t('tip.saveSuccess'))
          this.loading = false
          this.getConstantsList()
        })
        .catch(() => {
          this.loading = false
        })
    },
    cancelHandler() {
      this.showDetail = false
    },
    showExpandList(row) {
      this.showExpand = true
      this.constants = row.constants
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getConstantsList()
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getConstantsList()
    }
  }
}
</script>
