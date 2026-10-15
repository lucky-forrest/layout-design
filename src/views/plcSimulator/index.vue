<template>
  <div v-loading.body="loading" class="app-container plc-simulator">
    <div class="filter-container">
      <shop-line-filter @changeEvent="lineIdChangHandler" >
        <el-col slot="prefix" :lg="6" :md="8" :sm="12" style="white-space:nowrap;">
          <el-form-item>
            <el-radio-group v-model="isEqSimulator" class="filter-item" @change="toggleSimulatorTypeHandler">
              <el-radio-button :label="0" style="width:50%;">EQ-Simulator</el-radio-button>
              <el-radio-button :label="1" style="width:50%;">BC-Simulator</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item label="EqpNo">
            <el-select v-model="currentEquipmentNo" :placeholder="t('tip.pleaseSelectEquipmentNo')" class="filter-item" clearable>
              <el-option v-for="(equipmentNo,index) in equipmentList" :key="index" :label="equipmentNo" :value="equipmentNo" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="8" :sm="12">
          <el-form-item label="Filter">
            <el-input v-model="parentFilterText" placeholder="By Name Filter" class="filter-item" clearable />
          </el-form-item>
        </el-col>
      </shop-line-filter>
      <el-input v-if="blockName" id="importJsonFile" type="file" style="display:none;" @change.native="readJsonHandler" />
    </div>
    <el-table
      v-if="showBlockList.length>0"
      ref="blockList"
      :data="showBlockList"
      :row-key="getRowKey"
      :expand-row-keys="expandRowKeys"
      stripe
      border
      @expand-change="expandRow">
      <el-table-column type="index">#</el-table-column>
      <el-table-column align="center" min-width="150px" type="expand">
        <template slot-scope="curr">
          <table class="item-table" stripe>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Offset</th>
              <th>Point</th>
              <th>Type</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
            <tr v-for="(item,index) in curr.row.itemCollection" :key="index">
              <td style="width:30px;text-align:center">{{ index +1 }}</td>
              <td style="width:120px;text-align:center">{{ item.privateName }}</td>
              <td style="width:50px;text-align:center">{{ item.offset }}</td>
              <td style="width:50px;text-align:center">{{ item.points }}</td>
              <td style="width:50px;text-align:center">{{ item.itemType }}</td>
              <td style="width:100px">
                <el-select
                  v-show="getConstants(item.privateName,curr.row.privateName)"
                  :placeholder="t('tip.pleaseSelect')"
                  :disabled="curr.row.privateAction === 'READ'"
                  :clearable="curr.row.privateAction !== 'READ'"
                  v-model="item.strValue"
                  filterable
                  allow-create
                  default-first-option

                  style="width:100%">
                  <el-option
                    v-for="(tItem,tIndex) in getConstants(item.privateName,curr.row.privateName)"
                    :key="`${item.privateName}-${curr.row.prefix}-${tIndex}`"
                    :label="`${tItem.value} : ${tItem.label}`"
                    :value="tItem.value" />
                </el-select>
                <el-input
                  v-show="!getConstants(item.privateName,curr.row.privateName)"
                  v-model="item.strValue"
                  :disabled="curr.row.privateAction === 'READ'"
                  :clearable="curr.row.privateAction !== 'READ'"
                />
              </td>
              <td :label="curr.row.deviceCode === 'B'?'Action':''" class="center" style="width:80px">
                <el-button
                  v-show="curr.row.deviceCode === 'B'"
                  :loading="loading"
                  type="primary"
                  icon="el-icon-check"

                  @click="sendToService(curr.row, item.privateName)">
                  <!-- {{ t('btn.send') }} -->
                </el-button>
              </td>
            </tr>
          </table>
        </template>
      </el-table-column>
      <el-table-column align="center" width="80px" label="Prefix" prop="prefix" />
      <el-table-column sortable width="280px" label="Name" prop="privateName" />
      <el-table-column :filters="[{text:'Word',value:'W'},{text:'Bit',value:'B'}]" :filter-method="filterListByArea" align="center" label="Area" prop="deviceCode" />
      <el-table-column :filters="[{text:'Read',value:'READ'},{text:'Write',value:'WRITE'}]" :filter-method="filterListByAction" align="center" label="Action" prop="privateAction" />
      <el-table-column sortable align="center" label="Points" prop="privatePoints" />
      <el-table-column sortable align="center" label="StartAddress" prop="privateStartAddress" />
      <el-table-column align="center" width="240px" label="Action" fixed="right">
        <template slot-scope="curr">
          <el-tooltip :content="t('btn.update')" class="item" effect="dark" placement="top">
            <el-button
              v-show="['W','BL','SW'].includes(curr.row.deviceCode)"
              :loading="loading"
              type="primary"
              icon="el-icon-check"
              @click="sendToService(curr.row, '')" />
          </el-tooltip>
          <el-tooltip :content="t('btn.refresh')" class="item" effect="dark" placement="top">
            <el-button
              :loading="loading"
              type="primary"
              icon="el-icon-refresh"
              @click="updateBlockInfo(curr.row)" />
          </el-tooltip>
          <el-tooltip :content="t('btn.import')" class="item" effect="dark" placement="top">
            <el-button
              v-show="curr.row.privateAction==='WRITE'"
              :loading="loading"
              type="success"
              @click="importJsonHandler(curr.row)">
              <svg-icon :icon-class="'import'" />
            </el-button>
          </el-tooltip>
          <el-tooltip :content="t('btn.download')" class="item" effect="dark" placement="top">
            <el-button
              v-show="curr.row.privateAction==='WRITE'"
              :loading="loading"
              type="success"
              @click="exportJsonHandler(curr.row)">
              <svg-icon :icon-class="'download'" />
            </el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <no-data v-else/>
    <el-tooltip placement="top" content="top">
      <back-to-top :visibility-height="100" :back-position="0" transition-name="fade" />
    </el-tooltip>
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1000px"
      top="10vh"
      title="PLC Simulator Config">
      <Detail :filter="filter" :is-eq-simulator="`${isEqSimulator}`" @successEvent="successHandler"/>
    </el-dialog>
  </div>
</template>
<script>
import { getPlcBlockList, sendPlcCommand, updateBlockInfo, getPlcSimulatorConstants, getConnectByName } from '@/api/plcSimulator'
import ShopLineFilter from '@/components/ShopLineFilter'
import Detail from '@/views/plcSimulator/detail'
import BackToTop from '@/components/BackToTop'
import { JsonFile } from '@/utils/file-utils'
import NoData from '@/components/Nodata'
import notice from '@/utils/notice'
import { t } from '@/utils'
import dayjs from 'dayjs'

export default {
  name: 'PlcSimulator',
  components: {
    ShopLineFilter,
    BackToTop,
    NoData,
    Detail
  },
  data() {
    return {
      loading: false,
      showDetail: false,
      parentFilterText: '',
      equipmentList: [],
      currentEquipmentNo: '',
      currentConfigInfo: [],
      blockList: [],
      showBlockList: [],
      multipleSelection: [],
      intervalTime: 0,
      num: 0,
      expandRowKeys: [],
      plcSimulatorConfig: {},
      prefix: '',
      blockName: '',
      uploadDom: null,
      isEqSimulator: '0',
      filter: {}
    }
  },
  watch: {
    currentEquipmentNo() {
      this.loading = true
      this.parentFilterText = ''
      this.blockList = this.$lodash.orderBy(((this.currentConfigInfo || []).find(item => { return item.eqpNo === this.currentEquipmentNo }) || {}).blocks || [], ['deviceCode', 'privateName', 'privateAction'], ['desc', 'asc', 'desc'])
      this.showBlockList = Array.from(this.blockList)
      this.loading = false
    },
    parentFilterText() {
      if (this.parentFilterText) {
        this.showBlockList = Array.from(this.blockList).filter(item => {
          return item.privateName.toUpperCase().includes(this.parentFilterText.toUpperCase())
        })
      } else {
        this.showBlockList = Array.from(this.blockList)
      }
    }
  },
  methods: {
    t,
    getConstants(itemName, blockName) {
      for (const i in this.plcSimulatorConfig) {
        if (i.search(`${blockName}--`) !== -1) {
          var index = i.indexOf('--')
          var j = i.substring(index + 2, i.length)
          if (j === itemName) {
            return this.plcSimulatorConfig[i]
          }
        } else if (i === itemName) {
          return this.plcSimulatorConfig[i]
        }
      }
    },
    getPlcSimulatorConstants() {
      return getPlcSimulatorConstants({
        shop: this.filter.shop,
        lineName: this.filter.lineId
      }).then(res => {
        const temp = {}
        res.body.plcSimulatorConfig.forEach(item => {
          var name = item.name
          if (item.blockName) {
            name = item.blockName + '--' + name
          }
          this.$set(temp, `${name}`, [])
          item.plcSimulatorConfig.forEach(({ label, value }) => {
            temp[name].push({ label, value })
          })
        })
        this.plcSimulatorConfig = temp
      })
    },
    lineIdChangHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      if (this.filter.lineId) {
        return getConnectByName({
          shop: this.filter.shop,
          lineName: this.filter.lineId,
          isEqSimulator: this.isEqSimulator
        }).then(res => {
          if (res.body) {
            this.getPlcBlockList()
            this.getPlcSimulatorConstants()
          } else {
            this.showDetail = true
          }
        })
      } else {
        this.blockList.splice(0, this.blockList.length)
      }
    },
    successHandler($event) {
      this.showDetail = false
      this.filter = Object.assign({}, this.filter, $event)
      this.getPlcBlockList()
      this.getPlcSimulatorConstants()
    },
    toggleSimulatorTypeHandler() {
      if (this.filter.lineId) {
        return getConnectByName({
          shop: this.filter.shop,
          lineName: this.filter.lineId,
          isEqSimulator: this.isEqSimulator
        }).then(res => {
          if (res.body) {
            this.getPlcBlockList()
            this.getPlcSimulatorConstants()
          } else {
            this.showDetail = true
          }
        })
      } else {
        this.blockList.splice(0, this.blockList.length)
      }
    },
    getPlcBlockList() {
      this.loading = true
      return getPlcBlockList({
        shop: this.filter.shop,
        lineName: this.filter.lineId,
        isEqSimulator: this.isEqSimulator,
        mapBean: this.filter.mapBean,
        jobDataBean: this.filter.jobDataBean
      }).then(res => {
        this.currentConfigInfo = res.body || []
        this.equipmentList = this.$lodash.map(this.currentConfigInfo, 'eqpNo').sort()
        this.currentEquipmentNo = this.$lodash(this.equipmentList).first()
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    filterListByAction(value, row, column) {
      return row.privateAction === value
    },
    filterListByArea(value, row, column) {
      return row.deviceCode === value
    },
    sendToService(block, itemName) {
      let isValid = true
      let errMsg = ''
      for (const {
        itemType,
        privateName,
        strValue
      } of block.itemCollection) {
        switch (itemType) {
          case 'BCD': {
            const regexp = new RegExp(
              '^\\d{12}$'
            )
            if (!regexp.test(strValue)) {
              isValid = false
              errMsg = `ItemName [${privateName}] is  Incorrectly,Must satisfy the rule yyMMddHHmmss !`
            }
          }
            break
        }
        if (!isValid) {
          break
        }
      }
      if (!isValid) {
        notice.error(errMsg)
        return false
      }
      return sendPlcCommand({
        lineName: this.filter.lineId,
        time: this.intervalTime,
        isEqSimulator: this.isEqSimulator,
        itemName,
        plcBlockBean: {
          eqpNo: this.currentEquipmentNo,
          blocks: [block]
        }
      }).then(res => {
        notice.success(res.result.message)
      })
    },
    updateBlockInfo(block) {
      return updateBlockInfo({
        lineId: this.filter.lineId,
        equipmentNo: this.currentEquipmentNo,
        blockName: block.privateName,
        prefix: block.prefix,
        isEqSimulator: this.isEqSimulator
      }).then(res => {
        const updateParentIndex = this.blockList.findIndex(item => {
          return item.prefix === res.body.prefix && item.privateName === res.body.privateName
        })
        this.blockList.splice(updateParentIndex, 1, res.body)
        const updateShowIndex = this.showBlockList.findIndex(item => {
          return item.prefix === res.body.prefix && item.privateName === res.body.privateName
        })
        this.showBlockList.splice(updateShowIndex, 1, res.body)
        this.expandRowKeys = [`${block.prefix}-${block.privateName}-${block.functionName}`]
      })
    },
    expandRow(row, expandedRows) {
      if (expandedRows.length > 1) {
        this.$refs.blockList.toggleRowExpansion(expandedRows[0], false)
      }
      const parentTarget = this.$refs.blockList.$el.getElementsByClassName('el-table__body-wrapper')[0]
      parentTarget.style.overflowX = 'hidden'
      const regexp = new RegExp(
        '^((([0-9]{1}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})(((0[13578]|1[02])(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)(0[1-9]|[12][0-9]|30))|(02(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))0229))([0-1]?[0-9]|2[0-3])([0-5][0-9])([0-5][0-9])$'
      )
      row.itemCollection.map(item => {
        switch (item.itemType) {
          case 'BCD':
            item.strValue = regexp.test(item.strValue) ? item.strValue : dayjs().format('YYMMDDHHmmss')
            break
        }
        return item
      })
    },
    getRowKey(row) {
      return `${row.prefix}-${row.privateName}-${row.functionName}`
    },
    importJsonHandler({
      privateName,
      prefix
    }) {
      this.blockName = privateName
      this.prefix = prefix
      setTimeout(() => {
        this.uploadDom = document.getElementById('importJsonFile')
        this.uploadDom.click()
      }, 100)
    },
    readJsonHandler(event) {
      const targetFile = event.target.files[0]
      const reg = /^application\/json$/
      if (!reg.test(targetFile.type)) {
        notice.error('请选择json格式文件！')
        return false
      }
      if (!targetFile.name.match(this.blockName)) {
        notice.error('请选择正确的数据模板！')
        return false
      } else {
        const reader = new FileReader()
        reader.onload = () => {
          const fileResult = JSON.parse(reader.result)
          const tempIndex = this.showBlockList.findIndex(({
            privateName,
            prefix
          }) => {
            return privateName === this.blockName && prefix === this.prefix
          })
          this.showBlockList.splice(tempIndex, 1, Object.assign({}, this.showBlockList[tempIndex], {
            itemCollection: fileResult.itemCollection
          }))
          this.blockName = ''
        }
        reader.readAsText(targetFile, 'application/json')
      }
    },
    exportJsonHandler(block) {
      JsonFile(block, `${block.privateName}.json`)
    }
  }
}

</script>
<style lang="scss">
  /* eslint-disable */

  .plc-simulator {

    .el-select,
    el-input {
      width: 140px;
    }

    .el-form-item {
      margin: 0;
    }

    table {
      background-color: white !important;

      &:hover {

        tr,
        td {
          background-color: white !important;
        }
      }
    }
  }

  /* eslint-disable */

  .filter-container {

    .el-select,
    .el-input-number,
    .el-date-editor {
      width: 100%;
    }
  }

  .item-table {
    width: calc(100% - 190px);
    border: 1px solid #ebeef5;
    border-collapse: collapse;

    th,
    td {
      padding: 5px 10px;
    }

    .center {
      text-align: center;
    }
  }

  .radio {
    margin-left: 20px;
  }
</style>
