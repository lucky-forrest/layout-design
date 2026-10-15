<template>
  <div class="simulator-detail">
    <fieldset class="fieldset">
      <legend style="padding:0px 10px">Map Bean</legend>
      <el-form ref="mapBean" label-width="150px" style="margin-top:10px;">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="PLC Type:">
              <el-select v-model="mapBean.plcType" placeholder="PLC Type">
                <el-option v-for="(item,index) in plcTypeList" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="IP:">
              <el-input v-model="mapBean.ip" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Port:">
              <el-input v-model="mapBean.port" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="EqpNo">
              <div class="custom-form-wrapper">
                <div class="left">
                  <el-checkbox v-model="checked" size="mini">全选</el-checkbox>
                </div>
                <div class="right">
                  <el-select v-model="mapBean.eqpNoList" :placeholder="t('tip.pleaseSelectEquipmentNo')" multiple clearable>
                    <el-option v-for="(item,index) in equipmentList" :key="index" :label="item" :value="item" />
                  </el-select>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </fieldset>
    <fieldset v-if="isEqSimulator==='1'" class="fieldset">
      <legend style="padding:0px 10px">Job Data Bean</legend>
      <el-form ref="jobDataBean" label-width="150px" style="margin-top:10px;">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="PLC Type:">
              <el-select v-model="jobDataBean.plcType" placeholder="PLC Type">
                <el-option v-for="(item,index) in plcTypeList" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Melsec Frame:">
              <el-input v-model="jobDataBean.melsecFrame" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="IP:">
              <el-input v-model="jobDataBean.ip" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="Port:">
              <el-input v-model="jobDataBean.port" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="ChannelNo">
              <el-input v-model="jobDataBean.connelNo" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="PlcNo">
              <el-input v-model="jobDataBean.plcNo" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="EqpNo">
              <el-select v-model="jobDataBean.eqpNo" :placeholder="t('tip.pleaseSelectEquipmentNo')" clearable>
                <el-option v-for="(item,index) in equipmentList2" :key="index" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </fieldset>
    <el-row style="text-align:right;">
      <el-button type="primary" @click="successHandler">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
    </el-row>
  </div>
</template>
<script>
import { getPlcEquipmentList, getJobDataEquipmentList } from '@/api/eqpmodel/equipment'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'PLCSimulatorConfig',
  props: {
    filter: {
      type: Object,
      default() {
        return {}
      }
    },
    isEqSimulator: {
      type: String,
      default: '0'
    }
  },
  data() {
    return {
      checked: false,
      plcTypeList: ['MELSECPLC', 'MODBUS', 'CCLINKBRD', 'SIMULATOR', 'SERIAL'],
      mapBean: {
        plcType: 'MELSECPLC',
        melsecFrame: 'IIIE',
        ip: '192.168.3.39',
        port: '7001',
        connelNo: '00',
        plcNo: 'FF',
        stationNo: '00',
        eqpNoList: []
      },
      jobDataBean: {
        plcType: 'MELSECPLC',
        melsecFrame: 'IIIE',
        ip: '192.168.3.39',
        port: '7002',
        connelNo: '01',
        plcNo: '02',
        stationNo: '00',
        eqpNo: ''
      },
      equipmentList: [],
      equipmentList2: []
    }
  },
  watch: {
    checked(currValue) {
      if (currValue) {
        this.mapBean.eqpNoList = this.equipmentList
      } else {
        this.mapBean.eqpNoList = []
      }
    },
    'mapBean.plcType'(currValue) {
      if (currValue === 'SIMULATOR') {
        this.mapBean = Object.assign(this.mapBean, {
          plcType: 'SIMULATOR',
          melsecFrame: 'CCLINK',
          ip: '127.0.0.1',
          port: '6379',
          connelNo: '01'
        })
      } else if (currValue === 'MELSECPLC') {
        this.mapBean = Object.assign(this.mapBean, {
          plcType: 'MELSECPLC',
          melsecFrame: 'IIIE',
          ip: '192.168.3.39',
          port: '7001',
          connelNo: '00'
        })
      } else if (currValue === 'SERIAL') {
        this.mapBean = Object.assign(this.mapBean, {
          plcType: 'SERIAL',
          melsecFrame: 'CIM',
          ip: '127.0.0.1',
          port: '3000',
          connelNo: '01'
        })
      }
    },
    'jobDataBean.plcType'(currValue) {
      if (currValue === 'SIMULATOR') {
        this.jobDataBean = Object.assign(this.jobDataBean, {
          plcType: 'SIMULATOR',
          melsecFrame: 'CCLINK',
          ip: '127.0.0.1',
          port: '6379',
          connelNo: '01'
        })
      } else if (currValue === 'MELSECPLC') {
        this.jobDataBean = Object.assign(this.jobDataBean, {
          plcType: 'MELSECPLC',
          melsecFrame: 'IIIE',
          ip: '192.168.3.39',
          port: '7001',
          connelNo: '00'
        })
      } else if (currValue === 'SERIAL') {
        this.jobDataBean = Object.assign(this.jobDataBean, {
          plcType: 'SERIAL',
          melsecFrame: 'CIM',
          ip: '127.0.0.1',
          port: '3000',
          connelNo: '01'
        })
      }
    }
  },
  created() {
    this.getJobDataBeanEqplist()
    this.getPlcEquipmentList()
    this.mapBean.eqpNoList = []
  },
  methods: {
    t,
    successHandler() {
      if (this.mapBean.eqpNoList.length === 0) {
        notice.error('Please Select MapBean EqpNo!')
        return
      }
      if (this.isEqSimulator === '1' && this.jobDataBean.eqpNo === '') {
        notice.error('Please Select JobDataBean EqpNo!')
        return
      }
      if (this.isEqSimulator === '1') {
        this.$emit('successEvent', { mapBean: this.mapBean, jobDataBean: this.jobDataBean })
      } else {
        this.$emit('successEvent', { mapBean: this.mapBean })
      }
    },
    getJobDataBeanEqplist() {
      this.loading = true
      this.jobDataBean.eqpNo = ''
      return getJobDataEquipmentList({
        shop: this.filter.shop,
        lineName: this.filter.lineId
      })
        .then(res => {
          this.equipmentList2 = res.body
          this.jobDataBean.eqpNo = this.$lodash.head(this.equipmentList2)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getPlcEquipmentList() {
      this.loading = true
      this.mapBean.eqpNoList = []
      return getPlcEquipmentList({
        shop: this.filter.shop,
        lineName: this.filter.lineId
      })
        .then(res => {
          this.equipmentList = this.mapBean.eqpNoList = res.body
          this.equipmentList.length === 0 ? this.checked = false : this.checked = true
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.simulator-detail {
  .el-input,
  .el-select{
    width: 100%;
    margin-bottom: 10px;
  }

  .fieldset {
    min-width: 100px;
    height: 100%;
    border: 1px solid #e3e3e3;
    border-radius: 5px;
    margin-bottom: 10px;
    padding-top:0;
    padding:10px;

    legend {
      margin-left: 20px;
      font-weight: bold;
      margin-left: 20px;
    }
  }
  .custom-form-wrapper{
    display:flex;
    width:100%;
    height:30px;
    overflow-y: hidden;
    line-height: 30px;
    flex-flow:row nowrap;
    font-size:0;
    border:1px solid #e3e3e3;
    border-radius:5px;
    .left{
      width:80px;
      background-color:rgba(#000,0.03);
      text-align: center;
    }
    .right{
      flex:1;
      /deep/input{
        border:none;
      }
    }
  }
}
</style>
