<template>
  <div class="container">
    <el-form ref="connectionForm" :model="connectionForm" :rules="rules" label-width="150px" >
      <fieldset class="fieldset">
        <legend class="word" style="padding:0px 10px">SECS</legend>
        <el-row :gutter="20" class="el-row">
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="SECS NAME"
              prop="name" >
              <el-input v-model="connectionForm.name" :placeholder="t('tip.pleaseInput')" :disabled="isEdit" autofocus clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Connect Mode"
              prop="connectionMode" >
              <el-select
                v-model="connectionForm.connectionMode"
                :placeholder="t('tip.pleaseSelect')"
                clearable
                filterable
                class="el-input">
                <el-option
                  v-for="(item,index) in connectionModeList"
                  :key="index"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="connectionForm.connectionMode ==='ACTIVE'" :xs="24" :md="12" >
            <el-form-item
              label="Remote IP"
              prop="remoteIP" >
              <el-input
                v-model="connectionForm.remoteIP"
                :placeholder="t('tip.pleaseInput')"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col v-if="connectionForm.connectionMode ==='ACTIVE'" :xs="24" :md="12" >
            <el-form-item
              label="Remote Port"
              prop="remotePort" >
              <el-input-number
                v-model="connectionForm.remotePort"
                :precision="0"
                :min="0"
                :max="65535"
                controls-position="right"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col v-if="connectionForm.connectionMode ==='PASSIVE'" :xs="24" :md="12" >
            <el-form-item
              label="Local IP"
              prop="localIP" >
              <el-input
                v-model="connectionForm.localIP"
                :placeholder="t('tip.pleaseInput')"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col v-if="connectionForm.connectionMode ==='PASSIVE'" :xs="24" :md="12" >
            <el-form-item
              label="Local Port"
              prop="localPort" >
              <el-input-number
                v-model="connectionForm.localPort"
                :precision="0"
                :min="0"
                :max="65535"
                controls-position="right"
                clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              label="DeviceID"
              prop="deviceID" >
              <el-input v-model="connectionForm.deviceID" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseSelect')}]"
              label="File Name"
              prop="secsLibraryFile" >
              <el-select
                v-model="connectionForm.secsLibraryFile"
                placeholder="Please select fileName"
                clearable
                filterable
                class="el-input">
                <el-option v-for="(item,index) in fileNameList" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" >
            <el-form-item
              label="SECS DESC"
              prop="desc" >
              <el-input v-model="connectionForm.desc" :placeholder="t('tip.pleaseInput')" :rows="3" type="textarea" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset class="fieldset">
        <legend class="word" style="padding:0px 10px">Timeout</legend>
        <el-row :gutter="20" class="el-row">
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="T3 TimeOut"
              prop="t3" >
              <el-input-number v-model="connectionForm.t3" :precision="0" :controls-position="'right'" :min="0" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="T5 TimeOut"
              prop="t5" >
              <el-input-number v-model="connectionForm.t5" :precision="0" :controls-position="'right'" :min="0" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="T6 TimeOut"
              prop="t6" >
              <el-input-number v-model="connectionForm.t6" :precision="0" :controls-position="'right'" :min="0" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="T7 TimeOut"
              prop="t7" >
              <el-input-number v-model="connectionForm.t7" :precision="0" :controls-position="'right'" :min="0" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="T8 TimeOut"
              prop="t8" >
              <el-input-number v-model="connectionForm.t8" :precision="0" :controls-position="'right'" :min="0" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Link Test TimeOut"
              prop="linkTest" >
              <el-input-number v-model="connectionForm.linkTest" :precision="0" :controls-position="'right'" :min="0" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
    </el-form>
    <div class="card-footer">
      <el-button v-show="isEdit" :loading="loading" type="primary" @click="connTestHandler">
        <svg-icon :icon-class="'conntest'"/>&nbsp;{{ t('btn.connTest') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="saveHandler">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="closeHandler">
        <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { testConnection } from '@/api/secsSimulator/connection'
import { getMessageFileList } from '@/api/secsSimulator'
import { connectionModeList } from '@/config'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'ConnectionDetail',
  props: {
    detailData: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      isEdit: false,
      connectionModeList: connectionModeList,
      fileNameList: [],
      connectionForm: {
        secsLibraryFile: '',
        name: '',
        desc: '',
        remoteIP: '127.0.0.1',
        remotePort: 7500,
        localIP: '127.0.0.1',
        localPort: 7500,
        connectionMode: 'ACTIVE',
        deviceID: '1',
        t3: 45,
        t5: 10,
        t6: 60,
        t7: 10,
        t8: 5,
        linkTest: 60
      },
      rules: {
        remoteIP: [
          { required: true, message: this.t('tip.pleaseInput'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]).*$/
            if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('输入格式有误'))
            }
          }, trigger: 'blur' }
        ],
        localIP: [
          { required: true, message: this.t('tip.pleaseInput'), trigger: 'blur' },
          { validator: (rule, value, callback) => {
            const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]).*$/
            if (reg.test(value)) {
              callback()
            } else {
              callback(new Error('输入格式有误'))
            }
          }, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick().then(() => {
      this.connectionForm = Object.assign({}, this.connectionForm, this.detailData)
      this.isEdit = !!this.connectionForm.name
      this.getMessageFileList()
    })
  },
  methods: {
    t,
    getMessageFileList() {
      this.loading = true
      return getMessageFileList({}).then(res => {
        this.fileNameList = res.body
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    saveHandler() {
      this.$refs['connectionForm'].validate(valid => {
        if (valid) {
          this.$emit('successEvent', this.connectionForm, this.isEdit)
        }
      })
    },
    closeHandler() {
      this.$emit('cancelEvent', 'connectionDetail')
    },
    connTestHandler() {
      this.$refs['connectionForm'].validate(valid => {
        if (valid) {
          this.loading = true
          return testConnection(this.connectionForm).then(res => {
            if (res.body) {
              notice.success(this.t('tip.connectionSuccess'))
            } else {
              notice.error('The connection was unsuccessful!')
            }
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input,.el-input-number{
    width:100%;
    margin: 0 5px;
  }
  .fieldset {
    margin-bottom: 5px;
    min-width: 100px;
    height: 100%;
    border:1px solid #e3e3e3;
    border-radius:5px;

    legend{
      margin-left:20px;
    }
  }
  .el-row{
    margin:5px;
    width: calc(100% - 10px);
    }
  .word{
    font-weight:bold;
  }
  .container{
    margin-top: -10px;
    margin-left: 10px;
  }
</style>
