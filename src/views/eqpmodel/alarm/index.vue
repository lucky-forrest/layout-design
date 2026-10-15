<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :sm="8" :lg="3">
          <el-select v-model="lineId" placeholder="LineId" clearable class="filter-item">
            <el-option v-for="(item,index) in lineList" :label="item.lineId" :value="item.lineId" :key="index"/>
          </el-select>
        </el-col>
        <el-col :sm="8" :lg="3">
          <el-select v-model="equipmentNo" placeholder="EquipmentNo" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in equipmentList" :label="item" :value="item" :key="index"/>
          </el-select>
        </el-col>
        <el-col :sm="8" :lg="3">
          <el-select v-model="alarmLevel" placeholder="AlarmLevel" clearable filterable class="filter-item">
            <el-option v-for="(alarmLevel,index) in alarmLevels" :key="index" :label="alarmLevel.label" :value="alarmLevel.value"/>
          </el-select>
        </el-col>
        <el-col :sm="8" :lg="3">
          <el-input v-model="alarmCode" placeholder="AlarmCode" clearable filterable class="filter-item"/>
        </el-col>
        <el-col :sm="16" :lg="12">
          <el-button :loading="isloading" type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" :loading="isloading" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
          <el-button type="primary" @click="importHandler"><svg-icon icon-class="import" /><span style="margin-left:8px">{{ t('btn.import') }}</span></el-button>
          <el-dropdown @command="exportData">
            <el-button type="primary">
              <svg-icon icon-class="excel" /><span style="margin-left:7px">{{ t('btn.export') }}</span><i class="el-icon-arrow-down el-icon--right"/>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="">{{ t('btn.exportTemplate') }}</el-dropdown-item>
              <el-dropdown-item command="1">{{ t('btn.exportData') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading.body="isloading" :data="pageInfo.dataList" stripe border>
      <el-table-column :index="indexHandler" type="index" fixed>#</el-table-column>
      <el-table-column label="LineId" min-width="100" prop="lineId"/>
      <el-table-column label="ServerName" min-width="100" prop="serverName"/>
      <el-table-column label="EquipmentNo" min-width="100" prop="equipmentNo"/>
      <el-table-column label="UnitNo" min-width="100" prop="unitNo"/>
      <el-table-column label="AlarmLevel" min-width="100" prop="alarmLevel"/>
      <el-table-column label="AlarmId" min-width="100" prop="alarmId"/>
      <el-table-column label="AlarmCode" min-width="100" prop="alarmCode"/>
      <el-table-column label="AlarmText" min-width="100" prop="alarmText"/>
      <el-table-column label="Operate" width="240" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" :loading="isloading" type="primary" icon="el-icon-edit" @click="editHandler(curr.row)">
            {{ t('btn.edit') }}
          </el-button>
          <el-button v-authorize="'remove'" :loading="isloading" type="danger" icon="el-icon-delete" @click="deleteHandler(curr.row)">
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
    <el-dialog
      :visible="importVisible"
      :before-close="()=>{importVisible = false}"
      width="60%">
      <upload-excel-component
        v-if="importVisible"
        :container-style="{width: '400px', height: '40px', 'line-height': '40px'}"
        :btn-style="{'margin-left':'16px','vertical-align':'5px'}"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"/>
    </el-dialog>
    <el-dialog
      :visible.sync="showDetailForm"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body
      title="AlarmDetail"
      top="15vh"
      width="50%"
    >
      <alarm-detail v-if="showDetailForm" :curr-alarm="currAlarm" :line-list="lineList" @saveEvent="successHandler" @cancelEvent="cancelHandler"/>
    </el-dialog>
  </div>
</template>

<script>
import { getAlarmList, importAlarmList, deleteAlarmInfo, saveAlarmInfo } from '@/api/eqpmodel/alarm'
import { alarmLevelList } from '@/config/dropdown'
import { t, convertDataToJson } from '@/utils'
import { alarmTable } from '@/config/table'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import { getLineList } from '@/api/eqpmodel/line'
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import alarmDetail from './detail'
import notice from '@/utils/notice'
export default {
  name: 'AlarmList',
  components: {
    UploadExcelComponent,
    alarmDetail
  },
  data() {
    return {
      lineId: '',
      equipmentNo: '',
      alarmLevel: '',
      alarmCode: '',
      lineList: [],
      equipmentList: [],
      isloading: false,
      currAlarm: {},
      tableName: '',
      showDetailForm: false,
      downloadLoading: false,
      alarmLevels: alarmLevelList,
      importVisible: false,
      exportDataList: [],
      alarmTable: alarmTable,
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
    lineId(value) {
      this.equipmentNo = ''
      if (value) {
        getEquipmentList({ condition: { lineId: value }}).then(res => {
          this.equipmentList = new Set([])
          res.body.rows.forEach(ele => {
            this.equipmentList.add(ele.equipmentNo)
          })
          this.equipmentList = [...this.equipmentList]
        })
      } else {
        this.equipmentList = []
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeader = this.$lodash.map(this.alarmTable.columnList, 'label')
      this.getLineList().then(() => {
        this.getAlarmList()
      })
    })
  },
  methods: {
    t,
    convertDataToJson,
    searchHandler() {
      this.pageInfo.pageNo = 1
      this.getAlarmList()
    },
    deleteHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        this.isloading = true
        deleteAlarmInfo(row).then(res => {
          this.isloading = false
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getAlarmList()
          })
        }).catch(err => {
          this.isloading = false
          notice.error(err)
        })
      })
    },
    successHandler(alarm, isEdit) {
      // const actionType = isEdit ? 'Modify' : 'Add'
      saveAlarmInfo(alarm).then(res => {
        this.showDetailForm = false
        notice.success(this.t('tip.saveSuccess'), () => {
          this.getAlarmList()
        })
      }).catch(err => {
        notice.error(err)
      })
    },
    cancelHandler() {
      this.isloading = false
      this.showDetailForm = false
    },
    editHandler(row) {
      this.showDetailForm = true
      this.currAlarm = row
    },
    addHandler() {
      this.showDetailForm = true
      this.currAlarm = {}
    },
    getLineList() {
      return new Promise((resolve, reject) => {
        try {
          this.isloading = true
          return getLineList({ condition: {}}).then(res => {
            this.isloading = false
            this.lineList = res.body.rows
            resolve()
          })
        } catch (error) {
          this.isloading = false
          reject(error)
        }
      })
    },
    getEquipmentList(data) {
      return new Promise((resolve, reject) => {
        try {
          this.isloading = true
          return getEquipmentList(data).then(res => {
            this.isloading = false
            this.equipmentList = res.body.rows
            resolve()
          })
        } catch (error) {
          this.isloading = false
          reject(error)
        }
      })
    },
    getAlarmList() {
      return new Promise((resolve, reject) => {
        try {
          this.isloading = true
          return getAlarmList({
            condition: {
              lineId: this.lineId,
              equipmentNo: this.equipmentNo,
              alarmId: this.alarmId,
              alarmLevel: this.alarmLevel
            },
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize
          }).then(res => {
            this.pageInfo.total = res.body.total
            this.pageInfo.dataList = res.body.rows
            this.isloading = false
            resolve()
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    exportData(command) {
      let tempPromise
      if (!command) {
        this.fileName = 'alarm-template'
        tempPromise = new Promise((resolve) => {
          this.exportDataList = this.pageInfo.dataList
          resolve()
        })
      } else {
        this.fileName = 'alarm-data'
        tempPromise = getAlarmList({ condition: {}
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
      importAlarmList({ rows: this.importDataList }).then(res => {
        this.importVisible = false
        if (res.body) {
          notice.error(res.body)
        }
        this.pageInfo.pageNo = 1
        this.getAlarmList()
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
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getAlarmList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getAlarmList()
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select{
  width: 100%;
}
.fieldset{
    margin-bottom:10px;
    border: 1px solid #dcdfe6;
    legend{
      font-weight: bold;
    }
  }
</style>
