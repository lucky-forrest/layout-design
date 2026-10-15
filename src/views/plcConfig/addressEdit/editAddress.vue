<template>
  <div class="app-container">
    <div class="filter-container">
      <shop-line-filter :shop-val="shop" :line-val="lineId" :disabled="shopLine" @changeEvent="changeHandler" >
        <el-col :lg="6" :md="8" style="text-align:right;white-space:nowrap;">
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="searchHandler" >{{ t('btn.search') }}</el-button>
          <el-button :loading="loading" type="primary" @click="saveHandle"> <svg-icon :icon-class="'save'" /> &nbsp;{{ t('btn.save') }} </el-button>
          <el-button v-authorize="'createData'" :loading="loading" type="primary" @click="createDataHandle" >{{ t('btn.createData') }}</el-button>
        </el-col>
      </shop-line-filter>
    </div>
    <div v-if="Array.isArray(pageInfo.dataList)&&pageInfo.dataList.length>0">
      <el-tabs v-model="tabsType" :stretch="true" type="border-card" @tab-click="handleClick">
        <el-tab-pane v-for="(item,key) in allSheet" :key="key" :label="item.type" :name="item.type">
          <el-table :data="pageInfo.dataList" border>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-table :data="props.row.list">
                  <el-table-column
                    v-for="(column, index) in filterHandler(item)"
                    :key="index"
                    :prop="column"
                    :label="column"
                    min-width="140"
                    align="center"
                  >
                    <template slot-scope="curr">
                      <el-input
                        v-if="['blockName','itemName','size'].includes(column)"
                        v-model="curr.row[column]"
                        style="border:none;width:90%"
                      />
                      <el-input v-else v-model="curr.row.eqpMap[column].startAddress" style="border:none;width:90%" />
                      <el-checkbox
                        v-if="!['blockName','itemName','size'].includes(column)"
                        v-model="curr.row.eqpMap[column].available"
                        true-label="Y"
                        false-label="N"
                      />
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(column, index) in filterHandler(item)"
              :key="index"
              :prop="column"
              :label="column"
              min-width="140"
              align="center"
            >
              <template slot-scope="curr">
                <el-input
                  v-if="['blockName','itemName','size'].includes(column)"
                  v-model="curr.row[column]"
                  style="border:none;width:90%"
                />
                <el-input v-else v-model="curr.row[column].startAddress" style="border:none;width:90%" />
                <el-checkbox
                  v-if="!['blockName','itemName','size'].includes(column)"
                  v-model="curr.row[column].available"
                  true-label="Y"
                  false-label="N"
                />
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <div class="card-footer">
        <el-pagination
          :total="pageInfo.total"
          :page-size="pageInfo.pageSize"
          :page-sizes="pageInfo.pageSizeList"
          :current-page="pageInfo.currPage"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <NoData v-else/>
    <div class="card-footer">
      <el-button v-if="showNextBtn" type="primary" @click="nextHandler('back')">{{ t('btn.back') }}</el-button>
      <el-button v-if="showNextBtn" type="primary" @click="nextHandler('save')">{{ t('btn.save') }}</el-button>
    </div>
  </div>
</template>
<script>
import { t } from '@/utils'
import notice from '@/utils/notice'
import NoData from '@/components/Nodata'
import ShopLineFilter from '@/components/ShopLineFilter'
import {
  getAddressMap,
  updateAddressMapData,
  saveAddressMap
} from '@/api/plcConfig/address'
export default {
  name: 'EditAddress',
  components: {
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
      loading: false,
      shopLine: false,
      update: false,
      showNextBtn: false,
      tabsType: '',
      shop: '',
      lineId: '',
      filter: {},
      allSheet: [],
      allList: [],
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        currPage: 1,
        dataList: []
      }
    }
  },
  created() {
    if (this.detailData.isShowBtn) {
      this.shop = this.detailData.row.shopName
      this.lineId = this.detailData.row.lineId
      this.shopLine = this.detailData.shopLine
      this.showNextBtn = this.detailData.isShowBtn
      this.update = true
      this.getAddressMap()
    }
  },
  methods: {
    t,
    filterHandler(item) {
      return ['blockName', 'itemName', 'size'].concat(
        Object.keys(this.$lodash.head(item.addressMaps).eqpMap).sort()
      )
    },
    filterItemHandler(item) {
      console.log(item)
      return ['blockName', 'itemName', 'size'].concat(
        Object.keys(this.$lodash.head(item.addressMaps).list.eqpMap).sort()
      )
    },
    nextHandler(type) {
      if (type === 'save') {
        this.$emit('successEvent', 'end', this.pageInfo.dataList)
      } else {
        this.$emit('successEvent', 'constants')
      }
    },
    getTargetObject() {
      return new Promise((resolve, reject) => {
        const targetObject = JSON.parse(JSON.stringify(this.allSheet))
        targetObject.forEach(element => {
          element.addressMaps.forEach(item => {
            Object.keys(item.eqpMap).forEach(key => {
              item.eqpMap = Object.assign(item.eqpMap, { [key]: item[key] })
              delete item[key]
            })
          })
        })
        resolve(targetObject)
      })
    },
    createDataHandle() {
      this.loading = true
      this.getTargetObject().then(res => {
        return updateAddressMapData({
          shopName: this.filter.shop,
          lineId: this.filter.lineId,
          update: this.update,
          list: res
        })
          .then(res => {
            const tempObject = res.body
            if (Array.isArray(tempObject.list)) {
              tempObject.list.forEach(tabData => {
                if (Array.isArray(tabData.addressMaps)) {
                  tabData.addressMaps.forEach(item => {
                    Object.assign(item, { ...item.eqpMap })
                  })
                }
              })
              this.allSheet = tempObject.list
            }
            const { type, addressMaps } = this.$lodash.head(res.body.list) || {}
            this.tabsType = type
            this.allList = addressMaps
            this.getDataListByPage()
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      })
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      this.shop = this.filter.shop
      this.lineId = this.filter.lineId
    },
    getAddressMap() {
      this.loading = true
      return getAddressMap({
        shopName: this.shop,
        lineId: this.lineId,
        update: this.update
      })
        .then(res => {
          const tempObject = res.body
          if (Array.isArray(tempObject.list)) {
            tempObject.list.forEach(tabData => {
              if (Array.isArray(tabData.addressMaps)) {
                tabData.addressMaps.forEach(item => {
                  Object.assign(item, { ...item.eqpMap })
                })
              }
            })
            this.allSheet = tempObject.list
          }
          const { type, addressMaps } = this.$lodash.head(res.body.list) || {}
          this.tabsType = type
          this.allList = addressMaps
          this.getDataListByPage()
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleClick({ label }, event) {
      this.pageInfo.currPage = 1
      const { addressMaps } = this.allSheet.find(({ type }) => type === label)
      this.allList = addressMaps
      this.getDataListByPage()
    },
    getDataListByPage() {
      this.loading = true
      this.pageInfo.total = this.allList.length
      this.pageInfo.dataList = this.$lodash.slice(
        this.allList,
        (this.pageInfo.currPage - 1) * this.pageInfo.pageSize,
        this.pageInfo.currPage * this.pageInfo.pageSize
      )
      this.loading = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getDataListByPage()
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getDataListByPage()
    },
    searchHandler() {
      if (this.filter.lineId !== '') {
        this.getAddressMap()
      }
    },
    saveHandle() {
      this.loading = true
      this.getTargetObject().then(res => {
        return saveAddressMap({
          shopName: this.shop,
          lineId: this.lineId,
          update: this.update,
          list: res
        })
          .then(res => {
            this.loading = false
            notice.success(this.t('tip.saveSuccess'))
          })
          .catch(() => {
            this.loading = false
          })
      })
    }
  }
}
</script>

