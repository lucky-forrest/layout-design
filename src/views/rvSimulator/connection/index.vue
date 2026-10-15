<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :sm="4" :lg="4">
          <el-input v-model="connectionName" :placeholder="t('tip.pleaseInputConnectionName')" clearable class="filter-item" @keyup.enter.native="searchHandler"/>
        </el-col>
        <el-col :sm="4" :lg="4">
          <el-input v-model="selfSubject" :placeholder="t('tip.pleaseInputSelfSubject')" clearable class="filter-item" @keyup.enter.native="searchHandler"/>
        </el-col>
        <el-col :sm="4" :lg="4">
          <el-input v-model="targetSubject" :placeholder="t('tip.pleaseInputTargetSubject')" clearable class="filter-item" @keyup.enter.native="searchHandler"/>
        </el-col>
        <el-col :sm="8" :lg="8">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="loading"
      :data="showFileList"
      highlight-current-row
      stripe
      border>
      <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
      <el-table-column label="ConnectionName" min-width="100" align="center" prop="connectionName"/>
      <el-table-column label="NewWork" min-width="100" align="center" prop="netWork"/>
      <el-table-column label="Service" min-width="100" align="center" prop="service"/>
      <el-table-column label="Daemon" min-width="100" align="center" prop="daemon"/>
      <el-table-column label="SelfSubject" min-width="100" align="center" prop="selfSubject"/>
      <el-table-column label="TargetSubject" min-width="100" align="center" prop="targetSubject"/>
      <el-table-column label="TimeOut(s)" min-width="100" align="center" prop="timeout"/>
      <el-table-column :label="t('column.operate')" width="200" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" :loading="loading" type="primary" icon="el-icon-edit" @click="editHandler(curr.row)"/>
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
import { saveConnection, deleteConnection, getConnectionList } from '@/api/rvsimulator/connectionlist/index'
import ConnectionDetail from './detail'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'ConnectionList',
  components: {
    ConnectionDetail
  },
  data() {
    return {
      loading: false,
      connectionName: '',
      selfSubject: '',
      targetSubject: '',
      showDetail: false,
      showFileList: [],
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

  // watch: {
  //   connectionName() {
  //     if (this.connectionName) {
  //       this.showFileList = this.$lodash.slice(this.pageInfo.dataList.filter(data => {
  //         return data.connectionName.replace(/\s/g, '').toUpperCase().includes(this.connectionName.replace(/\s/g, '').toUpperCase())
  //       }
  //       ))
  //       this.pageInfo.total = this.showFileList.length
  //     } else {
  //       this.showFileList = this.$lodash.slice(this.pageInfo.dataList)
  //     }
  //   },
  //   selfSubject() {
  //     if (this.selfSubject) {
  //       this.showFileList = this.$lodash.slice(this.pageInfo.dataList.filter(data => {
  //         return data.selfSubject.replace(/\s/g, '').toUpperCase().includes(this.selfSubject.replace(/\s/g, '').toUpperCase())
  //       }
  //       ))
  //       this.pageInfo.total = this.showFileList.length
  //     } else {
  //       this.showFileList = this.$lodash.slice(this.pageInfo.dataList)
  //     }
  //   },
  //   targetSubject() {
  //     if (this.targetSubject) {
  //       this.showFileList = this.$lodash.slice(this.pageInfo.dataList.filter(data => {
  //         return data.targetSubject.replace(/\s/g, '').toUpperCase().includes(this.targetSubject.replace(/\s/g, '').toUpperCase())
  //       }
  //       ))
  //       this.pageInfo.total = this.showFileList.length
  //     } else {
  //       this.showFileList = this.$lodash.slice(this.pageInfo.dataList)
  //     }
  //   }
  // },
  mounted() {
    this.$nextTick().then(() => {
      this.getConnectionList()
    })
  },
  methods: {
    t,
    getConnectionList() {
      this.loading = true
      return getConnectionList({
        condition: {
          connectionName: this.connectionName,
          selfSubject: this.selfSubject,
          targetSubject: this.targetSubject
        },
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.total = res.body.total
        this.pageInfo.dataList = res.body.rows
        this.showFileList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    editHandler(row) {
      this.showDetail = true
      this.rowData = row
    },
    addHandler() {
      this.showDetail = true
      this.rowData = {}
    },
    successHandler(connectionForm, isEdit) {
      this.showDetail = false
      const actionType = isEdit ? 'update' : 'add'
      if (!isEdit) {
        const isExist = this.pageInfo.dataList.filter(ele => ele.connectionName === connectionForm.connectionName).length > 0
        if (isExist) {
          notice.error('connectionName is exist')
          return
        }
      }
      saveConnection(connectionForm, actionType).then(() => {
        this.getConnectionList()
      })
    },
    cancelHandler() {
      this.showDetail = false
    },
    searchHandler() {
      this.pageInfo.pageNo = 1
      this.getConnectionList()
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        deleteConnection(row).then(res => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getConnectionList()
          })
        })
      })
    },
    doFilter() {
      const filtersConnectionName = this.connectionName.trim()
      const filtersSelfSubject = this.selfSubject.trim()
      const filtersTargetSubject = this.targetSubject.trim()
      const filtersShowFileList = this.pageInfo.dataList.filter(item => {
        var isFiltersConnectionName = true
        var isFiltersSelfSubject = true
        var isFiltersTargetSubject = true
        if (filtersConnectionName.length !== 0) {
          isFiltersConnectionName = filtersConnectionName === item.connectionName
        }
        if (filtersSelfSubject.length !== 0) {
          isFiltersSelfSubject = filtersSelfSubject === item.selfSubject
        }
        if (filtersTargetSubject.length !== 0) {
          isFiltersTargetSubject = filtersTargetSubject === item.targetSubject
        }
        return isFiltersConnectionName && isFiltersSelfSubject && isFiltersTargetSubject
      })
      this.showFileList = this.$lodash.slice(filtersShowFileList)
      this.pageInfo.total = this.showFileList.length
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

<style scoped>
.excel-upload-input{
  display: none;
  z-index: -9999;
}
</style>
