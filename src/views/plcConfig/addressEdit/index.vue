<template>
  <div class="app-container">
    <el-form name="addressForm" label-width="120px">
      <div class="filter-container">
        <shop-line-filter :shop-val="shop" :line-val="lineId" :disabled="shopLine" @changeEvent="changeHandler" >
          <el-col :lg="6" :md="8" style="text-align:right;white-space:nowrap;">
            <el-button :loading="loading" type="primary" icon="el-icon-search" @click="search">{{ t('btn.search') }}</el-button>
            <el-button v-authorize="'save'" :loading="loading" type="primary" @click="saveHandle" > <svg-icon :icon-class="'save'" /> {{ t('btn.save') }}</el-button>
          </el-col>
        </shop-line-filter>
      </div>
      <div v-if="Array.isArray(dataList)&&dataList.length>0">
        <table class="custom-table" stripe border>
          <thead>
            <tr>
              <th style="width:150px;" rowspan="3">EquipmentNo</th>
              <th stype="width:220px" rowspan="3">Name</th>
              <th stype="width:150px" rowspan="3">NetWorkNo</th>
              <th stype="width:150px" rowspan="3">StationNo</th>
              <th stype="width:450px" colspan="3">Send range for each station (Bit)</th>
              <th stype="width:450px" colspan="3">Send range for each station (Word)</th>
              <th style="width:450px" colspan="3">Send range(Expansion) for each station (Word)</th>
            </tr>
            <tr>
              <th stype="width:150px" rowspan="2">Points</th>
              <th stype="width:300px" colspan="2">Link side</th>
              <th stype="width:150px" rowspan="2">Points</th>
              <th stype="width:300px" colspan="2">Link side</th>
              <th stype="width:150px" rowspan="2">Points</th>
              <th stype="width:300px" colspan="2">Link side</th>
            </tr>
            <tr>
              <th stype="width:150px">Start</th>
              <th stype="width:150px">End</th>
              <th stype="width:150px">Start</th>
              <th stype="width:150px">End</th>
              <th stype="width:150px">Start</th>
              <th stype="width:150px">End</th>
            </tr>
          </thead>
          <tr v-for="(item,index) in dataList" :key="index">
            <td stype="width:150px;" align="center">{{ item.equipmentNo }}</td>
            <td stype="width:220px;" align="center">{{ item.equipmentName }}</td>
            <td stype="width:150px;" align="center">{{ item.networkNo }}</td>
            <td stype="width:150px;" align="center">{{ item.stationNo }}</td>
            <td stype="width:150px;" align="center">
              <el-input v-model="item.bPoints" placeholder="Please Input!" class="filter-item" />
            </td>
            <td stype="width:150px;" align="center">
              <el-input v-model="item.bStartAddress" placeholder="Please Input!" class="filter-item" />
            </td>
            <td stype="width:150px;" align="center">
              <el-input v-model="item.bEndAddress" placeholder="Please Input!" class="filter-item" />
            </td>
            <td stype="width:150px;" align="center">
              <el-input v-model="item.wPoints" placeholder="Please Input!" class="filter-item" />
            </td>
            <td stype="width:150px;" align="center">
              <el-input v-model="item.wStartAddress" placeholder="Please Input!" class="filter-item" />
            </td>
            <td stype="width:150px;" align="center">
              <el-input v-model="item.wEndAddress" placeholder="Please Input!" class="filter-item" />
            </td>
            <td stype="width:150px;" align="center">
              <el-input v-model="item.ewPoints" class="filter-item" />
            </td>
            <td stype="width:150px;" align="center">
              <el-input v-model="item.ewStartAddress" class="filter-item" />
            </td>
            <td stype="width:150px;" align="center">
              <el-input v-model="item.ewEndAddress" class="filter-item" />
            </td>
          </tr>
        </table>
      </div>
      <NoData v-else/>
      <div v-if="showNextBtn" class="card-footer">
        <el-button type="primary" @click="nextHandler">{{ t('btn.next') }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getAddressRangeList, updateAddressRange } from '@/api/plcConfig/address'
import AddressImport from '@/components/UploadExcel/addressImport.vue'
import ShopLineFilter from '@/components/ShopLineFilter'
import notice from '@/utils/notice'
import NoData from '@/components/Nodata'
import { t } from '@/utils'
export default {
  name: 'AddressEdit',
  components: {
    AddressImport,
    ShopLineFilter,
    NoData
  },
  props: {
    detailData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      shop: '',
      lineId: '',
      version: '',
      loading: false,
      update: false,
      shopLine: false,
      factoryName: '',
      showUploadFile: false,
      showNextBtn: false,
      dataList: [],
      filter: {}
    }
  },
  created() {
    if (this.detailData.isShowBtn) {
      this.shop = this.detailData.row.shopName
      this.lineId = this.detailData.row.lineId
      this.shopLine = this.detailData.shopLine
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.detailData.isShowBtn) {
        console.log(this.detailData)
        this.showNextBtn = this.detailData.isShowBtn
        this.shop = this.detailData.row.shopName
        this.lineId = this.detailData.row.lineId
        this.version = this.detailData.row.version
        this.factoryName = this.detailData.row.factoryName
        this.update = true
        this.getAddressRangeList()
      }
    })
  },
  methods: {
    t,
    nextHandler() {
      this.$emit('successEvent', 'function', this.dataList)
    },
    getAddressRangeList() {
      this.loading = true
      return getAddressRangeList({
        shopName: this.shop,
        lineId: this.lineId,
        version: this.version,
        factoryName: this.factoryName,
        update: this.update
      })
        .then(res => {
          this.dataList = res.body
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    search() {
      this.getAddressRangeList()
    },
    saveHandle() {
      this.loading = true
      return updateAddressRange({
        lineId: this.lineId,
        shopName: this.shop,
        version: this.version,
        update: this.update,
        factoryName: this.factoryName,
        list: this.dataList
      })
        .then(res => {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.loading = false
            this.getAddressRangeList()
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      this.shop = this.filter.shop
      this.lineId = this.filter.lineId
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ebeef5;

  th {
    font-size: 14px;
    color: #606266;
    text-align: center;
    background-color: #f2f6fc !important;
  }
  th,
  td {
    height: 40px;
    border: 1px solid #ebeef5;
  }
}

.span {
  border: 1px solid #e3e3e3;
  border-radius: 5px;
  padding: 10px;
  width: 100%;
}
</style>
