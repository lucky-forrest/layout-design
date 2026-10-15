<template>
  <div class="app-container">
    <div v-if="jobDataItemList.length>0" class="joblist-main">
      <header id="header">
        <el-form ref="jobForm" :model="formData" label-width="90px">
          <el-row :gutter="10">
            <el-col :lg="5" :md="5" :sm="12">
              <el-form-item label="CstSeqNo" prop="cstSeqno">
                <el-input-number v-model="formData.cstSeqno" :min="1" :precision="0" clearable />
              </el-form-item>
            </el-col>
            <el-col :lg="5" :md="5" :sm="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="JobID" prop="jobId">
                <el-input v-model="formData.jobId" clearable />
              </el-form-item>
            </el-col>
            <el-col :lg="6" :md="5" :sm="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')},{pattern:/^[0,1]*$/,message:'只能是由0和1组成的字符串'}]" label="SlotInfo" prop="slotInfo">
                <el-input v-model="formData.slotInfo" clearable />
              </el-form-item>
            </el-col>
            <el-col :lg="8" :md="9" :sm="12" >
              <el-form-item style="white-space:nowrap;">
                <el-button :loading="loading" type="primary" @click="generateHandler">{{ t('btn.generate') }}</el-button>
                <el-button :loading="loading" type="primary" @click="commonSettingHandler">{{ t('btn.commonSetting') }}</el-button>
                <el-button :loading="loading" type="primary" @click="sendHandler">{{ t('btn.send') }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </header>
      <div class="jobdata-main">
        <table class="custom-table">
          <thead>
            <tr>
              <th style="min-width:70px;">SlotNo</th>
              <th v-for="(fieldInfo,fIndex) in jobDataItemList" :key="fIndex" style="min-width:200px;">
                {{ fieldInfo.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="({slotFlag,jobData},jIndex) in dataList" :key="jIndex">
              <td style="min-width:70px;">
                {{ slotFlag }}
              </td>
              <template v-for="(item,fIndex) in jobDataItemList">
                <td :key="fIndex">
                  <custom-field :field="item" :job-data="jobData"/>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <no-data v-else />
    <el-dialog
      :visible.sync="showSetting"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="1400px"
      top="8vh"
      append-to-body>
      <div slot="title">
        <svg-icon :icon-class="'plc'" />&nbsp;{{ t('btn.commonSetting') }}
      </div>
      <common-setting v-if="showSetting" :data="jobDataItemList" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>
<script>
import { getJobDataBlock, updateRedisCassetteMap } from '@/api/jobDataDownload'
import CustomField from '@/views/jobDataDownload/components/CustomField'
import CommonSetting from '@/views/jobDataDownload/Detail'
import ShopLineFilter from '@/components/ShopLineFilter'
import NoData from '@/components/Nodata'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'JobDataDownLoad',
  components: {
    ShopLineFilter,
    CommonSetting,
    CustomField,
    NoData
  },
  props: {
    filter: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      showSetting: false,
      jobData: {},
      jobDataItemList: [],
      dataList: [],
      portList: [],
      formData: {
        cstSeqno: null,
        jobId: null,
        slotInfo: null
      },
      charsArr: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    }
  },
  created() {
    this.getJobDataBlock()
  },
  methods: {
    t,
    getTargetValue({ type, name, value, points }) {
      let defaultValue = null
      if (type === 'B') {
        defaultValue = this.$lodash.padEnd(value || 0, (points * 16 - `${value || 0}`.length), 0)
      } else {
        switch (name) {
          case 'CIMMode':
            defaultValue = 1
            break
          case 'SamplingSlotFlag':
            defaultValue = 1
            break
          case 'JobGrade':
            defaultValue = 'OK'
            break
          default:
            defaultValue = value
            break
        }
      }
      return defaultValue
    },
    getJobDataBlock() {
      this.loading = true
      return getJobDataBlock({
        shop: this.filter.shop,
        lineName: this.filter.lineId,
        localNo: this.filter.equipmentNo
      }).then(res => {
        this.jobDataItemList = (res.body || []).map(item => {
          item.defaultValue = this.getTargetValue(item)
          return item
        })
        this.jobData = this.jobDataItemList.reduce((jobData, item) => {
          this.$set(jobData, item.name, item.defaultValue)
          return jobData
        }, {})
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    generateHandler() {
      this.$refs['jobForm'].validate(valid => {
        if (valid) {
          this.dataList.splice(0, this.dataList.length)
          Array.from(this.formData.slotInfo).forEach((item, index) => {
            if (item !== '0') {
              this.dataList.push({
                slotFlag: index + 1,
                jobData: Object.assign(this.$lodash.cloneDeep(this.jobData), {
                  CassetteSequenceNo: this.formData.cstSeqno,
                  JobSequenceNo: index + 1,
                  JobId: this.filter.shop === 'CELL'
                    ? `${this.formData.jobId}${this.charsArr[Math.floor(index / 24)]}${this.charsArr[index % 24]}`
                    : `${this.formData.jobId}${this.charsArr[index % 24]}`
                })
              })
            }
          })
        }
      })
    },
    commonSettingHandler() {
      this.showSetting = true
    },
    sendHandler() {
      console.log(1111, this.dataList)
      this.loading = true
      return updateRedisCassetteMap({
        shop: this.filter.shop,
        lineName: this.filter.lineId,
        localNo: this.filter.equipmentNo,
        portId: this.filter.portId,
        jobDataBlock: this.dataList.map(({ jobData }) => jobData)
      }).then(res => {
        notice.success(res.result.message)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    successHandler(template) {
      const min = this.$lodash.min([template.slotStart, template.slotEnd])
      const max = this.$lodash.max([template.slotStart, template.slotEnd])
      const nTemplateList = Object.entries(template).filter(([key, value]) => {
        return (key !== 'slotStart' && key !== 'slotEnd' && key !== 'CassetteSequenceNo' && key !== 'JobSequenceNo' && key !== 'JobId' && value !== null && value !== '')
      })
      this.dataList.forEach(({ jobData }, index) => {
        const tempIndex = index + 1
        if ((min === max && tempIndex === min) || (tempIndex >= min && tempIndex <= max)) {
          nTemplateList.forEach(([key, value]) => {
            jobData[key] = value
          })
        }
      })
      this.showSetting = false
    },
    cancelHandler() {
      this.showSetting = false
    }
  }
}
</script>
<style lang="scss">
.app-container {
  #header {
    padding: 10px;
    padding-bottom: 0;
    margin-bottom: 10px;
    border: 1px solid #e3e3e3;
    border-radius: 5px;
    .el-input-number,
    .el-input {
      width: 100%;
    }
  }
  .jobdata-main {
    width: 100%;
    padding-bottom:10px;
    overflow-x: auto;
    .custom-table {
      border-collapse: collapse;
      border: 1px solid #ebeef5;
      overflow-x: auto;
      th {
        word-break: break-all;
        font-size: 14px;
        color: #606266;
        text-align: center;
        background-color: #f2f6fc !important;
      }
      th,td {
        min-width:120px;
        padding: 4px 10px 4px 10px;
        height: 40px;
        border: 1px solid #ebeef5;
      }
    }
  }
  .choose-port-list{
    display: flex;
    flex-flow: column wrap;
    label{
      width:100%;
      height:30px;
      line-height:30px;
      text-align: center;
    }

  }
  .el-form-item__error{
    display: block!important;
    width:100% !important;
    text-align: center !important;
  }
}
</style>
