<template>
  <div class="app-container">
    <el-form ref="lineScenarioForm" :model="lineScenarioForm" label-width="150px">
      <el-row :gutter="20">
        <el-col :xs="24" :md="9">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="Shop" prop="shop">
            <el-select v-model="lineScenarioForm.shop" :placeholder="t('tip.pleaseSelect')" filterable clearable>
              <el-option v-for="item in shopList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="9">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="LineId" prop="lineName">
            <el-select
              v-model="lineScenarioForm.lineName"
              :placeholder="t('tip.pleaseSelect')"
              filterable
              default-first-option
              clearable
              @change="getLocalScenarioList">
              <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineId" :value="item.lineId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="9">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="ScenarioName"
            prop="scenarioName">
            <el-select
              v-model="lineScenarioForm.scenarioName"
              :placeholder="t('tip.pleaseSelect')"
              allow-create
              filterable
              default-first-option
              clearable>
              <el-option
                v-for="(item,index) in fileList"
                :key="index"
                :label="item.scenarioName"
                :value="item.scenarioName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="9">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="ScenarioDesc"
            prop="scenarioDesc">
            <el-input v-model="lineScenarioForm.scenarioDesc" :placeholder="t('tip.pleaseSelect')" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="4">
          <div style="width:200px">
            <el-button
              :loading="loading"
              :disabled="!lineScenarioForm.scenarioName"
              type="primary"
              @click="saveHandler('lineScenarioForm')">
            <svg-icon :icon-class="'save'" /> {{ t('btn.save' ) }}</el-button>
            <el-button v-authorize="'remove'" :loading="loading" :disabled="!lineScenarioForm.scenarioName" type="danger" @click="removeLineScenarioHandler">
            <svg-icon :icon-class="'remove'" /> {{ t('btn.remove' ) }}</el-button>
            <!-- <el-button :loading="loading" :disabled="!lineScenarioForm.scenarioName" type="success">
              <svg-icon :icon-class="'clean'" /> {{ t('btn.clean' ) }}</el-button> -->
          </div>
        </el-col>
        <el-col :sm="24">
          <fieldset class="fieldset">
            <legend style="padding:0px 10px">Setting Form</legend>
            <el-row>
              <el-col :lg="6" :md="12">
                <el-form-item label="SCE TackTime" prop="sceTackTime">
                  <el-input-number :min="0" v-model="lineScenarioForm.setting.scenTackTime" clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="12">
                <el-form-item label="Unit TrackTime" prop="unitTrackTime">
                  <el-input-number :min="0" v-model="lineScenarioForm.setting.unitTackTime" clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="12">
                <el-form-item label="Glass IntervalTime" prop="glassIntervalTime">
                  <el-input-number :min="0" v-model="lineScenarioForm.setting.glassIntervalTime" clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="12">
                <el-form-item label="Stress Count" prop="stressCount">
                  <el-input-number :min="0" v-model="lineScenarioForm.setting.stressCount" clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="12">
                <el-form-item label="Curr Count" prop="curCount">
                  <el-input-number v-model="lineScenarioForm.setting.curCount" disabled clearable />
                </el-form-item>
              </el-col>
              <el-col :lg="6" :md="12">
                <el-form-item label="Mode" prop="mode">
                  <el-radio-group v-model="lineScenarioForm.setting.mode">
                    <el-radio label="Auto">Auto</el-radio>
                    <el-radio label="Manual">Manual</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :lg="12">
                <el-form-item label="Infinte">
                  <el-checkbox v-model="lineScenarioForm.setting.infinte" />
                  <div class="btn-container">
                    <el-button
                      :loading="loading"
                      :disabled="!lineScenarioForm.scenarioName"
                      type="primary"
                      @click="dataSettingHandler">
                    <svg-icon :icon-class="'setting'" /> {{ t('btn.dataSetting') }}</el-button>
                    <el-button
                      :loading="loading"
                      :disabled="!lineScenarioForm.scenarioName"
                      type="success"
                      @click="startHandler">
                    <svg-icon :icon-class="'start'" /> {{ t('btn.start') }}</el-button>
                    <el-button :disabled="!lineScenarioForm.scenarioName" type="danger" @click="stopHandler">
                    <svg-icon :icon-class="'stop'" /> {{ t('btn.stop') }}</el-button>
                    <el-button :disabled="!lineScenarioForm.scenarioName" type="success" @click="cleanLineScenarioLog">
                    <svg-icon :icon-class="'cleanlog'" />{{ t('btn.cleanLog') }}</el-button>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </fieldset>
        </el-col>
      </el-row>
    </el-form>
    <transition-group name="el-zoom-in-center">
      <el-form v-show="start" key="eventcount-datetime" label-width="150px">
        <fieldset class="fieldsetOfEventCount">
          <legend style="padding:0px 10px">Date Time & Date Time Long & Event Count</legend>
          <el-row :gutter="20">
            <el-col :lg="6" :md="6">
              <el-form-item label="Date Time" prop="dateTime">
                <el-input v-model="stressTestLog.dateTime" disabled/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="6">
              <el-form-item label="Date Time Long" prop="dateTimeLong">
                <el-input v-model="stressTestLog.dateTimeLong" disabled/>
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="6">
              <el-form-item label="Event Count" prop="eventCount">
                <el-input v-model="stressTestLog.eventCount" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
        </fieldset>
      </el-form>
      <el-table
        v-loading="loading"
        v-mousewheelX="'el-table__body-wrapper'"
        v-show="!start"
        key="lineScenarioList"
        :data="lineScenarioForm.localScenarioList"
        border
        fit
        highlight-current-row>
        <el-table-column label="#" type="index" width="80" align="center" />
        <el-table-column min-width="150" label="LocalScenarioName" prop="localScenario" align="center">
          <template slot-scope="curr">
            <el-select
              v-model="curr.row.scenarioName"
              :placeholder="t('tip.pleaseSelect')"
              allow-create
              filterable
              default-first-option
              @change="getLocalScenarioDesc(curr.row)">
              <el-option
                v-for="(item,index) in curr.row.localScenarioList"
                :key="index"
                :label="item.scenarioName"
                :value="item.scenarioName" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column min-width="150" label="LocalScenarioDesc" prop="scenarioDesc" align="center">
          <template slot-scope="curr">
            <el-input v-model="curr.row.scenarioDesc" disabled/>
          </template>
        </el-table-column>
        <el-table-column :label="t('column.actions')" width="80" align="center">
          <template slot-scope="curr">
            <el-button
              :disabled="!lineScenarioForm.scenarioName"
              type="danger"
              @click="removeHandler(curr.$index)">
              <svg-icon :icon-class="'remove'" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-loading="loading"
        v-mousewheelX="'el-table__body-wrapper'"
        v-show="start"
        key="logList"
        :data="stressTestLogList"

        border
        fit
        highlight-current-row>
        <el-table-column label="#" type="index" width="80" align="center" />
        <el-table-column min-width="150" label="DateTimeStart" prop="dateTimeStart" align="center" />
        <el-table-column min-width="150" label="DateTimeEnd" prop="dateTimeEnd" align="center" />
        <el-table-column min-width="150" label="LocalNo" prop="localNo" align="center" />
        <el-table-column min-width="150" label="EventName" prop="eventName" align="center" />
        <el-table-column min-width="150" label="Result" prop="result" align="center" />
        <el-table-column min-width="300" label="Description">
          <template slot-scope="curr">
            <el-tooltip :open-delay="500" :content="curr.row.description" placement="left">
              <span>{{ curr.row.description }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </transition-group>
    <div v-show="!start" style="margin-top:10px;text-align:right;">
      <el-button :loading="loading" :disabled="!lineScenarioForm.scenarioName" type="success" @click="addHandler">
      <svg-icon :icon-class="'plus'" />&nbsp;1</el-button>
    </div>
    <el-dialog
      :visible.sync="showDataSetting"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="t('dialog.eventDetail')"
      top="5vh"
      width="1000px">
      <div class="app-container">
        <el-table
          v-loading="loading"
          v-mousewheelX="'el-table__body-wrapper'"
          key="dataSettingList"
          :data="lineScenarioForm.dataSetList"

          border
          fit
          highlight-current-row>
          <el-table-column min-width="150" label="PortNo" prop="portNo">
            <template slot-scope="curr">
              <el-input-number v-model="curr.row.portNo" :percision="0" :min="1" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column min-width="150" label="CstID" prop="cstId">
            <template slot-scope="curr">
              <el-input v-model="curr.row.cstId" clearable />
            </template>
          </el-table-column>
          <el-table-column min-width="150" label="CstSeqStart" prop="cstSeqStart">
            <template slot-scope="curr">
              <el-input-number v-model="curr.row.cstSeqStart" :percision="0" :min="0" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column min-width="150" label="CstSeqEnd" prop="cstSeqEnd">
            <template slot-scope="curr">
              <el-input-number v-model="curr.row.cstSeqEnd" :percision="0" :min="0" controls-position="right" />
            </template>
          </el-table-column>
          <el-table-column :label="t('column.actions')" width="80" align="center" fixed="right">
            <template slot-scope="curr">
              <el-button type="danger" @click="removeDataSettingHandler(curr.$index)">
                <svg-icon :icon-class="'remove'" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="card-footer">
          <el-button :loading="loading" type="success" @click="addDataSettingHandler">
          <svg-icon :icon-class="'plus'" />&nbsp;1</el-button>
          <el-button :loading="loading" type="primary" @click="showDataSetting=false">
          <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}</el-button>
          <el-button type="primary" @click="showDataSetting=false">
          <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getLineScenarioList,
  startLineScenario,
  stopLineScenario,
  saveLineScenario,
  deleteLineScenario
} from '@/api/stressTest/lineScenario'
import {
  getLocalScenarioList
} from '@/api/stressTest/localScenario'
import {
  getLineList
} from '@/api/eqpmodel/line'
import EventDetail from './eventDetail'
import {
  shopList
} from '@/config'
import waves from '@/directive/waves' // 水波纹指令
import notice from '@/utils/notice'
import {
  mapState
} from 'vuex'
import {
  t
} from '@/utils'

export default {
  name: 'LineScenario',
  components: {
    EventDetail
  },
  directives: {
    waves
  },
  data() {
    return {
      loading: false,
      start: false,
      showDataSetting: false,
      shopList: shopList,
      lineList: [],
      filterLineList: [],
      fileList: [],
      localScenarioList: [],
      dataSettingList: [],
      stressTestLogList: [],
      lineScenarioForm: {
        shop: '',
        lineName: '',
        scenarioName: '',
        scenarioDesc: '',
        setting: {},
        dataSetList: [],
        localScenarioList: []
      },
      logList: []
    }
  },
  computed: {
    ...mapState({
      stressTestLog: state => state.socket.data.socket_publishStressTestLog
    })
  },
  watch: {
    stressTestLog() {
      this.monitorStressTestLog()
    },
    'lineScenarioForm.shop'() {
      this.getLineList()
    },
    'lineScenarioForm.lineName'() {
      this.getLineScenarioList()
    },
    'lineScenarioForm.scenarioName'() {
      this.lineScenarioForm = Object.assign({}, this.lineScenarioForm, this.fileList.find(item => item
        .scenarioName === this.lineScenarioForm.scenarioName))
      this.lineScenarioForm.localScenarioList.forEach(item => {
        if (!Object.hasOwnProperty(item, 'localScenarioList')) {
          this.$set(item, 'localScenarioList', this.localScenarioList)
        }
      })
    }
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
    monitorStressTestLog() {
      if (this.stressTestLog.curCount !== 0) {
        this.lineScenarioForm.setting.curCount = this.stressTestLog.curCount
      }
      if (this.stressTestLogList.length > 199) {
        this.stressTestLogList.splice(199, this.stressTestLogList.length - 199)
      }
      this.stressTestLogList.unshift(this.stressTestLog)
    },
    removeLineScenarioHandler() {
      return deleteLineScenario({
        shop: this.lineScenarioForm.shop,
        lineName: this.lineScenarioForm.lineName,
        scenarioName: this.lineScenarioForm.scenarioName
      }).then(() => {
        notice.success(this.t('tip.removeSuccess'))
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
    getLocalScenarioList() {
      return getLocalScenarioList({
        shop: this.lineScenarioForm.shop,
        lineName: this.lineScenarioForm.lineName
      }).then(res => {
        this.localScenarioList = res.body
      })
    },
    getLineScenarioList() {
      return getLineScenarioList({
        shop: this.lineScenarioForm.shop,
        lineName: this.lineScenarioForm.lineName
      }).then(res => {
        this.fileList = res.body
      })
    },
    addHandler() {
      this.lineScenarioForm.localScenarioList.push({
        scenarioName: '',
        scenarioDesc: '',
        tackTime: 1000,
        eventList: null,
        localScenarioList: this.localScenarioList
      })
    },
    removeHandler(index) {
      notice.confirm(this.t('tip.confirmRemove'), () => {
        this.lineScenarioForm.localScenarioList.splice(index, 1)
      })
    },
    addDataSettingHandler() {
      this.lineScenarioForm.dataSetList.push({
        portNo: 1,
        cstId: 'CST0001',
        cstSeqStart: 1,
        cstSeqEnd: 99
      })
    },
    removeDataSettingHandler(index) {
      notice.confirm(this.t('tip.confirmRemove'), () => {
        this.lineScenarioForm.dataSetList.splice(index, 1)
      })
    },
    saveHandler() {
      this.getTargetDate().then(res => {
        return saveLineScenario(res).then(() => {
          notice.success(this.t('tip.saveSuccess'))
        })
      })
    },
    dataSettingHandler() {
      this.showDataSetting = true
    },
    getTargetDate() {
      return new Promise((resolve, reject) => {
        const condition = JSON.parse(JSON.stringify(this.lineScenarioForm))
        condition.localScenarioList.filter(item => {
          delete item.localScenarioList
          delete item.eventList
        })
        if (condition.localScenarioList.length === 0) {
          notice.error('LocalScenarioList Can not be Empty!')
          reject()
        } else if (condition.localScenarioList.find(({ scenarioName }) => scenarioName === '')) {
          condition.localScenarioList = condition.localScenarioList.filter(({ scenarioName }) => scenarioName !== '')
        }
        this.lineScenarioForm.localScenarioList = condition.localScenarioList
        resolve(condition)
      })
    },
    startHandler() {
      this.start = true
      this.getTargetDate().then(res => {
        return startLineScenario(res).then().catch(() => {
          this.$message({
            message: 'ERROR!',
            type: 'error'
          })
        })
      })
    },
    stopHandler() {
      this.start = false
      this.loading = false
      return stopLineScenario().then()
    },
    getLocalScenarioDesc(row) {
      row.scenarioDesc = (this.localScenarioList.find(({ scenarioName }) => scenarioName === row.scenarioName) || {}).scenarioDesc
    },
    cleanLineScenarioLog() {
      this.stressTestLogList = []
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

  .fieldset {
    margin-bottom: 10px;
    padding-right: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 5px;

    legend {
      margin-left: 30px;
      font: bold 14px/20px '微软雅黑';
    }
  }

  .fieldsetOfEventCount {
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    margin-bottom: 10px;
    padding-top: 10px;

    legend {
      margin-left: 30px;
      font: bold 14px/20px '微软雅黑';
    }
  }

  .btn-container {
    position: absolute;
    right: 0;
    display: inline-block;
    background: #fff;
  }

</style>
