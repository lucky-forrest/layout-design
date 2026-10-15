<template>
  <div class="app-container bcWorkflowPage">
    <el-card body-style="padding:10px">
      <div slot="header">
        <div class="filter-container">
          <shop-line-filter @changeEvent="changeHandler" />
        </div>
      </div>
      <iframe
        ref="iframeBCWorkflow"
        :src="serviceAddress"
        class="iframe"
        width="100%"
        frameborder="no"
        marginwidth="0"
        marginheight="0"
        allowtransparency="yes"
        style="height:calc(100vh - 220px);overflow-y:auto"/>
    </el-card>
  </div>
</template>
<script>
import ShopLineFilter from '@/components/ShopLineFilter'
import { getAllLineList } from '@/api/dashboard'
import NoData from '@/components/Nodata'
import { t, nativeAjax } from '@/utils'

export default {
  name: 'BcWorkflow',
  components: {
    ShopLineFilter,
    NoData
  },
  data() {
    return {
      serviceAddress: '',
      filter: {},
      lineList: [],
      currentLine: {}
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
    submitLogin() {
      this.$refs['bcLoginForm'].submit()
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      if (this.filter.lineId) {
        this.currentLine = this.lineList.find(({ lineId }) => lineId === this.filter.lineId)
        this.currentLine = this.lineList.find(item => {
          return item.lineId === this.currentLineId
        }) || {}
        const currentThis = this
        nativeAjax({
          url: `http://${this.currentLine.ip}:8080/activiti-explorer/ui/1/loginHandler`,
          data: { username: 'kermit', password: 'kermit' },
          currentThis,
          success(a, vm) {
            vm.serviceAddress = `http://${this.currentLine.ip}:8080/activiti-explorer`
          },
          error() {
            console.log('Service is unused !')
          }
        })
      } else {
        this.workflowList.splice(0, this.workflowList.length)
      }
    }
  }
}

</script>
<style lang="scss">
   .bcWorkflowPage {
    .el-card__header{
      padding:10px 10px 0 10px;
    }
    .el-select,
    .el-input {
      width: 100%;
    }
  }
</style>
