<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :sm="6" :lg="5">
          <el-button :loading="loading" type="primary" icon="el-icon-plus" @click="fileDetailHandler">{{ t('btn.createFile') }}</el-button>
          <el-button :loading="loading" :disabled="!fileName" type="danger" icon="el-icon-delete" @click="delFileHandler">{{ t('btn.remove') }}</el-button>
        </el-col>
        <el-col :sm="4" :lg="4">
          <el-select v-model="fileName" :placeholder="t('tip.pleaseSelectFileName')" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in fileNameList" :key="index" :label="item" :value="item"/>
          </el-select>
        </el-col>
        <el-col :sm="4" :lg="4">
          <el-select v-model="direction" :placeholder="t('tip.pleaseSelectDirection')" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in directionList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :sm="4" :lg="4">
          <el-input v-model="pattern" :placeholder="t('tip.pleaseInputPattern')" clearable class="filter-item" @keyup.enter.native="searchHandler"/>
        </el-col>
        <el-col :sm="5" :lg="5">
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" :loading="loading" :disabled="!fileName" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      :loading="loading"
      :data="pageInfo.dataList"
      highlight-current-row
      stripe
      border>
      <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
      <el-table-column label="Pattern" min-width="140" align="center" prop="pattern"/>
      <el-table-column label="Key" min-width="140" align="center" prop="key"/>
      <el-table-column label="Direction" min-width="100" align="center" prop="direction"/>
      <el-table-column label="WaitReply" min-width="100" align="center" prop="waitReply">
        <template slot-scope="curr">
          <el-checkbox v-model="curr.row.waitReply" disabled/>
        </template>
      </el-table-column>
      <el-table-column label="AutoReply" min-width="100" align="center" prop="autoReply">
        <template slot-scope="curr">
          <el-checkbox v-model="curr.row.autoReply" disabled/>
        </template>
      </el-table-column>
      <el-table-column label="Reply Message" min-width="100" align="center" prop="autoReplyMessage"/>
      <el-table-column label="Description" min-width="100" align="center" prop="description"/>
      <el-table-column :label="t('column.operate')" width="140" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" @click="editHandler(curr.row)"/>
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="removeHandler(curr.row)"/>
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
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog
      :visible.sync="showFileDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
      top="30vh"
      title="Message Form">
      <file-detail v-if="showFileDetail" @successEvent="successHandler" @cancelEvent="cancelHandler"/>
    </el-dialog>
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="70%"
      top="5vh"
      title="Message Form">
      <message-detail v-if="showDetail" :action-type="actionType" :detail-data="rowData" @successEvent="successHandler" @cancelEvent="cancelHandler"/>
    </el-dialog>
  </div>
</template>

<script>
import { getMessageFileList, getMessageList, deleteMessage, newMessageFile, saveMessage, deleteMessageFile } from '@/api/rvsimulator/messagelist/index'
import { directionList } from '@/config/dropdown'
import FileDetail from './detailforfile'
import MessageDetail from './detail'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'MessageList',
  components: {
    MessageDetail,
    FileDetail
  },
  data() {
    return {
      loading: false,
      fileName: '',
      direction: '',
      pattern: '',
      showDetail: false,
      showFileDetail: false,
      fileNameList: [],
      rowData: {},
      actionType: '',
      directionList: directionList,
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        currPage: 1,
        dataList: []
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getMessageFileList()
    })
  },
  methods: {
    t,
    delFileHandler() {
      this.loading = true
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        return deleteMessageFile({ fileName: this.fileName }).then(res => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.fileName = ''
            this.getMessageFileList()
            this.pageInfo.dataList = []
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    getMessageFileList() {
      this.loading = true
      return getMessageFileList().then(res => {
        this.fileNameList = res.body
        this.pageInfo.total = res.body.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getMessageList() {
      this.loading = true
      return getMessageList({
        condition: {
          fileName: this.fileName,
          direction: this.direction,
          pattern: this.pattern
        },
        pageNo: this.pageInfo.currPage,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.dataList = res.body.rows
        this.pageInfo.total = res.body.total
        this.pageInfo.currPage = res.body.pageNo
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    editHandler(row) {
      this.showDetail = true
      this.rowData = row
      this.actionType = 'edit'
    },
    addHandler() {
      this.showDetail = true
      this.rowData = { fileName: this.fileName }
      this.actionType = 'add'
    },
    fileDetailHandler() {
      this.showFileDetail = true
    },
    successHandler(message, actionType) {
      if (actionType === 'newMessageFile' && message !== '') {
        return newMessageFile({
          fileName: message
        }).then(res => {
          notice.success(this.t('tip.saveSuccess'))
          this.showFileDetail = false
          this.getMessageFileList()
        }).catch(() => {
          this.showFileDetail = false
        })
      }
      if (actionType === 'add' || 'edit') {
        message.actionType = actionType
        return saveMessage(message).then(res => {
          notice.success(this.t('tip.saveSuccess'))
          this.showDetail = false
          this.getMessageList()
        })
      }
    },
    cancelHandler(type) {
      if (type === 'showDetail') {
        this.showDetail = false
      }
      if (type === 'showFileDetail') {
        this.showFileDetail = false
      }
    },
    searchHandler() {
      this.getMessageList()
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        return deleteMessage(row).then(() => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getMessageList()
          })
        })
      })
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getMessageList()
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getMessageList()
    },
    indexHandler(index) {
      return (this.pageInfo.currPage - 1) * this.pageInfo.pageSize + index + 1
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
