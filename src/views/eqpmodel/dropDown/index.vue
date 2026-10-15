<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :md="6" :lg="6">
          <el-select v-model="constansType" :placeholder="t('tip.pleaseSelectConstanstype')" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in constansList" :key="index" :label="item.dataName" :value="item.dataName" />
          </el-select>
        </el-col>
        <el-col :md="12" :lg="12">
          <el-button type="primary" icon="el-icon-search" @click="search">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading.body="loading" :data="pageInfo.dataList" :span-method="objectSpan" highlight-current-row border>
      <el-table-column :index="indexHandler" type="index" fixed>#</el-table-column>
      <el-table-column min-width="120px" label="DataType" prop="dataType">
        <template slot-scope="curr">
          <el-tooltip :content="t('btn.edit')" placement="top">
            <el-button type="text" @click="editHandler(curr.row)">{{ curr.row.dataType }}</el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="DataName" prop="dataName" />
      <el-table-column min-width="120px" label="Sort" prop="sort" />
      <el-table-column min-width="120px" label="Attribute" prop="dataAttr" />
      <el-table-column min-width="120px" label="DataDesc" prop="dataDesc" />
      <el-table-column min-width="120px" label="CreateUser" prop="createUser" />
      <el-table-column min-width="130px" label="CreateTime" prop="createTime">
        <template slot-scope="curr">
          {{ curr.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="UpdateUser" prop="updateUser" />
      <el-table-column min-width="130px" label="UpdateTime" prop="updateTime">
        <template slot-scope="curr">
          {{ curr.row.updateTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="100" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button
            v-authorize="'remove'"
            type="danger"
            icon="el-icon-delete"
            @click="removeHandler(curr.row)"/>
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
        @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      :visible="showDetail"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="() => {showDetail = false}"
      width="510px"
      top="10vh"
      title="DropDownDetail">
      <constans-detail
        v-if="showDetail"
        :detail-data="detailData"
        @saveEvent="successHandler"
        @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>
<script>
import { getDropDownList, deleteDropDownItem, importDropDownList } from '@/api/eqpmodel/dropDown'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { dropDownTable } from '@/config/table'
import ConstansDetail from './detail'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'ConstantsList',
  components: {
    UploadExcelComponent,
    ConstansDetail
  },
  data() {
    return {
      loading: false,
      showDetail: false,
      importVisible: false,
      detailData: {},
      constansType: '',
      constansList: [{
        dataName: 'Root'
      }],
      exportDataList: [],
      importDataList: [],
      dropDownTable: dropDownTable,
      tableHeader: [],
      fileName: '',
      spanArr: [],
      position: 0,
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        pageNo: 1,
        dataList: []
      }
    }
  },
  mounted() {
    this.tableHeader = this.$lodash.map(this.dropDownTable.columnList, 'label')
    this.$nextTick().then(() => {
      this.getConstansList().then(() => {
        this.getDropDownList()
      })
    })
  },
  methods: {
    t,
    addHandler() {
      this.detailData = {}
      this.showDetail = true
    },
    editHandler(row) {
      this.detailData = row
      this.showDetail = true
    },
    getConstansList() {
      return getDropDownList({
        condition: {},
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.constansList = this.constansList.concat(res.body.rows.filter(({ dataType }) => { return dataType === 'Root' }))
        this.constansType = 'Root'
      })
    },
    getDropDownList() {
      this.loading = true
      return getDropDownList({
        condition: { dataType: this.constansType },
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.total = res.body.total
        this.pageInfo.dataList = res.body.rows
        this.spanArr = []
        this.rowSpan(this.pageInfo.dataList)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    search() {
      this.pageInfo.pageNo = 1
      this.getDropDownList()
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        deleteDropDownItem({ objectId: row.objectId }).then(res => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getConstansList()
            this.getDropDownList()
          })
        })
      })
    },
    rowSpan(dataList) {
      dataList.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (dataList[index].dataType === dataList[index - 1].dataType) {
            this.spanArr[this.position]++
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.position = index
          }
        }
      })
    },
    handleSuccess({ results, header }) {
      this.importDataList = results
      importDropDownList({ rows: this.importDataList }).then(res => {
        this.importVisible = false
        if (Array.isArray(res.body) && res.body.length) {
          notice.error(res.body.join('\n'), () => {
            this.pageInfo.pageNo = 1
            this.getDropDownList()
          })
        }
        this.pageInfo.pageNo = 1
        this.getDropDownList()
      })
    },
    objectSpan({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    successHandler() {
      notice.success(this.t('tip.saveSuccess'), () => {
        this.showDetail = false
        this.getDropDownList()
      })
    },
    cancelHandler() {
      this.showDetail = false
    },
    importHandler() {
      this.importVisible = true
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getDropDownList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getDropDownList()
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-select,
  .el-input-number,
  .el-date-editor {
    width: 100%;
  }
  .custom-table{
  width:100%;
  border-collapse:collapse;
  border: 1px solid #ebeef5;

  th,td{
    width:14%;
    padding:5px;
    border: 1px solid #ebeef5;
    line-height: 24px;
  }
  th{
    text-align: center !important;
  }
  td{
    word-break: break-all;
  }
}
</style>
