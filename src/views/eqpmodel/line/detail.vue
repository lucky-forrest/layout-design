<template>
  <div class="app-container">
    <el-form ref="lineForm" :model="lineForm" :rules="rules" label-width="120px" >
      <el-row :gutter="20">
        <el-col :xs="24" :md="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="Shop"
            prop="shopName" >
            <el-select
              v-model="lineForm.shopName"
              :placeholder="t('tip.pleaseSelectShopType')"
              :disabled="true"
              clearable
              filterable
              allow-create
              class="filter-item">
              <el-option v-for="(item,index) in shopTypeList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="ServerName"
            prop="serverName" >
            <el-input v-model="lineForm.serverName" :placeholder="t('tip.pleaseInput')" :disabled="true" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="LineId"
            prop="lineId" >
            <el-input v-model="lineForm.lineId" :placeholder="t('tip.pleaseInput')" :disabled="isEdit" autofocus clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="LineType"
            prop="lineType" >
            <el-input v-model="lineForm.lineType" :disabled="true"/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="LineName"
            prop="lineName" >
            <el-input v-model="lineForm.lineName" :placeholder="t('tip.pleaseInput')" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item
            label="ServerIp"
            prop="ip" >
            <el-input v-model="lineForm.ip" :placeholder="t('tip.pleaseInput')" clearable>
              <template slot="append">0.0.0.0</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="Port1"
            prop="port" >
            <el-input-number v-model="lineForm.port" :precision="0" :controls-position="'right'" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item
            label="Port2"
            prop="port2" >
            <el-input-number v-model="lineForm.port2" :precision="0" :controls-position="'right'" />
          </el-form-item>
        </el-col>
        <el-col :span="24" >
          <el-form-item
            label="Descript"
            prop="info" >
            <el-input v-model="lineForm.info" :placeholder="t('tip.pleaseInput')" :row="3" type="textarea" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="showBtn" class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler('lineForm')">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="closeHandler">
        <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { t } from '@/utils'
import { getDropDownList } from '@/api/eqpmodel/dropDown'
import { getLineList } from '@/api/eqpmodel/line'
import { shopList } from '@/config'
import notice from '@/utils/notice'
const validateIp = (rule, value, callback) => {
  const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]).*$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('输入格式有误'))
  }
}
export default {
  name: 'LineDetail',
  props: {
    detailData: {
      type: Object,
      default() {
        return {
        }
      }
    },
    showBtn: {
      type: Boolean,
      default() {
        return true
      }
    }
  },
  data() {
    return {
      isEdit: false,
      loading: false,
      lineTypeList: [],
      shopTypeList: shopList,
      lineForm: {
        objectId: '',
        lineId: '',
        lineName: '',
        lineType: '',
        shopName: '',
        serverName: '',
        ip: '127.0.0.1',
        port: '8081',
        port2: '8085',
        info: ''
      },
      rules: {
        ip: [
          { required: true, message: this.t('tip.pleaseInput'), trigger: 'blur' },
          { validator: validateIp, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    'lineForm.lineId'(value) {
      this.lineForm.serverName = value || ''
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.lineForm = Object.assign({}, this.lineForm, this.detailData)
      this.isEdit = !!this.lineForm.objectId
      getDropDownList({ condition: {}}).then(res => {
        this.lineTypeList = res.body.rows.filter(ele => ele.dataType.toUpperCase() === 'LINETYPE')
      })
    })
  },
  methods: {
    t,
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            getLineList({ condition: { lineId: this.lineForm.lineId }}).then(res => {
              if (Array.isArray(res.body.rows) && res.body.rows.length) {
                notice.error(`${this.lineForm.lineId} is exist`)
                return
              }
              this.$emit('successEvent', this.lineForm, this.isEdit)
            })
          } else {
            this.$emit('successEvent', this.lineForm, this.isEdit)
          }
        }
      })
    },
    closeHandler() {
      this.$emit('cancelEvent', 'lineDetail')
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-input,.el-select,.el-input-number{
    width:100%;
  }
  .fieldset {
    margin-bottom: 10px;
    padding: 0 20px;
    border: 1px solid #dcdfe6;

    legend {
      font-weight: bold;
    }
  }
</style>
