<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-collapse>
        <el-collapse-item title="Connection Information">
          <el-row :gutter="20">
            <el-col :xs="24" :md="12" :lg="6">
              <el-form-item label="ConnName" prop="connectionName">
                <el-select
                  v-model="connectionName"
                  :placeholder="t('tip.pleaseSelectConnectionName')"
                  clearable
                  filterable
                  class="el-input"
                >
                  <el-option
                    v-for="(item,index) in connectionList"
                    :key="index"
                    :label="item.connectionName"
                    :value="item.connectionName"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12" :lg="6">
              <el-form-item label="NewWork" prop="network">
                <el-input v-model="network" :placeholder="t('tip.pleaseInput')" class="el-input" autofocus clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12" :lg="6">
              <el-form-item label="Service" prop="service">
                <el-input v-model="service" :placeholder="t('tip.pleaseInput')" class="el-input" autofocus clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12" :lg="6">
              <el-form-item label="Daemon" prop="daemon">
                <el-input v-model="daemon" :placeholder="t('tip.pleaseInput')" class="el-input" autofocus clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12" :lg="6">
              <el-form-item label="SelfSubject" prop="selfSubject">
                <el-input
                  v-model="selfSubject"
                  :placeholder="t('tip.pleaseInput')"
                  class="el-input"
                  autofocus
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12" :lg="6">
              <el-form-item label="TargetSubject" prop="targetSubject">
                <el-input
                  v-model="targetSubject"
                  :placeholder="t('tip.pleaseInput')"
                  class="el-input"
                  autofocus
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :md="12" :lg="12">
              <el-form-item>
                <el-button :disabled="isDisable" type="primary" @click="valiedConnectionName">
                  <svg-icon :icon-class="'start'" />
                  &nbsp;&nbsp;{{ t('btn.start') }}
                </el-button>
                <el-button :disabled="!isDisable" type="danger" @click="stopHandler">
                  <svg-icon :icon-class="'stop'" />
                  &nbsp;&nbsp;{{ t('btn.stop') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-collapse-item>
      </el-collapse>
      <el-row>
        <el-col :span="24">
          <el-select
            v-model="fileName"
            :placeholder="t('tip.pleaseSelectFileName')"
            :disabled="isDisable"
            style="width: 300px;margin:10px"
            clearable
            filterable
            class="filter-item"
          >
            <el-option v-for="(item,index) in fileNameList" :key="index" :label="item" :value="item" />
          </el-select>
          <el-button :disabled="isDisable" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
          <el-button type="primary" @click="saveHandler">
            <svg-icon :icon-class="'save'" />
            &nbsp;{{ t('btn.saveHistory') }}
          </el-button>
          <el-button type="primary" style="float:right;margin-top:10px;" @click="chenLogHandler">
            <svg-icon :icon-class="'cleanlog'" />
            &nbsp;{{ t('btn.cleanLog') }}
          </el-button>
          <el-button :disabled="!isDisable" type="primary" style="float:right;margin-top:10px;" @click="sendHandler">
            <svg-icon :icon-class="'send'" />
            &nbsp;{{ t('btn.send') }}
          </el-button>
        </el-col>
      </el-row>
    </el-form>
    <Split v-model="splitValue" style="height:calc(100vh - 228px);border:1px solid #dcdee2;">
      <div slot="left">
        <div class="message-List-container">
          <el-input
            v-model="messageText"
            prefix-icon="el-icon-search"
            placeholder="search"
            style="margin-bottom:5px;"
            clearable
          />
          <div v-if="Array.isArray(showMessageList)&&showMessageList.length>0">
            <el-tooltip
              v-for="(item,index) in showMessageList"
              :open-delay="500"
              :key="index"
              :content="item.key"
              placement="top-start"
            >
              <span
                v-contextmenu:contextmenu
                :class="{'active':item.key===sendMessage.key}"
                class="message-item"
                @click="messageHandler(item)"
                @contextmenu="contextmenuhandler(item)"
              >{{ item.key }}</span>
            </el-tooltip>
          </div>
          <NoData v-else/>
        </div>
      </div>
      <div slot="right" class="right-container">
        <el-tabs v-model="activeName" type="border-card" style="height:calc(100vh - 256px)" @tab-click="handleClick">
          <el-tab-pane label="Text Box" name="textBox" class="message-text">
            <el-row :gutter="10">
              <el-col :span="18">
                <el-input v-model="realMessage" :rows="12" autosize type="textarea" />
                <el-button type="primary" @click="saveTemplate">
                  <svg-icon :icon-class="'save'" />
                  &nbsp;&nbsp;{{ t('btn.save') }}
                </el-button>
              </el-col>
              <el-col :span="6">
                <div class="message-List-Time-container">
                  <el-button
                    v-for="(item,index) in messageHistoryList"
                    :key="index"
                    style="width:100%"
                    class="button-container"
                    @click="messageHistoryHandler(item)"
                  >
                    {{ item.saveTime }}
                    <span @click="deleteMessageHistory(item)">
                      <svg-icon :icon-class="'remove'" class="button-item" />
                    </span>
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="Tree View" name="treeView">
            <fieldset class="fieldset">
              <el-tree
                ref="tree"
                :data="messageTreeView"
                :expand-on-click-node="false"
                highlight-current
                default-expand-all
                accordion
                node-key="label"
              >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                  <span>{{ data.label }}</span>
                  <input v-show="data.text === ''|| data.text" v-model="data.text" class="custom-tree-input" >
                </span>
              </el-tree>
            </fieldset>
            <el-button type="primary" @click="saveTemplate">
              <svg-icon :icon-class="'save'" />
              &nbsp;&nbsp;{{ t('btn.save') }}
            </el-button>
          </el-tab-pane>
          <el-tab-pane label="Transaction" name="transaction">
            <el-table :data="transationList">
              <el-table-column type="expand" width="55">
                <template slot-scope="props">
                  <el-input v-model="props.row.contents" :rows="10" type="textarea" />
                </template>
              </el-table-column>
              <el-table-column label="Time" prop="time" align="center" />
              <el-table-column label="Direction" prop="direction" align="center" />
              <el-table-column label="MessageName" prop="messageName" align="center" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="Trace" name="trace">
            <el-table :data="traceList">
              <el-table-column label="Time" prop="time" align="center" />
              <el-table-column label="Level" prop="level" align="center" />
              <el-table-column label="Method" prop="method" align="center" />
              <el-table-column label="Description" prop="description" align="center" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
    </Split>
    <v-contextmenu ref="contextmenu">
      <v-contextmenu-item @click="contentMenuHandler('edit')">
        <svg-icon :icon-class="'edit'" />
        &nbsp;&nbsp;&nbsp;{{ t('btn.edit') }}
      </v-contextmenu-item>
      <v-contextmenu-item divider />
      <v-contextmenu-item @click="contentMenuHandler('copy')">
        <svg-icon :icon-class="'copy'" />
        &nbsp;&nbsp;&nbsp;{{ t('btn.copy') }}
      </v-contextmenu-item>
      <v-contextmenu-item divider />
      <v-contextmenu-item @click="contentMenuHandler('remove')">
        <svg-icon :icon-class="'remove'" />
        &nbsp;&nbsp;&nbsp;{{ t('btn.remove') }}
      </v-contextmenu-item>
      <v-contextmenu-item divider />
      <v-contextmenu-item :disabled="!isDisable" @click="contentMenuHandler('send')">
        <svg-icon :icon-class="'send'" />
        &nbsp;&nbsp;&nbsp;{{ t('btn.send') }}
      </v-contextmenu-item>
    </v-contextmenu>
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="80%"
      top="5vh"
      title="Message Form"
    >
      <message-detail
        v-if="showDetail"
        :action-type="actionType"
        :detail-data="rowData"
        @successEvent="successHandler"
        @cancelEvent="cancelHandler"
      />
    </el-dialog>
  </div>
</template>
<script>
import {
  sendMessage,
  startSimulator,
  stopSimulator,
  saveMessageHistory,
  deleteMessageHistory
} from '@/api/rvsimulator/simulator'
import {
  getMessageFileList,
  saveMessage,
  deleteMessage,
  getMessageList
} from '@/api/rvsimulator/messagelist'
import { getConnectionList } from '@/api/rvsimulator/connectionlist'
import MessageDetail from '@/views/rvSimulator/message/detail'
import '@/vendor/convert/jquery.json2xml.js'
import '@/vendor/convert/jquery.xml2json.js'
import NoData from '@/components/Nodata'
import notice from '@/utils/notice'
import { mapState } from 'vuex'
import { t } from '@/utils'
import $ from 'jquery'

export default {
  name: 'RvSimulator',
  components: {
    MessageDetail,
    NoData
  },
  data() {
    return {
      messageFlag: 'xml',
      activeName: '',
      showDetail: false,
      isDisable: false,
      splitValue: 0.25,
      messageText: '',
      name: '',
      realMessage: '',
      sendMessage: {},
      messageHistoryList: [],
      dataList: [],
      showMessageList: [],
      connectionList: [],
      fileNameList: [],
      fileName: '',
      connectionName: '',
      rowData: {},
      actionType: '',
      network: '',
      service: '',
      messageField: '',
      timeout: '',
      tibcoIdleSecond: '',
      daemon: '',
      selfSubject: '',
      targetSubject: '',
      transationList: [],
      traceList: [],
      messageTreeView: []
    }
  },
  computed: {
    ...mapState({
      sendRvMsgLog: state => state.socket.data.socket_sendRvMsgLog,
      sendRvTraceLog: state => state.socket.data.socket_sendRvTraceLog
    })
  },
  watch: {
    sendRvMsgLog() {
      if (this.sendRvMsgLog.connectionName === this.connectionName) {
        this.transationList.unshift(this.sendRvMsgLog)
      }
    },
    sendRvTraceLog() {
      if (this.sendRvTraceLog.connectionName === this.connectionName) {
        this.traceList.unshift(this.sendRvTraceLog)
      }
    },
    messageText() {
      if (this.messageText) {
        this.showMessageList = this.$lodash.slice(
          this.dataList.filter(data => {
            return data.key
              .replace(/\s/g, '')
              .toUpperCase()
              .includes(this.messageText.replace(/\s/g, '').toUpperCase())
          })
        )
      } else {
        this.showMessageList = this.$lodash.slice(this.dataList)
      }
    },
    fileName() {
      if (this.fileName) {
        this.getMessageList()
      } else {
        this.showMessageList.splice(0, this.showMessageList.length)
      }
    },
    connectionName() {
      if (this.connectionName) {
        this.showConnectionDetail()
      } else {
        this.network = ''
        this.service = ''
        this.daemon = ''
        this.selfSubject = ''
        this.targetSubject = ''
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getMessageFileList()
      this.getConnectionList()
    })
  },
  methods: {
    t,
    saveTemplate() {
      console.log(this.messageFlag)
      this.sendMessage['body'] = ''
      this.sendMessage['returnMessage'] = ''
      if (this.messageFlag === 'xml') {
        this.sendMessage.content = this.realMessage
      } else {
        this.getJSObjectByTree()
        this.sendMessage.content = this.realMessage
      }
      return saveMessage(this.sendMessage).then(res => {
        notice.success(this.t('tip.saveSuccess'))
      })
    },
    deleteMessageHistory(item) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        return deleteMessageHistory({
          key: this.sendMessage.key,
          fileName: this.fileName,
          saveTime: item.saveTime
        }).then(res => {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.getMessageList().then(res => {
              const item = this.showMessageList.filter(
                element => element.key === this.sendMessage.key
              )[0]
              this.messageHandler(item)
            })
          })
        })
      })
    },
    contextmenuhandler(message) {
      this.sendMessage = message
      console.log(message)
    },
    getConnectionList() {
      return getConnectionList({
        condition: {},
        pageNo: 1,
        pageSize: 99999
      }).then(res => {
        this.connectionList = res.body.rows
      })
    },
    showConnectionDetail() {
      this.connectionList.forEach(element => {
        if (element.connectionName === this.connectionName) {
          this.network = element.netWork
          this.service = element.service
          this.daemon = element.daemon
          this.selfSubject = element.selfSubject
          this.targetSubject = element.targetSubject
          this.messageField = element.messageField
          this.timeout = element.timeout
          this.tibcoIdleSecond = element.tibcoIdleSecond
        }
      })
    },
    getMessageFileList() {
      return getMessageFileList().then(res => {
        this.fileNameList = res.body
      })
    },
    valiedConnectionName() {
      if (this.connectionName === '' || this.fileName === '') {
        notice.error('Please Select ConnectionName&&FileName!')
      } else {
        this.startHandler()
      }
    },
    startHandler() {
      this.isDisable = true
      return startSimulator({
        fileName: this.fileName,
        connectionName: this.connectionName,
        daemon: this.daemon,
        netWork: this.network,
        service: this.service,
        selfSubject: this.selfSubject,
        targetSubject: this.targetSubject,
        messageField: this.messageField,
        timeout: this.timeout,
        tibcoIdleSecond: this.tibcoIdleSecond
      }).then(res => {
        notice.success('连接开启!')
      })
    },
    messageHistoryHandler(item) {
      this.realMessage = item.content
    },
    stopHandler() {
      this.isDisable = false
      return stopSimulator({
        connectionName: this.connectionName
      }).then(res => {
        notice.success('连接终止!')
      })
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.removeMessage'), () => {
        return deleteMessage(row).then(() => {
          notice.success(this.t('tip.removeSuccess'))
          this.getMessageList()
        })
      })
    },
    addHandler() {
      if (this.fileName === '') {
        notice.error('Please Select File!')
      } else {
        this.showDetail = true
        this.rowData = {
          fileName: this.fileName
        }
        this.actionType = 'add'
      }
    },
    sendHandler() {
      if (this.sendMessage) {
        this.sendMessage = Object.assign({}, this.sendMessage, {
          connectionName: this.connectionName
        })
        return sendMessage(this.sendMessage).then(res => {
        })
      } else {
        notice.error('请选择一个消息！')
      }
    },
    saveHandler() {
      const condition = {
        fileName: this.fileName,
        content: this.realMessage,
        key: this.sendMessage.key,
        pattern: this.sendMessage.pattern
      }
      return saveMessageHistory(condition).then(res => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.showDetail = false
          this.getMessageList().then(res => {
            const item = this.showMessageList.filter(
              element => element.key === this.sendMessage.key
            )[0]
            this.messageHandler(item)
          })
        })
      })
    },
    successHandler(message, actionType) {
      message.actionType = actionType
      this.saveMessage(message)
      this.getMessageList()
    },
    saveMessage(message) {
      return saveMessage(message)
        .then(res => {
          notice.success(this.t('tip.saveSuccess'))
          this.showDetail = false
          this.getMessageList()
        })
        .catch(() => {
          this.showDetail = false
        })
    },
    cancelHandler() {
      this.showDetail = false
    },
    messageHandler(item) {
      this.activeName = 'textBox'
      this.sendMessage = item
      this.realMessage = this.sendMessage.content
      this.messageHistoryList = this.sendMessage.historyList
    },
    handleClick(tab, event) {
      if (tab.label === 'Tree View') {
        this.messageFlag = 'tree'
        const jsObject = $.xml2json(`<message>${this.realMessage}</message>`)
        this.updateTreeHandler(jsObject)
      } else if (tab.label === 'Text Box') {
        this.messageFlag = 'xml'
        this.getJSObjectByTree()
      }
    },
    updateTreeHandler(tempMessage) {
      this.messageTreeView.splice(0, this.messageTreeView.length)
      const getNode = (target, parent = []) => {
        for (const key in target) {
          const currNode = {
            label: key,
            text: '',
            children: []
          }
          if (target[key] instanceof Object) {
            getNode(target[key], currNode.children)
          } else {
            currNode.text = target[key]
          }
          parent.push(currNode)
        }
      }
      const tempTree = []
      getNode(tempMessage, tempTree)
      this.messageTreeView = tempTree
    },
    getJSObjectByTree() {
      const tempObj = {}
      const getObjFromTree = (messageTreeView, targetObj = {}) => {
        messageTreeView.forEach(item => {
          const elementIsArray =
            item.children.length > 1 &&
            Array.from(
              new Set(
                this.$lodash
                  .map(item.children, 'label')
                  .map(item => item.replace(/\d*/, ''))
              )
            ).length < item.children.length
          let elementValue = elementIsArray ? [] : {}
          if (Array.isArray(item.children) && item.children.length > 0) {
            const childNode = { [item.label]: elementValue }
            targetObj = Object.assign(targetObj, childNode)
            getObjFromTree(item.children, targetObj[item.label])
          } else {
            elementValue = Object.assign(elementValue, {
              [item.label]: item.text
            })
            targetObj = Object.assign(targetObj, elementValue)
          }
        })
      }
      getObjFromTree(this.messageTreeView, tempObj)
      this.realMessage = this.removeChars($.json2xml(tempObj))
    },
    removeChars(source) {
      const chars = ['<root>', '</root>']
      for (let i = 0; i < chars.length; i++) {
        const reg = new RegExp(chars[i], 'gi')
        source = source.replace(reg, '')
      }
      return source
    },
    chenLogHandler() {
      this.transationList = []
      this.traceList = []
    },
    getMessageList() {
      return getMessageList({
        condition: {
          fileName: this.fileName
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.messageText = ''
        this.dataList = res.body.rows
        this.showMessageList = res.body.rows
      })
    },
    contentMenuHandler(type) {
      switch (type) {
        case 'edit':
          this.showDetail = true
          this.rowData = this.sendMessage
          this.actionType = 'edit'
          break
        case 'copy':
          this.showDetail = true
          this.rowData = this.sendMessage
          this.actionType = 'copy'
          break
        case 'remove':
          this.removeHandler()
          break
        case 'send':
          this.sendHandler()
          break
      }
    }
  }
}
</script>
<style lang="scss">
.message-text {
  .el-textarea {
    height: calc(100vh - 365px);
    margin-bottom: 5px;
    .el-textarea__inner {
      height: 100% !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.right-container {
  height: 100%;
  overflow-y: auto;
}

.active {
  color: #fff;
  background-color: rgb(84, 164, 201);
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: flex-start;
  align-content: center;
  height: 20px;
  font-size: 15px;
  padding-right: 8px;

  .custom-tree-input {
    padding-left: 5px;
    height: 20px;
    font-size: 12px;
    margin-left: 15px;
    width: 180px;
    border: none;
    border-bottom: 1px solid #e3e3e3;
    background-color: transparent;
  }

  .custom-tree-input:focus {
    outline: none;
  }
}

.el-input {
  width: 100%;
}
.message-List-container {
  height: calc(100vh - 254px);
  overflow: hidden;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e3e3e3;

  .message-item {
    display: inline-block;
    margin: 2px 0;
    overflow: hidden;
    width: 100%;
    font-size: 16px;
    height: 30px;
    padding: 5px 10px;
    border: 1px solid #e3e3e3;
    border-radius: 5px;
    text-overflow: ellipsis;

    &:hover {
      box-shadow: 0 0 2px 3px #409eff;
      cursor: pointer;
    }
  }
}

.message-List-Time-container {
  height: calc(100vh - 320px);
  overflow-y: auto;
  border: 1px solid #e3e3e3;

  .el-button {
    margin: 0;
  }

  .button-container {
    position: relative;

    .button-item {
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }
}

.fieldset {
  height: calc(100vh - 365px);
  overflow-y: auto;
  border: 1px solid #e3e3e3;
  min-width: 100px;
  border-radius: 5px;
  margin-bottom: 5px;
}
</style>
<style lang="scss">
.splitpanes__pane {
  padding: 10px;
  background-color: #fff !important;
  border: 1px solid #e3e3e3;
  overflow-y: auto;
}

.splitpanes__splitter {
  background-color: #ccc;
  position: relative;
  border: 1px solid #e3e3e3 !important;
}
</style>
