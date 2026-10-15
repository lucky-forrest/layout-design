<template>
  <el-form ref="jobForm" label-width="120px">
    <el-row :gutter="10">
      <slot name="prefix"/>
      <el-col :lg="6" :md="8" :sm="12">
        <el-form-item label="Shop" >
          <el-select v-loading="loading" v-model="shop" :disabled="disabled" :placeholder="t('tip.pleaseSelectShop')" filterable clearable class="filter-item">
            <el-option v-for="(item,index) in shopList" :label="item.label" :value="item.value" :key="index" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :lg="6" :md="8" :sm="12">
        <el-form-item label="LineID">
          <el-select v-model="lineId" :disabled="disabled" :placeholder="t('tip.pleaseSelectLineId')" allow-create filterable clearable class="filter-item">
            <el-option v-for="(item,index) in filterLineList" :value="item.lineId" :key="index" />
          </el-select>
        </el-form-item>
      </el-col>
      <slot/>
    </el-row>
  </el-form>
</template>
<script>
import { getLineList } from '@/api/eqpmodel/line'
import { shopList } from '@/config'
import { t } from '@/utils'
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    shopVal: {
      type: String,
      default: ''
    },
    lineVal: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      shop: '',
      lineId: '',
      shopList: shopList,
      lineList: [],
      filterLineList: []
    }
  },
  watch: {
    shop() {
      if (!this.disabled) {
        this.lineId = ''
        this.filterLineList = Array.isArray(this.lineList) ? this.lineList.filter(({ shopName }) => shopName === this.shop) : []
        this.$emit('changeEvent', {
          shop: this.shop,
          lineId: this.lineId
        })
      }
    },
    lineId() {
      if (!this.disabled) {
        this.$emit('changeEvent', {
          shop: this.shop,
          lineId: this.lineId
        })
      }
    }
  },
  created() {
    this.shop = this.shopVal
    this.lineId = this.lineVal
    this.getLineList()
  },
  methods: {
    t,
    getLineList() {
      this.loading = true
      return getLineList({
        condition: {
          shopName: this.shop
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.lineList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-select{
  width:100%;
}
</style>
