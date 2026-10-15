<template>
  <div v-loading.body="loading" class="app-container dashboardPage">
    <div class="filter-container">
      <shop-line-filter @changeEvent="lineIdChangHandler">
        <el-col
          slot="prefix"
          :lg="6"
          :md="8"
          :sm="12"
          style="white-space:nowrap;"
        >
          <el-form-item>
            <el-radio-group
              v-model="isEqSimulator"
              class="filter-item"
              @change="toggleSimulatorTypeHandler"
            >
              <el-radio-button
                :label="'eqEventList'"
                style="width:50%;"
              >EQ-Simulator</el-radio-button
              >
              <el-radio-button
                :label="'bcEventList'"
                style="width:50%;"
              >BC-Simulator</el-radio-button
              >
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item label="EqpNo">
            <el-select
              v-model="equipmentNo"
              :placeholder="t('tip.pleaseSelectEquipmentNo')"
              class="filter-item"
              allow-create
              clearable
            >
              <el-option
                v-for="(item, index) in equipmentList"
                :key="index"
                :label="item.equipmentNo"
                :value="item.equipmentNo"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col
          :lg="24"
          :md="16"
          :sm="24"
          style="text-align:right;white-space:nowrap;"
        >
          <el-button
            :loading="loading"
            :disabled="!equipmentNo"
            type="primary"
            icon="el-icon-search"
            class="filter-item"
            @click="searchHandler"
          >{{ t("btn.search") }}</el-button
          >
        </el-col>
      </shop-line-filter>
    </div>
    <div
      v-if="
        Array.isArray(eventObject[isEqSimulator]) &&
          eventObject[isEqSimulator].length > 0
      "
      class="graph-container"
    >
      <div class="container-left">
        <div style="padding:5px;border: 1px solid #e3e3e3;margin-top:5px;">
          <el-input
            v-model="eventNameFilter"
            :placeholder="t('btn.search')"
            suffix-icon="el-icon-search"
            clearable
            @keyup.enter.native="eventNameFilterHandler"/>
        </div>
        <div style="padding:5px;border: 1px solid #e3e3e3;margin-top:5px;">
          <el-button :loading="loading" type="primary" style="width:100%;height:40px;" @click="getBitStatusList">Bit Status</el-button>
        </div>
        <el-collapse
          v-model="eventName"
          accordion
          @change="getBlockListHandler"
        >
          <el-collapse-item
            v-for="(item, index) in eventObject[isEqSimulator]"
            :key="index"
            :name="item.name"
            :title="item.name"
          >
            <el-menu class="container-left-menu">
              <el-menu-item
                v-for="(bItem, bIndex) in blockList.filter(item =>
                  `${item.name}`
                    .toUpperCase()
                    .includes(eventNameFilter.toUpperCase())
                )"
                :key="bIndex"
                @click="getBlockHandler(bItem)"
              >
                {{ bItem.name }}
              </el-menu-item>
            </el-menu>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="container-right">
        <div v-for="(item, index) in eqpStatusSideList" :key="index">
          <EQPStatusSide
            :simulator-type="item.isEqSimulator"
            :block="item.eqpStatusBlock"
            :shop-filter="item.shopFilter"
            :legend-string="item.legendString"
          />
        </div>
        <div v-if="eventName!=='BitStatus'" class="right-main">
          <el-form v-show="eventName === 'PortCommon'" label-width="80px" style="padding:20px 10px 0 0;">
            <el-form-item label="Port" prop="portType">
              <el-select
                v-model="portType"
                placeholder="请选择PortType"
                class="filter-item"
                clearable
              >
                <el-option
                  v-for="(item, index) in portList"
                  :key="index"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <bc-side
            :simulator-type="isEqSimulator"
            :block="bcBlock"
            :send-block="localBlock"
            @bcSideEvent="sideEventHandler"
          />
          <local-side
            :simulator-type="isEqSimulator"
            :block="localBlock"
            :send-block="bcBlock"
            @localSideEvent="sideEventHandler"
          />
          <local-side
            v-if="(specialBlcok.eventBlock||{}).items"
            :simulator-type="isEqSimulator"
            :block="specialBlcok"
            :send-block="bcBlock"
            @localSideEvent="sideEventHandler"
          />
        </div>
      </div>
    </div>
    <no-data v-else />
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1000px"
      top="10vh"
      title="PLC Simulator Config"
    >
      <Detail :filter="filter" :is-eq-simulator="`${isEqSimulator==='eqEventList'?'0':'1'}`" @successEvent="successHandler" />
    </el-dialog>
    <el-dialog
      :visible.sync="showJobDataDownload"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="Job Data Download"
      width="1400px"
      top="8vh"
    >
      <JobDataDownload :filter="filterForJobData"/>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGraphidToolList,
  getGraphidToolListByName
} from '@/api/plcGraphicTools'
import { updateitemvalueintoplc } from '@/api/plcGraphicTools'
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import ShopLineFilter from '@/components/ShopLineFilter'
import EQPStatusSide from './components/eqpStatusSide'
import { getConnectByName } from '@/api/plcSimulator'
import JobDataDownload from '@/views/jobDataDownload'
import Detail from '@/views/plcSimulator/detail'
import LocalSide from './components/localSide'
import BcSide from './components/bcSide'
import NoData from '@/components/Nodata'
import { t } from '@/utils'

export default {
  name: 'PlcGraphicTools',
  components: {
    ShopLineFilter,
    LocalSide,
    BcSide,
    EQPStatusSide,
    NoData,
    Detail,
    JobDataDownload
  },
  data() {
    return {
      loading: false,
      showDetail: false,
      sendSpecialFlag: false,
      showJobDataDownload: false,
      equipmentList: [],
      portList: [],
      eqpStatusSideList: [],
      equipmentNo: '',
      eventName: null,
      blockName: null,
      isEqSimulator: 'eqEventList',
      eventNameFilter: '',
      portType: '',
      filter: {},
      filterForJobData: {},
      eventObject: {},
      localBlock: {},
      specialBlcok: {},
      bcBlock: {},
      blockList: []
    }
  },
  watch: {
    portType(currValue) {
      if (currValue) {
        this.handleSubmit()
      }
    },
    'filter.lineId'(currVal) {
      if (currVal) {
        this.getEquipmentList()
      } else {
        this.equipmentNo = ''
      }
    }
  },
  methods: {
    t,
    async eventNameFilterHandler() {
      // 如果字段匹配，则eventName等与该父项，并且显示匹配到的第一个子项
      for (const i of this.eventObject[this.isEqSimulator]) {
        let temp = {}
        let falg = false
        this.blockName = ''
        this.eventName = i.name
        const valid = await this.getGraphidToolListByName().then(() => {
          for (const j of i.eventList) {
            if (j.name.toUpperCase().includes(this.eventNameFilter.toUpperCase())) {
              temp = Object.assign({}, j)
              falg = true
              this.getBlockHandler(temp)
              break
            }
          }
          return falg
        })
        if (valid) {
          break
        }
      }
    },
    sideEventHandler($event) {
      this.filterForJobData = Object.assign({}, this.filter, { equipmentNo: this.equipmentNo })
      switch ($event) {
        case 'bcSide':
          Object.assign(this.filterForJobData, { portId: this.bcBlock.port })
          this.showJobDataDownload = true
          break
        case 'localSide':
          Object.assign(this.filterForJobData, { portId: this.localBlock.port })
          this.showJobDataDownload = true
          break
        case 'sendHandler':
          if (this.sendSpecialFlag) {
            this.sendHandler()
          }
          break
        case 'sendSpecialBlock':
          this.sendSpecialFlag = true
          break
        case 'noSendSpecialBlock':
          this.sendSpecialFlag = false
          break
      }
    },
    sendHandler() {
      const temp = []
      this.specialBlcok.eventBlock.items.forEach(item => {
        temp.push({
          privateName: item.name,
          strValue: item.value
        })
      })
      return updateitemvalueintoplc({
        lineName: this.specialBlcok.lineId,
        isEqSimulator: this.isEqSimulator === 'eqEventList' ? '0' : '1',
        plcBlockBean: {
          eqpNo: this.specialBlcok.eqpName,
          blocks: [
            {
              prefix: this.specialBlcok.eventBlock.prefix,
              privateName: this.specialBlcok.eventBlock.name,
              privateEQPName: this.specialBlcok.eqpName,
              itemCollection: temp
            }
          ]
        }
      }).then(res => {})
    },
    toggleSimulatorTypeHandler() {
      this.equipmentNo = ''
      this.eventObject = {}
      this.initLocalBlockandBcBlock()
      this.blockList = []
    },
    searchHandler() {
      this.initLocalBlockandBcBlock()
      if (this.equipmentNo) {
        return getConnectByName({
          shop: this.filter.shop,
          lineName: this.filter.lineId,
          isEqSimulator: this.isEqSimulator === 'eqEventList' ? '0' : '1'
        }).then(res => {
          if (res.body) {
            this.getGraphidToolList()
          } else {
            this.showDetail = true
          }
        })
      }
    },
    successHandler($event) {
      this.showDetail = false
      this.filter = Object.assign({}, this.filter, $event)
      this.initLocalBlockandBcBlock()
      this.getGraphidToolList()
    },
    getGraphidToolList() {
      this.loading = true
      const temp = this.isEqSimulator === 'eqEventList' ? '0' : '1'
      return getGraphidToolList({
        shop: this.filter.shop,
        lineName: this.filter.lineId,
        isEqSimulator: temp,
        localNo: this.equipmentNo,
        mapBean: this.filter.mapBean,
        jobDataBean: this.filter.jobDataBean
      })
        .then(res => {
          this.eqpStatusSideList = []
          // 剥离EquipmentStatus
          const indexOfEqpStatus = res.body[`${this.isEqSimulator}`].findIndex(
            ({ name }) => name === 'EquipmentStatus'
          )
          const eqpStatusBlock = (
            (res.body.eqEventList || []).find(
              ({ name }) => name === 'EquipmentStatus'
            ) || {}
          ).eventList
          this.eqpStatusSideList.push({ legendString: 'Alive Auto Change', shopFilter: { lineId: this.filter.lineId, equipmentNo: this.equipmentNo }, isEqSimulator: this.isEqSimulator, eqpStatusBlock: eqpStatusBlock })
          res.body[`${this.isEqSimulator}`].splice(indexOfEqpStatus, 1)
          // 剥离BitStatus
          const indexOfBitStatus = res.body[`${this.isEqSimulator}`].findIndex(
            ({ name }) => name === 'BitStatus'
          )
          res.body[`${this.isEqSimulator}`].splice(indexOfBitStatus, 1)
          this.eventObject = res.body
          this.eventName = ''
          this.blockName = ''
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getGraphidToolListByName() {
      this.loading = true
      const temp = this.isEqSimulator === 'eqEventList' ? '0' : '1'
      return getGraphidToolListByName({
        shop: this.filter.shop,
        lineName: this.filter.lineId,
        isEqSimulator: temp,
        localNo: this.equipmentNo,
        eventName: this.eventName,
        blockName: this.blockName
      })
        .then(res => {
          this.specialBlcok = {}
          if (this.eventName === 'BitStatus' && !this.blockName) {
            this.setBitStatusList(res.body)
          } else if (
            this.eventName &&
            !this.blockName &&
            this.isEqSimulator === 'eqEventList'
          ) {
            this.blockList = res.body.eqEventList[0].eventList
          } else if (
            this.eventName &&
            !this.blockName &&
            this.isEqSimulator === 'bcEventList'
          ) {
            this.blockList = res.body.bcEventList[0].eventList
          } else if (this.eventName && this.blockName) {
            if (this.eventName === 'PortCommon') {
              this.localBlock = Object.assign(
                {},
                this.localBlock,
                { type: 'Local Side' },
                res.body.eqEventList[0].eventList[0].portList[0]
              )
              this.specialBlcok = Object.assign(
                {},
                this.localBlock,
                { type: 'Special', eventBlock: res.body.eqEventList[0].eventList[0].portList[0].specialBlcok }
              )
              this.bcBlock = Object.assign(
                {},
                this.bcBlock,
                { type: 'BC Side' },
                res.body.bcEventList[0].eventList[0].portList[0]
              )
            } else {
              this.localBlock = Object.assign(
                {},
                this.localBlock,
                { type: 'Local Side' },
                res.body.eqEventList[0].eventList[0]
              )
              this.bcBlock = Object.assign(
                {},
                this.bcBlock,
                { type: 'BC Side' },
                res.body.bcEventList[0].eventList[0]
              )
            }
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getBitStatusList() {
      this.eventName = 'BitStatus'
      this.blockName = ''
      this.initLocalBlockandBcBlock()
      this.getGraphidToolListByName()
    },
    setBitStatusList(currData) {
      this.eqpStatusSideList.splice(1, this.eqpStatusSideList.length - 1)
      const bitStatusEqBlock = (
        (currData.eqEventList || []).find(
          ({ name }) => name === 'BitStatus'
        ) || {}
      ).eventList
      const bitStatusBcBlock = (
        (currData.bcEventList || []).find(
          ({ name }) => name === 'BitStatus'
        ) || {}
      ).eventList
      this.eqpStatusSideList.push(
        { legendString: 'BC Bit Status', shopFilter: { lineId: this.filter.lineId, equipmentNo: this.equipmentNo }, isEqSimulator: this.isEqSimulator === 'eqEventList' ? 'bcEventList' : 'eqEventList', eqpStatusBlock: bitStatusBcBlock },
        { legendString: 'Local Bit Status', shopFilter: { lineId: this.filter.lineId, equipmentNo: this.equipmentNo }, isEqSimulator: this.isEqSimulator, eqpStatusBlock: bitStatusEqBlock }
      )
    },
    initLocalBlockandBcBlock() {
      this.localBlock = Object.assign({}, this.localBlock, {
        lineId: this.filter.lineId,
        eqpName: this.equipmentNo,
        name: '',
        type: 'Local Side',
        eventBlock: { name: '', items: [] }
      })
      this.bcBlock = Object.assign({}, this.bcBlock, {
        lineId: this.filter.lineId,
        eqpName: this.equipmentNo,
        name: '',
        type: 'BC Side',
        eventBlock: { name: '', items: [] }
      })
      this.eqpStatusSideList.splice(1, this.eqpStatusSideList.length - 1)
    },
    getEquipmentList() {
      this.loading = true
      return getEquipmentList({
        condition: {
          lineId: this.filter.lineId,
          equipmentNo: ''
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      })
        .then(res => {
          this.equipmentList = res.body.rows
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getBlockListHandler() {
      this.blockName = ''
      this.portType = ''
      this.initLocalBlockandBcBlock()
      this.getGraphidToolListByName()
    },
    getBlockHandler(item) {
      this.initLocalBlockandBcBlock()
      if (this.eventName === 'PortCommon') {
        this.portList = item.portList
        this.portType = (this.$lodash.head(this.portList) || {}).name
        this.handleSubmit()
      } else {
        this.blockName = item.name
        this.getGraphidToolListByName()
      }
    },
    handleSubmit() {
      const temp = this.portList.find(({ name }) => {
        return name === this.portType
      })
      this.blockName = temp.name
      this.getGraphidToolListByName()
    },
    lineIdChangHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
    }
  }
}
</script>

<style lang="scss">
.graph-container {
  display: flex;
  flex-flow: row nowrap;
  height: calc(100vh - 240px);
  border: 1px solid #e3e3e3;
  .container-left {
    width: 320px;
    overflow-y: auto;
    border-right: 1px solid #e3e3e3;
    padding: 0 10px;
    .el-collapse {
      border-top: none;
    }
    .container-left-menu {
      border: 1px solid #e3e3e3;
      border-radius: 5px;
      li {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e3e3e3;
      }
    }
    .container-left-menu > li:last-child {
      border: none;
    }
  }
  .container-right {
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-y: auto;
  }
}
</style>
