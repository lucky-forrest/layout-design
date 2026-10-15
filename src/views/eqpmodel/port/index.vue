<template>
  <div v-loading="loading" class="app-container">
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
          <el-form-item label="PortNo">
            <el-input v-model="portNo" :placeholder="t('tip.pleaseInputPortNo')" clearable filterable class="filter-item" />
          </el-form-item>
        </el-col>
        <el-col :lg="24" :md="16" :sm="24">
          <el-form-item style="text-align:right;">
            <el-button :loading="loading" type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          </el-form-item>
        </el-col>
      </shop-line-filter>
    </div>
    <el-table ref="portList" :data="pageInfo.dataList" border stripe>
      <el-table-column :index="indexHandler" type="index" align="center" fixed>#</el-table-column>
      <el-table-column label="LineId" min-width="120" prop="lineId" align="center" fixed />
      <el-table-column label="EquipmentNo" min-width="120" prop="equipmentNo" align="center" fixed />
      <el-table-column label="PortNo" width="80" prop="portNo" align="center" fixed />
      <el-table-column label="ServerName" min-width="120" prop="serverName" align="center" />
      <el-table-column label="EquipmentId" min-width="120" prop="equipmentId" align="center" />
      <el-table-column label="PortId" width="80" prop="portId" align="center" />
      <el-table-column label="MaxCount" width="100" prop="maxCount" align="center" />
      <el-table-column label="Attribute" width="100" prop="attribute" align="center" />
      <el-table-column label="ProcessStartType" width="140" prop="processStartType" align="center" />
      <el-table-column label="MappingEnable" width="130" align="center">
        <template slot-scope="curr">
          <span v-if="curr.row.mappingEnabled" style="font-size:20px;color:green;">
            <svg-icon :icon-class="'ok'" />
          </span>
          <span v-else style="font-size:20px;color:red;">
            <svg-icon :icon-class="'disable'" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="CassetteType" min-width="120" prop="cassetteType" align="center" />
      <el-table-column width="100px" label="CreateUser" prop="createUser" />
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
          <el-button
            v-authorize="'update'"
            :loading="loading"
            type="primary"
            icon="el-icon-edit"
            @click="editHandler(curr.row)"/>
          <el-button
            v-authorize="'remove'"
            :loading="loading"
            type="danger"
            icon="el-icon-delete"
            @click="delHandler(curr.row)"/>
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
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
      top="18vh"
      title="PortDetail">
      <port-detail v-if="showDetail" :curr-port="currPort" @saveEvent="successHandler" @cancelEvent="cancelHandler" />
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
import { getPortList, savePortInfo, deletePortInfo, importPortList } from '@/api/eqpmodel/port'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import ShopLineFilter from '@/components/ShopLineFilter'
import { t, convertDataToJson } from '@/utils'
import { portTable } from '@/config/table'
import notice from '@/utils/notice'
import PortDetail from './detail'

export default {
  name: 'PortList',
  components: {
    PortDetail,
    UploadExcelComponent,
    ShopLineFilter
  },
  data() {
    return {
      loading: false,
      showDetail: false,
      equipmentNo: '',
      equipmentList: [],
      portNo: '',
      filter: {},
      importVisible: false,
      exportDataList: [],
      importDataList: [],
      portTable: portTable,
      tableHeader: [],
      fileName: '',
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        pageNo: 1,
        dataList: []
      },
      currPort: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeader = this.$lodash.map(this.portTable.columnList, 'label')
      this.getPortList()
    })
  },
  methods: {
    t,
    convertDataToJson,
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
    exportData(command) {
      let tempPromise
      if (!command) {
        this.fileName = 'port-template'
        tempPromise = new Promise((resolve) => {
          this.exportDataList = this.pageInfo.dataList
          resolve()
        })
      } else {
        this.fileName = 'port-data'
        tempPromise = getPortList({
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
    handleSuccess({ results, header }) {
      this.importDataList = results
      this.importDataList.forEach(ele => {
        ele.mappingEnabled = ele.mappingEnabled.toLowerCase()
      })
      importPortList({
        rows: this.importDataList
      }).then(res => {
        this.importVisible = false
        if (res.body) {
          notice.error(res.body)
        }
        this.pageInfo.pageNo = 1
        this.getPortList()
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
    searchHandler() {
      this.pageInfo.pageNo = 1
      this.getPortList()
    },
    addHandler() {
      this.showDetail = true
      this.currPort = {}
    },
    getPortList() {
      this.loading = true
      return getPortList({
        condition: {
          lineId: this.filter.lineId,
          equipmentNo: this.equipmentNo,
          portNo: this.portNo
        },
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.loading = false
        this.pageInfo.dataList = res.body.rows
        this.pageInfo.total = res.body.total
      }).catch(() => {
        this.loading = false
      })
    },
    editHandler(row) {
      this.showDetail = true
      this.currPort = row
    },
    delHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        this.loading = true
        deletePortInfo(row).then(res => {
          this.loading = false
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getPortList()
          })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getPortList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getPortList()
    },
    successHandler(port, isEdit) {
      savePortInfo(port).then(res => {
        this.showDetail = false
        notice.success(this.t('tip.saveSuccess'), () => {
          this.pageNo = 1
          this.getPortList()
        })
      }).catch(err => {
        notice.error(err)
      })
    },
    cancelHandler() {
      this.showDetail = false
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
  .el-select,
  .el-input-number,
  .el-date-editor {
    width: 100%;
  }

  .is-horizontal {
    display: none;
  }

</style>
