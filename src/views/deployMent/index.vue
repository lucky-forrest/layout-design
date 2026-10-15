<template>
  <div class="app-container">
    <el-table v-loading.body="loading" :data="dataList" border>
      <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
      <el-table-column label="Name" prop="name" align="center"/>
      <el-table-column label="Version" prop="version" align="center"/>
      <el-table-column label="Description" prop="content" align="center"/>
    </el-table>
    <div class="card-footer">
      <el-button v-authorize="'upload'" :loading="loading" type="primary" icon="el-icon-upload" @click="showUploadFile=true">
        {{ t('btn.upload') }}
      </el-button>
      <el-button v-authorize="'upload'" :loading="loading" type="success" icon="el-icon-check" @click="showReleaseDialog=true">{{ t('btn.deploy') }}</el-button>
    </div>
    <el-dialog :visible.sync="showUploadFile" :fullscreen="false" :body-style="{padding:'10px 20px'}" :close-on-click-modal="false" :close-on-press-escape="false" width="500px" top="8vh" title="Upload Form">
      <upload v-if="showUploadFile" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
    <el-dialog :visible.sync="showReleaseDialog" :fullscreen="false" :close-on-click-modal="false" :close-on-press-escape="false" width="800px" top="8vh" title="Release Dialog">
      <release v-if="showReleaseDialog" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>
<script>
import { getConfVersionHistoryList } from '@/api/deployMent'
import upload from './upload'
import release from './release'
import { t } from '@/utils'
export default {
  components: {
    upload,
    release
  },
  data() {
    return {
      loading: false,
      showUploadFile: false,
      showReleaseDialog: false,
      dataList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getConfVersionHistoryList()
    })
  },
  methods: {
    t,
    getConfVersionHistoryList() {
      this.loading = true
      return getConfVersionHistoryList({ type: 'BC', name: 'BC' }).then(res => {
        this.loading = false
        this.dataList = res.body
      }).catch(() => {
        this.loading = false
      })
    },
    successHandler(type) {
      if (type === 'upload') {
        this.getConfVersionHistoryList()
        this.showUploadFile = false
      } else if (type === 'release') {
        this.showReleaseDialog = false
      }
    },
    cancelHandler(type) {
      if (type === 'upload') {
        this.showUploadFile = false
      } else {
        this.showReleaseDialog = false
      }
    },
    indexHandler(index) {
      return index + 1
      // return (this.pageInfo.currPage - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}
</script>

