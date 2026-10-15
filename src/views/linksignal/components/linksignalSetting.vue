<template>
  <div class="linksignal-setting">
    <el-row :gutter="20">
      <el-col :md="4">
        <el-select v-show="actionType==='add'" v-model="upStreamName" placeholder="UpStream" clearable filterable >
          <el-option v-for="(item,index) in upStreamNameList" :key="index" :label="item" :value="item" />
        </el-select>
      </el-col>
      <el-col :md="4">
        <el-select v-show="actionType==='add'" v-model="downStreamName" placeholder="DownStream" clearable filterable >
          <el-option v-for="(item,index) in downStreamNameList" :key="index" :label="item" :value="item" />
        </el-select>
      </el-col>
      <el-col :sm="4">
        <el-input :disabled="actionType==='update'" v-model="flowName" placeholder="FlowName" clearable/>
      </el-col>
      <el-col :sm="12">
        <el-button :disabled="upStreamList.length===0||downStreamList.length===0" :loading="loading" type="success" @click="addColsHandler">+1</el-button>
        <el-button :loading="loading" type="primary" @click="saveHandler">
          <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
        </el-button>
        <el-button :disabled="upStreamList.length===0||downStreamList.length===0||cols.length===0" :loading="loading" type="danger" @click="delHandler">
          <svg-icon :icon-class="'remove'" />&nbsp;{{ t('btn.remove') }}
        </el-button>
      </el-col>
    </el-row>
    <el-table
      :data="upStreamList"
      style="margin-top:10px;"
      border>
      <el-table-column min-width="180px" align="right" label="UpStream" prop="itemName"/>
      <el-table-column
        v-for="(col, index) in cols"
        :key="index"
        :prop="col"
        :label="col"
        align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row[col]"
            :active-value="1"
            :inactive-value="0"
            active-color="green"
            inactive-color="red"/>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      :data="downStreamList"
      style="margin-top:10px;"
      border>
      <el-table-column min-width="180px" align="right" label="DownStream" prop="itemName"/>
      <el-table-column
        v-for="(col, index) in cols"
        :key="index"
        :prop="col"
        :label="col"
        align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row[col]"
            :active-value="1"
            :inactive-value="0"
            active-color="green"
            inactive-color="red"/>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { saveLinkSignalSpce, getLinkSignalTemplateByLineId, getLinkSignalTempName, getLiksignalSpec } from '@/api/linksignal/linksignalSpec'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'LinksignalSetting',
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
        return 'add'
      }
    }
  },
  data() {
    return {
      loading: false,
      edit: false,
      colNum: 0,
      flowName: '',
      upStreamName: '',
      downStreamName: '',
      upStreamNameList: [],
      downStreamNameList: [],
      linkSignalNameList: {},
      upStreamList: [],
      downStreamList: [],
      targetUpStreamList: [],
      targetDownStreamList: [],
      dataList: [],
      cols: []
    }
  },
  watch: {
    upStreamName() {
      if (this.actionType === 'add') {
        this.upStreamList = this.linkSignalNameList.Upstream.find(({ templateName }) => templateName === this.upStreamName).list
      }
    },
    downStreamName() {
      if (this.actionType === 'add') {
        this.downStreamList = this.linkSignalNameList.Downstream.find(({ templateName }) => templateName === this.downStreamName).list
      }
    }
  },
  created() {
    if (this.actionType === 'update') {
      this.loading = true
      this.edit = true
      this.upStreamName = this.detailData.upStreamName
      this.downStreamName = this.detailData.downStreamName
      this.flowName = this.detailData.flowName
      return getLiksignalSpec({
        flowName: this.flowName,
        upStreamList: null,
        downStreamList: null
      }).then(res => {
        const upstreamLinkSignal = res.body.linkSignalSpecList.find(item => item.templateName.substr(0, 8) === 'Upstream').list
        const downstreamLinkSignal = res.body.linkSignalSpecList.find(item => item.templateName.substr(0, 10) === 'Downstream').list
        const linksignal = res.body.itemBeans
        if (Array.isArray(linksignal)) {
          this.colNum = linksignal.length
          linksignal.forEach(({ upStreamSignal, downStreamSignal }, index) => {
            const columnName = `${index + 1}`
            this.cols.push(columnName)
            for (let i = 0; i <= 31; i++) {
              this.$set(upstreamLinkSignal[i], columnName, Number.parseInt(upStreamSignal[i], 10))
              this.$set(downstreamLinkSignal[i], columnName, Number.parseInt(downStreamSignal[i], 10))
            }
          // this.detailData.upstreamLinkSignal.forEach((row, rIndex) => {
          //   this.$set(row, columnName, Number.parseInt(upStreamSignal[rIndex], 10))
          // })
          })
        }
        this.upStreamList = upstreamLinkSignal
        this.downStreamList = downstreamLinkSignal
        this.loading = false
      })
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.getLinkSignalTempName()
    })
  },
  methods: {
    t,
    delHandler() {
      this.upStreamList.forEach(item => delete item[this.colNum])
      this.downStreamList.forEach(item => delete item[this.colNum])
      this.cols.splice(this.cols.indexOf(this.colNum), 1)
      --this.colNum
    },
    getLinkSignalTempName() {
      return getLinkSignalTempName({}).then(res => {
        this.linkSignalNameList = res.body
        if (res.body.Upstream) {
          this.upStreamNameList = res.body.Upstream.map(curr => { return curr.templateName })
        }
        if (res.body.Downstream) {
          this.downStreamNameList = res.body.Downstream.map(curr => { return curr.templateName })
        }
      })
    },
    addColsHandler() {
      ++this.colNum
      this.upStreamList.forEach(item => {
        this.$set(item, `${this.colNum}`, '0')
      })
      this.downStreamList.forEach(item => {
        this.$set(item, `${this.colNum}`, '0')
      })
      this.cols.push(`${this.colNum}`)
    },
    getLinkSignalTemplateByLineId() {
      this.loading = true
      return getLinkSignalTemplateByLineId({}).then(res => {
        res.body.forEach(curr => {
          if (curr.itemGroupName === 'UpstreamLinkSignal') {
            this.upStreamList = this.$lodash.slice(curr.itemBeans)
          } else {
            this.downStreamList = this.$lodash.slice(curr.itemBeans)
          }
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    removeHandler(index) {
      this.dataList.splice(index, 1)
    },
    getTargetStreamList() {
      return new Promise((resolve, reject) => {
        for (let i = 1; i <= this.colNum; i++) {
          this.targetUpStreamList.push({ sort: i, upStreamSignal: this.$lodash.map(this.upStreamList, `${i}`).join('') })
          this.targetDownStreamList.push({ sort: i, downStreamSignal: this.$lodash.map(this.downStreamList, `${i}`).join('') })
        }
        resolve([{
          itemGroupName: 'UpstreamLinkSignal',
          itemBeans: this.targetUpStreamList
        },
        {
          itemGroupName: 'DownstreamLinkSignal',
          itemBeans: this.targetDownStreamList
        }])
      })
    },
    saveHandler() {
      if (!this.flowName) {
        notice.error('请输入FlowName!')
        return false
      } else {
        this.getTargetStreamList().then(res => {
          this.loading = true
          return saveLinkSignalSpce({
            edit: this.edit,
            upstreamTemp: this.upStreamName,
            downstreamTemp: this.downStreamName,
            flowName: this.flowName,
            itemBeans: res
          }).then(res => {
            notice.success(this.t('tip.saveSuccess'))
            this.$emit('successEvent')
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        })
      }
    }
  }
}
</script>
<style lang="scss">
  .linksignal-setting {
    .el-select {
      width: auto !important;
    }

    .custom-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e3e3e3;
      overflow: hidden;

      th,
      td {
        border: 1px solid #e3e3e3;
        padding: 0 10px;
        line-height: 40px;
      }

      th {
        text-align: center;
      }
    }

    .row-stream {
      flex: row nowrap;
      margin:5px;
      line-height: 30px;

      .col-key {
        display: inline-block;
        margin: 0;
        flex: 1 1 auto;
        width:200px;
        text-align: right;
      }

      .col-value {
        display: inline-block;
        margin: 0;
         flex: 0 1 auto;
      }
    }
  }
</style>
