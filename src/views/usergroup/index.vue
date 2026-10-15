<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="groupName" :placeholder="t('tip.pleaseInputUserGroupName')" clearable style="width: 300px" class="filter-item" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="searchHandler">
        {{ t('btn.search') }}</el-button>
      <el-button v-authorize="'add'" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
    </div>
    <el-table v-loading="loading" v-mousewheelX="'el-table__body-wrapper'" :data="pageInfo.dataList" border fit highlight-current-row>
      <el-table-column :index="indexHandler" :label="t('column.serialNumber')" type="index" width="80" align="center" />
      <el-table-column label="GroupName" min-width="150" prop="groupId" align="left" />
      <el-table-column label="Description" min-width="150" prop="description" align="left" />
      <el-table-column label="CreateTime" min-width="150" prop="createTime" align="center" />
      <el-table-column label="CreateUser" min-width="150" prop="createUser" align="center" />
      <el-table-column label="UpdateTime" min-width="150" prop="updateTime" align="center" />
      <el-table-column label="UpdateUser" min-width="150" prop="updateUser" align="center" />
      <el-table-column :label="t('column.actions')" align="center" width="130" class-name="small-padding fixed-width" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" style="width: 44px" @click="editHandler(curr.row)" />
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" style="width: 44px" @click="removeHandler(curr.row,'deleted')" />
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-pagination :total="pageInfo.total" :page-size="pageInfo.pageSize" :page-sizes="pageInfo.pageSizeList" :current-page="pageInfo.pageNo" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      :visible.sync="showDetailForm"
      :fullscreen="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="t('dialog.usergroupDetail')"
      top="5vh"
      width="1200px">
      <usergroup-detail v-if="showDetailForm" :group-info="groupInfo" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>

<script>
import { getUsergroupList, deleteusergroups } from '@/api/usergroup'
import waves from '@/directive/waves' // 水波纹指令
import UsergroupDetail from './detail'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'UsergroupList',
  components: {
    UsergroupDetail
  },
  directives: {
    waves
  },
  data() {
    return {
      loading: false,
      showDetailForm: false,
      groupName: '',
      groupInfo: {},
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
    this.getUsergroupList()
  },
  methods: {
    t,
    getUsergroupList() {
      this.loading = true
      return getUsergroupList({
        groupId: this.groupName,
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
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    },
    searchHandler() {
      this.pageInfo.pageNo = 1
      this.getUsergroupList()
    },
    addHandler() {
      this.showDetailForm = true
      this.groupInfo = {}
    },
    editHandler(row) {
      this.showDetailForm = true
      this.groupInfo = row
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemove'), () => {
        return deleteusergroups(row).then(() => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getUsergroupList()
          })
        })
      })
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getUsergroupList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getUsergroupList()
    },
    successHandler(title, res) {
      this.showDetailForm = false
      this.getUsergroupList()
    },
    cancelHandler(event) {
      switch (event) {
        case 'usergroupDetail':
          this.showDetailForm = false
          break
      }
      this.showDetailForm = false
    }
  }
}
</script>

