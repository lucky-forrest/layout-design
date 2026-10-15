<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :sm="6">
          <el-input v-model="eventName" :placeholder="t('tip.pleaseInputEventName')" class="filter-item" />
        </el-col>
        <el-col :sm="8">
          <el-button
            v-waves
            v-authorize="'add'"
            type="primary"
            icon="el-icon-plus"
            class="filter-item"
            @click="addHandler">{{ t('btn.add') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading="loading"
      v-mousewheelX="'el-table__body-wrapper'"
      :data="showList"
      border
      fit
      highlight-current-row>
      <el-table-column label="#" type="index" width="80" align="center" />
      <el-table-column min-width="200" sortable label="EventName" prop="eventName" />
      <el-table-column min-width="200" sortable label="BlockName" prop="blockName" />
      <el-table-column min-width="100" label="RepeatReport" prop="repeatReportByGlass" align="center" >
        <template slot-scope="curr">
          <span v-if="curr.row.repeatReportByGlass" style="font-size:20px;color:green;">
            <svg-icon :icon-class="'ok'" />
          </span>
          <span v-else style="font-size:20px;color:red;">
            <svg-icon :icon-class="'disable'" />
          </span>
        </template>
      </el-table-column>
      <el-table-column min-width="150" label="TriggerCondition" prop="triggerCondition" />
      <el-table-column min-width="100" label="Timeout" prop="timeOut" align="center" />
      <el-table-column
        :label="t('column.actions')"
        align="center"
        width="140"
        fixed="right">
        <template slot-scope="curr">
          <el-button
            v-authorize="'update'"
            type="primary"
            icon="el-icon-edit"
            @click="editHandler(curr.row)" />
          <el-button
            v-authorize="'remove'"
            type="danger"
            icon="el-icon-delete"
            @click="removeHandler(curr)" />
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="showEventDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="t('dialog.eventDetail')"
      top="5vh"
      width="800px">
      <event-detail
        v-if="showEventDetail"
        :detail-data="currEvent"
        @successEvent="successHandler"
        @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>

<script>
import { getEventList, deleteEvent } from '@/api/stressTest/eventList'
import EventDetail from './eventDetail'
import waves from '@/directive/waves' // 水波纹指令
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'EventList',
  components: {
    EventDetail
  },
  directives: {
    waves
  },
  data() {
    return {
      loading: true,
      eventName: '',
      showEventDetail: false,
      currEvent: {},
      showList: [],
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 20, 50, 100],
        currPage: 1,
        dataList: []
      }
    }
  },
  watch: {
    eventName() {
      this.getShowList()
    }
  },
  created() {
    this.getEventList().then(() => {

    })
  },
  methods: {
    t,
    getEventList() {
      this.loading = true
      return getEventList({ }).then(res => {
        this.pageInfo.total = res.body.length
        this.pageInfo.dataList = res.body
        this.loading = false
        this.getShowList()
      }).catch(() => {
        this.loading = false
      })
    },
    getShowList() {
      if (this.eventName) {
        this.showList = this.pageInfo.dataList.filter(item => {
          return item.eventName.toUpperCase().includes(this.eventName.toUpperCase())
        })
      } else {
        this.showList = Array.from(this.pageInfo.dataList)
      }
    },
    addHandler() {
      this.showEventDetail = true
      this.currEvent = {}
    },
    editHandler(row) {
      this.showEventDetail = true
      this.currEvent = row
    },
    removeHandler({ $index, row }) {
      notice.confirm(this.t('tip.confirmRemove'), () => {
        this.loading = true
        return deleteEvent({
          eventName: row.eventName
        }).then(res => {
          notice.success(this.t('tip.removeSuccess'))
          this.pageInfo.dataList.splice($index, 1)
          this.getShowList()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    successHandler(res) {
      this.showEventDetail = false
      notice.success(this.t('tip.saveSuccess'), () => {
        this.getEventList()
      })
    },
    cancelHandler() {
      this.showEventDetail = false
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
