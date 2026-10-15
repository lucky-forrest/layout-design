<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :md="3">
          <el-select
            v-model="shopName"
            :placeholder="t('tip.pleaseSelectShop')"
            clearable
            filterable
            class="filter-item"
            @change="getLineTypeListByShop"
          >
            <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :md="3">
          <el-select
            v-model="lineType"
            :placeholder="t('tip.pleaseSelectLineType')"
            clearable
            filterable
            class="filter-item"
            @change="getLineIdList"
          >
            <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.lineTypeName" :value="item.lineTypeName" />
          </el-select>
        </el-col>
        <el-col :md="3">
          <el-select
            v-model="lineId"
            :placeholder="t('tip.pleaseSelectLineId')"
            clearable
            filterable
            class="filter-item"
            @change="getEquipmentTypeList"
          >
            <el-option v-for="(item,index) in lineIdList" :key="index" :label="item.lineId" :value="item.lineId" />
          </el-select>
        </el-col>
        <el-col :md="3">
          <el-select
            v-model="eqpType"
            :placeholder="t('tip.pleaseSelectEquipmentType')"
            clearable
            filterable
            class="filter-item"
            @change="getEquipmentNoList"
          >
            <el-option v-for="(item,index) in eqpTypeList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-col>
        <el-col :md="3">
          <el-select v-model="equipmentNo" :placeholder="t('tip.pleaseSelectEquipmentNo')" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-col>
        <el-col :sm="9" :lg="9">
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="search">{{ t('btn.search') }}</el-button>
          <el-button :loading="loading" type="primary" @click="saveHandler">
            <svg-icon :icon-class="'save'" />
            &nbsp;{{ t('btn.save') }}
          </el-button>
          <el-button :loading="loading" type="success" @click="addHandler">
            <svg-icon :icon-class="'add'" />&nbsp;1
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div v-if="Array.isArray(showDataList)&&showDataList.length>0" class="tableDiv">
      <table class="custom-table">
        <thead>
          <tr>
            <th width="70px">#</th>
            <th>EquipmentNo</th>
            <th>ParameterName</th>
            <th>SVID</th>
            <th>Item</th>
            <th>Site</th>
            <th>SubOffset</th>
            <th>SubPoint</th>
            <th>Area</th>
            <th>Size</th>
            <th>Address</th>
            <th>Description</th>
            <th>Range</th>
            <th>Operator</th>
            <th>Dotratio</th>
            <th>ReportTo</th>
            <th>ReportUnitNo</th>
            <th>Unit</th>
            <th>Expression</th>
            <th>JobDataItem</th>
            <th width="180px">{{ t('column.operate') }}</th>
          </tr>
        </thead>
        <draggable v-model="showDataList" element="tbody" @update="bitNameDatadragEnd">
          <tr v-for="(item,index) in showDataList" :key="index">
            <td align="center">{{ index }}</td>
            <td align="center">
              <span>{{ item.equipmentNo }}</span>
            </td>
            <td align="center">
              <el-input v-model="item.parameterName" clearable style="width:200px;" />
            </td>
            <td align="center">
              <el-input v-model="item.svid" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.item" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.site" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.subOffset" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.subPoint" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.area" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input-number v-model="item.size" :min="1" :precision="0" controls-position="right" style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.address" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.description" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.range" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.operator" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-select v-model="item.dotratio" placeholder="Please Select" clearable filterable style="width:180px;">
                <el-option v-for="(item,index) in dotratioList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </td>
            <td align="center">
              <el-select v-model="item.reportTo" placeholder="Please Select" clearable filterable style="width:180px;">
                <el-option v-for="(item,index) in reportToList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </td>
            <td align="center">
              <el-input v-model="item.reportUnitNo" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-input v-model="item.unit" clearable style="width:180px;" />
            </td>
            <td align="center">
              <el-select
                v-model="item.expression"
                placeholder="Please Select"
                clearable
                filterable
                style="width:180px;"
              >
                <el-option v-for="(item,index) in expressionList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </td>
            <td align="center">
              <span>{{ item.jobDataItem }}</span>
            </td>
            <td align="center">
              <el-button type="danger" icon="el-icon-delete" @click="deleteHandler(item,index)" />
            </td>
          </tr>
        </draggable>
      </table>
    </div>
    <NoData v-else/>
  </div>
</template>
<script>
import {
  getLineTypeListByShop,
  getEquipmentTypeList,
  getEquipmentNoList
} from '@/api/eqprofile'
import {
  getAPCCommandDataByLineId,
  updateAPCCommandData,
  updateAPCCommandDataFromTools,
  getLineByLineType
} from '@/api/apcDownloadSetting/index'
import { expressionList, dotratioList, reportToList } from '@/config/index'
import NoData from '@/components/Nodata'
import draggable from 'vuedraggable'
import notice from '@/utils/notice'
import { shopList } from '@/config'
import { t } from '@/utils'
export default {
  name: 'ApcDownloadSetting',
  components: {
    draggable,
    NoData
  },
  data() {
    return {
      equipmentNo: '',
      shopName: '',
      lineType: '',
      eqpType: '',
      lineId: '',
      loading: false,
      APCDownloadObj: {},
      showDataList: [],
      jobList: [],
      equipmentList: [],
      lineTypeList: [],
      lineIdList: [],
      eqpTypeList: [],
      shopList: shopList,
      expressionList: expressionList,
      dotratioList: dotratioList,
      reportToList: reportToList
    }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.getAPCDownloadList()
  //   })
  // },
  methods: {
    t,
    getLineIdList() {
      this.loading = true
      return getLineByLineType({
        shopName: this.shopName,
        lineType: this.lineType
      }).then(res => {
        this.lineIdList = res.body
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getLineTypeListByShop() {
      if (this.shopName !== '') {
        return getLineTypeListByShop({ shopName: this.shopName }).then(res => {
          this.lineTypeList = res.body.rows
        })
      } else {
        this.lineType = ''
        this.eqpType = ''
        this.equipmentNo = ''
        this.lineTypeList = []
      }
    },
    getEquipmentTypeList() {
      if (this.lineType !== '') {
        return getEquipmentTypeList({
          shopName: this.shopName,
          lineType: this.lineType
        }).then(res => {
          this.eqpTypeList = res.body
        }).catch(() => {
          this.loading = false
        })
      } else {
        this.eqpType = ''
        this.equipmentNo = ''
        this.eqpTypeList = []
      }
    },
    getEquipmentNoList() {
      if (this.eqpType !== '') {
        return getEquipmentNoList({
          shopName: this.shopName,
          lineType: this.lineType
        }).then(res => {
          this.equipmentList = res.body
        })
      } else {
        this.equipmentNo = ''
        this.equipmentList = []
      }
    },
    bitNameDatadragEnd(evt) {
      this.showDataList = this.datadrag(evt, this.jobList, this.showDataList)
      this.jobList = this.$lodash.slice(this.showDataList)
    },
    datadrag(evt, tempArr, targetArr) {
      let list = []
      const newIndex = evt.newIndex
      const oldIndex = evt.oldIndex
      if (newIndex < oldIndex) {
        if (newIndex !== 0) {
          for (let i = 0; i < newIndex; i++) {
            list.push(tempArr[i])
          }
          list.push(tempArr[oldIndex])
          for (let i = newIndex; i < tempArr.length; i++) {
            if (i !== oldIndex) {
              list.push(tempArr[i])
            }
          }
        } else {
          list.push(tempArr[oldIndex])
          for (let i = 0; i < tempArr.length; i++) {
            if (i !== oldIndex) {
              list.push(tempArr[i])
            }
          }
        }
      } else if (oldIndex < newIndex) {
        for (let i = 0; i <= newIndex; i++) {
          if (i !== oldIndex) {
            list.push(tempArr[i])
          }
        }
        list.push(tempArr[oldIndex])
        for (let i = newIndex + 1; i < tempArr.length; i++) {
          list.push(tempArr[i])
        }
      } else {
        list = this.$lodash.slice(tempArr)
      }
      targetArr = this.$lodash.slice(list)
      return this.$lodash.slice(targetArr)
    },
    search() {
      this.getAPCDownloadList()
    },
    filterAPCDownloadList() {
      this.showDataList = Array.from(this.jobList)
      if (this.equipmentNo) {
        this.showDataList = this.showDataList.filter(item => {
          return item.equipmentNo === this.equipmentNo
        })
      }
    },
    getAPCDownloadList() {
      this.loading = true
      return getAPCCommandDataByLineId({
        shopName: this.shopName,
        lineType: this.lineType,
        equipmentType: this.eqpType,
        equipmentNo: this.equipmentNo
      })
        .then(res => {
          this.APCDownloadObj = res.body
          this.jobList = res.body.apcCommandList
          this.showDataList = Array.from(this.jobList)
          this.filterAPCDownloadList()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    saveHandler() {
      this.loading = true
      return updateAPCCommandData(
        Object.assign(this.APCDownloadObj, {
          apcCommandList: this.showDataList
        })
      )
        .then(res => {
          notice.success(this.t('tip.saveSuccess'), () => {
            const serviceAddress = `http://${res.body.ip}:${res.body.port}/`
            this.getAPCDownloadList()
            this.updateAPCCommandDataFromTools(serviceAddress)
            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    updateAPCCommandDataFromTools(serviceAddress) {
      this.loading = true
      this.showDataList.map(item => {
        delete item.subOffset
        delete item.subPoint
        delete item.area
        delete item.address
        delete item.apcCommandList
        delete item.equipmentType
        delete item.factoryName
        delete item.lineId
        delete item.lineType
        delete item.objectId
        delete item.serverName
        delete item.shopName
        delete item.fileObjectId
        return Object.assign(item, { dataType: 'APCCommand' })
      })
      return updateAPCCommandDataFromTools(serviceAddress, {
        lineId: this.lineId,
        equipmentNo: this.equipmentNo,
        apcCommandList: this.showDataList
      }).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    deleteHandler(item, index) {
      this.showDataList.splice(index, 1)
      this.jobList = this.$lodash.slice(this.showDataList)
    },
    addHandler() {
      this.showDataList.push({
        equipmentNo: this.equipmentNo,
        parameterName: '',
        svid: '',
        item: '',
        site: '',
        subOffset: '',
        subPoint: '',
        area: '',
        size: '',
        address: '',
        description: '',
        range: '',
        operator: '',
        dotratio: '',
        reportTo: '',
        reportUnitNo: '',
        unit: '',
        expression: '',
        jobDataItem: ''
      })
      this.jobList = this.$lodash.slice(this.showDataList)
    },
    indexHandler(index) {
      return index + 1
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

.tableDiv {
  width: 100%;
  height: calc(100vh - 180px);
  overflow-x: auto;
  border: 1px solid #ebeef5;

  .custom-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ebeef5;

    th {
      font-size: 14px;
      color: #606266;
      text-align: center;
      background-color: #f2f6fc !important;
    }

    th,
    td {
      padding: 4px 10px 4px 10px;
      height: 40px;
      border: 1px solid #ebeef5;
    }
  }
}
</style>

