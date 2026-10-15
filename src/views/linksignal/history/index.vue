<template>
  <div class="app-container linksignal">
    <div class="filter-container">
      <el-row :gutter="21">
        <shop-line-filter @changeEvent="changeHandler" >
          <template slot="prefix">
            <el-col :lg="6" :md="8" :sm="12">
              <el-form-item label="StartTime">
                <el-date-picker
                  v-model="startTime"
                  :placeholder="t('column.startTime')"
                  :picker-options="pickerOptions"
                  type="date"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="filter-item"/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="8" :sm="12">
              <el-form-item label="EndTime">
                <el-date-picker
                  v-model="endTime"
                  :placeholder="t('column.endTime')"
                  :picker-options="pickerOptions"
                  type="date"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  class="filter-item"/>
              </el-form-item>
            </el-col>
          </template>
          <el-col :lg="6" :md="8" :sm="12">
            <el-form-item label="FlowName">
              <el-select v-model="flowName" :placeholder="t('tip.pleaseSelectFlowName')" clearable filterable >
                <el-option v-for="(item,index) in flowNameList" :key="index" :label="item.flowName" :value="item.flowName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12">
            <el-form-item label="UpStream">
              <el-select v-model="upStreamMultiple" :collapse-tags="true" :placeholder="t('tip.pleaseSelectUpStream')" multiple clearable filterable class="filter-item">
                <el-option v-for="(item,index) in upStreamList" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12">
            <el-form-item label="DwStream">
              <el-select v-model="downStreamMultiple" :collapse-tags="true" :placeholder="t('tip.pleaseSelectDownStream')" multiple clearable filterable class="filter-item">
                <el-option v-for="(item,index) in downStreamList" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="8" :sm="12">
            <el-form-item label="EqpName">
              <el-select v-model="eqpName" :placeholder="t('tip.pleaseSelectEqpName')" filterable clearable class="filter-item">
                <el-option v-for="(item,index) in eqpNameList" :value="item" :key="index" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="24" :md="8" :sm="24" style="text-align:right;">
            <el-button :loading="loading" :disabled="!flowName" type="primary" icon="el-icon-search" class="filter-item" @click="getLinkSignalLogByTime">{{ t('btn.search') }}
            </el-button>
          </el-col>
        </shop-line-filter>
      </el-row>
    </div>
    <transition name="el-zoom-in-center">
      <el-row v-if="upstreamLinkSignal.length>0" :gutter="20">
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
  </div>
</template>

<script>
import { getLinkSignalFlowNameList, getLinkSignalTempByFlowName } from '@/api/linksignal/linksignalSpec'
import ShopLineFilter from '@/components/ShopLineFilter'
import { getLinkSignalLogByTime } from '@/api/linksignal'
import resize from '@/views/linksignal/mixins/resize'
import NoData from '@/components/Nodata'
import { pickerOptions } from '@/config'
import { t } from '@/utils'
import dayjs from 'dayjs'
const echarts = require('echarts')

export default {
  name: 'LinksignalHistory',
  components: {
    ShopLineFilter,
    NoData
  },
  mixins: [resize],
  data() {
    return {
      loading: false,
      showChart: false,
      UpFlag: false,
      DownFlag: false,
      bitNum: 0,
      startTime: '',
      endTime: '',
      flowName: '',
      flowNameList: [],
      specList: [],
      filter: {},
      linksignal: [],
      upStreamMultiple: [],
      downStreamMultiple: [],
      upStreamList: [],
      downStreamList: [],
      eqpName: '',
      upstreamLinkSignalName: '',
      downstreamLinkSignalName: '',
      eqpNameList: [],
      downstreamLinkSignal: [],
      upstreamLinkSignal: [],
      pickerOptions: pickerOptions,
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
      linkSignalforSendOut: {},
      linkSignalforReceive: {},
      sendOutXAxisDataList: [],
      sendOutSeriesDataList: [],
      sendOutY2AxisDataList: [],
      receiveXAxisDataList: [],
      receiveSeriesDataList: [],
      receiveY2AxisDataList: [],
      upstreamLinkSignalLogList: [],
      downstreamLinkSignalLogList: [],
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
    },
    'filter.lineId'() {
      if (this.filter.lineId) {
        this.getLinkSignalFlowNameList()
      }
    },
    eqpName() {
      if (this.eqpName !== '') {
        this.search()
      }
    }
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
    getLinkSignalFlowNameList() {
      this.loading = true
      return getLinkSignalFlowNameList({
        shopName: this.filter.shop,
        lineId: this.filter.lineId
      }).then(res => {
        this.loading = false
        this.flowNameList = res.body
      }).catch(() => {
        this.loading = false
      })
    },
    search() {
      this.showChart = false
      this.loading = true
      this.bitNum = 0
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
      this.linksignalforSendOutChart = echarts.init(document.getElementById('linksignalforSendOutChart'))
      this.linksignalforReceiveChart = echarts.init(document.getElementById('linksignalforReceiveChart'))
      if (this.eqpName) {
        this.loading = true
        this.updateChartData().then(() => {
          this.updateReceiveChart()
          this.updateSendOutChart()
          this.loading = false
        })
        this.showChart = true
      }
      this.loading = false
    },
    updateChartData() {
      return new Promise((resolve, reject) => {
        if (this.eqpName) {
          this.upstreamLinkSignalName = this.eqpName.split('To')[0]
          this.downstreamLinkSignalName = this.eqpName.split('To')[1]
          this.linksignal.find(({ eqpName }) => { return eqpName === this.eqpName }).itemBeans.map(item => {
            ++this.bitNum
            if (item.upStream && item.upStream.length !== 0) {
              const sendOutArray = item.upStream.map(curr => { return curr.logValue })
              this.upstreamLinkSignal = this.upstreamLinkSignal.map((temp, index) => {
                const tempValue = index * 2 + 1 - sendOutArray[index]
                if (item.upStream[index].flag) {
                  if (temp.data.length <= this.limit) {
                    temp.data.push({
                      value: tempValue,
                      symbolSize: 2
                    })
                  } else {
                    temp.data.shift()
                    temp.data.push({
                      value: tempValue,
                      symbolSize: 2
                    })
                  }
                  return temp
                } else {
                  if (temp.data.length <= this.limit) {
                    temp.data.push({
                      value: tempValue,
                      symbol: 'triangle',
                      symbolSize: 10,
                      itemStyle: { color: '#FF0000' }
                    })
                  } else {
                    temp.data.shift()
                    temp.data.push({
                      value: tempValue,
                      symbol: 'triangle',
                      symbolSize: 10,
                      itemStyle: { color: '#FF0000' }
                    })
                  }
                  return temp
                }
              })
              if (this.sendOutXAxisDataList.length <= this.limit) {
                this.sendOutXAxisDataList.push(item.time)
              } else {
                this.sendOutXAxisDataList.shift()
                this.sendOutXAxisDataList.push(item.time)
              }
              this.sendOutSeriesDataList = Array.from(this.upstreamLinkSignal)
            }
            if (item.downStream && item.downStream.length !== 0) {
              const reciveArray = item.downStream.map(curr => { return curr.logValue })
              this.downstreamLinkSignal = this.downstreamLinkSignal.map((temp, index) => {
                const tempValue = index * 2 + 1 - reciveArray[index]
                if (item.downStream[index].flag) {
                  if (temp.data.length <= this.limit) {
                    temp.data.push({
                      value: tempValue,
                      symbolSize: 2
                    })
                  } else {
                    temp.data.shift()
                    temp.data.push({
                      value: tempValue,
                      symbolSize: 2
                    })
                  }
                  return temp
                } else {
                  if (temp.data.length <= this.limit) {
                    temp.data.push({
                      value: tempValue,
                      symbol: 'triangle',
                      symbolSize: 10,
                      itemStyle: { color: '#FF0000' }
                    })
                  } else {
                    temp.data.shift()
                    temp.data.push({
                      value: tempValue,
                      symbol: 'triangle',
                      symbolSize: 10,
                      itemStyle: { color: '#FF0000' }
                    })
                  }
                  return temp
                }
              })

              if (this.receiveXAxisDataList.length <= this.limit) {
                this.receiveXAxisDataList.push(item.time)
              } else {
                this.receiveXAxisDataList.shift()
                this.receiveXAxisDataList.push(item.time)
              }
              this.receiveSeriesDataList = Array.from(this.downstreamLinkSignal)
            }
          })
        }
        resolve(true)
      })
    },
    getLinkSignalLogByTime() {
      if (this.flowName) {
        this.loading = true
        this.eqpName = ''
        this.sendOutY2AxisDataList = []
        this.receiveY2AxisDataList = []
        return getLinkSignalLogByTime({
          startTime: dayjs(this.startTime).format('YYYYMMDDHHmmss'),
          endTime: dayjs(this.endTime).format('YYYYMMDDHHmmss'),
          shopName: this.filter.shop,
          lineId: this.filter.lineId,
          flowName: this.flowName,
          upStreamList: this.upStreamMultiple,
          downStreamList: this.downStreamMultiple
        }).then(res => {
          this.loading = false
          this.linksignal = res.body.itemBeans
          this.eqpNameList = res.body.itemBeans.map(({ eqpName }) => { return eqpName })
          this.upstreamLinkSignal = res.body.linkSignalSpecList.find(item => item.templateName.substr(0, 8) === 'Upstream').list.map(item => {
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
          this.search()
        }).catch(() => {
          this.loading = false
        })
      }
    },
    updateSendOutChart() {
      this.linksignalforSendOutChart.setOption({
        title: {
          text: `UpstreamLinkSignal-${this.upstreamLinkSignalName}`
        },
        grid: {
          show: true,
          left: '0px',
          top: '50px',
          right: '3%',
          bottom: '0px',
          containLabel: true
        },
        tooltip: {
          show: true,
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
          position: 'right',
          type: 'category',
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
          // data: this.$lodash.range(0, 65)
          data: this.y1AxisDataList
        },
        {
          // name: 'linksiganlName',
          position: 'left',
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
            inside: false
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
          text: `DownstreamLinkSignal-${this.downstreamLinkSignalName}`
        },
        grid: {
          show: true,
          left: '0px',
          top: '50px',
          right: '3%',
          bottom: '0px',
          containLabel: true
        },
        tooltip: {
          show: true,
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
        yAxis: [
          {
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
          }, {
            // name: 'linksiganlName',
            type: 'category',
            position: 'left',
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
              inside: false
            },
            data: this.receiveY2AxisDataList
          }
        ],
        series: this.receiveSeriesDataList
      })
      this.linksignalforReceiveChart.resize()
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
    }
  }
}

</script>
<style lang="scss" scoped>
  .linksignal {

    .el-select,
    .el-input {
      width: 100%;
    }
  }

  .table-container {
    padding-top: 70px;

    .custom-table {
      width: 100%;
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

</style>
