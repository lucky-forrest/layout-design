<template>
  <div v-loading="loading" class="app-container">
    <div class="filter-container">
      <el-button type="primary" @click="saveHandler">
        <svg-icon :icon-class="'save'" />
        &nbsp;{{ t('btn.save') }}
      </el-button>
      <!-- <el-button type="primary" icon="el-icon-edit" @click="showUpdateMapDialog = true">
        {{ t('btn.updateMap') }}
      </el-button> -->
    </div>
    <el-tabs :stretch="true" type="border-card">
      <el-tab-pane v-for="([key,profile],index) in Object.entries(dataDetail)" :key="index" :label="key">
        <component :is="key" :detail-data="profile" @childEvent="childHandler" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="showUpdateMapDialog"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="300px"
      top="10vh"
      title="Update Map"
    >
      <el-row :gutter="20">
        <el-checkbox-group v-model="checkedList">
          <el-col :span="6">
            <el-checkbox
              v-for="(item,index) in profileList"
              :label="item.value"
              :key="index"
              :disabled="item.value==='common'"
            >{{ item.label }}</el-checkbox>
          </el-col>
        </el-checkbox-group>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="updateMapHandler">
          <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
        </el-button>
        <el-button :loading="loading" type="primary" @click="showUpdateMapDialog= false">
          <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.close') }}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="showOnLineDetail" :fullscreen="false" :close-on-click-modal="false" :close-on-press-escape="false" width="1000px" top="8vh" title="OnLine Form">
      <onLineDetail :detail-data="detailData" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>
<script>
import { saveProfileInfo, getProfileInfo, updateProfileXml } from '@/api/eqprofile'
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import components from '@/views/profile/components'
import { profileList } from '@/config/dropdown'
import onLineDetail from './onLineDetail'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'ExportEqpProfile',
  components: {
    ...components,
    onLineDetail
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    dataDetail: {
      type: Object,
      default() {
        return {
          common: {},
          processDataReportBlock: {
            blockType: 'Process Data Report',
            description: '',
            reportTo: [],
            reportType: '',
            tpDatas: []
          },
          apcDataBlock: {
            blockType: 'APC Data',
            description: '',
            reportTo: [],
            reportType: '',
            tpDatas: []
          },
          dailyCheckProcessDataBlock: {
            blockType: 'Daily Check Process Data',
            description: '',
            reportTo: [],
            reportType: '',
            tpDatas: []
          },
          apcDataDownloadBlock: {
            blockType: 'APC Data Download',
            description: '',
            reportTo: [],
            reportType: '',
            tpDatas: []
          },
          recipeParameterRequestBlock: {
            blockType: 'Recipe Parameter Request',
            description: '',
            reportTo: [],
            reportType: '',
            tpDatas: []
          },
          energyVisualizationBlock: {
            blockType: 'Energy Visualization',
            description: '',
            reportTo: [],
            reportType: '',
            tpDatas: []
          },
          iOSensor: {
            blockType: 'IO Sensor',
            description: '',
            reportTo: [],
            reportType: '',
            tpDatas: []
          },
          efu: {
            blockType: 'EFU',
            description: '',
            reportTo: [],
            reportType: '',
            tpDatas: []
          },
          ionizerFan: {
            blockType: 'IonizerFan',
            description: '',
            reportTo: [],
            reportType: '',
            tpDatas: []
          },
          position: { tpDatas: [] },
          alarm: { tpDatas: [] }
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      showUpdateMapDialog: false,
      showOnLineDetail: false,
      filter: {},
      profileList: profileList,
      checkedList: ['common'],
      version: '',
      equipmentNo: '',
      fileName: '',
      email: '',
      updateNotes: '',
      detailData: {},
      emailGroup: [],
      childList: [],
      equipmentList: [],
      common: null,
      apcDataBlock: null,
      apcDataDownloadBlock: null,
      dailyCheckProcessDataBlock: null,
      energyVisualizationBlock: null,
      processDataReportBlock: null,
      recipeParameterRequestBlock: null,
      iOSensor: null,
      efu: null,
      ionizerFan: null,
      alarm: null,
      position: null
    }
  },
  methods: {
    t,
    updateMapHandler() {
      this.loading = true
      const tempObj = {}
      this.checkedList.forEach(element => {
        tempObj[element] = this[element]
      })
      return updateProfileXml(tempObj)
        .then(res => {
          this.showUpdateMapDialog = false
          this.showOnLineDetail = true
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getEquipmentList(lineId) {
      this.loading = true
      return getEquipmentList({
        condition: {
          lineId: lineId
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
    childHandler(childList) {
      switch (childList.blockType) {
        case 'Common':
          delete childList.blockType
          this.common = childList
          break
        case 'APC Data':
          this.apcDataBlock = childList
          break
        case 'APC Data Download':
          this.apcDataDownloadBlock = childList
          break
        case 'Daily Check Process Data':
          this.dailyCheckProcessDataBlock = childList
          break
        case 'Energy Visualization':
          this.energyVisualizationBlock = childList
          break
        case 'IO Sensor':
          this.iOSensor = childList
          break
        case 'EFU':
          this.efu = childList
          break
        case 'IonizerFan':
          this.ionizerFan = childList
          break
        case 'Process Data Report':
          this.processDataReportBlock = childList
          break
        case 'Recipe Parameter Request':
          this.recipeParameterRequestBlock = childList
          break
        case 'Alarm':
          delete childList.blockType
          this.alarm = childList
          break
        case 'Position':
          delete childList.blockType
          this.position = childList
          break
      }
    },
    searchHandler() {
      this.getProfileInfo()
    },
    saveHandler() {
      this.loading = true
      return saveProfileInfo({
        apcDataBlock: this.apcDataBlock,
        common: this.common,
        apcDataDownloadBlock: this.apcDataDownloadBlock,
        dailyCheckProcessDataBlock: this.dailyCheckProcessDataBlock,
        energyVisualizationBlock: this.energyVisualizationBlock,
        iOSensor: this.iOSensor,
        efu: this.efu,
        ionizerFan: this.ionizerFan,
        processDataReportBlock: this.processDataReportBlock,
        recipeParameterRequestBlock: this.recipeParameterRequestBlock,
        position: this.position,
        alarm: this.alarm
      })
        .then(res => {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.$store
              .dispatch('delViewByRouteName', 'EditProfile')
              .then(() => {
                // setTimeout(() => {
                this.$router.push({ name: 'ProfileList' })
                // }, 1000)
              })
          })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    successHandler() {
      this.showOnLineDetail = false
    },
    cancelHandler() {
      this.showOnLineDetail = false
    },
    getProfileInfo() {
      this.loading = true
      return getProfileInfo({
        shop: this.filter.shop,
        lineId: this.filter.lineId,
        equipmentNo: this.equipmentNo,
        profileName: this.fileName,
        version: this.version
      })
        .then(res => {
          this.filter.shop = res.body.rows.shop
          this.filter.lineId = res.body.rows.lineId
          this.equipmentNo = res.body.rows.equipmentNo
          this.fileName = res.body.rows.fileName
          this.version = res.body.rows.version
          this.emailGroup = res.body.rows.emailNotification
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    changeHandler($event) {
      this.equipmentNo = ''
      this.filter = Object.assign({}, this.filter, $event)
      this.getEquipmentList(this.filter.lineId)
    }
  }
}
</script>
