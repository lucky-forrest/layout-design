<template>
  <div class="chart-wrapper">
    <div class="chart-header">
      <span class="title">{{ `${data.monitorType}: ${data.linksignalName} - LinkSignal` }}</span>
      <div class="extra">
        <el-button
          v-if="data.monitorType==='Upstream'"
          :disabled="loading||btnDisabled"
          type="primary"
          @click="showDetailHandler('upstreamlinksignal')"
        >
          {{ t('btn.writeJobCount') }}
        </el-button>
        <el-button
          v-else
          :disabled="loading||btnDisabled"
          type="primary"
          @click="showDetailHandler('downstreamlinksignal')"
        >
          {{ t('btn.readDetail') }}
        </el-button>
      </div>
    </div>
    <div class="chart-body">
      <div :id="`step-chart-${chartId}`" :style="{width:width,height:height}" class="left"/>
      <div :style="{height:`${Number(height.replace(/px/,''))-30}px`}" class="right" >
        <div v-for="(item,index) in data.chartSeriesData" :key="index" class="step-item">
          <el-switch
            :disabled="loading || btnDisabled"
            v-model="item.value"
            :active-value="1"
            :inactive-value="0"
            :active-color="'green'"
            :inactive-color="'red'"
            @change="sendLinksignalHandler"
          />&nbsp;{{ item.itemName }}
        </div>
      </div>
    </div>
    <el-dialog
      :visible.sync="showJobCountDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1200px"
      top="5vh"
      title="Job Count Detail" >
      <JobCount
        v-if="showJobCountDetail"
        :detail-data="rowData"
        @successEvent="showJobCountDetail=false" />
    </el-dialog>
  </div>
</template>
<script>
import JobCount from '@/views/linksignal/components/jobCount'
import { sendLinksignal } from '@/api/linksignal'
const echarts = require('echarts')
import { mapState } from 'vuex'
import { t } from '@/utils'
export default {
  name: 'StepChart',
  components: {
    JobCount
  },
  props: {
    chartId: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default() {
        return {
          chartTitle: null,
          chartXAxisData: [],
          chartSeriesData: []
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      width: '100%',
      height: '408px',
      yAxis: [],
      rowData: {},
      showJobCountDetail: false
    }
  },
  computed: {
    ...mapState({
      sidebarOpened: state => state.app.sidebar.opened
    }),
    btnDisabled() {
      return this.data.linksignalName.replace(/_\d/g, '') !== this.data.monitorEquipmentNo
    }
  },
  watch: {
    sidebarOpened() {
      this.fixChartWidth()
    },
    'data.chartXAxisData'() {
      this.setChartData(this.data)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  methods: {
    t,
    showDetailHandler(type) {
      console.log(this.data)
      this.rowData = Object.assign(this.rowData,
        {
          shop: this.data.shop,
          lineId: this.data.lineId,
          type: type,
          name: this.data.linksignalType,
          localNo: this.data.upEquipmentNo,
          downLocal: this.data.downEquipmentNo
        })
      this.showJobCountDetail = true
    },
    fixChartWidth() {
      this.width = `${document.body.offsetWidth - (this.sidebarOpened ? 180 : 40)}px`
      setTimeout(() => {
        this.myChart && this.myChart.resize({ silent: true })
      }, 200)
    },
    initChart() {
      this.yAxis.splice(0, this.yAxis.length)
      if (this.data && Array.isArray(this.data.chartSeriesData)) {
        const itmeTotal = this.data.chartSeriesData.length
        this.height = `${itmeTotal * 51}px`
        for (let index = 0; index < itmeTotal; index++) {
          this.yAxis.push(...['', 'on', 'off'])
        }
        this.yAxis.push(...['', 'on'])
      }
      this.myChart = echarts.init(document.getElementById(`step-chart-${this.chartId}`))
      this.setChartData(this.data)
      // 修复图表容器宽度，使其自适应
      window.addEventListener('resize', () => {
        this.fixChartWidth()
      })
      this.fixChartWidth()
    },
    setChartData({ chartXAxisData = [], chartSeriesData = [] }) {
      this.myChart.setOption({
        grid: {
          top: '0',
          left: '3%',
          right: '0',
          bottom: '10',
          containLabel: true
        },
        tooltip: {
          show: false,
          trigger: 'axis',
          formatter: function(params) {
            return params.reduce((template, item, index) => {
              return `${template}</br>${item.marker} ${+item.value % 3 === 1 ? 'on' : 'off'}`
            }, '')
          }
        },
        xAxis: [
          {
            position: 'top',
            type: 'category',
            data: chartXAxisData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [{
          type: 'category',
          inverse: true,
          boundaryGap: false,
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: true,
            interval: 0,
            lineStyle: {
              color: [
                'white', 'green', 'red'
              ],
              type: 'dashed'
            }
          },
          data: this.yAxis
        }],
        series: chartSeriesData.map(item => item.chartData)
      })
    },
    sendLinksignalHandler() {
      const strValue = this.data.chartSeriesData.map(({ value }) => value).join('')
      const lineId = this.data.lineId
      const monitorEquipmentNo = `${lineId}_${this.data.monitorEquipmentNo}`
      const blockName = this.data.blockName
      const itemEventId = this.data.itemEventId
      this.loading = true
      return sendLinksignal({
        lineName: lineId,
        time: 0,
        itemName: '',
        plcBlockBean: {
          eqpNo: monitorEquipmentNo,
          blocks: [{
            privateAction: 'WRITE',
            deviceCode: 'BL',
            eventid: blockName,
            fullName: '',
            prefix: '',
            privateDeviceNo: '01',
            itemCollection: [{
              strValue: strValue,
              privateEventON: false,
              itemType: 'B',
              eventID: itemEventId,
              privateName: itemEventId,
              offset: '0',
              points: '2'
            }],
            wMonitor: false,
            privateStartAddress: '',
            privateName: blockName,
            privateEQPName: monitorEquipmentNo,
            privatePoints: 32
          }]
        }}).then(res => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.chart-wrapper{
  border:1px solid #e3e3e3;
  border-radius: 5px;
  margin-bottom:10px;
  .chart-header{
    height:40px;
    line-height: 40px;
    padding:0 10px;
    display: flex;
    flex-flow: row nowrap;
    color:#000;
    background: rgba(#e3e3e3,0.28);
    border-bottom: 1px solid #e3e3e3;
    .title{
      flex:1;
    }
    .extra{
      width:auto;
    }
  }
  .chart-body{
    max-height:calc(100vh - 290px);
    padding-top:10px;
    overflow-y: auto;
    display: flex;
    flex-flow:row nowrap;
    .left{
       flex:1;
       padding-left:10px;
     }
    .right{
      width:200px;
      margin-top:20px;
      padding-top:13px;
      display:flex;
      flex-flow: column nowrap;
      .step-item{
        flex:1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

</style>
