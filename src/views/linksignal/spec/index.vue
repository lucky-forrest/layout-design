<template>
  <div class="app-container linksignal">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :md="4">
          <el-select v-model="flowName" :placeholder="t('tip.pleaseSelectFlowName')" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in specList" :key="index" :label="item.flowName" :value="item.flowName" />
          </el-select>
        </el-col>
        <el-col :md="4">
          <el-select v-model="upStreamMultiple" :collapse-tags="true" :placeholder="t('tip.pleaseSelectUpStream')" multiple clearable filterable class="filter-item">
            <el-option v-for="(item,index) in upStreamList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-col>
        <el-col :md="4">
          <el-select v-model="downStreamMultiple" :collapse-tags="true" :placeholder="t('tip.pleaseSelectDownStream')" multiple clearable filterable class="filter-item">
            <el-option v-for="(item,index) in downStreamList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-col>
        <el-col :md="12">
          <el-button :disabled="!flowName" :loading="loading" type="primary" icon="el-icon-search" class="filter-item" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" :loading="loading" type="primary" class="filter-item" @click="addHandler">
            <svg-icon :icon-class="'add'"/>&nbsp;
            {{ t('btn.add') }}</el-button>
          <el-button :disabled="!flowName" :loading="loading" type="primary" icon="el-icon-edit" class="filter-item" @click="updateHandler">{{ t('btn.update') }}</el-button>
          <el-button v-authorize="'remove'" :disabled="!flowName" :loading="loading" icon="el-icon-delete" type="danger" class="filter-item" @click="delHandler">
            {{ t('btn.remove') }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <transition name="el-zoom-in-center">
      <el-row v-if="upstreamLinkSignal.length>0" >
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <div :style="linksignalforUpStreamHeight" class="table-container">
                <table class="custom-table">
                  <tr v-for="(item,index) in upstreamLinkSignal" :key="index">
                    <th> {{ item.itemName }} </th>
                  </tr>
                </table>
              </div>
            </el-col>
            <el-col :span="18">
              <div v-loading="loading" id="linksignalforSendOutChart" :style="linksignalforUpStreamHeight" style="width:auto;" />
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-row>
            <el-col :span="6">
              <div :style="linksignalforDownStreamHeight" class="table-container">
                <table class="custom-table">
                  <tr v-for="(item,index) in downstreamLinkSignal" :key="index">
                    <th> {{ item.itemName }} </th>
                  </tr>
                </table>
              </div>
            </el-col>
            <el-col :span="18">
              <div v-loading="loading" id="linksignalforReceiveChart" :style="linksignalforDownStreamHeight" style="width:auto;" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <no-data v-else/>
    </transition>
    <el-dialog
      :visible.sync="showSettingForm"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      top="5vh"
      width="800px"
      title="Linksignal Setting From">
      <linksignal-setting v-if="showSettingForm" :detail-data="detailData" :action-type="actionType" @successEvent="successHandler"/>
    </el-dialog>
  </div>
</template>
<script>
import LinksignalSetting from '@/views/linksignal/components/linksignalSetting'
import NoData from '@/components/Nodata'
import notice from '@/utils/notice'
import {
  getLiksignalSpec,
  getLinkSignalFlowNameList,
  deleteLinkSignalByFlowName,
  getLinkSignalTempByFlowName
} from '@/api/linksignal/linksignalSpec'
const echarts = require('echarts')
import { t } from '@/utils'
export default {
  name: 'LinksignalSpec',
  components: {
    LinksignalSetting,
    NoData
  },
  data() {
    return {
      loading: false,
      showSettingForm: false,
      detailData: {},
      upStreamList: [],
      downStreamList: [],
      upStreamMultiple: [],
      downStreamMultiple: [],
      actionType: 'add',
      upstreamNum: 0,
      downstreamNum: 0,
      flowName: '',
      upStreamName: '',
      downStreamName: '',
      upstreamLinksignalType: '',
      downstreamLinksignalType: '',
      linksignal: [],
      upstreamLinkSignal: [],
      downstreamLinkSignal: [],
      yAxisAllDataList: [
        'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off',
        'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off',
        'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off',
        'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off',
        'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off',
        'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off',
        'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off',
        'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on'
      ],
      y1AxisDataList: [],
      y2AxisDataList: [],
      linksignalforDownStreamHeight: { 'height': '0px' },
      linksignalforUpStreamHeight: { 'height': '0px' },
      specList: [],
      sendOutXAxisDataList: [],
      sendOutSeriesDataList: [],
      sendOutY2AxisDataList: [],
      receiveXAxisDataList: [],
      receiveSeriesDataList: [],
      receiveY2AxisDataList: [],
      linkSignalforUpstream: {},
      linkSignalforDownstream: {},
      linksignalforSendOutChart: null,
      linksignalforReceiveChart: null,
      limit: 50
    }
  },
  watch: {
    flowName(flowName) {
      if (this.flowName) {
        this.getLinkSignalTempByFlowName()
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.getLinkSignalFlowNameList()
    })
  },
  methods: {
    t,
    getLinkSignalTempByFlowName() {
      this.loading = true
      return getLinkSignalTempByFlowName({ flowName: this.flowName }).then(res => {
        this.loading = false
        this.upStreamList = this.upStreamMultiple = res.body.upStreamList
        this.downStreamList = this.downStreamMultiple = res.body.downStreamList
      }).catch(() => {
        this.loading = false
      })
    },
    updateHandler() {
      if (this.upstreamLinkSignal.length === 0 && this.downstreamLinkSignal.length === 0) {
        this.$message({
          message: 'Please Click Search!',
          type: 'error'
        })
      } else {
        this.actionType = 'update'
        this.detailData = Object.assign({}, this.detailData, {
          flowName: this.flowName,
          upStreamName: this.upStreamName,
          downStreamName: this.downStreamName
        })
        this.showSettingForm = true
      }
    },
    delHandler() {
      this.loading = true
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        return deleteLinkSignalByFlowName({
          flowName: this.flowName
        }).then(res => {
          notice.success(this.t('tip.removeSuccess'))
          this.loading = false
          this.flowName = ''
          this.getLinkSignalFlowNameList()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    getLinkSignalFlowNameList() {
      this.loading = true
      return getLinkSignalFlowNameList({
      }).then(res => {
        this.loading = false
        this.specList = res.body
      }).catch(() => {
        this.loading = false
      })
    },
    searchHandler() {
      this.loading = true
      this.sendOutY2AxisDataList = []
      this.receiveY2AxisDataList = []
      return getLiksignalSpec({
        flowName: this.flowName,
        upStreamList: this.upStreamMultiple,
        downStreamList: this.downStreamMultiple
      }).then(res => {
        this.linksignal = res.body.itemBeans
        this.upstreamLinkSignal = res.body.linkSignalSpecList.find(item => item.templateName.substr(0, 8) === 'Upstream').list.map(item => {
          this.upStreamName = item.templateName
          this.sendOutY2AxisDataList.push({
            value: item.itemName
          })
          return Object.assign({}, item, {
            type: 'line',
            step: 'end',
            color: '#000',
            data: []
          })
        })
        this.downstreamLinkSignal = res.body.linkSignalSpecList.find(item => item.templateName.substr(0, 10) === 'Downstream').list.map(item => {
          this.downStreamName = item.templateName
          this.receiveY2AxisDataList.push({
            value: item.itemName
          })
          return Object.assign({}, item, {
            type: 'line',
            step: 'end',
            color: '#000',
            data: []
          })
        })
        this.y1AxisDataList = this.yAxisAllDataList.slice(0, this.upstreamLinkSignal.length * 2 + 1)
        this.y2AxisDataList = this.yAxisAllDataList.slice(0, this.downstreamLinkSignal.length * 2 + 1)
        this.linksignalforUpStreamHeight = { 'height': `${this.upstreamLinkSignal.length * 47 + 80}px` }
        this.linksignalforDownStreamHeight = { 'height': `${this.downstreamLinkSignal.length * 47 + 80}px` }
        this.initHandler()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    initHandler() {
      this.loading = true
      // 界面数据初始化
      this.upstreamNum = 0
      this.downstreamNum = 0
      // 重新绘制sendOut Chart
      if (this.linksignalforSendOutChart) {
        this.linksignalforSendOutChart.dispose()
        this.sendOutXAxisDataList.splice(0, this.sendOutXAxisDataList.length)
        this.sendOutSeriesDataList.splice(0, this.sendOutSeriesDataList.length)
        this.upstreamLinkSignal.map(item => {
          item.data.splice(0, item.data.length)
          return item
        })
      }

      // 重新绘制receive Chart
      if (this.linksignalforReceiveChart) {
        this.linksignalforReceiveChart.dispose()
        this.receiveXAxisDataList.splice(0, this.receiveXAxisDataList.length)
        this.receiveSeriesDataList.splice(0, this.receiveSeriesDataList.length)
        this.downstreamLinkSignal.map(item => {
          item.data.splice(0, item.data.length)
          return item
        })
      }
      // 重置
      this.linksignalforSendOutChart = echarts.init(document.getElementById('linksignalforSendOutChart'))
      this.linksignalforReceiveChart = echarts.init(document.getElementById('linksignalforReceiveChart'))
      this.updateChartData().then(() => {
        this.updateSendOutChart()
        this.updateReceiveChart()
        this.loading = false
      })
      this.loading = false
    },
    addHandler() {
      this.actionType = 'add'
      this.showSettingForm = true
    },
    updateChartData() {
      return new Promise((resolve, reject) => {
        if (this.linksignal) {
          this.linksignal.map(curr => {
            ++this.upstreamNum
            const sendOutArray = Array.from(curr.upStreamSignal)
            this.upstreamLinkSignal = this.upstreamLinkSignal.map((item, index) => {
              const tempValue = index * 2 + 1 - sendOutArray[index]
              if (item.data.length <= this.limit) {
                item.data.push(tempValue)
              } else {
                item.data.shift()
                item.data.push(tempValue)
              }
              return item
            })
            if (this.sendOutXAxisDataList.length <= this.limit) {
              this.sendOutXAxisDataList.push(this.upstreamNum)
            } else {
              this.sendOutXAxisDataList.shift()
              this.sendOutXAxisDataList.push(this.upstreamNum)
            }
            this.sendOutSeriesDataList = Array.from(this.upstreamLinkSignal)
          })

          this.linksignal.map(curr => {
            ++this.downstreamNum
            const reciveArray = Array.from(curr.downStreamSignal)
            this.downstreamLinkSignal = this.downstreamLinkSignal.map((item, index) => {
              const tempValue = index * 2 + 1 - reciveArray[index]

              if (item.data.length <= this.limit) {
                item.data.push(tempValue)
              } else {
                item.data.shift()
                item.data.push(tempValue)
              }
              return item
            })
            if (this.receiveXAxisDataList.length <= this.limit) {
              this.receiveXAxisDataList.push(this.downstreamNum)
            } else {
              this.receiveXAxisDataList.shift()
              this.receiveXAxisDataList.push(this.downstreamNum)
            }
            this.receiveSeriesDataList = Array.from(this.downstreamLinkSignal)
          })
        }
        resolve(true)
      })
    },
    updateSendOutChart() {
      this.linksignalforSendOutChart.setOption({
        title: {
          text: 'UpstreamLinkSignal'
        },
        grid: {
          show: true,
          left: '0px',
          top: '40px',
          right: '3%',
          bottom: '0px',
          containLabel: true
        },
        tooltip: {
          show: false,
          trigger: 'axis',
          formatter: function(params) {
            return params.reduce((template, item, index) => {
              return `${template}</br>${item.marker} ${+item.value % 2 === 0 ? 'on' : 'off'}`
            }, '')
          }
        },
        xAxis: {
          position: 'top',
          type: 'category',
          data: this.sendOutXAxisDataList
        },
        yAxis: [{
          type: 'category',
          inverse: true,
          position: 'right',
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: false,
            interval: 1,
            lineStyle: {
              color: ['red', 'green'],
              type: 'dashed'
            }
          },
          data: this.y1AxisDataList
        },
        {
          type: 'category',
          inverse: true,
          boundaryGap: false,
          axisLine: {
            show: true
          },
          axisTick: {
            show: false,
            interval: 0
          },
          axisLabel: {
            show: false,
            interval: 0,
            inside: true
          },
          data: this.sendOutY2AxisDataList
        }
        ],
        series: this.sendOutSeriesDataList
      })
      this.linksignalforSendOutChart.resize()
    },
    updateReceiveChart() {
      this.linksignalforReceiveChart.setOption({
        title: {
          text: 'DownstreamLinkSignal'
        },
        grid: {
          show: true,
          left: '0px',
          top: '40px',
          right: '3%',
          bottom: '0px',
          containLabel: true
        },
        tooltip: {
          show: false,
          trigger: 'axis',
          formatter: function(params) {
            return params.reduce((template, item, index) => {
              return `${template}</br>${item.marker} ${+item.value % 2 === 0 ? 'on' : 'off'}`
            }, '')
          }
        },
        xAxis: {
          position: 'top',
          type: 'category',
          data: this.receiveXAxisDataList
        },
        yAxis: [{
          type: 'category',
          position: 'right',
          inverse: true,
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: false,
            interval: 1,
            lineStyle: {
              color: ['red', 'green'],
              type: 'dashed'
            }
          },
          data: this.y2AxisDataList
        },
        {
          type: 'category',
          inverse: false,
          boundaryGap: false,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false,
            interval: 0
          },
          axisLabel: {
            show: false,
            interval: 0,
            inside: false
          },
          data: this.receiveY2AxisDataList
        }
        ],
        series: this.receiveSeriesDataList
      })
      this.linksignalforReceiveChart.resize()
    },
    successHandler(title, res) {
      this.showSettingForm = false
      this.$router.go(0)
      this.upstreamNum = 0
      this.downstreamNum = 0
      this.getLinkSignalFlowNameList()
    }
  }
}
</script>
<style lang="scss">
  .linksignal {

    .el-input,
    .el-select {
      width: 100%;
    }

    .table-container {
      padding-top: 60px;

      .custom-table {
        width:100%;
        height: 100%;
        border-collapse: collapse;
        border: 1px solid #e3e3e3;
        overflow: hidden;

        th,
        td {
          border: 1px solid #e3e3e3;
          padding: 0 10px;
          text-align: center;
        }

        th {
          width: 60%;
          text-align: right !important;
        }
      }
    }
  }
</style>
