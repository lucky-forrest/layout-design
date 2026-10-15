<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :sm="4">
          <el-input v-model="userId" :placeholder="t('tip.pleaseInputUserId')" class="filter-item" clearable />
        </el-col>
        <el-col :sm="4">
          <el-input v-model="userName" :placeholder="t('tip.pleaseInputUserName')" class="filter-item" clearable />
        </el-col>
        <el-col :sm="8">
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchHandler">
            {{ t('btn.search') }}</el-button>
          <el-button v-waves v-authorize="'add'" type="primary" icon="el-icon-plus" class="filter-item" @click="addHandler">{{ t('btn.add') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading="loading" v-mousewheelX="'el-table__body-wrapper'" :data="pageInfo.dataList" border fit highlight-current-row>
      <el-table-column :index="indexHandler" :label="t('column.serialNumber')" type="index" width="80" align="center" />
      <el-table-column label="UserID" min-width="150" prop="userId" align="center" />
      <el-table-column label="UserName" min-width="150" prop="userName" align="center" />
      <el-table-column label="SEX" min-width="150" prop="sex" align="center" />
      <el-table-column label="Phone" min-width="150" prop="phone" align="center" />
      <el-table-column label="E-Mail" min-width="150" prop="mail" align="left" />
      <el-table-column label="Department" min-width="150" prop="department" align="left" />
      <el-table-column label="IsEnable" width="150" prop="isEnable" align="center">
        <template slot-scope="curr">
          <span v-if="curr.row.isEnable==='Y'" style="font-size:20px;color:green;">
            <svg-icon :icon-class="'ok'" />
          </span>
          <span v-else style="font-size:20px;color:red;">
            <svg-icon :icon-class="'disable'" />
          </span>
        </template>
      </el-table-column>
      <el-table-column label="CreateTime" min-width="150" prop="createTime" align="center" />
      <el-table-column label="CreateUser" min-width="150" prop="createUser" align="center" />
      <el-table-column label="UpdateTime" min-width="150" prop="updateTime" align="center" />
      <el-table-column label="UpdateUser" min-width="150" prop="updateUser" align="center" />
      <el-table-column :label="t('column.actions')" align="center" width="180" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" :loading="loading" type="primary" icon="el-icon-edit" style="width: 44px" @click="editHandler(curr.row)" />
          <el-tooltip :open-delay="500" :content="t('btn.resetPassword')" placement="top">
            <el-button v-authorize="'update'" :loading="loading" type="success" style="width: 44px" @click="resetPasswordHandler(curr.row)">
              <svg-icon :icon-class="'reset'" />
            </el-button>
          </el-tooltip>
          <el-button v-authorize="'remove'" :loading="loading" type="danger" style="width: 44px" icon="el-icon-delete" @click="removeHandler(curr.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-pagination :total="pageInfo.total" :page-size="pageInfo.pageSize" :page-sizes="pageInfo.pageSizeList" :current-page="pageInfo.pageNo" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="showDetailForm"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="t('dialog.userDetail')"
      top="5vh"
      width="600px">
      <user-detail v-if="showDetailForm" :curr-user="currUser" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, deleteusers, resetUserPwd } from '@/api/user'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { t, convertDataToJson } from '@/utils'
import waves from '@/directive/waves' // 水波纹指令
import notice from '@/utils/notice'
import UserDetail from './detail'

export default {
  name: 'UserList',
  components: {
    UserDetail
  },
  directives: {
    waves,
    elDragDialog
  },
  data() {
    return {
      loading: false,
      downloadLoading: false,
      showDetailForm: false,
      userId: '',
      userName: '',
      currUser: {},
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 20, 50, 100],
        pageNo: 1,
        dataList: []
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    t,
    getUserList() {
      this.loading = true
      return getUserList({
        userId: this.userId,
        userName: this.userName,
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.total = res.body.total
        this.pageInfo.dataList = res.body.rows
        this.loading = false
      }).then(() => {
        this.loading = false
      })
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    },
    searchHandler() {
      this.getUserList()
    },
    downloadHandler() {
      this.downloadLoading = true
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['lineId', 'equipmentId', 'connectionType', 'host', 'connectionStr', 'desc']
          const filterVal = ['lineId', 'equipmentId', 'connectionType', 'host', 'connectionStr', 'desc']
          const data = convertDataToJson(filterVal, this.pageInfo.dataList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: 'connection-table-list'
          })
          this.downloadLoading = false
        })
    },
    addHandler() {
      this.showDetailForm = true
      this.currUser = {}
    },
    editHandler(row) {
      this.showDetailForm = true
      this.currUser = row
    },
    resetPasswordHandler(row) {
      notice.confirm(this.t('tip.resetPassword'), () => {
        this.loading = true
        return resetUserPwd(row).then(res => {
          notice.success(res.result.message)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemove'), () => {
        return deleteusers(row).then(res => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getUserList()
          })
        })
      })
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getUserList()
    },
    successHandler(title, res) {
      this.showDetailForm = false
      notice.success(this.t('tip.saveSuccess'), () => {
        this.getUserList()
      })
    },
    cancelHandler() {
      this.showDetailForm = false
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

</style>
