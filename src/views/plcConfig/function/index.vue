<template>
  <div class="app-container">
    <div class="filter-container">
      <shop-line-filter :shop-val="shop" :line-val="lineId" :disabled="shopLine" @changeEvent="changeHandler" >
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item label="FunctionType">
            <el-select v-model="type" :placeholder="t('tip.pleaseSelectFunctionType')" clearable filterable class="filter-item" >
              <el-option v-for="(item,index) in functionType" :key="index" :label="item.label" :value="item.label" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item label="FunctionName">
            <el-input v-model="functionName" :placeholder="t('tip.pleaseInputFunctionName')" clearable class="filter-item" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :md="16" :sm="24" style="text-align:right;white-space:nowrap;">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
          <el-button v-authorize="'clone'" v-show="!update" :disabled="isDisable" type="primary" @click="cloneHandler">
            <svg-icon :icon-class="'clone'" />
            &nbsp;{{ t('btn.clone') }}
          </el-button>
        </el-col>
      </shop-line-filter>
    </div>
    <el-table :data="pageInfo.dataList" stripe border @selection-change="selectionChangeHandler">
      <el-table-column type="selection" width="30" />
      <el-table-column label="Shop" min-width="190" align="center">
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.edit"
            v-model="scope.row.shopName"
            placeholder="Please Input!"
            style="width: 160px"
            filterable
            clearable
            class="filter-item"
            @change="getLineListHandler(scope.row)"
          >
            <el-option v-for="(item,index) in shopList" :label="item.label" :value="item.value" :key="index" />
          </el-select>
          <span v-else-if="!scope.row.edit">{{ scope.row.shopName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="LineId" min-width="190" align="center">
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.edit"
            v-model="scope.row.lineId"
            placeholder="Please Input!"
            style="width: 160px"
            filterable
            clearable
            class="filter-item"
          >
            <el-option v-for="(item,index) in scope.row.lineList" :value="item.lineId" :key="index" />
          </el-select>
          <span v-else-if="!scope.row.edit">{{ scope.row.lineId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="FunctionName" min-width="190" align="center">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.edit"
            v-model="scope.row.functionName"
            placeholder="Please Input!"
            style="width: 160px"
            clearable
            class="filter-item"
          />
          <span v-else-if="!scope.row.edit">{{ scope.row.functionName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="FunctionQty" min-width="190" prop="functionQty" align="center">
        <template slot-scope="scope">
          <el-input
            v-if="scope.row.edit"
            v-model="scope.row.functionQty"
            placeholder="Please Input!"
            style="width: 160px"
            clearable
            class="filter-item"
          />
          <span v-else-if="!scope.row.edit">{{ scope.row.functionQty }}</span>
        </template>
      </el-table-column>
      <el-table-column label="FunctionType" min-width="190" align="center">
        <template slot-scope="scope">
          <el-select
            v-if="scope.row.edit"
            :placeholder="t('tip.pleaseSelectFunctionType')"
            v-model="scope.row.functionType"
            filterable
            class="filter-item"
          >
            <el-option v-for="(item,index) in functionType" :label="item.label" :value="item.value" :key="index" />
          </el-select>
          <span v-else-if="!scope.row.edit">{{ scope.row.functionType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Common/Spec" width="190" align="center">
        <template slot-scope="scope">
          <el-radio-group v-if="scope.row.edit" v-model="scope.row.functionCategory">
            <el-radio label="Common">Common</el-radio>
            <el-radio label="Spec">Spec</el-radio>
          </el-radio-group>
          <span v-else-if="!scope.row.edit">{{ scope.row.functionCategory }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Command" min-width="130" align="center">
        <template slot-scope="scope">
          <el-radio-group
            v-if="scope.row.edit"
            v-model="scope.row.command"
            :disabled="scope.row.functionType!=='Command'"
          >
            <el-radio :label="0">0</el-radio>
            <el-radio :label="1">1</el-radio>
          </el-radio-group>
          <span v-else-if="!scope.row.edit">{{ scope.row.command }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CommandDetail" min-width="270" align="center">
        <template slot-scope="scope">
          <el-row :gutter="20">
            <el-col :sm="24">
              <el-checkbox v-model="scope.row.functionWord" :disabled="!scope.row.edit" label="FunWord" />
              <el-checkbox v-model="scope.row.functionReplyWord" :disabled="!scope.row.edit" label="FunReplyWord" />
            </el-col>
            <el-col :sm="24">
              <el-checkbox v-model="scope.row.functionBit" :disabled="!scope.row.edit" label="FunBit" class="special" />
              <el-checkbox v-model="scope.row.functionReplyBit" :disabled="!scope.row.edit" label="FunReplyBit" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="130" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-authorize="'update'"
            v-if="!scope.row.edit"
            :loading="loading"
            type="primary"
            icon="el-icon-edit"
            @click="scope.row.edit = true,getLineListHandler2(scope.row)"
          />
          <el-tooltip class="item" effect="dark" content="Save" placement="top">
            <el-button
              v-authorize="'update'"
              v-if="scope.row.edit"
              :loading="loading"
              type="primary"
              @click="saveHandler(scope.row)"
            >
              <svg-icon :icon-class="'save'" />
            </el-button>
          </el-tooltip>
          <el-button
            v-authorize="'remove'"
            type="danger"
            icon="el-icon-delete"
            @click="delHandler(scope)"
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
    <div v-if="showNextBtn" class="card-footer">
      <el-button type="primary" @click="nextHandler('back')">{{ t('btn.back') }}</el-button>
      <el-button type="primary" @click="nextHandler('next')">{{ t('btn.next') }}</el-button>
    </div>
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="850px"
      top="8vh"
      title="Function Form"
      append-to-body
    >
      <add v-if="showDetail" :update="update" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
    <el-dialog
      :visible.sync="showLittleDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="30%"
      top="20vh"
      title="Function Form"
      append-to-body
    >
      <detail
        v-if="showLittleDetail"
        :little-detail="littleDetail"
        @successEvent="handlerSuccess"
        @cancelEvent="cancelHandler"
      />
    </el-dialog>
  </div>
</template>
<script>
import { t, convertDataToJson } from '@/utils'
import notice from '@/utils/notice'
import add from './add'
import detail from './detail'
import { getLineList } from '@/api/eqpmodel/line'
import { shopList } from '@/config'
import { functionType } from '@/config/dropdown'
import ShopLineFilter from '@/components/ShopLineFilter'
import {
  getFunctionList,
  saveFunction,
  removeFunction,
  cloneFunction
} from '@/api/plcConfig/functionList'

export default {
  name: 'FunctionList',
  components: { add, detail, ShopLineFilter },
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
      filter: {},
      type: '',
      shop: '',
      lineId: '',
      version: '',
      loading: false,
      shopLine: false,
      functionName: '',
      showDetail: false,
      isDisable: true,
      showLittleDetail: false,
      currFun: '',
      update: false,
      downloadLoading: false,
      showNextBtn: false,
      shopList: shopList,
      functionType: functionType,
      multipleSelection: [],
      littleDetail: {},
      lineList: [],
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
    this.getLineList()
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
        this.lineId = this.detailData.row.lineId
        this.version = this.detailData.row.version
        this.shopLine = this.detailData.shopLine
        this.factoryName = this.detailData.row.factoryName
        this.isDisable = true
        this.update = true
        this.getFunctionList()
      }
    })
  },
  methods: {
    t,
    getLineListHandler(row) {
      row.lineId = ''
      row.lineList = this.lineList.filter(({ shopName }) => {
        return row.shopName === shopName
      })
    },
    getLineListHandler2(row) {
      row.lineList = this.lineList.filter(({ shopName }) => {
        return row.shopName === shopName
      })
    },
    getLineList() {
      this.loading = true
      return getLineList({
        condition: {
          shopName: this.shop
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      })
        .then(res => {
          this.lineList = res.body.rows
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    changeHandler($event) {
      this.type = ''
      this.filter = Object.assign({}, this.filter, $event)
      this.shop = this.filter.shop
      this.lineId = this.filter.lineId
    },
    selectionChangeHandler(val) {
      this.multipleSelection = val
      if (!(this.multipleSelection.length === 0)) {
        this.isDisable = false
      } else {
        this.isDisable = true
      }
    },
    handlerSuccess(shop, lineId) {
      this.cloneFunction(shop, lineId)
    },
    cloneHandler() {
      if (!(this.multipleSelection.length === 0)) {
        this.multipleSelection.forEach(element => {
          delete element.edit
        })
        this.showLittleDetail = true
        this.littleDetail.lineId = this.filter.lineId
      } else {
        notice.error('Please Select A Data!')
      }
    },
    cloneFunction(shop, lineId) {
      return cloneFunction({
        update: this.update,
        shopName: shop,
        lineId: lineId,
        list: this.multipleSelection
      }).then(res => {
        this.showLittleDetail = false
        this.$message({
          message: 'Successful！',
          type: 'success'
        })
      })
    },
    getFunctionList() {
      return new Promise((resolve, reject) => {
        try {
          this.loading = true
          return getFunctionList({
            condition: {
              shopName: this.shop,
              lineId: this.lineId,
              update: this.update,
              functionName: this.functionName,
              functionType: this.type,
              factoryName: this.factoryName,
              version: this.version
            },
            pageNo: this.pageInfo.currPage,
            pageSize: this.pageInfo.pageSize
          }).then(res => {
            this.pageInfo.total = res.body.total
            this.pageInfo.dataList = res.body.rows
            this.pageInfo.dataList.forEach(item => {
              this.$set(item, 'edit', false)
            })
            this.pageInfo.dataList.forEach(item => {
              this.$set(item, 'update', this.update)
            })
            this.loading = false
            resolve()
          })
        } catch (error) {
          this.loading = false
          reject(error)
        }
      })
    },
    nextHandler(type) {
      if (type === 'next') {
        this.$emit('successEvent', 'block', this.pageInfo.dataList)
      } else {
        this.$emit('successEvent', 'addressEdit')
      }
    },
    saveFunction() {
      return new Promise((resolve, reject) => {
        try {
          this.loading = true
          return saveFunction(
            (this.pageInfo.dataList = Object.assign(
              {},
              this.pageInfo.dataList,
              { update: this.update }
            ))
          ).then(res => {
            notice.success(this.t('tip.saveSuccess'), () => {
              this.loading = false
              this.getFunctionList()
              resolve()
            })
          }).catch(() => {
            this.loading = false
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    searchHandler() {
      this.getFunctionList()
    },
    addHandler() {
      this.showDetail = true
      this.currFun = this.update
    },
    saveHandler(row) {
      if (
        row.functionBit ||
        row.functionReplyBit ||
        row.functionWord ||
        row.functionReplyWord
      ) {
        delete row.edit
        row.update = this.update
        return saveFunction(row)
          .then(res => {
            this.$set(row, 'edit', false)
            this.loading = false
            this.getFunctionList()
          })
          .catch(() => {
            this.$set(row, 'edit', false)
            this.loading = false
          })
      } else {
        notice.error('Function Word And Bit Must Checked One')
      }
    },
    delHandler(curr) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        delete curr.row.edit
        curr.row.update = this.update
        return removeFunction(curr.row)
          .then(res => {
            notice.success(this.t('tip.removeSuccess'), () => {
              this.$set(curr.row, 'edit', false)
              this.loading = false
              this.getFunctionList()
              this.pageInfo.dataList.splice(curr.$index, 1)
            })
          })
          .catch(() => {
            this.$set(curr.row, 'edit', false)
            this.loading = false
          })
      })
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getFunctionList()
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getFunctionList()
    },
    downloadExcel() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = [
          'ShopName',
          'LineId',
          'FunctionName',
          'FunctionType',
          'Area'
        ]
        const filterVal = [
          'shopName',
          'lineId',
          'functionName',
          'functionType',
          'area'
        ]
        return getFunctionList({
          area: this.area,
          lineId: this.lineId,
          update: this.update,
          functionType: this.functionType,
          functionName: this.functionName,
          pageNum: 1,
          pageSize: Number.MAX_VALUE
        })
          .then(res => {
            const data = convertDataToJson(filterVal, res.body.rows)
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: 'Function-list'
            })
            this.loading = false
            this.downloadLoading = false
          })
          .catch(() => {
            this.loading = false
            this.downloadLoading = false
          })
      })
    },
    successHandler() {
      notice.success(this.t('tip.saveSuccess'), () => {
        this.getFunctionList()
        this.showDetail = false
      })
    },
    cancelHandler(dialogName) {
      switch (dialogName) {
        case 'add':
          this.showDetail = false
          break
        case 'littleDetail':
          this.showLittleDetail = false
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select {
  width: 100%;
}

.special {
  width: 95px;
  margin-left: -32px;
}
</style>
