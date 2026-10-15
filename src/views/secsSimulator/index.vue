<template>
  <div class="app-container secs-simulator">
    <el-form ref="secsForm" :model="secsForm" :rules="rules" label-width="150px">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="1">
          <template slot="title">
            Connection Information&nbsp;&nbsp;
            <span v-show="connectionStatus">[HSMS Connected {{ collapseTitle }}]</span>
          </template>
          <el-row :gutter="20">
            <el-col :lg="8" :md="12">
              <el-form-item
                :rules="[{required: true,message:t('tip.pleaseSelect')}]"
                label="ConnectionName"
                prop="name"
              >
                <el-select
                  v-model="connectionName"
                  :disabled="connectionStatus"
                  :placeholder="t('tip.pleaseSelectConnectionName')"
                  clearable
                  filterable
                  class="el-input"
                  @focus="connNameFocusHandler"
                >
                  <el-option v-for="(item,index) in connectionList" :key="index" :label="item.name" :value="item.name" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item
                :rules="[{required: true,message:t('tip.pleaseSelect')}]"
                label="ConnectionMode"
                prop="connectionMode"
              >
                <el-select
                  v-model="secsForm.connectionMode"
                  :placeholder="t('tip.pleaseSelect')"
                  :disabled="connectionStatus"
                  clearable
                  filterable
                  class="el-input"
                >
                  <el-option
                    v-for="(item,index) in connectionModeList"
                    :key="index"
                    :label="item.label"
                    v-model="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="secsForm.connectionMode ==='PASSIVE'" :lg="8" :md="12">
              <el-form-item label="Local" prop="local">
                <el-input
                  v-model="secsForm.local"
                  :placeholder="t('tip.pleaseInput')"
                  :disabled="connectionStatus"
                  class="el-input"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="secsForm.connectionMode ==='ACTIVE'" :lg="8" :md="12">
              <el-form-item label="Remote" prop="remote">
                <el-input
                  :placeholder="t('tip.pleaseInput')"
                  :disabled="connectionStatus"
                  v-model="secsForm.remote"
                  class="el-input"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="DeviceID" prop="deviceID">
                <el-input
                  v-model="secsForm.deviceID"
                  :placeholder="t('tip.pleaseInput')"
                  :disabled="connectionStatus"
                  class="el-input"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item
                :rules="[{required: true,message:t('tip.pleaseSelect')}]"
                label="File Name"
                prop="secsLibraryFile"
              >
                <el-select
                  v-model="secsForm.secsLibraryFile"
                  :disabled="connectionStatus"
                  :placeholder="t('tip.pleaseSelectFileName')"
                  clearable
                  filterable
                  class="el-select"
                >
                  <el-option v-for="(item,index) in fileNameList" :key="index" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="T3 TimeOut" prop="t3">
                <el-input-number
                  v-model="secsForm.t3"
                  :placeholder="t('tip.pleaseInput')"
                  :precision="0"
                  :controls-position="'right'"
                  :min="0"
                  :disabled="connectionStatus"
                  class="el-input"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="T5 TimeOut" prop="t5">
                <el-input-number
                  v-model="secsForm.t5"
                  :placeholder="t('tip.pleaseInput')"
                  :precision="0"
                  :controls-position="'right'"
                  :min="0"
                  :disabled="connectionStatus"
                  class="el-input"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="T6 TimeOut" prop="t6">
                <el-input-number
                  v-model="secsForm.t6"
                  :placeholder="t('tip.pleaseInput')"
                  :precision="0"
                  :controls-position="'right'"
                  :min="0"
                  :disabled="connectionStatus"
                  class="el-input"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="T7 TimeOut" prop="t7">
                <el-input-number
                  v-model="secsForm.t7"
                  :placeholder="t('tip.pleaseInput')"
                  :precision="0"
                  :controls-position="'right'"
                  :min="0"
                  :disabled="connectionStatus"
                  class="el-input"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="T8 TimeOut" prop="t8">
                <el-input-number
                  v-model="secsForm.t8"
                  :placeholder="t('tip.pleaseInput')"
                  :precision="0"
                  :controls-position="'right'"
                  :min="0"
                  :disabled="connectionStatus"
                  class="el-input"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="Link Test" prop="linkTest">
                <el-input-number
                  v-model="secsForm.linkTest"
                  :placeholder="t('tip.pleaseInput')"
                  :precision="0"
                  :controls-position="'right'"
                  :min="0"
                  :disabled="connectionStatus"
                  class="el-input"
                />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="12">
              <el-form-item
                :rules="[{required: true,message:t('tip.pleaseSelect')}]"
                label="ConnectionType"
                prop="connectType"
              >
                <el-select
                  v-model="secsForm.connectType"
                  :disabled="connectionStatus"
                  :placeholder="t('tip.pleaseSelectConnectType')"
                  clearable
                  filterable
                  class="el-input"
                >
                  <el-option v-for="(item,index) in connectTypeList" :key="index" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="14">
              <el-form-item>
                <el-button :loading="loading" :disabled="connectionStatus" type="primary" @click="startHandler">
                  <svg-icon :icon-class="'start'" />
                  &nbsp;&nbsp;{{ t('btn.start') }}
                </el-button>
                <el-button :loading="loading" :disabled="!connectionStatus" type="danger" @click="stopHandler">
                  <svg-icon :icon-class="'stop'" />
                  &nbsp;&nbsp;{{ t('btn.stop') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div class="filter-container" style="margin:10px auto -10px;">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-button type="primary" class="filter-item" @click="showFileDetail=true">
            <svg-icon :icon-class="'add'" />
            {{ t('btn.createFile') }}
          </el-button>
          <el-select
            v-model="secsForm.secsLibraryFile"
            :disabled="connectionStatus"
            placeholder="Please select fileName"
            clearable
            filterable
            class="filter-item"
            style="width:260px;"
          >
            <el-option v-for="(item,index) in fileNameList" :key="index" :label="item" :value="item" />
          </el-select>
          <el-button
            :loading="loading"
            :disabled="!secsForm.secsLibraryFile"
            type="primary"
            class="filter-item"
            @click="saveHandler('generateMessage')"
          >
            <svg-icon :icon-class="'save'" />
            {{ t('btn.save') }}
          </el-button>
        </el-col>
        <el-col :span="8" style="text-align:right;">
          <el-button
            :loading="loading"
            :disabled="(!connectionStatus) || msgList.length===0"
            type="primary"
            class="filter-item"
            @click="sendHandler"
          >
            <svg-icon :icon-class="'send'" />
            &nbsp;{{ t('btn.send') }}
          </el-button>
          <el-button :disabled="transationList.length===0" type="primary" class="filter-item" @click="cleanLogHandler">
            <svg-icon :icon-class="'cleanlog'" />
            &nbsp;{{ t('btn.cleanLog') }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <Split v-model="splitValue" style="height:calc(100vh - 228px);border:1px solid #dcdee2;">
      <div slot="left">
        <div class="box-container">
          <div style="padding:10px;">
            <el-input v-model="filterMsg" prefix-icon="el-icon-search" placeholder="search" clearable />
          </div>
          <div v-if="Array.isArray(treeList)&&treeList.length>0">
            <el-tree
              ref="tree"
              :data="treeList"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              :props="{label:(item)=>`${item.label}`}"
              :default-expanded-keys="expandedKeys"
              :highlight-current="true"
              show-checkbox
              node-key="id"
              @check-change="handleCheckChange"
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span
                  v-contextmenu:contextmenu
                  :class="{'active':currentNodeData.label===node.label}"
                  @contextmenu="contextmenuhandler(data, node)"
                >{{ node.label }}</span>
                <span v-if="data.type==='file'" class="tree-actions">
                  <el-tooltip :content="t('btn.add')" :open-delay="300" :hide-after="1000" placement="top">
                    <span @click="addHandler(data,node)">
                      <svg-icon :icon-class="'add'" />
                    </span>
                  </el-tooltip>
                  <el-tooltip :content="t('btn.copy')" :open-delay="300" :hide-after="1000" placement="top">
                    <span @click="copyHandler(data,node)">
                      <svg-icon :icon-class="'copy'" />
                    </span>
                  </el-tooltip>
                  <el-tooltip :content="t('btn.remove')" :open-delay="300" :hide-after="1000" placement="top">
                    <span @click="removeHandler(data,node)">
                      <svg-icon :icon-class="'remove'" />
                    </span>
                  </el-tooltip>
                </span>
                <span v-else-if="data.type==='message'" class="tree-actions">
                  <el-tooltip
                    v-if="data.children.length===0"
                    :content="t('btn.add')"
                    :open-delay="300"
                    :hide-after="1000"
                    placement="top"
                  >
                    <span @click.stop="addHandler(data,node)">
                      <svg-icon :icon-class="'add'" />
                    </span>
                  </el-tooltip>
                  <el-tooltip :content="t('btn.copy')" :open-delay="300" :hide-after="1000" placement="top">
                    <span @click.stop="copyHandler(data,node)">
                      <svg-icon :icon-class="'copy'" />
                    </span>
                  </el-tooltip>
                  <el-tooltip :content="t('btn.remove')" :open-delay="300" :hide-after="1000" placement="top">
                    <span @click.stop="removeHandler(data,node)">
                      <svg-icon :icon-class="'remove'" />
                    </span>
                  </el-tooltip>
                </span>
                <span v-else class="tree-actions">
                  <el-tooltip
                    v-if="data.type==='LIST'"
                    :content="t('btn.add')"
                    :open-delay="300"
                    :hide-after="1000"
                    placement="top"
                  >
                    <span @click.stop="addHandler(data,node)">
                      <svg-icon :icon-class="'add'" />
                    </span>
                  </el-tooltip>
                  <el-tooltip :content="t('btn.remove')" :open-delay="300" :hide-after="1000" placement="top">
                    <span @click.stop="removeHandler(data,node)">
                      <svg-icon :icon-class="'remove'" />
                    </span>
                  </el-tooltip>
                </span>
              </span>
            </el-tree>
          </div>
          <NoData v-else/>
        </div>
      </div>
      <div slot="right" class="right-container">
        <el-tabs v-model="activeTab" type="border-card" style="height:100%; overflow-y:auto;">
          <el-tab-pane v-if="secsForm.secsLibraryFile&&!!currentNodeType" label="Edit Form" name="editForm">
            <component
              :is="currentNodeType"
              :data-detail="currentNodeData"
              :message-name-list="messageNameList"
              @updateNodeEvent="updateNodeHandler"
            />
          </el-tab-pane>
          <el-tab-pane
            v-if="secsForm.secsLibraryFile&&currentNodeType==='message'"
            label="Edit String"
            name="editString"
          >
            <el-input
              v-model="currentNodeData.dataItem"
              :disabled="loading"
              type="textarea"
              @blur="saveHandler('updateMessageString')"
            />
          </el-tab-pane>
          <el-tab-pane label="Transaction" name="transaction">
            <el-table
              ref="transactionTable"
              :data="pageInfo.dataList"
              :default-expand-all="defaultExpand"
              style="margin-bottom:10px;"
              border
              @header-click="clickHandler"
            >
              <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
              <el-table-column type="expand" width="55">
                <template slot-scope="props">
                  <pre v-text="props.row.message" />
                </template>
              </el-table-column>
              <el-table-column label="MessageName" prop="messageName" />
              <el-table-column label="State" prop="state" align="center" />
              <el-table-column label="Direction" prop="direction" align="center" />
              <el-table-column width="160px" label="Time" prop="time" align="center" />
            </el-table>
            <div class="card-footer">
              <el-pagination
                :total="pageInfo.total"
                :page-size="pageInfo.pageSize"
                :page-sizes="pageInfo.pageSizeList"
                :current-page="pageInfo.pageNo"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </Split>
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item
        :disabled="contextmenuData.children.length!==0&&contextmenuData.type==='message'||contextmenuData.type==='ASCII'"
        @click="contentMenuHandler('add')"
      >
        <svg-icon :icon-class="'add'" />
        &nbsp;&nbsp;&nbsp;{{ t('btn.add') }}
      </v-contextmenu-item>
      <v-contextmenu-item divider />
      <v-contextmenu-item
        :disabled="contextmenuData.type==='LIST'||contextmenuData.type==='ASCII'"
        @click="contentMenuHandler('copy')"
      >
        <svg-icon :icon-class="'copy'" />
        &nbsp;&nbsp;&nbsp;{{ t('btn.copy') }}
      </v-contextmenu-item>
      <v-contextmenu-item divider />
      <v-contextmenu-item @click="contentMenuHandler('remove')">
        <svg-icon :icon-class="'remove'" />
        &nbsp;&nbsp;&nbsp;{{ t('btn.remove') }}
      </v-contextmenu-item>
      <v-contextmenu-item divider />
      <v-contextmenu-item
        :disabled="(!connectionStatus)||contextmenuData.type==='file'"
        @click="contentMenuHandler('send')"
      >
        <svg-icon :icon-class="'send'" />
        &nbsp;&nbsp;&nbsp;{{ t('btn.send') }}
      </v-contextmenu-item>
    </v-contextmenu>
    <el-dialog
      :visible.sync="showFileDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
      top="30vh"
      title="Create File"
    >
      <file-detail v-if="showFileDetail" @successEvent="successHandler" @cancelEvent="showFileDetail = false" />
    </el-dialog>
    <el-dialog
      :visible.sync="showTimerDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="40%"
      top="30vh"
      title="Create File"
    >
      <el-form>
        <el-form-item label="SendCount" label-width="150px">
          <el-input-number v-model="sendCount" :min="1" :precision="0" :controls-position="'right'" style="width:100%;" />
        </el-form-item>
        <el-form-item label="IntervalTime(ms)" label-width="150px">
          <el-input-number v-model="timeOut" :min="0" :precision="0" :controls-position="'right'" style="width:100%;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showTimerDetail = false,sendMessage()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getMessageFileList,
  getMessageList,
  newMessageFile,
  saveMessage,
  sendMessage,
  startSimulator,
  stopSimulator,
  deleteMessageFile,
  copyMessageFile,
  settingMessage
} from '@/api/secsSimulator'
import { getConnectionList } from '@/api/secsSimulator/connection'
import FileDetail from '@/views/rvSimulator/message/detailforfile'
import { connectionModeList } from '@/config'
import NoData from '@/components/Nodata'
import { nodeTypeList } from '@/config'
import components from './components'
import notice from '@/utils/notice'
import vkbeautify from 'vkbeautify'
import { mapState } from 'vuex'
import { t } from '@/utils'
import dayjs from 'dayjs'
import { Promise } from 'q'

export default {
  name: 'SECSSimulator2',
  components: {
    ...components,
    FileDetail,
    NoData
  },
  data() {
    return {
      loading: false,
      showFileDetail: false,
      isCopyFile: false,
      defaultExpand: false,
      showTimerDetail: false,
      contextmenuData: { children: [] },
      contextmenuNode: {},
      connectionModeList: connectionModeList,
      splitValue: 0.25,
      copyNum: 0,
      newMessageNode: 0,
      newASCII: 0,
      timeOut: 0,
      sendCount: 1,
      newFileName: '',
      fileNameList: [],
      connectionStatus: false,
      connectionName: '',
      connectionList: [],
      secsForm: {},
      connectTypeList: ['Host', 'Eqp'],
      activeTab: 'editForm',
      filterMsg: '',
      collapseTitle: '',
      transationList: [],
      treeList: [],
      expandedKeys: [],
      currentNodeType: '',
      currentNodeData: {},
      nodeType: {},
      messageNameList: [],
      msgList: [],
      activeNames: ['1'],
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        pageNo: 1,
        dataList: []
      },
      rules: {
        remote: [
          {
            required: true,
            message: this.t('tip.pleaseInput'),
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]).*\:(\d{4})$/
              if (reg.test(value)) {
                callback()
              } else {
                callback(new Error('输入格式有误'))
              }
            },
            trigger: 'blur'
          }
        ],
        local: [
          {
            required: true,
            message: this.t('tip.pleaseInput'),
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]).*\:(\d{4})$/
              if (reg.test(value)) {
                callback()
              } else {
                callback(new Error('输入格式有误'))
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      messageLog: state => state.socket.data.socket_sendMessageLog
    })
  },
  watch: {
    connectionName() {
      this.secsForm = Object.assign(
        {},
        this.secsForm,
        this.connectionList.find(({ name }) => this.connectionName === name) ||
          {}
      )
      if (this.secsForm.connectionMode === 'ACTIVE') {
        this.collapseTitle = `${this.secsForm.connectType} ${this.secsForm.connectionMode} ${this.secsForm.remotePort}`
      } else {
        this.collapseTitle = `${this.secsForm.connectType} ${this.secsForm.connectionMode} ${this.secsForm.localPort}`
      }
      this.connectionStatus = this.secsForm.start
    },
    filterMsg(val) {
      this.$refs.tree.filter(val)
    },
    'secsForm.secsLibraryFile'() {
      this.getMessageList()
    },
    messageLog() {
      if (this.messageLog.connectName === this.connectionName) {
        if (this.transationList.length > 49) {
          this.transationList.splice(49, this.transationList.length - 49)
        }
        this.transationList.unshift(this.messageLog)
        this.getDataListByPage()
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.nodeType = nodeTypeList.reduce((nodeTypeObj, item) => {
        return Object.assign(nodeTypeObj, { [item.label]: item.value })
      }, {})
      this.getMessageFileList()
      this.getConnectionList()
    })
  },
  methods: {
    t,
    handleCheckChange(data, checked, indeterminate) {
      if (checked && data.type === 'message') {
        this.msgList.push(data)
      } else if (!checked && data.type === 'message') {
        if (this.msgList.find(({ label }) => label === data.label)) {
          this.msgList.splice(
            this.msgList.findIndex(({ label }) => label === data.label),
            1
          )
        }
      }
    },
    contextmenuhandler(data, node) {
      this.contextmenuData = data
      this.contextmenuNode = node
      this.currentNodeData = data
    },
    clickHandler() {
      this.defaultExpand = !this.defaultExpand
      this.pageInfo.dataList.forEach(row => {
        this.$refs['transactionTable'].toggleRowExpansion(
          row,
          this.defaultExpand
        )
      })
    },
    expandHandler(h, data) {
      return h('h4', 'aaa')
    },
    connNameFocusHandler() {
      this.getConnectionList()
    },
    startHandler() {
      this.$refs['secsForm'].validate(valid => {
        if (valid) {
          this.loading = true
          return startSimulator(this.secsForm)
            .then(res => {
              this.connectionStatus = res.body
              if (this.secsForm.connectionMode === 'ACTIVE') {
                const temp = this.secsForm.remote.split(':')[1]
                this.collapseTitle = `${this.secsForm.connectType} ${this.secsForm.connectionMode} ${temp}`
              } else {
                const temp = this.secsForm.local.split(':')[1]
                this.collapseTitle = `${this.secsForm.connectType} ${this.secsForm.connectionMode} ${temp}`
              }
              if (res.body) {
                notice.success(this.t('tip.openSuccess'))
                this.activeNames = []
              } else {
                notice.error(this.t('tip.openFailure'))
              }
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    stopHandler() {
      return stopSimulator(this.secsForm)
        .then(res => {
          this.connectionStatus = !res.body
          if (res.body) {
            notice.success(this.t('tip.stopSuccess'))
          } else {
            notice.error(this.t('tip.stopFailure'))
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    saveHandler(eventType) {
      this.loading = true
      const tempTreeList = this.treeList.slice(0, this.treeList.length)
      return new Promise(resolve => {
        if (eventType === 'generateMessage') {
          if (
            Array.isArray(tempTreeList) &&
            Array.isArray(tempTreeList[0].children)
          ) {
            tempTreeList[0].children.forEach(data => {
              Object.assign(data, {
                dataItem: vkbeautify.xml(this.getSECSMessageString(data, '', ''))
              })
            })
          }
        }
        resolve(tempTreeList)
      }).then(res => {
        return saveMessage({
          connectName: this.connectionName,
          message: tempTreeList
        })
          .then(res => {
            if (eventType === 'generateMessage') {
              notice.success(this.t('tip.saveSuccess'))
              this.loading = false
            } else {
              setTimeout(() => {
                this.loading = false
              }, 500)
            }
            this.getMessageList()
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    sendHandler() {
      // if (this.msgList.length !== 1) {

      // } else {
      //   this.timeOut = 0
      //   this.sendCount = 0
      //   this.sendMessage()
      // }
      this.showTimerDetail = true
    },
    sendMessage() {
      this.loading = true
      return sendMessage({
        timeOut: this.timeOut,
        sendCount: this.sendCount,
        msgList: this.msgList,
        connectName: this.connectionName,
        secsLibraryFile: this.secsForm.secsLibraryFile
      })
        .then(res => {
          this.$message({ message: 'Success!', type: 'success' })
          this.activeTab = 'transaction'
          if (Array.isArray(res.body)) {
            res.body.forEach(item => {
              if (item.connectName === this.connectionName) {
                this.transationList.unshift({
                  direction: item.direction,
                  state: item.state,
                  message: item.message,
                  messageName: item.messageName,
                  time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
                })
              }
            })
            this.getDataListByPage()
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    contextmenuSendMessage() {
      this.loading = true
      return sendMessage({
        timeOut: this.timeOut,
        sendCount: this.sendCount,
        msgList: [this.currentNodeData],
        connectName: this.connectionName,
        secsLibraryFile: this.secsForm.secsLibraryFile
      })
        .then(res => {
          this.$message({ message: 'Success!', type: 'success' })
          this.activeTab = 'transaction'
          if (Array.isArray(res.body)) {
            res.body.forEach(item => {
              if (item.connectName === this.connectionName) {
                this.transationList.unshift({
                  direction: item.direction,
                  state: item.state,
                  message: item.message,
                  messageName: item.messageName,
                  time: dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')
                })
              }
            })
            this.getDataListByPage()
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.toUpperCase().includes(value.toUpperCase())
    },
    getUniqID({ id, children }) {
      let tempSeqNo = 0
      let tempLabel = `${id}-${tempSeqNo}`
      while (this.$lodash.map(children, 'id').includes(tempLabel)) {
        tempLabel = `${id}-${tempSeqNo++}`
      }
      return tempLabel
    },
    addHandler(data, node) {
      switch (data.type) {
        case 'file':
          data.children.unshift({
            id: this.getUniqID(data),
            label: `NewMessageNode_${++this.newMessageNode}`,
            type: 'message',
            children: [],
            dataItem: `<DataItem></DataItem>`,
            messageName: 'S0F0',
            description: '',
            stream: '',
            function: '',
            direction: 'H->E',
            wait: true,
            autoReply: false,
            noLogging: false,
            replyName: '',
            secsLibraryFile: `${this.secsForm.secsLibraryFile}`
          })
          this.activeTab = 'editForm'
          this.currentNodeType = 'message'
          this.currentNodeData = data.children[0]
          this.messageNameList = this.$lodash.map(
            node.parent.data[0].children,
            'messageName'
          )
          break
        case 'message':
          {
            const tempNum = data.children.push({
              id: this.getUniqID(data),
              label: `NewList`,
              type: 'LIST',
              children: [],
              itemName: '',
              count: 0,
              fixed: false,
              value: '0'
            })
            this.activeTab = 'editForm'
            this.currentNodeType = 'node'
            this.currentNodeData = data.children[tempNum - 1]
          }
          break
        default:
          {
            const tempNum = data.children.push({
              id: this.getUniqID(data),
              label: `NewASCII_${++this.newASCII}`,
              type: 'ASCII',
              children: [],
              itemName: '',
              count: 0,
              fixed: false,
              value: '0'
            })
            this.activeTab = 'editForm'
            this.currentNodeType = 'node'
            this.currentNodeData = data.children[tempNum - 1]
          }
          break
      }
    },
    copyHandler(data, node) {
      switch (data.type) {
        case 'file':
          this.showFileDetail = true
          this.isCopyFile = true
          break
        case 'message':
          {
            const targetData = JSON.parse(JSON.stringify(data))
            const updateNodeID = (targetNode, parentNodeData) => {
              if (targetNode.hasOwnProperty('id')) {
                targetNode.id = this.getUniqID(parentNodeData)
              }
              if (Array.isArray(targetNode.children)) {
                targetNode.children.forEach(item => {
                  updateNodeID(item, targetNode)
                })
              }
            }
            updateNodeID(targetData, node.parent.data)
            const index = this.$refs.tree.data[0].children.findIndex(
              item => item.messageName === data.messageName
            )
            node.parent.data.children.splice(
              index + 1,
              0,
              Object.assign({}, targetData, {
                label: `${data.label}_Copy${++this.copyNum}`
              })
            )
            this.currentNodeData = node.parent.data.children[index + 1]
          }
          break
      }
    },
    removeHandler(data, node) {
      notice.confirm(this.t('tip.removeMessage'), () => {
        switch (data.type) {
          case 'file':
            this.deleteMessageFileHandler()
            break
          default:
            {
              const removeIndex = this.$lodash.findIndex(
                node.parent.data.children,
                ({ id }) => {
                  return id === data.id
                }
              )
              node.parent.data.children.splice(removeIndex, 1)
            }
            break
        }
      })
    },
    handleNodeClick(data, node) {
      switch (data.type) {
        case 'file':
          this.currentNodeType = ''
          break
        case 'message':
          this.currentNodeType = 'message'
          this.currentNodeData = data
          this.messageNameList = this.$lodash.map(
            node.parent.data.children,
            'messageName'
          )
          this.$set(data, 'secsLibraryFile', this.secsForm.secsLibraryFile)
          // data.dataItem = vkbeautify.xml(this.getSECSMessageString(data))
          data.dataItem = this.getSECSMessageString(data, '', '')
          break
        default:
          this.activeTab = 'editForm'
          this.currentNodeType = 'node'
          this.currentNodeData = data
          break
      }
    },
    getConnectionList() {
      this.loading = true
      return getConnectionList({
        condition: {
          name: this.connectionName
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      })
        .then(res => {
          this.connectionList = res.body.rows
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getMessageFileList() {
      this.loading = true
      return getMessageFileList({})
        .then(res => {
          this.fileNameList = res.body
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    successHandler(fileName, dialogTitle) {
      this.newFileName = fileName.includes('.')
        ? fileName.replace(/\.[a-z]*/i, '.xml')
        : `${fileName}.xml`
      switch (dialogTitle) {
        case 'newMessageFile':
          this.loading = true
          if (this.isCopyFile) {
            // 保存Message
            this.copyMessageFileHandler()
          } else {
            return newMessageFile({ secsLibraryFile: this.newFileName })
              .then(res => {
                notice.success(this.t('tip.saveSuccess'))
                this.showFileDetail = false
                this.getMessageList()
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          }
      }
    },
    getMessageList() {
      if (this.secsForm.secsLibraryFile) {
        this.loading = true
        return getMessageList({
          secsLibraryFile: this.secsForm.secsLibraryFile
        })
          .then(res => {
            this.activeTab = 'editForm'
            this.currentNodeType = ''
            this.currentNodeData = {}
            this.messageNameList = []
            this.treeList.splice(0, this.treeList.length)
            const parentNode = {
              id: '1',
              label: res.body.secsLibraryFile,
              type: 'file',
              children: []
            }
            const getNode = (target, parent) => {
              if (
                Array.isArray(target.children) &&
                target.children.length > 0
              ) {
                target.children.forEach((item, index) => {
                  let childNode = {
                    id: `${parent.id}-${index}`,
                    label: item.label,
                    type: item.type,
                    children: []
                  }
                  if (item.type === 'message') {
                    childNode = Object.assign({}, childNode, {
                      dataItem: item.dataItem,
                      messageName: item.messageName,
                      description: item.description,
                      stream: item.stream,
                      function: item.function,
                      direction: item.direction,
                      wait: item.wait,
                      autoReply: item.autoReply,
                      noLogging: item.noLogging,
                      replyName: item.replyName
                    })
                  } else {
                    childNode = Object.assign({}, childNode, {
                      itemName: item.itemName,
                      count: item.count,
                      fixed: item.fixed,
                      value: item.value
                    })
                  }
                  if (
                    Array.isArray(item.children) &&
                    item.children.length > 0
                  ) {
                    getNode(item, childNode)
                  }
                  parent.children.push(childNode)
                })
              }
            }
            getNode(res.body, parentNode)
            this.treeList.push(parentNode)
            this.expandedKeys.push('1')
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.treeList.splice(0, this.treeList.length)
      }
    },
    getSECSMessageString(objectMessage, listTab, itemTab) {
      let messageString = ''
      objectMessage.children.forEach(item => {
        var count = 0
        if (item.type === 'LIST') {
          count = item.children.length
        } else {
          count = item.count
        }
        messageString = `${messageString}${itemTab}<${
          this.nodeType[item.type]
        } [${count}] [${item.itemName}]`
        if (item.type !== 'LIST') {
          messageString = `${messageString} '${item.value}'>`
        }
        messageString = `${messageString} \n`
        if (item.children.length > 0) {
          listTab = `${itemTab}`
          itemTab = `${itemTab}\t`
          messageString = `${messageString} ${this.getSECSMessageString(item, listTab, itemTab)}`
        }
        if (item.type === 'LIST') {
          messageString = `${messageString} ${listTab}>\n`
        }
      })
      return messageString
    },
    settingMessage(data) {
      if (this.connectionName) {
        this.loading = true
        const temp = Object.assign(data, { connectName: this.connectionName })
        return settingMessage(temp)
          .then(() => {
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    updateNodeHandler($event, type) {
      if (type === 'button') {
        this.settingMessage($event)
      }
      this.getTargetTreeList(this.$refs.tree.data[0])
      const currNode = this.$refs.tree.getNode($event.id)
      if (currNode && currNode.hasOwnProperty('parent')) {
        const parentNode = this.$refs.tree.getNode($event.id).parent
        const index = parentNode.data.children.findIndex(
          ({ id }) => id === $event.id
        )
        const updateNodeList = parentNode.data.children.slice(
          0,
          parentNode.data.children.length
        )
        switch ($event.type) {
          case 'message':
            $event = Object.assign({}, $event, {
              label: `${$event.messageName}:${$event.description}`
            })
            break
          default:
            $event = Object.assign({}, $event, {
              label: `${$event.type} ${$event.count}  ${$event.itemName ||
                ''} ${$event.value}`
            })
            break
        }
        updateNodeList.splice(index, 1, $event)
        this.expandedKeys.splice(1, this.expandedKeys.length - 1, $event.id)
        this.$refs.tree.updateKeyChildren(parentNode.data.id, updateNodeList)
      } else {
        console.log('目标节点已经被删除！')
      }
    },
    getTargetTreeList(arr) {
      this.treeList[0].children = arr.children.sort((value1, value2) => {
        const [tempStream1, tempFunction1] = value1.messageName
          .split('_')[0]
          .match(/(S|F)?\d+/g)
        const [tempStream2, tempFunction2] = value2.messageName
          .split('_')[0]
          .match(/(S|F)?\d+/g)
        const tempStreamArr1 = Array.from(tempStream1)
        const tempFunctionArr1 = Array.from(tempFunction1)
        const tempStreamArr2 = Array.from(tempStream2)
        const tempFunctionArr2 = Array.from(tempFunction2)
        let val1 = ''
        let val2 = ''
        let val3 = ''
        let val4 = ''
        if (tempStreamArr1.length === 2) {
          tempStreamArr1.splice(1, 0, '00')
          val1 = tempStreamArr1.join('')
        } else if (tempStreamArr1.length === 3) {
          tempStreamArr1.splice(1, 0, '0')
          val1 = tempStreamArr1.join('')
        } else if (tempStreamArr1.length === 4) {
          val1 = tempStreamArr1.join('')
        }
        if (tempFunctionArr1.length === 2) {
          tempFunctionArr1.splice(1, 0, '00')
          val2 = tempFunctionArr1.join('')
        } else if (tempFunctionArr1.length === 3) {
          tempFunctionArr1.splice(1, 0, '0')
          val2 = tempFunctionArr1.join('')
        } else if (tempFunctionArr1.length === 4) {
          val2 = tempFunctionArr1.join('')
        }

        if (tempStreamArr2.length === 2) {
          tempStreamArr2.splice(1, 0, '00')
          val3 = tempStreamArr2.join('')
        } else if (tempStreamArr2.length === 3) {
          tempStreamArr2.splice(1, 0, '0')
          val3 = tempStreamArr2.join('')
        } else if (tempStreamArr2.length === 4) {
          val3 = tempStreamArr2.join('')
        }
        if (tempFunctionArr2.length === 2) {
          tempFunctionArr2.splice(1, 0, '00')
          val4 = tempFunctionArr2.join('')
        } else if (tempFunctionArr2.length === 3) {
          tempFunctionArr2.splice(1, 0, '0')
          val4 = tempFunctionArr2.join('')
        } else if (tempFunctionArr2.length === 4) {
          val4 = tempFunctionArr2.join('')
        }
        if (`${val1}${val2}` < `${val3}${val4}`) {
          return -1
        } else if (`${val1}${val2}` < `${val3}${val4}`) {
          return 1
        } else {
          return 0
        }
      })
    },
    cleanLogHandler() {
      this.transationList.splice(0, this.transationList.length)
      this.getDataListByPage()
    },
    copyMessageFileHandler() {
      this.loading = true
      return copyMessageFile({
        secsLibraryFile: this.secsForm.secsLibraryFile,
        copyFileName: this.newFileName
      })
        .then(res => {
          this.showFileDetail = false
          this.getMessageFileList()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    deleteMessageFileHandler() {
      this.loading = true
      return deleteMessageFile({
        secsLibraryFile: this.secsForm.secsLibraryFile
      })
        .then(() => {
          this.getMessageFileList()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    contentMenuHandler(type) {
      switch (type) {
        case 'add':
          this.addHandler(this.contextmenuData, this.contextmenuNode)
          break
        case 'copy':
          this.copyHandler(this.contextmenuData, this.contextmenuNode)
          break
        case 'remove':
          this.removeHandler(this.contextmenuData, this.contextmenuNode)
          break
        case 'send':
          this.contextmenuSendMessage()
          break
      }
    },
    getDataListByPage() {
      this.loading = true
      this.pageInfo.total = this.transationList.length
      this.pageInfo.dataList = this.$lodash.slice(
        this.transationList,
        (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize,
        this.pageInfo.pageNo * this.pageInfo.pageSize
      )
      this.loading = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getDataListByPage()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getDataListByPage()
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}
</script>
<style lang="scss">
.secs-simulator {
  padding: 10px 20px;

  .el-textarea {
    height: calc(100vh - 350px);

    .el-textarea__inner {
      height: 100% !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.el-input,
.el-select {
  width: 100%;
}

.box-container {
  .el-tree {
    height: calc(100vh - 288px);
    overflow-y: auto;

    .tree-actions {
      span {
        padding: 2px;
        margin: 0 5px;
        &:hover {
          border-radius: 2px;
          box-shadow: 0 0 1px 2px #409eff;
        }
      }
    }
  }
}

.active {
  color: #fff;
  background-color: rgb(84, 164, 201);
}

.right-container {
  height: 100%;
  overflow-y: auto;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.secs-item-type {
  label {
    width: 100px;
    margin: 5px 15px 5px 0;
  }
}
</style>
