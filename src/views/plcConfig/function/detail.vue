<template>
  <div>
    <el-row :gutter="10">
      <el-col :md="12">
        <el-select v-model="shop" placeholder="Shop" filterable clearable class="filter-item">
          <el-option v-for="(item,index) in shopList" :label="item.label" :value="item.value" :key="index" />
        </el-select>
      </el-col>
      <el-col :md="12">
        <el-select v-model="lineId" placeholder="LineID" filterable clearable class="filter-item">
          <el-option v-for="(item,index) in filterLineList" :disabled="item.lineId===lineVal" :value="item.lineId" :key="index" />
        </el-select>
      </el-col>
    </el-row>
    <div style="margin-top:10px;text-align:center;">
      <el-button type="primary" @click="saveHandler">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button type="primary" @click="closeHandler">
        <svg-icon :icon-class="'close'"/>&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { getLineList } from '@/api/eqpmodel/line'
import notice from '@/utils/notice'
import { shopList } from '@/config'
import { t } from '@/utils'
export default {
  name: 'FunctionDetail',
  props: {
    littleDetail: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      shop: '',
      lineId: '',
      lineVal: '',
      shopList: shopList,
      lineList: [],
      filterLineList: []
    }
  },
  watch: {
    shop() {
      this.lineId = ''
      this.filterLineList = Array.isArray(this.lineList) ? this.lineList.filter(({ shopName }) => shopName === this.shop) : []
    }
  },
  created() {
    this.lineVal = this.littleDetail.lineId
    this.getLineList()
  },
  methods: {
    t,
    getLineList() {
      return getLineList({
        condition: {
          shopName: this.shop
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.lineList = res.body.rows
      })
    },
    saveHandler() {
      if (this.shop && this.lineId) {
        this.$emit('successEvent', this.shop, this.lineId)
      } else {
        notice.error('Please Select Shop and LineId!')
      }
    },
    closeHandler() {
      this.$emit('cancelEvent', 'littleDetail')
    }
  }
}
</script>
<style scoped>
 .shopLineFilter{
   width: 300%;
 }
</style>
