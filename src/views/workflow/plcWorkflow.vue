<template>
  <div class="app-container workflowPage">
    <el-card body-style="padding:10px;" style="height:calc(100vh - 130px);">
      <div slot="header" class="filter-container">
        <shop-line-filter @changeEvent="changeHandler" >
          <el-col :lg="6" :md="8" :sm="12">
            <el-form-item label="Filter">
              <el-input v-model="filterText" placeholder="By Name Filter" clearable>
                <span slot="append">Filter</span>
              </el-input>
            </el-form-item>
          </el-col>
        </shop-line-filter>
      </div>
      <div v-if="Array.isArray(workflowList)&&workflowList.length>0">
        <el-tabs v-loading.body="loading" v-model="currentTab" class="monitorPage" tab-position="left">
          <el-tab-pane v-for="(item,pIndex) in workflowList" :label="item.eqpNo" :name="item.eqpNo" :key="pIndex">
            <el-table
              v-mousewheelX="'is-scroll-left'"
              :data="item.workflows.filter(item => { return !item.isHidden})"
              :max-height="560"
              border>
              <el-table-column type="index">#</el-table-column>
              <el-table-column min-width="200px" label="Name" prop="name" />
              <el-table-column min-width="600px" label="Steps">
                <template slot-scope="curr">
                  <el-steps
                    :active="$lodash.map(curr.row.steps,'stepItemName').indexOf(curr.row.currentStep)+1"
                    :space="150"
                    align-center
                    finish-status="success">
                    <el-step v-for="(item, stepIndex) in curr.row.steps" :title="`step${stepIndex+1}`" :key="stepIndex">
                      <div slot="description">
                        {{ item.stepItemName }}
                        <div v-show="item.timeOut > 0" style="font-size:18px;">
                        <svg-icon :icon-class="'ios-time-outline'" /> {{ item.timeOut }}</div>
                      </div>
                    </el-step>
                  </el-steps>
                </template>
              </el-table-column>
              <el-table-column :label="t('column.operate')" align="center" min-width="120px">
                <template slot-scope="curr">
                  <el-button
                    :loading="loading"
                    type="primary"
                    icon="el-icon-refresh"
                    @click="getEqpWorkflow(curr.row.name)">
                    {{ t('btn.refresh') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <NoData v-else/>
    </el-card>
  </div>
</template>
<script>
import { getAllEqpWorkflow, getEqpWorkflow } from '@/api/workflow'
import ShopLineFilter from '@/components/ShopLineFilter'
import { getAllLineList } from '@/api/dashboard'
import NoData from '@/components/Nodata'
import { t } from '@/utils'
export default {
  name: 'PlcWorkflow',
  components: {
    ShopLineFilter,
    NoData
  },
  data() {
    return {
      loading: false,
      filterText: '',
      filter: {},
      lineList: [],
      currentLine: {},
      currentTab: '',
      workflowList: [],
      serviceAddress: ''
    }
  },
  watch: {
    filterText() {
      if (this.filterText) {
        (this.workflowList.find(item => { return item.eqpNo === this.currentTab }).workflows || []).map(item => {
          item.isHidden = !item.name.toUpperCase().startsWith(this.filterText.toUpperCase())
          return item
        })
      } else {
        (this.workflowList.find(item => { return item.eqpNo === this.currentTab }).workflows || []).map(item => {
          item.isHidden = false
          return item
        })
      }
    }
  },
  created() {
    this.getAllLineList()
  },
  methods: {
    t,
    getAllLineList() {
      return getAllLineList({ condition: {}, pageNo: 1, pageSize: Number.MAX_VALUE }).then(res => {
        this.lineList = res.body.rows
      })
    },
    getAllEqpWorkflow() {
      this.loading = true
      this.serviceAddress = `http://${this.currentLine.ip}:${this.currentLine.port}`
      return getAllEqpWorkflow(this.serviceAddress, {}).then(res => {
        this.workflowList = res.body || []
        this.currentTab = (this.$lodash.first(this.workflowList) || {}).eqpNo
        this.loading = false
      }).catch(() => {
        this.loading = false
        this.workflowList.splice(0, this.workflowList.length)
      })
    },
    getEqpWorkflow(workFlowName) {
      this.loading = true
      return getEqpWorkflow(this.serviceAddress, {
        lineId: this.currentLineId,
        eqpId: this.currentTab,
        workFlowName
      }).then(res => {
        ((this.workflowList.find(item => { return item.eqpNo === this.currentTab }).workflows || []).find(item => { return item.name === res.body.name })).currentStep = res.body.currentStep
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      if (this.filter.lineId) {
        this.currentLine = this.lineList.find(({ lineId }) => lineId === this.filter.lineId)
        this.getAllEqpWorkflow()
      } else {
        this.workflowList.splice(0, this.workflowList.length)
      }
    }
  }
}

</script>
<style lang="scss">
  .workflowPage {
    .el-card__header{
      padding:10px 10px 0 10px;
    }
    .el-select,
    .el-input {
      width: 100%;
    }
  }
</style>
