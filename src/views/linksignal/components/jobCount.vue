<template>
  <div class="jobCountClass">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in ((eventObject['eqEventList']||[])[0]||{}).eventList" :key="index" :label="item.name" :name="item.name">
        <div style="margin-left:20px;">
          <el-button v-show="detailData.type==='upstreamlinksignal'&&item.name.search('SendOut') !== -1" type="primary" @click="copyHandler">Copy</el-button>
          <el-button v-show="detailData.type==='upstreamlinksignal'?item.name.search('SendOut') !== -1:item.name.search('Receive') !== -1" type="primary" @click="sendHandler">Send</el-button>
        </div>
        <el-row :gutter="20">
          <el-form :disabled="detailData.type==='upstreamlinksignal'?item.name.search('Receive') !== -1:item.name.search('SendOut') !== -1" label-width="250px">
            <template v-for="(item,index) in (localBlock.eventBlock||{}).items||[]">
              <el-col :md="12" :key="index" style="height:45px;">
                <div v-if="item.constantItems" :key="index">
                  <component :is="'input-select'" :key="index" :data="item"/>
                </div>
                <div v-else :key="index">
                  <component :key="index" :is="item.type" :data="item"/>
                </div>
              </el-col>
            </template>
          </el-form>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { getGraphidJobData, updateJobDataValue, getGraphidSendOutJobData } from '@/api/linksignal/index'
import components from '@/views/plcGraphicTools/components/property'
import { t } from '@/utils'
export default {
  name: 'JobCount',
  components: { ...components },
  props: {
    detailData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: '',
      eventObject: {},
      localBlock: {}
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.getGraphidJobData()
    })
  },
  methods: {
    t,
    copyHandler() {
      return getGraphidSendOutJobData({
        shop: this.detailData.shop,
        lineName: this.detailData.lineId,
        localNo: this.detailData.localNo,
        downLocal: this.detailData.downLocal,
        name: this.detailData.name
      }).then(res => {
        if ((((((res.body.eqEventList || [])[0] || {}).eventList || [])[0] || {}).eventBlock || {}).items) {
          Object.assign(this.localBlock.eventBlock, { items: res.body.eqEventList[0].eventList[0].eventBlock.items })
        } else {
          this.$message({
            message: 'Receive JobData is NULL',
            type: 'error'
          })
        }
      })
    },
    getGraphidJobData() {
      return getGraphidJobData({
        shop: this.detailData.shop,
        lineName: this.detailData.lineId,
        localNo: this.detailData.localNo,
        downLocal: this.detailData.downLocal,
        name: this.detailData.name
      }).then(res => {
        this.eventObject = res.body || {}
        this.activeName = (this.$lodash.head(this.eventObject.eqEventList[0].eventList) || []).name
        this.localBlock = Object.assign({ lineId: this.detailData.lineId, eqpName: this.detailData.localNo }, this.localBlock, res.body.eqEventList[0].eventList[0])
        if (this.detailData.type === 'upstreamlinksignal') {
          this.localBlock.eventBlock.items.forEach(item => {
            switch (item.name) {
              case 'ProductNo':
                item.value = 1
                break
              case 'SamplingSlotFlag':
                item.value = '1'
                break
              case 'OXRInformationRequestFlag':
                item.value = '1'
                break
              case 'CIMMode':
                item.value = '1'
                break
              case 'JobJudge':
                item.value = '1'
                break
              case 'JobGrade':
                item.value = 'OK'
                break
              case 'JobType':
                item.value = '1'
                break
              case 'CSTOperationMode':
                item.value = '1'
                break
            }
          })
        }
      })
    },
    sendHandler() {
      const temp = []
      this.localBlock.eventBlock.items.forEach(item => {
        temp.push({
          privateName: item.name,
          strValue: item.value
        })
      })
      return updateJobDataValue({
        lineName: this.localBlock.lineId,
        isEqSimulator: '0',
        plcBlockBean: {
          eqpNo: this.activeName.search('Receive') !== -1 ? this.detailData.downLocal : this.detailData.localNo,
          blocks: [
            {
              prefix: this.localBlock.eventBlock.prefix,
              privateName: this.localBlock.eventBlock.name,
              privateEQPName: this.localBlock.eqpName,
              itemCollection: temp
            }
          ]
        }
      }).then(res => {
        this.$message({
          message: res.result.message,
          type: 'success'
        })
        this.$emit('successEvent')
      })
    },
    handleClick(tab) {
      this.activeName = tab.label
      this.localBlock = Object.assign({ lineId: this.detailData.lineId, eqpName: this.detailData.localNo }, (((this.eventObject.eqEventList || [])[0] || {}).eventList || []).find(({ name }) => { return name === this.activeName }))
    }
  }
}
</script>
<style lang="scss">
.jobCountClass {
  padding: 10px 10px;
  margin-top: -10px;
  margin-left: 10px;

  .el-input,
  .el-input-number,
  .el-select {
    width: 100%;
  }
}
</style>
