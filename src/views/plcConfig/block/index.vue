
<template>
  <div class="app-container">
    <div class="filter-container">
      <shop-line-filter :shop-val="shopName" :line-val="lineId" :disabled="shopLine" @changeEvent="changeHandler">
        <el-col slot="prefix" :lg="6" :md="8" :sm="12">
          <el-form-item style="white-space:nowrap;">
            <el-radio-group v-model="radioType">
              <el-radio-button label="LTM">LW (LTM)</el-radio-button>
              <el-radio-button label="MTL">LW (MTL)</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="24" :sm="12" style="white-space:nowrap;">
          <el-button type="primary" icon="el-icon-search" @click="search">{{ t('btn.search') }}</el-button>
          <el-button :loading="loading" type="primary" @click="saveHandle(true)">
            <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
          </el-button>
        </el-col>
      </shop-line-filter>
      <div v-if="Array.isArray(showDataList)&&showDataList.length>0">
        <table class="custom-table">
          <thead>
            <tr>
              <th>#</th>
              <th>BlockName</th>
              <th>Size</th>
              <th>Action</th>
            </tr>
          </thead>
          <draggable v-model="showDataList" element="tbody" @update="datadragEnd">
            <tr v-for="(item,index) in showDataList" :key="index">
              <td align="center">{{ index }}</td>
              <td align="center">
                <span>{{ item.blockName }}</span>
              </td>
              <td align="center">
                <span>{{ item.size }}</span>
              </td>
              <td align="center">
                <svg-icon :icon-class="'move'"/>
              </td>
            </tr>
          </draggable>
        </table>
      </div>
      <NoData v-else/>
      <div v-if="showNextBtn" class="card-footer">
        <el-button type="primary" @click="nextHandler('back')">{{ t('btn.back') }}</el-button>
        <el-button type="primary" @click="nextHandler('next')">{{ t('btn.next') }}</el-button>
      </div>
    </div>
</div></template>

<script>
import { t } from '@/utils'
import notice from '@/utils/notice'
import draggable from 'vuedraggable'
import NoData from '@/components/Nodata'
import ShopLineFilter from '@/components/ShopLineFilter'
import { getBlockList, updatePlcMapBlockSort, saveBlockList } from '@/api/plcConfig/block'
export default {
  name: 'BlockSort',
  components: { draggable, ShopLineFilter, NoData },
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
      showNextBtn: false,
      shopName: '',
      lineId: '',
      version: '',
      update: false,
      shopLine: false,
      dataList: [],
      blockList: [],
      radioType: 'LTM',
      showDataList: [],
      filter: {}
    }
  },
  watch: {
    radioType() {
      if (this.shopName && this.lineId) {
        this.saveHandle(false)
        this.getBlockList()
        this.blockList = this.$lodash.slice(this.dataList.filter(curr => { return curr.blockCatory.includes(this.radioType) }))
        this.showDataList = this.$lodash.slice(this.blockList).rows
      }
    }
  },
  created() {
    if (this.detailData.isShowBtn) {
      this.shopName = this.detailData.row.shopName
      this.lineId = this.detailData.row.lineId
      this.shopLine = this.detailData.shopLine
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.detailData.isShowBtn) {
        this.showNextBtn = this.detailData.isShowBtn
        this.shopName = this.detailData.row.shopName
        this.lineId = this.detailData.row.lineId
        this.shopLine = this.detailData.shopLine
        this.version = this.detailData.row.version
        this.update = true
        this.getBlockList()
      }
    })
  },
  methods: {
    t,
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      this.shopName = this.filter.shop
      this.lineId = this.filter.lineId
    },
    nextHandler(type) {
      if (type === 'next') {
        this.$emit('successEvent', 'wordEdit', this.dataList)
      } else {
        this.$emit('successEvent', 'function')
      }
    },
    saveBlockList(flag) {
      this.loading = true
      return saveBlockList({
        update: this.update,
        shopName: this.shopName,
        lineId: this.lineId,
        version: this.version,
        list: this.dataList
      }).then(res => {
        notice.success(this.t('tip.saveSuccess'))
      }).catch(() => {
        this.loading = false
      })
    },
    search() {
      this.getBlockList()
      this.blockList = this.$lodash.slice(this.dataList.filter(curr => { return curr.blockCatory.includes(this.radioType) }))
      this.showDataList = this.$lodash.slice(this.blockList)
    },
    saveHandle(flag) {
      updatePlcMapBlockSort({
        update: this.update,
        shopName: this.shopName,
        lineId: this.lineId,
        version: this.version,
        list: this.showDataList
      }).then(res => {
        if (flag) {
          notice.success(this.t('tip.saveSuccess'))
        }
      }).catch(err => {
        notice.error(err)
      })
    },
    getBlockList() {
      this.loading = true
      return getBlockList({
        condition: {
          shopName: this.shopName,
          lineId: this.lineId,
          version: this.version,
          update: this.update
        }
      }).then(res => {
        this.dataList = res.body.rows
        this.loading = false
        this.blockList = this.$lodash.slice(this.dataList.filter(curr => { return curr.blockCatory.includes(this.radioType) }))
        this.showDataList = this.$lodash.slice(this.blockList)
      }).catch(() => {
        this.loading = false
      })
    },
    datadragEnd(evt) {
      let list = []
      const newIndex = evt.newIndex
      const oldIndex = evt.oldIndex
      if (newIndex < oldIndex) {
        if (newIndex !== 0) {
          for (let i = 0; i < newIndex; i++) {
            list.push(this.blockList[i])
          }
          list.push(this.blockList[oldIndex])
          for (let i = newIndex; i < this.blockList.length; i++) {
            if (i !== oldIndex) {
              list.push(this.blockList[i])
            }
          }
        } else {
          list.push(this.blockList[oldIndex])
          for (let i = 0; i < this.blockList.length; i++) {
            if (i !== oldIndex) {
              list.push(this.blockList[i])
            }
          }
        }
      } else if (oldIndex < newIndex) {
        for (let i = 0; i <= newIndex; i++) {
          if (i !== oldIndex) {
            list.push(this.blockList[i])
          }
        }
        list.push(this.blockList[oldIndex])
        for (let i = newIndex + 1; i < this.blockList.length; i++) {
          list.push(this.blockList[i])
        }
      } else {
        list = this.$lodash.slice(this.blockList)
      }
      this.showDataList = this.$lodash.slice(list)
      for (let i = 0; i < this.showDataList.length; i++) {
        this.showDataList[i].sort = i
      }
      this.blockList = this.$lodash.slice(this.showDataList)
    }
  }
}
</script>
<style lang="scss" scoped>
  .custom-table{
    width:100%;
    border-collapse: collapse;
    border:1px solid #ebeef5;

    th{
      font-size:14px;
      color:#606266;
      text-align: center;
      background-color: #f2f6fc !important;
    }
    th,td{
       height: 40px;
       border:1px solid #ebeef5;
    }
  }
</style>
