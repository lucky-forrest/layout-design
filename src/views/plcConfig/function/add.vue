<template>
  <div class="addfuncion-container">
    <div class="filter-container">
      <shop-line-filter :disabled="shopLine" @changeEvent="changeHandler"/>
    </div>
    <el-table :data="dataList" stripe border>
      <el-table-column :index="indexHandler" type="index" align="center" fixed>#</el-table-column>
      <el-table-column label="FunctionName" min-width="150" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.functionName" class="filter-item"/>
        </template>
      </el-table-column>
      <el-table-column label="FunctionQty" min-width="150" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.functionQty" class="filter-item"/>
        </template>
      </el-table-column>
      <el-table-column label="FunctionType" min-width="150" align="center">
        <template slot-scope="scope">
          <el-select :placeholder="t('tip.pleaseSelectFunctionType')" v-model="scope.row.functionType" filterable class="filter-item">
            <el-option v-for="(item,index) in functionType" :label="item.label" :value="item.value" :key="index"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Common/Spec" min-width="200" align="center">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.functionCategory">
            <el-radio label="Common" class="radio">Common</el-radio>
            <el-radio label="Spec" class="radio">Spec</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column label="CommandDetail" min-width="280" align="center">
        <template slot-scope="scope">
          <el-row :gutter="20">
            <el-col :sm="24">
              <el-checkbox v-model="scope.row.functionWord" label="FunWord" />
              <el-checkbox v-model="scope.row.functionReplyWord" label="FunReplyWord" />
            </el-col>
            <el-col :sm="24">
              <el-checkbox v-model="scope.row.functionBit" label="FunBit" class="check"/>
              <el-checkbox v-model="scope.row.functionReplyBit" label="FunReplyBit" />
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="80" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="delHandler(curr)"/>
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-button :loading="loading" type="success" @click="addHandler">
        <svg-icon :icon-class="'add'"/>&nbsp;1
      </el-button>
      <el-button :loading="loading" type="primary" @click="saveHandler">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="closeHandler">
        <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { saveFunction } from '@/api/plcConfig/functionList'
import ShopLineFilter from '@/components/ShopLineFilter'
import { functionType } from '@/config/dropdown'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'Add',
  components: { ShopLineFilter },
  props: {
    update: {
      type: Boolean,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      filter: {},
      dataList: [],
      loading: false,
      shopLine: false,
      functionType: functionType
    }
  },
  methods: {
    t,
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
    },
    addHandler() {
      if (this.filter.shop && this.filter.lineId) {
        this.dataList.push({ shopName: this.filter.shop, lineId: this.filter.lineId, factoryName: this.factoryName, functionType: '', functionName: '', functionCategory: 'Common', functionWord: true, functionReplyWord: false, functionBit: true, functionReplyBit: false })
      } else {
        notice.error('Shop and LineId cannot be Empty!')
      }
    },
    saveHandler() {
      if (this.filter.shop && this.filter.lineId) {
        if (this.dataList.length > 0) {
          return saveFunction({
            shopName: this.filter.shop,
            list: this.dataList,
            lineId: this.filter.lineId,
            update: this.update
          }).then(res => {
            this.$emit('successEvent', 'add')
          })
        } else {
          notice.error('Function List is not null!')
        }
      } else {
        notice.error('Shop and LineId cannot be Empty!')
      }
    },
    closeHandler() {
      this.$emit('cancelEvent', 'add')
    },
    delHandler(curr) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        this.dataList.splice(curr.$index, 1)
        notice.success(this.t('tip.removeSuccess'), () => {
          this.loading = false
        })
      })
    },
    indexHandler(index) {
      return index + 1
    }
  }
}
</script>
<style scoped>
  .radio {
    width: 70px;
    margin: 0 10px;
  }

  .check {
    width: 95px;
    margin-left: -32px;
  }
</style>

