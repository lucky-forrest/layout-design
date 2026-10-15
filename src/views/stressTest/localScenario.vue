<template>
  <div class="app-container">
    <el-form ref="localScenarioForm" :model="localScenarioForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="Shop" prop="shop">
            <el-select v-model="localScenarioForm.shop" :placeholder="t('tip.pleaseSelect')" filterable clearable>
              <el-option v-for="item in shopList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="LineId" prop="lineName">
            <el-select
              v-model="localScenarioForm.lineName"
              :placeholder="t('tip.pleaseSelect')"
              filterable
              default-first-option
              clearable>
              <el-option v-for="(item,index) in filterLineList" :key="index" :label="item.lineId" :value="item.lineId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="ScenarioName"
            prop="scenarioName">
            <el-select
              v-model="localScenarioForm.scenarioName"
              :placeholder="t('tip.pleaseSelect')"
              allow-create
              filterable
              clearable
              default-first-option>
              <el-option
                v-for="(item,index) in fileList"
                :key="index"
                :label="item.scenarioName"
                :value="item.scenarioName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="TackTime" prop="tackTime">
            <el-input-number v-model="localScenarioForm.tackTime" style="text-align:center" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="ScenarioDesc"
            prop="scenarioDesc">
            <el-input v-model="localScenarioForm.scenarioDesc" :placeholder="t('tip.pleaseSelect')"/>
          </el-form-item>
        </el-col>
        <el-col :span="18">
          <el-form-item>
            <el-button :loading="loading" :disabled="!localScenarioForm.scenarioName" type="primary" @click="saveHandler('localScenarioForm')">
            <svg-icon :icon-class="'save'" /> {{ t('btn.save' ) }}</el-button>
            <el-button v-authorize="'remove'" :loading="loading" :disabled="!localScenarioForm.scenarioName" type="danger" @click="deleteHandler">
            <svg-icon :icon-class="'remove'" /> {{ t('btn.remove' ) }}</el-button>
            <el-button :loading="loading" :disabled="localScenarioForm.eventList.length===0" type="success" @click="cleanHandler">
            <svg-icon :icon-class="'clean'" /> {{ t('btn.clean' ) }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      v-loading="loading"
      v-mousewheelX="'el-table__body-wrapper'"
      :data="localScenarioForm.eventList"
      border
      fit
      highlight-current-row>
      <el-table-column label="#" type="index" width="80" align="center" />
      <el-table-column min-width="150" label="LocalNo" prop="localNo" align="center">
        <template slot-scope="curr">
          <el-select
            v-model="curr.row.localNo"
            :placeholder="t('tip.pleaseSelect')"
            allow-create
            filterable
            default-first-option>
            <el-option
              v-for="(item,index) in curr.row.equipmentList"
              :key="index"
              :label="item.equipmentNo"
              :value="item.equipmentNo" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column min-width="150" label="EventName" prop="eventName" align="center">
        <template slot-scope="curr">
          <el-select
            v-model="curr.row.eventName"
            :placeholder="t('tip.pleaseSelect')"
            allow-create
            filterable
            default-first-option
            @change="getLocalData(curr.row)">
            <el-option
              v-for="(item,index) in curr.row.eventList"
              :key="index"
              :label="item.eventName"
              :value="item.eventName" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column min-width="150" label="Itc" prop="triggerCondition" align="center"/>
      <el-table-column min-width="150" label="EventGroup" prop="eventGroup" align="center">
        <template slot-scope="curr">
          <el-input-number v-model="curr.row.eventGroup" :min="0" :precision="0" controls-position="right" clearable />
        </template>
      </el-table-column>
      <el-table-column min-width="150" label="GroupNo" prop="groupNo" align="center">
        <template slot-scope="curr">
          <el-input-number v-model="curr.row.groupNo" :min="0" :precision="0" controls-position="right" clearable />
        </template>
      </el-table-column>
      <el-table-column :label="t('column.actions')" min-width="70" align="center">
        <template slot-scope="curr">
          <el-button :disabled="!localScenarioForm.scenarioName" type="danger" @click="removeHandler(curr.$index)">
            <svg-icon :icon-class="'remove'" />
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;text-align:right;">
      <el-button :loading="loading" :disabled="!localScenarioForm.scenarioName" type="success" @click="addHandler">
      <svg-icon :icon-class="'plus'" />&nbsp;1</el-button>
    </div>
  </div>
</template>

<script>
import { getLocalScenarioList, saveLocalScenario, deleteLocalScenario } from '@/api/stressTest/localScenario'
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import { getEventList } from '@/api/stressTest/eventList'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { getLineList } from '@/api/eqpmodel/line'
import waves from '@/directive/waves' // 水波纹指令
import EventDetail from './eventDetail'
import notice from '@/utils/notice'
import { shopList } from '@/config'
import { t } from '@/utils'
import axios from 'axios'

export default {
  name: 'LocalScenario',
  components: {
    EventDetail
  },
  directives: {
    waves,
    elDragDialog
  },
  data() {
    return {
      loading: false,
      shopList: shopList,
      lineList: [],
      filterLineList: [],
      fileList: [],
      equipmentList: [],
      eventList: [],
      localScenarioForm: {
        shop: '',
        lineName: '',
        scenarioName: '',
        scenarioDesc: '',
        tackTime: '',
        eventList: []
      }
    }
  },
  watch: {
    'localScenarioForm.shop'(currVal) {
      this.filterLineList = Array.isArray(this.lineList) ? this.lineList.filter(({ shopName }) => shopName === currVal) : []
    },
    'localScenarioForm.lineName'() {
      this.fileList.splice(0, this.fileList.length)
      this.localScenarioForm.scenarioName = ''
      axios.all([this.getEquipmentList(), this.getEventList()]).then(axios.spread(() => {
        this.getLocalScenarioList()
      }))
    },
    'localScenarioForm.scenarioName'(currVal) {
      if (currVal) {
        this.localScenarioForm = Object.assign({}, this.localScenarioForm, this.fileList.slice(0, this.fileList.length).find(item => item
          .scenarioName === this.localScenarioForm.scenarioName))
        this.localScenarioForm.eventList.forEach(item => {
          if (!item.hasOwnProperty('equipmentList')) {
            this.$set(item, 'equipmentList', this.equipmentList)
          }
          if (!item.hasOwnProperty('eventList')) {
            this.$set(item, 'eventList', this.eventList)
          }
        })
      }
    }
  },
  created() {
    this.getLineList()
  },
  mounted() {
    this.$nextTick(() => {
      this.tips()
    })
  },
  methods: {
    t,
    tips() {
      this.$notify.info({
        title: 'Tips:',
        message: '若您需要新增Scenario，请在输入ScenarioName后，点击回车键！'
      })
    },
    getLineList() {
      return getLineList({
        condition: {},
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.lineList = res.body.rows
      })
    },
    getEquipmentList() {
      this.loading = true
      return getEquipmentList({
        condition: {
          shop: this.localScenarioForm.shop,
          lineId: this.localScenarioForm.lineName
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.equipmentList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getEventList() {
      this.loading = true
      return getEventList({ }).then(res => {
        this.eventList = res.body
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getLocalScenarioList() {
      return getLocalScenarioList({
        shop: this.localScenarioForm.shop,
        lineName: this.localScenarioForm.lineName
      }).then(res => {
        this.fileList = res.body
      })
    },
    addHandler() {
      this.localScenarioForm.eventList.push({
        localNo: '',
        eventName: '',
        itc: '',
        unitNo: 1,
        eventGroup: '',
        groupNo: '',
        equipmentList: this.equipmentList,
        eventList: this.eventList
      })
    },
    removeHandler(index) {
      notice.confirm(this.t('tip.confirmRemove'), () => {
        this.localScenarioForm.eventList.splice(index, 1)
      })
    },
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let errMsg = ''
          if (this.localScenarioForm.eventList.length === 0) {
            errMsg = 'event is required !'
          } else {
            for (const [index, item] of Object.entries(this.localScenarioForm.eventList)) {
              if (!item.localNo) {
                errMsg = `Row ${+index + 1} localNo is required !`
                break
              }
              if (!item.eventName) {
                errMsg = `Row ${+index + 1} eventName is required !`
                break
              }
            }
          }
          if (errMsg) {
            notice.error(errMsg)
          } else {
            const eventList = []
            this.localScenarioForm.eventList.forEach(({ blockName, eventGroup, eventName, groupNo, itc, items, localNo, repeatReportByGlass, timeOut, triggerCondition, unitNo
            }) => {
              eventList.push({
                blockName,
                eventGroup,
                eventName,
                groupNo,
                itc,
                items,
                localNo,
                repeatReportByGlass,
                timeOut,
                triggerCondition,
                unitNo
              })
            })
            this.loading = true
            const targetObj = Object.assign({}, this.localScenarioForm, { eventList: eventList })
            return saveLocalScenario(targetObj).then(res => {
              this.loading = false
              notice.success(this.t('tip.saveSuccess'))
            }).catch(() => {
              this.loading = false
            })
          }
        }
      })
    },
    deleteHandler() {
      notice.confirm(this.t('tip.confirmRemove'), () => {
        this.loading = true
        return deleteLocalScenario({
          shop: this.localScenarioForm.shop,
          lineName: this.localScenarioForm.lineName,
          scenarioName: this.localScenarioForm.scenarioName
        }).then(() => {
          notice.success(this.t('tip.removeSuccess'))
          this.localScenarioForm.scenarioName = ''
          this.getLocalScenarioList()
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    getLocalData(row) {
      row.groupNo = (this.eventList.find(({ eventName }) => eventName === row.eventName) || {}).groupNo
      row.eventGroup = (this.eventList.find(({ eventName }) => eventName === row.eventName) || {}).eventGroup
    },
    cleanHandler() {
      this.localScenarioForm.eventList = []
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

  .btn-container {
    position: absolute;
    right: 0;
    display: inline-block;
    background: #fff;
    width: 242px;
  }

</style>
