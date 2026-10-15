<template>
  <div class="app-container">
    <div class="filter-container">
      <shop-line-filter @changeEvent="changeHandler" >
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item label="EquipmentNo">
            <el-input v-model="equipmentNo" :placeholder="t('tip.pleaseInputEquipmentNo')" clearable class="filter-item" />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="24" :sm="12">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="search">{{ t('btn.search') }}</el-button>
          </el-form-item>
        </el-col>
      </shop-line-filter>
    </div>
    <el-table v-loading.body="loading" :data="pageInfo.dataList" stripe border>
      <el-table-column :index="indexHandler" type="index" fixed>#</el-table-column>
      <el-table-column min-width="120px" label="LineId" prop="lineId" fixed />
      <el-table-column min-width="120px" label="EquipmentNo" prop="equipmentNo" fixed />
      <el-table-column min-width="120px" label="ServerName" prop="serverName" />
      <el-table-column min-width="120px" label="EquipmentId" prop="equipmentId" />
      <el-table-column min-width="130px" label="EquipmentType" prop="eqpType" />
      <el-table-column min-width="120px" label="Name" prop="name" />
      <el-table-column min-width="120px" label="Attribute" prop="attribute" />
      <el-table-column min-width="120px" label="UnitCount" prop="unitCount" />
      <el-table-column min-width="120px" label="RecipeIndex" prop="recipeIndex" />
      <el-table-column min-width="120px" label="RecipeLength" prop="recipeLength" />
      <el-table-column min-width="140px" label="RecipeSequence" prop="recipeSequence" />
      <el-table-column min-width="120px" label="VcrType" prop="vcrType" />
      <el-table-column min-width="120px" label="TouchPanel" prop="touchPanel" />
      <el-table-column min-width="160px" label="ProcessdateSource" prop="processdateSource" />
      <el-table-column min-width="120px" label="ReportMode" prop="reportMode" />
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
          <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" @click="editHandler(curr.row)" />
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="removeHandler(curr.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-pagination :total="pageInfo.total" :page-size="pageInfo.pageSize" :page-sizes="pageInfo.pageSizeList" :current-page="pageInfo.pageNo" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :visible="showDetail" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="() => {showDetail = false}" width="800px" top="10vh" title="EquipmentDetail">
      <equipment-detail v-if="showDetail" :curr-equipment="currEquipment" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
    <el-dialog :visible="importVisible" :before-close="()=>{importVisible = false}" width="60%">
      <upload-excel-component v-if="importVisible" :container-style="{width: '400px', height: '40px', 'line-height': '40px'}" :btn-style="{'margin-left':'16px','vertical-align':'5px'}" :on-success="handleSuccess" :before-upload="beforeUpload" />
    </el-dialog>
  </div>
</template>
<script>
import { getEquipmentList, saveEquipmentInfo, deleteEquipmentInfo, importEquipmentList } from '@/api/eqpmodel/equipment'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { t, convertDataToJson, convertData } from '@/utils'
import ShopLineFilter from '@/components/ShopLineFilter'
import { equipmentTable } from '@/config/table'
import EquipmentDetail from './detail'
import notice from '@/utils/notice'

export default {
  name: 'EquipmentList',
  components: {
    ShopLineFilter,
    EquipmentDetail,
    UploadExcelComponent
  },
  data() {
    return {
      loading: true,
      importVisible: false,
      showDetail: false,
      filter: {},
      equipmentNo: '',
      currEquipment: {},
      exportDataList: [],
      importDataList: [],
      equipmentTable: equipmentTable,
      tableHeader: [],
      fileName: '',
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
      this.tableHeader = this.$lodash.map(this.equipmentTable.columnList, 'label')
      this.getEquipmentList()
    })
  },
  methods: {
    t,
    convertDataToJson,
    convertData,
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      if (this.filter.lineId) {
        this.getEquipmentList()
      }
    },
    search() {
      this.pageInfo.pageNo = 1
      this.getEquipmentList()
    },
    getEquipmentList() {
      this.loading = true
      return getEquipmentList({
        condition: {
          lineId: this.filter.lineId,
          equipmentNo: this.equipmentNo
        },
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.total = res.body.total
        this.pageInfo.dataList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addHandler() {
      this.showDetail = true
      this.currEquipment = {}
    },
    editHandler(row) {
      this.showDetail = true
      this.currEquipment = row
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        deleteEquipmentInfo(row).then(() => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getEquipmentList()
          })
        })
      })
    },
    successHandler(equipment, isEdit) {
      saveEquipmentInfo(equipment).then(res => {
        this.showDetail = false
        this.getEquipmentList()
      })
    },
    exportData(command) {
      let tempPromise
      if (!command) {
        this.fileName = 'equipment-template'
        tempPromise = new Promise((resolve) => {
          this.exportDataList = this.pageInfo.dataList
          resolve()
        })
      } else {
        this.fileName = 'equipment-data'
        tempPromise = getEquipmentList({
          condition: {},
          pageNo: 1,
          pageSize: Number.MAX_VALUE
        }).then(res => {
          this.exportDataList = res.body.rows
        })
      }
      tempPromise.then(() => {
          import('@/vendor/Export2Excel').then(excel => {
            this.exportDataList = this.convertData(this.tableHeader, this.exportDataList)
            excel.export_json_to_excel({
              header: this.tableHeader,
              data: this.exportDataList,
              filename: this.fileName
            })
            this.loading = false
          })
      })
    },
    handleSuccess({ results, header }) {
      this.importDataList = results
      this.importDataList.forEach(ele => {
        ele.isIonizer = ele.isIonizer.toLowerCase()
      })
      importEquipmentList({ rows: this.importDataList }).then(res => {
        this.importVisible = false
        if (res.body) {
          notice.error(res.body)
        }
        this.pageInfo.pageNo = 1
        this.getEquipmentList()
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
      this.showDetail = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getEquipmentList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getEquipmentList()
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
  .el-date-editor
    {
    width: 100%;
  }

</style>
