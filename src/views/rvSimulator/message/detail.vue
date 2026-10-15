<template>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="MessageInfo" name="first">
        <el-form ref="messageForm" :rules="rules" :model="messageForm" label-width="120px">
          <el-row :gutter="20">
            <el-col :md="8" :lg="8">
              <fieldset class="fieldset">
                <legend class="word" style="padding:0px 10px">Message</legend>
                <el-row :gutter="20" class="el-row">
                  <el-col :xs="24" :md="24">
                    <el-form-item
                      :rules="[{required: true,message:t('tip.pleaseInput')}]"
                      label="Pattern"
                      prop="pattern"
                    >
                      <el-input
                        v-model="messageForm.pattern"
                        :placeholder="t('tip.pleaseInput')"
                        class="el-input"
                        autofocus
                        clearable
                        type="textarea"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="24">
                    <el-form-item
                      :rules="[{required: true,message:t('tip.pleaseSelect')}]"
                      label="Direction"
                      prop="direction"
                    >
                      <el-select
                        v-model="messageForm.direction"
                        :placeholder="t('tip.pleaseSelectDirection')"
                        clearable
                        filterable
                        class="el-input"
                      >
                        <el-option
                          v-for="(item,index) in directionList"
                          :key="index"
                          :label="item.label"
                          :value="item.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="24">
                    <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="Key" prop="key">
                      <el-input
                        v-model="messageForm.key"
                        :placeholder="t('tip.pleaseInput')"
                        class="el-input"
                        clearable
                        type="textarea"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="24">
                    <el-form-item label="WaitReply" prop="waitReply">
                      <el-switch v-model="messageForm.waitReply" active-color="#13ce66" inactive-color="#ff4949" />
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="24">
                    <el-form-item label="AutoReply" prop="autoReply">
                      <div class="form-control">
                        <el-checkbox v-model="messageForm.autoReply" />
                        <el-select
                          v-model="messageForm.autoReplyMessage"
                          :placeholder="t('tip.pleaseSelect')"
                          :disabled="!messageForm.autoReply"
                          clearable
                          filterable
                          style="width:calc(100% - 16px);"
                        >
                          <el-option
                            v-for="(item,index) in messageList"
                            :key="index"
                            :label="item.key"
                            :value="item.key"
                          />
                        </el-select>
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :md="24">
                    <el-form-item label="Description" prop="description">
                      <el-input
                        v-model="messageForm.description"
                        :rows="7"
                        placeholder="Description"
                        class="el-input"
                        type="textarea"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </fieldset>
            </el-col>
            <el-col :md="16" :lg="16">
              <fieldset class="fieldset">
                <legend class="word" style="padding:0px 10px">Body&Return</legend>
                <el-row :gutter="20" class="el-row">
                  <el-col :xs="24" :md="24">
                    <el-input
                      v-model="messageForm.body"
                      :rows="17"
                      placeholder="Body"
                      class="textarea"
                      type="textarea"
                    />
                  </el-col>
                  <el-col :xs="24" :md="24">
                    <el-input
                      v-model="messageForm.returnMessage"
                      :rows="4"
                      placeholder="Return"
                      class="textarea"
                      type="textarea"
                    />
                  </el-col>
                </el-row>
              </fieldset>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="Condition" name="second">
        <el-table :data="dataList" border>
          <el-table-column type="index" align="center" fixed>#</el-table-column>
          <el-table-column label="ItemName" min-width="180">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.item"
                :placeholder="t('tip.pleaseSelect')"
                clearable
                filterable
                class="el-input"
              >
                <el-option v-for="(item,index) in itemNameList" :key="index" :label="item" :value="item" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Operator" min-width="180" prop="operator">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.operator"
                :placeholder="t('tip.pleaseSelect')"
                clearable
                filterable
                class="el-input"
              >
                <el-option v-for="(item,index) in operatorList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="Value" min-width="180">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" :placeholder="t('tip.pleaseInput')" class="el-input" clearable />
            </template>
          </el-table-column>
          <el-table-column label="Action" width="80px" align="center">
            <template slot-scope="scope">
              <el-button
                v-authorize="'remove'"
                type="danger"
                icon="el-icon-delete"
                @click="dataList.splice(scope.$index, 1)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Message List" name="third">
        <table class="custom-table">
          <thead>
            <tr>
              <th width="70px">#</th>
              <th width="300px">SendMessage</th>
              <th width="100px">{{ t('column.operate') }}</th>
            </tr>
          </thead>
          <draggable v-model="sendMessageList" element="tbody" @update="sendMessageDatadragEnd">
            <tr v-for="(item,index) in sendMessageList" :key="index">
              <td align="center">{{ index }}</td>
              <td align="center" style="padding:4px;">
                <el-select
                  v-model="item.sendMessage"
                  :placeholder="t('tip.pleaseSelect')"
                  clearable
                  filterable
                  style="width:calc(100% - 16px);"
                >
                  <el-option
                    v-for="(item,index) in messageList"
                    :key="index"
                    :label="item.key"
                    :value="item.key"
                  />
                </el-select>
              </td>
              <td align="center">
                <el-button
                  v-authorize="'remove'"
                  type="danger"
                  icon="el-icon-delete"

                  @click="sendMessageList.splice(index, 1)"
                />
              </td>
            </tr>
          </draggable>
        </table>
      </el-tab-pane>
    </el-tabs>
    <div class="card-footer">
      <el-button v-if="activeName!=='first'" :loading="loading" type="success" @click="addHandler">
        <svg-icon :icon-class="'add'" />&nbsp;1
      </el-button>
      <el-button :loading="loading" type="primary" @click="saveHandler">
        <svg-icon :icon-class="'save'" />
        &nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="closeHandler">
        <svg-icon :icon-class="'cancel'" />
        &nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { t } from '@/utils'
import { directionList, operatorList } from '@/config/dropdown'
import {
  getMessageList,
  getBodyTreeList
} from '@/api/rvsimulator/messagelist/index'
import draggable from 'vuedraggable'
const validateKey = (rule, value, callback) => {
  const reg = /^A-Za-z[*]$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('输入格式有误'))
  }
}
export default {
  name: 'MessageDetail',
  components: {
    draggable
  },
  props: {
    detailData: {
      type: Object,
      default() {
        return {}
      }
    },
    actionType: {
      type: String,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      messageList: [],
      activeName: 'first',
      directionList: directionList,
      operatorList: operatorList,
      dataList: [],
      sendMessageList: [],
      sendMessageListTemp: [],
      itemNameList: [],
      messageForm: {
        fileName: '',
        pattern: '',
        direction: '',
        key: '',
        waitReply: false,
        description: '',
        body: '',
        returnMessage: '',
        autoReplyMessage: '',
        autoReply: false,
        historyList: []
      },
      rules: {
        key: [
          { required: true, message: this.t('tip.pleaseInput'), trigger: 'blur' },
          { validator: validateKey, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.dataList = this.detailData.conditionList || []
      if (Array.isArray(this.detailData.sendMessageList)) {
        this.detailData.sendMessageList.forEach(item => {
          this.sendMessageList.push({
            sendMessage: item
          })
        })
        this.sendMessageListTemp = this.$lodash.slice(this.sendMessageList)
      }
      this.messageForm = Object.assign({}, this.messageForm, this.detailData)
      this.getMessageList()
    })
  },
  methods: {
    t,
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.loading = true
        return getBodyTreeList({ msgBody: this.messageForm.body })
          .then(res => {
            this.itemNameList = res.body
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    addHandler() {
      if (this.activeName === 'second') {
        this.dataList.push({
          item: '',
          operator: '',
          value: ''
        })
      } else if (this.activeName === 'third') {
        this.sendMessageList.push({
          sendMessage: ''
        })
        this.sendMessageListTemp = this.$lodash.slice(this.sendMessageList)
      }
    },
    getMessageList() {
      return getMessageList({
        condition: { fileName: this.messageForm.fileName },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      })
        .then(res => {
          this.messageList = res.body.rows
        })
        .catch(() => {
          this.loading = false
        })
    },
    sendMessageDatadragEnd(evt) {
      this.sendMessageList = this.datadrag(evt, this.sendMessageListTemp, this.sendMessageList)
      this.sendMessageListTemp = this.$lodash.slice(this.sendMessageList)
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
      for (let i = 0; i < targetArr.length; i++) {
        targetArr[i].sort = i
      }
      return this.$lodash.slice(targetArr)
    },
    saveHandler() {
      this.$refs['messageForm'].validate(valid => {
        if (valid) {
          this.loading = true
          const temp = []
          this.sendMessageList.forEach(({ sendMessage }) => {
            temp.push(sendMessage)
          })
          this.messageForm = Object.assign({}, this.messageForm, {
            conditionList: this.dataList,
            sendMessageList: temp
          })
          this.$emit('successEvent', this.messageForm, this.actionType)
        }
      })
    },
    closeHandler() {
      this.$emit('cancelEvent', 'showDetail')
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ebeef5;

    th {
      height: 40px;
      font-size: 14px;
      color: #606266;
      text-align: center;
      background-color: #f2f6fc !important;
      border: 1px solid #ebeef5;
    }

    td {
      height: 53px;
      border: 1px solid #ebeef5;
    }
  }

.el-input,
.el-input-number {
  width: 100%;
  margin: 0 5px;
}
.fieldset {
  min-width: 100px;
  height: 100%;
  border: 1px solid #e3e3e3;
  border-radius: 5px;

  legend {
    margin-left: 20px;
  }
}
.el-row {
  margin: 10px 0;
  width: calc(100% - 10px);
}
.word {
  font-weight: bold;
}
.textarea {
  margin-left: 15px;
  margin-bottom: 10px;
  width: 100%;
}
.container {
  padding: 10px 10px;
  margin-top: -10px;
  margin-left: 10px;
}
.test {
  margin-top: -10px;
  margin-bottom: 10px;
  margin-left: -33px;
  width: 235px;
}
.form-control {
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  margin: 0 10px;
}
</style>
