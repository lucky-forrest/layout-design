<template>
  <div class="app-container">
    <div class="filter-container">
      <shop-line-filter @changeEvent="changeHandler" >
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item label="EquipmentNo">
            <el-select v-model="equipmentNo" :placeholder="t('tip.pleaseSelectEquipmentNo')" clearable filterable class="filter-item">
              <el-option v-for="(item,index) in equipmentList" :label="item.equipmentNo" :value="item.equipmentNo" :key="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item label="UnitNo">
            <el-input v-model="unitNo" :placeholder="t('tip.pleaseInputUnitNo')" clearable filterable class="filter-item" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :md="16" :sm="24">
          <el-form-item style="text-align:right;">
            <el-button :loading="loading" type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          </el-form-item>
        </el-col>
      </shop-line-filter>
    </div>
    <el-table v-loading.body="loading" :data="pageInfo.dataList" stripe border>
      <el-table-column :index="indexHandler" type="index" fixed>#</el-table-column>
      <el-table-column label="LineId" min-width="100" prop="lineId" fixed />
      <el-table-column label="EquipmentNo" min-width="120" prop="equipmentNo" fixed />
      <el-table-column label="UnitNo" min-width="100" prop="unitNo" fixed />
      <el-table-column label="ServerName" min-width="120" prop="serverName" />
      <el-table-column label="EquipmentId" min-width="120" prop="equipmentId" />
      <el-table-column label="UnitId" min-width="100" prop="unitId" />
      <el-table-column label="UnitType" min-width="100" prop="unitType" />
      <el-table-column label="Attribute" min-width="100" prop="attribute" />
      <el-table-column label="Name" min-width="100" prop="name" />
      <el-table-column label="PositionPlcTrxNo" min-width="150" prop="postitionPlcTrxNo" />
      <el-table-column min-width="120px" label="CreateUser" prop="createUser" />
      <el-table-column min-width="150px" label="CreateTime" prop="createTime">
        <template slot-scope="curr">
          {{ curr.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="UpdateUser" prop="updateUser" />
      <el-table-column min-width="150px" label="UpdateTime" prop="updateTime">
        <template slot-scope="curr">
          {{ curr.row.updateTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="160" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" @click="editHandler(curr.row)"/>
          <el-button
            v-authorize="'remove'"
            type="danger"
            icon="el-icon-delete"
            @click="deleteHandler(curr.row)"/>
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
      :visible.sync="showDetailForm"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="UnitDetail"
      top="18vh"
      width="60%">
      <unit-detail
        v-if="showDetailForm"
        :curr-unit="currUnit"
        @saveEvent="successHandler"
        @cancelEvent="cancelHandler" />
    </el-dialog>
    <el-dialog :visible="importVisible" :before-close="()=>{importVisible = false}" width="60%">
      <upload-excel-component
        v-if="importVisible"
        :container-style="{width: '400px', height: '40px', 'line-height': '40px'}"
        :btn-style="{'margin-left':'16px','vertical-align':'5px'}"
        :on-success="handleSuccess"
        :before-upload="beforeUpload" />
    </el-dialog>
  </div>
</template>

<script>
import { getUnitList, saveUnitInfo, deleteUnitInfo, importUnitList } from '@/api/eqpmodel/unit'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import ShopLineFilter from '@/components/ShopLineFilter'
import { unitTable } from '@/config/table'
import notice from '@/utils/notice'
import { t, convertDataToJson } from '@/utils'
import UnitDetail from './detail'

export default {
  name: 'UnitList',
  components: {
    UnitDetail,
    UploadExcelComponent,
    ShopLineFilter
  },
  data() {
    return {
      unitNo: '',
      loading: true,
      showDetailForm: false,
      currUnit: {},
      equipmentNo: '',
      equipmentList: [],
      importVisible: false,
      exportDataList: [],
      importDataList: [],
      unitTable: unitTable,
      tableHeader: [],
      fileName: '',
      filter: {},
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
    this.$nextTick(() => {
      this.tableHeader = this.$lodash.map(this.unitTable.columnList, 'label')
      this.loading = true
      this.getUnitList()
    })
  },
  methods: {
    t,
    convertDataToJson,
    search() {
      this.pageInfo.pageNo = 1
      this.getUnitList()
    },
    getEquipmentList() {
      this.loading = true
      return getEquipmentList({
        condition: {
          lineId: this.filter.lineId
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.equipmentList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getUnitList() {
      this.loading = true
      return getUnitList({
        condition: {
          lineId: this.filter.lineId,
          equipmentNo: this.equipmentNo,
          unitNo: this.unitNo
        },
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.total = res.body.total
        this.pageInfo.dataList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = true
      })
    },
    searchHandler() {
      this.pageInfo.pageNo = 1
      this.getUnitList()
    },
    editHandler(row) {
      this.showDetailForm = true
      this.currUnit = row
    },
    addHandler() {
      this.showDetailForm = true
      this.currUnit = {}
    },
    deleteHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        this.loading = true
        deleteUnitInfo(row).then(res => {
          this.loading = false
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getUnitList()
          })
        }).catch(err => {
          this.loading = false
          notice.error(err)
        })
      })
    },
    successHandler(unit, isEdit) {
      saveUnitInfo(unit).then(res => {
        this.showDetailForm = false
        notice.success(this.t('tip.saveSuccess'), () => {
          this.getUnitList()
        })
      }).catch(err => {
        notice.error(err)
      })
    },
    exportData(command) {
      let tempPromise
      if (!command) {
        this.fileName = 'unit-template'
        tempPromise = new Promise((resolve) => {
          this.exportDataList = this.pageInfo.dataList
          resolve()
        })
      } else {
        this.fileName = 'unit-data'
        tempPromise = getUnitList({
          condition: {}
        }).then(res => {
          this.exportDataList = res.body.rows
        })
      }
      tempPromise.then(() => {
          import('@/vendor/Export2Excel').then(excel => {
            this.exportDataList = this.convertDataToJson(this.tableHeader, this.exportDataList)
            excel.export_json_to_excel({
              header: this.tableHeader,
              data: this.exportDataList,
              filename: this.fileName
            })
            this.loading = false
          })
      })
    },
    handleSuccess({
      results,
      header
    }) {
      this.importDataList = results
      importUnitList({
        rows: this.importDataList
      }).then(res => {
        this.importVisible = false
        if (res.body) {
          notice.error(res.body)
        }
        this.pageInfo.pageNo = 1
        this.getUnitList()
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 2
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 2m in size.',
        type: 'warning'
      })
      return false
    },
    importHandler() {
      this.importVisible = true
    },
    cancelHandler() {
      this.loading = false
      this.showDetailForm = false
    },
    backHandler() {
      this.showDetailForm = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getUnitList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getUnitList()
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      this.getEquipmentList()
    }
  }
}

</script>
<style lang="scss" scoped>
  .el-select {
    width: 100%;
  }

  .fieldset {
    margin-bottom: 10px;
    border: 1px solid #dcdfe6;

    legend {
      font-weight: bold;
    }
  }

</style>
