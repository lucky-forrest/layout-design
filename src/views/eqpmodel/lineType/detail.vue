<template>
  <div class="linetype-container">
    <el-table v-loading.body="loading" :data="dataList" border>
      <el-table-column :index="indexHandler" type="index" align="center" label="#" fixed />
      <el-table-column min-width="120px" label="ShopName" prop="shopName">
        <template slot-scope="curr">
          <el-select v-model="curr.row.shopName" :placeholder="t('tip.pleaseSelectShop')" clearable class="filter-item">
            <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="LineType" prop="lineTypeId">
        <template slot-scope="curr">
          <el-input v-model="curr.row.lineTypeId" />
        </template>
      </el-table-column>
      <el-table-column min-width="150px" label="Descript" prop="lineTypeName" align="center">
        <template slot-scope="curr">
          <el-input v-model="curr.row.lineTypeName" />
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="SeqNo" prop="lineTypeSeqNo" align="center">
        <template slot-scope="curr">
          <el-input v-model="curr.row.lineTypeSeqNo" />
        </template>
      </el-table-column>
      <el-table-column width="120px" label="Actions" align="center">
        <template slot-scope="curr">
          <el-button type="danger" icon="el-icon-delete" @click="removeHandler(curr.$index)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-button :loading="loading" type="success" @click="addHandler">
      <svg-icon :icon-class="'plus'" />&nbsp;1</el-button>
      <el-button :loading="loading" type="primary" @click="saveHandler">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="cancelHandler">
        <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { saveLineTypeInfo } from '@/api/eqpmodel/lineType'
import notice from '@/utils/notice'
import { shopList } from '@/config'
import { t } from '@/utils'
export default {
  data() {
    return {
      loading: false,
      shopList: shopList,
      dataList: []
    }
  },
  methods: {
    t,
    saveHandler() {
      let errMsg = ''
      if (this.dataList.length === 0) {
        errMsg = 'Please Input Datas !'
      } else {
        for (const [key, item] of Object.entries(this.dataList)) {
          const rowIndex = +key + 1
          if (!item.shopName) {
            errMsg = `Row ${rowIndex} ShopName is null !`
            break
          }
          if (!item.lineTypeId) {
            errMsg = `Row ${rowIndex} LineType is null !`
            break
          }
        }
      }
      if (errMsg) {
        notice.error(errMsg)
      } else {
        return saveLineTypeInfo({
          actionType: 'Add',
          itemList: this.dataList
        }).then(() => {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.$emit('saveEvent')
          })
        })
      }
    },
    cancelHandler() {
      this.$emit('cancelEvent')
    },
    addHandler() {
      this.dataList.push({
        shopName: '',
        lineTypeId: '',
        lineTypeName: '',
        lineTypeSeqNo: ''
      })
    },
    removeHandler(index) {
      this.dataList.splice(index, 1)
    },
    indexHandler(index) {
      return index + 1
    }
  }
}
</script>

