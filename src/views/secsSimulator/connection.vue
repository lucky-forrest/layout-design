<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :md="6" :lg="6">
          <el-input v-model="secsName" :placeholder="t('tip.pleaseSelectConnectionName')" clearable class="filter-item" @keyup.enter.native="searchHandler"/>
        </el-col>
        <el-col :md="18" :lg="18">
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" :loading="loading" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="pageInfo.dataList"
      highlight-current-row
      stripe
      border>
      <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
      <el-table-column label="SecsName" min-width="150" prop="name"/>
      <el-table-column label="Local" min-width="150" prop="localIP">
        <template v-if="curr.row.connectionMode==='PASSIVE'" slot-scope="curr">
          {{ `${curr.row.localIP}:${curr.row.localPort}` }}
        </template>
      </el-table-column>
      <el-table-column label="Remote" min-width="150">
        <template v-if="curr.row.connectionMode==='ACTIVE'" slot-scope="curr">
          {{ `${curr.row.remoteIP}:${curr.row.remotePort}` }}
        </template>
      </el-table-column>
      <el-table-column label="ConnectMode" min-width="150" align="center" prop="connectionMode"/>
      <el-table-column label="DeviceID" min-width="150" align="center" prop="deviceID"/>
      <el-table-column label="T3 TimeOut" min-width="150" align="center" prop="t3"/>
      <el-table-column label="T5 TimeOut" min-width="150" align="center" prop="t5"/>
      <el-table-column label="T6 TimeOut" min-width="150" align="center" prop="t6"/>
      <el-table-column label="T7 TimeOut" min-width="150" align="center" prop="t7"/>
      <el-table-column label="T8 TimeOut" min-width="150" align="center" prop="t8"/>
      <el-table-column label="Link Test TimeOut" min-width="150" align="center" prop="linkTest"/>
      <el-table-column :label="t('column.operate')" width="250" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" :loading="loading" type="primary" icon="el-icon-edit" @click="editHandler(curr.row)"/>
          <el-tooltip :content="t('btn.connectionTest')" placement="top">
            <el-button :loading="loading" type="primary" @click="connTestHandler(curr.row)">
              <svg-icon :icon-class="'test'"/>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Start" placement="top">
            <el-button v-show="!curr.row.start" :loading="loading" type="primary" @click="startHandler(curr.row)">
              <svg-icon :icon-class="'start'" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Stop" placement="top">
            <el-button v-show="curr.row.start" :loading="loading" type="danger" @click="stopHandler(curr.row)">
              <svg-icon :icon-class="'stop'" />
            </el-button>
          </el-tooltip>
          <el-button v-authorize="'remove'" :loading="loading" type="danger" icon="el-icon-delete" @click="removeHandler(curr.row)"/>
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
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="800px"
      top="8vh"
      title="Connection Form">
      <connection-detail v-if="showDetail" :detail-data="rowData" @successEvent="successHandler" @cancelEvent="cancelHandler"/>
    </el-dialog>
  </div>
</template>

<script>
import { getConnectionList, saveConnection, deleteConnection, testConnection } from '@/api/secsSimulator/connection'
import { startSimulator, stopSimulator } from '@/api/secsSimulator'
import ConnectionDetail from './connectionDetail'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'SecsSimulatorConnectionList',
  components: { ConnectionDetail },
  data() {
    return {
      loading: false,
      secsName: '',
      showDetail: false,
      rowData: {},
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
    this.$nextTick().then(() => {
      this.getConnectionList()
    })
  },
  methods: {
    t,
    startHandler(row) {
      this.loading = true
      return startSimulator(row).then(res => {
        if (res.body) {
          notice.success(this.t('tip.openSuccess'))
          this.activeNames = []
        } else {
          notice.error(this.t('tip.openFailure'))
        }
        this.getConnectionList()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    stopHandler(row) {
      return stopSimulator(row)
        .then(res => {
          if (res.body) {
            notice.success(this.t('tip.stopSuccess'))
          } else {
            notice.error(this.t('tip.stopFailure'))
          }
          this.getConnectionList()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    searchHandler() {
      this.pageInfo.pageNo = 1
      this.getConnectionList()
    },
    getConnectionList() {
      this.loading = true
      return getConnectionList({
        condition: { name: this.secsName },
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
    editHandler(row) {
      this.showDetail = true
      delete row.remote
      delete row.local
      this.rowData = row
    },
    addHandler() {
      this.showDetail = true
      this.rowData = {}
    },
    connTestHandler(row) {
      this.loading = true
      delete row.remote
      delete row.local
      delete row.sECSLibraryFile
      delete row.eQPType
      return testConnection(row).then(res => {
        if (res.body) {
          notice.success('Test Success!')
        } else {
          notice.error('Test Fail!')
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    successHandler(connectionForm, isEdit) {
      delete connectionForm.sECSLibraryFile
      delete connectionForm.eQPType
      saveConnection(connectionForm).then(() => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.showDetail = false
          this.getConnectionList()
        })
      }).catch(() => {
        this.showDetail = false
      })
    },
    cancelHandler() {
      this.showDetail = false
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        this.loading = true
        deleteConnection(row).then(res => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.loading = false
            this.getConnectionList()
          })
        }).catch(() => {
          this.loading = true
        })
      })
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

<style  lang="scss" scoped>
.el-input{
  width:100%;
}
</style>
