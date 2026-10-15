<template>
  <div class="app-container">
    <el-form ref="connectionForm" :model="connectionForm" :rules="rules" label-width="120px" >
      <fieldset class="fieldset">
        <legend class="word" style="padding:0px 10px">TIBCO</legend>
        <el-row :gutter="20" class="el-row">
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="ConnName"
              prop="connectionName" >
              <el-input v-model="connectionForm.connectionName" :placeholder="t('tip.pleaseInput')" :disabled="isEdit" class="el-input" autofocus clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Daemon"
              prop="daemon" >
              <el-input v-model="connectionForm.daemon" :placeholder="t('tip.pleaseInput')" class="el-input" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="NetWork"
              prop="netWork" >
              <el-input v-model="connectionForm.netWork" :placeholder="t('tip.pleaseInput')" class="el-input" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Service"
              prop="service" >
              <el-input v-model="connectionForm.service" :placeholder="t('tip.pleaseInput')" class="el-input" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="SelfSubject"
              prop="selfSubject" >
              <el-input v-model="connectionForm.selfSubject" :placeholder="t('tip.pleaseInput')" class="el-input" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="TargetSubject"
              prop="targetSubject" >
              <el-input v-model="connectionForm.targetSubject" :placeholder="t('tip.pleaseInput')" class="el-input" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="MessageField"
              prop="messageField" >
              <el-input v-model="connectionForm.messageField" :placeholder="t('tip.pleaseInput')" class="el-input" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset class="fieldset">
        <legend class="word" style="padding:0px 10px">Timeout</legend>
        <el-row class="el-row">
          <el-col :xs="24" :md="24" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              style="margin-left: -46px;"
            >
              <span class="word">T3 Timeout</span>
              <el-input-number v-model="connectionForm.timeout" :precision="0" :controls-position="'right'" :min="0" style="width:100px;"/>
              <span class="word">seconds</span>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="24" >
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              style="margin-left: -107px;">
              <span class="word">TIBCO transport idel</span>
              <el-input-number v-model="connectionForm.tibcoIdleSecond" :precision="0" :controls-position="'right'" :min="0" style="width:100px;" clearable/>
              <span class="word">seconds, Simulator will release and re-create TIBCO instance</span>
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
    </el-form>
    <div class="card-footer">
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
import { saveConnection } from '@/api/rvsimulator/connectionlist/index'
import notice from '@/utils/notice'
import { t } from '@/utils'
// const networkIp = (rule, value, callback) => {
//   const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]).*$/
//   if (reg.test(value)) {
//     callback()
//   } else {
//     callback(new Error('输入格式有误'))
//   }
// }
const daemonIp = (rule, value, callback) => {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]).*\:(\d{4})$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('输入格式有误'))
  }
}
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
      connectionForm: {
        connectionName: 'EEM',
        daemon: 'tcp:7500',
        netWork: '127.0.0.1',
        service: '8201',
        selfSubject: 'EEMsvr.Test',
        targetSubject: 'BC.TEST',
        messageField: 'xmlData',
        timeout: '45',
        tibcoIdleSecond: '420'
      },
      rules: {
        // netWork: [
        //   { required: true, message: this.t('tip.pleaseInput'), trigger: 'blur' },
        //   { validator: networkIp, trigger: 'blur' }
        // ],
        daemon: [
          { required: true, message: this.t('tip.pleaseInput'), trigger: 'blur' },
          { validator: daemonIp, trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.connectionForm = Object.assign({}, this.connectionForm, this.detailData)
      this.isEdit = !!this.connectionForm.connectionName
    })
  },
  methods: {
    t,
    saveHandler() {
      this.$refs['connectionForm'].validate(valid => {
        if (valid) {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.$emit('successEvent', this.connectionForm, this.isEdit)
          })
        }
      })
    },
    closeHandler() {
      this.$emit('cancelEvent', 'connectionDetail')
    },
    saveConnection() {
      this.loading = true
      return saveConnection({
      }).then(res => {
        this.dataList = res.body.rows
        this.showMessageList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input,.el-input-number{
    width:100%;
    margin: 0 10px;
  }
  .fieldset {
    margin-bottom: 10px;
    min-width: 100px;
    height: 100%;
    border:1px solid #e3e3e3;
    border-radius:5px;

    legend{
      margin-left:20px;
    }
  }
  .el-row{
    margin:10px;
    width: calc(100% - 10px);
    }
  .word{
    font-weight:bold;
  }
</style>
