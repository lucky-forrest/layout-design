<template>
  <div class="app-container linksignal-container">
    <div class="filter-container">
      <shop-line-filter @changeEvent="changeHandler" >
        <el-col :md="6" >
          <el-form-item label="UpStream">
            <el-popover placement="bottom-start" width="240" trigger="click" >
              <el-checkbox v-model="checkedForUP" size="mini">全选</el-checkbox>
              <hr style="border:1px solid #e3e3e3;">
              <el-checkbox-group v-if="upStreamList.length>0" v-model="upStreamMultiple">
                <el-checkbox
                  v-for="(item,index) in upStreamList"
                  :key="index"
                  :label="item"
                  class="custom-checkbox"/>
              </el-checkbox-group>
              <p v-else style="margin-top:10px;"> 暂无任何数据项</p>
              <el-input
                slot="reference"
                :value="`${(upStreamMultiple||[]).join(',')}`"
                :placeholder="t('tip.pleaseSelectUpStream')" />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :md="6">
          <el-form-item label="DownStream" >
            <el-popover placement="bottom-start" width="240" trigger="click" >
              <el-checkbox v-model="checkedForDown" size="mini">全选</el-checkbox>
              <hr style="border:1px solid #e3e3e3;">
              <el-checkbox-group v-if="downStreamList.length>0" v-model="downStreamMultiple">
                <el-checkbox
                  v-for="(item,index) in downStreamList"
                  :key="index"
                  :label="item"
                  class="custom-checkbox"/>
              </el-checkbox-group>
              <p v-else style="margin-top:10px;"> 暂无任何数据项</p>
              <el-input
                slot="reference"
                :value="`${(downStreamMultiple||[]).join(',')}`"
                :placeholder="t('tip.pleaseSelectUpStream')" />
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12" >
          <el-form-item label="Direction">
            <el-select v-model="linksignalType" :placeholder="t('tip.pleaseSelectDirection')" filterable clearable class="filter-item">
              <el-option v-for="(item,index) in linksignalTypeList" :value="item" :key="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :md="6" :sm="12">
          <el-form-item style="white-space:nowrap;">
            <el-checkbox v-model="exchange" style="margin-top:5px;">Exchange</el-checkbox>
            <el-radio-group v-show="linksignalType" v-model="linkEqpName">
              <el-radio v-for="(equpmentNo,index) in (equpmentNoList||[])" :key="index" :label="equpmentNo" >
                {{ equpmentNo }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="12">
          <el-form-item style="white-space:nowrap;">
            <el-button :loading="loading" :disabled="!linksignalType" type="primary" icon="el-icon-search" class="filter-item" @click="searchHandler">{{ t('btn.search') }} </el-button>
          </el-form-item>
        </el-col>
      </shop-line-filter>
    </div>
    <NoData v-if="linksignalList.length===0"/>
    <el-row v-else :gutter="10">
      <el-col v-for="(item,index) in linksignalList" :key="index" :span="12">
        <link-signal :chart-id="`step-chart-${index}`" :key="index" :data="item"/>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1000px"
      top="10vh"
      title="PLC Simulator Config">
      <Detail :filter="filter" :is-eq-simulator="'0'" @successEvent="successHandler"/>
    </el-dialog>
  </div>
</template>

<script>
import { getlinksignalbolcklist, getLinkSignalFlowList, filterLinkSignalFlowList } from '@/api/linksignal'
import LinkSignal from '@/views/linksignal/tools/StepChart'
import ShopLineFilter from '@/components/ShopLineFilter'
import resize from '@/views/linksignal/mixins/resize'
import { getConnectByName } from '@/api/plcSimulator'
import { linkSignalMonitor } from '@/api/publishInfo'
import Detail from '@/views/plcSimulator/detail'
import { mapState, mapActions } from 'vuex'
import NoData from '@/components/Nodata'
import { cloneDeep } from 'lodash'
import { t } from '@/utils'
import dayjs from 'dayjs'

export default {
  name: 'LinksignalTools',
  components: {
    ShopLineFilter,
    NoData,
    LinkSignal,
    Detail
  },
  mixins: [resize],
  data() {
    return {
      loading: false,
      showDetail: false,
      linkEqpName: '',
      exchange: false,
      checkedForUP: false,
      checkedForDown: false,
      filter: {},
      linksignalList: [],
      linksignalType: '',
      equpmentNoList: [],
      linksignalTypeList: [],
      upStreamMultiple: [],
      downStreamMultiple: [],
      upStreamList: [],
      downStreamList: [],
      timer: null,
      signalItemObject: {},
      maxDataCount: 30
    }
  },
  computed: {
    ...mapState({
      signalRealTimeData: state => state.socket.data.socket_linksignal
    })
  },
  watch: {
    'filter.lineId'(currValue) {
      if (!currValue) {
        this.linksignalType = ''
        this.linksignalTypeList.splice(0, this.linksignalTypeList.length)
      }
    },
    checkedForUP(currValue) {
      if (currValue) {
        this.upStreamMultiple = this.upStreamList
      } else {
        this.upStreamMultiple = []
      }
    },
    checkedForDown(currValue) {
      if (currValue) {
        this.downStreamMultiple = this.downStreamList
      } else {
        this.downStreamMultiple = []
      }
    },
    linksignalType() {
      this.equpmentNoList = (this.linksignalType || '').split('To').map(item => item.replace(/_\d/, ''))
      this.linkEqpName = this.equpmentNoList[0]
    },
    signalRealTimeData(currValue) {
      this.updateChartData(currValue)
    },
    linkEqpName() {
      this.searchHandler()
    }
  },
  deactivated() {
    if (this.$socket) {
      this.$socket.close()
    }
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    t,
    ...mapActions([
      'linksignalRealTimeData'
    ]),
    getLinkSignalMonitor() {
      return linkSignalMonitor({}).then(res => {
        res.body['linkSignalMap'][this.linksignalType] || [].forEach(item => {
          item.itemValue = Array.from('00000000000000000000000000000000').map(value => this.$lodash.random(1, 32) % 2).join('')
          return item
        })
        this.linksignalRealTimeData(res.body['linkSignalMap'])
      })
    },
    successHandler($event) {
      this.showDetail = false
      this.filter = Object.assign({}, this.filter, $event)
      this.getlinksignalbolcklist()
      this.getLinkSignalFlowList()
    },
    getLinkSignalFlowList() {
      this.loading = true
      return getLinkSignalFlowList({
        shop: this.filter.shop,
        lineName: this.filter.lineId,
        exchange: this.exchange,
        name: this.linksignalType,
        mapBean: this.filter.mapBean
      }).then(res => {
        if (Array.isArray(res.body)) {
          const bodyData = res.body.reduce((tempData, item) => {
            tempData[item.itemGroupName] = item
            return tempData
          }, {})
          this.upStreamList = this.upStreamMultiple = bodyData.UpstreamLinkSignal.itemNameList
          this.downStreamList = this.downStreamMultiple = bodyData.DownstreamLinkSignal.itemNameList
          this.upStreamList.length === 0 ? this.checkedForUP = false : this.checkedForUP = true
          this.downStreamList.length === 0 ? this.checkedForDown = false : this.checkedForDown = true
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    searchHandler() {
      this.loading = true
      this.linksignalList.splice(0, this.linksignalList.length)
      return filterLinkSignalFlowList({
        shop: this.filter.shop,
        lineName: this.filter.lineId,
        exchange: this.exchange,
        name: this.linksignalType,
        linkSignalItemList: [
          { itemGroupName: 'UpstreamLinkSignal', itemNameList: this.upStreamMultiple },
          { itemGroupName: 'DownstreamLinkSignal', itemNameList: this.downStreamMultiple }
        ]
      }).then(res => {
        if (res.body && Array.isArray(res.body.linkSignalItemList)) {
          this.signalItemObject = res.body.linkSignalItemList.reduce((tempObject, item) => {
            tempObject[item.itemGroupName] = item
            return tempObject
          }, {})
        }
        if (res.body && res.body.linkSignalMap) {
          this.updateChartData(res.body.linkSignalMap)
        }
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    updateChartData(linksignalMap) {
      if (linksignalMap instanceof Object) {
        for (const key in linksignalMap) {
          const [upEquipmentNo, downEquipmentNo] = key.split('To')
          if (Array.isArray(linksignalMap[key])) {
            const linkMapObject = linksignalMap[key].reduce((tempObject, item) => {
              tempObject[item.eventId] = item
              return tempObject
            }, {})
            linksignalMap[key].forEach(item => {
              const [monitorType] = item.blockName.split('#')
              const linksignalName = monitorType === 'Upstream' ? upEquipmentNo : downEquipmentNo
              // 获取图表数据索引，有则更新，没有则添加
              const index = this.linksignalList.findIndex(({ blockName, eventId, signalDirection }) =>
                item.blockName === blockName &&
                 item.eventId === eventId &&
                  signalDirection === item.signalDirection)
              // 获取当前时间
              const currTime = dayjs().format('HH:mm:ss')

              if (index >= 0) {
                const copyObject = cloneDeep(this.linksignalList[index])
                if (copyObject.chartXAxisData.length > this.maxDataCount) {
                  copyObject.chartXAxisData.shift()
                }
                copyObject.chartXAxisData.push(currTime)
                const valueList = Array.from(item.itemValue).map(item => Number(item))
                copyObject.chartSeriesData.forEach((item, index) => {
                  item.itemValue = valueList[index]
                  item.value = valueList[index]
                  if (item.chartData.data.length > this.maxDataCount) {
                    item.chartData.data.shift()
                  }
                  item.chartData.data.push(index * 3 + (valueList[index] === 1 ? 1 : 2))
                })
                this.linksignalList.splice(index, 1, copyObject)
              } else {
                this.linksignalList.push({
                  ...item,
                  shop: this.filter.shop,
                  lineId: this.filter.lineId,
                  monitorType: monitorType,
                  monitorEquipmentNo: this.linkEqpName,
                  upEquipmentNo: linkMapObject['LinkSignalforSendOut']['equipmentNo'],
                  downEquipmentNo: linkMapObject['LinkSignalforReceive']['equipmentNo'],
                  itemEventId: key,
                  linksignalName: linksignalName,
                  linksignalType: this.linksignalType,
                  chartXAxisData: [currTime],
                  chartSeriesData: this.getSeriesData(this.signalItemObject[`${monitorType}LinkSignal`].itemBeans, item.itemValue)
                })
              }
            })
          }
        }
      }
    },
    getSeriesData(itemList, signalValue) {
      const valueList = Array.from(signalValue).map(item => Number(item))
      return itemList.map((item, index) => {
        item.itemValue = valueList[index]
        if (!item.hasOwnProperty('chartData')) {
          this.$set(item, 'value', valueList[index])
        }
        if (!item.hasOwnProperty('chartData')) {
          item.chartData = {
            name: item.itemValue,
            type: 'line',
            step: 'start',
            data: []
          }
        }
        item.chartData.data.push(index * 3 + (valueList[index] === 1 ? 1 : 2))
        return item
      })
    },
    getlinksignalbolcklist() {
      if (this.filter.lineId) {
        return getlinksignalbolcklist({
          shop: this.filter.shop,
          lineName: this.filter.lineId,
          exchange: this.exchange,
          name: this.linksignalType,
          mapBean: this.filter.mapBean
        }).then(res => {
          this.linksignalTypeList = this.$lodash.sortBy(Object.keys(res.body.linkSignalMap))
        })
      }
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      if (this.filter.lineId) {
        return getConnectByName({
          shop: this.filter.shop,
          lineName: this.filter.lineId,
          isEqSimulator: '0'
        }).then(res => {
          if (res.body) {
            this.getlinksignalbolcklist()
            this.getLinkSignalFlowList()
          } else {
            this.showDetail = true
          }
        })
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.linksignal-container {
  .el-select,
  .el-input {
    width: 100%;
  }

  /deep/ .filter-container{
    .el-col{
      height:48px;
    }
  }

  .table-container {
    padding-top: 79px;
    padding-bottom: 47px;
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
        height: 40px;
        width: 60%;
        text-align: right !important;
      }
    }
  }
}
/deep/ .custom-checkbox{
  width:100%;
}
</style>
