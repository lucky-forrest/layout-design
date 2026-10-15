<template>
  <div class="container">
    <el-table
      ref="multipleTable"
      :data="dataList"
      border
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="Shop" prop="shopName" align="center"/>
      <el-table-column label="LineType" prop="lineType" align="center"/>
      <el-table-column label="LineId" prop="lineId" align="center"/>
      <el-table-column label="ServerIP" prop="ip" align="center"/>
      <el-table-column label="Port1" prop="port" align="center"/>
      <el-table-column label="Port2" prop="port2" align="center"/>
    </el-table>
    <div style="margin-top:10px;text-align:center;">
      <el-button type="primary" @click="sendHandler" ><svg-icon :icon-class="'send'" />&nbsp;{{ t('btn.send') }}</el-button>
      <el-button @click="cancelHandler"><svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.cancel') }}</el-button>
    </div>
  </div>
</template>
<script>
import { receiveProfileList } from '@/api/eqprofile'
import { t } from '@/utils'
export default {
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
      dataList: [],
      multipleSelection: []
    }
  },
  created() {
    this.readerData()
  },
  methods: {
    t,
    readerData() {
      this.dataList = this.detailData.bcLines
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    sendHandler() {
      this.multipleSelection.forEach(item => {
        const serviceAddress = `http://${item.ip}:${item.port}/`
        this.detailData.toolProfileEdit.common = Object.assign(this.detailData.toolProfileEdit.common, { lineId: item.lineId })
        this.receiveProfileList(serviceAddress)
      })
      this.$emit('successEvent', 'online')
    },
    receiveProfileList(serviceAddress) {
      return receiveProfileList(serviceAddress, this.detailData.toolProfileEdit).then(res => {

      })
    },
    cancelHandler() {
      this.$emit('cancelEvent', 'online')
    }
  }
}
</script>
