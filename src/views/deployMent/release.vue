<template>
  <div>
    <el-table :data="allToolsMonitorData" max-height="250" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column :index="indexHandler" type="index" align="center" fixed>#</el-table-column>
      <el-table-column label="LineId" min-width="100px" prop="lineId" align="center"/>
      <el-table-column label="Version" min-width="80px" prop="version" align="center"/>
      <el-table-column label="UpdateTime" min-width="130px" prop="updateTime" align="center">
        <template slot-scope="curr">
          {{ curr.row.updateTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="Description" min-width="120px" prop="content" align="center"/>
      <el-table-column label="Latest Version" min-width="120px" prop="newestVersion" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click.native.prevent="getConfVersionFileList(scope.row.newestVersion)">
            {{ scope.row.newestVersion }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table :data="confVersionFileList" max-height="250" style="margin-top:15px;" border @selection-change="handleSelectionChange2">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column :index="indexHandler2" type="index" align="center" fixed>#</el-table-column>
      <el-table-column label="FileName" prop="name" align="center"/>
      <el-table-column label="Version" prop="version" align="center"/>
      <el-table-column label="UpdateTime" prop="updateTime" align="center">
        <template slot-scope="curr">
          {{ curr.row.updateTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="Description" prop="content" align="center"/>
    </el-table>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="deployHandler">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="cancelHandler">
        <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { getalltoolsmonitortobcfiles, getConfVersionFileList, uploadFileToRemote } from '@/api/deployMent'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  data() {
    return {
      loading: false,
      multipleSelection: [],
      multipleSelection2: [],
      allToolsMonitorData: [],
      confVersionFileList: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getalltoolsmonitortobcfiles()
    })
  },
  methods: {
    t,
    getalltoolsmonitortobcfiles() {
      this.loading = true
      return getalltoolsmonitortobcfiles({ type: 'BC' }).then(res => {
        this.loading = false
        this.allToolsMonitorData = res.body
      }).catch(() => {
        this.loading = false
      })
    },
    getConfVersionFileList(fileVersion) {
      this.loading = true
      return getConfVersionFileList({ type: 'FILE', fileVersion: fileVersion }).then(res => {
        this.loading = false
        this.confVersionFileList = res.body
      }).catch(() => {
        this.loading = false
      })
    },
    deployHandler() {
      this.loading = true
      return uploadFileToRemote({
        configVersionFiles: this.multipleSelection2,
        monitorToBCFiles: this.multipleSelection
      }).then(res => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.$emit('successEvent', 'release')
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val
    },
    cancelHandler() {
      this.$emit('cancelEvent', 'release')
    },
    indexHandler(index) {
      return index + 1
    },
    indexHandler2(index) {
      return index + 1
    }
  }
}
</script>

