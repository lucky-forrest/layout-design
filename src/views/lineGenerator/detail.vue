<template>
  <div>
    <div class="filter-container">
      <shop-line-filter @changeEvent="changeHandler">
        <el-col :lg="6" :md="6" :sm="12">
          <el-form-item style="white-space:nowrap;">
            <el-checkbox>SECS-EQP</el-checkbox>
            <el-button :loading="loading" type="success" style="margin-right:10px" @click="addHandler">
              <svg-icon :icon-class="'add'" />&nbsp;1
            </el-button>
          </el-form-item>
        </el-col>
      </shop-line-filter>
    </div>
    <el-table
      v-loading="loading"
      :data="dataList"
      highlight-current-row
      stripe
      border>
      <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
      <el-table-column prop="eqpNo" min-width="120" label="EQP NO" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.eqpNo"
            placeholder="Please Input!"
            clearable
            style="width:100%;" />
        </template>
      </el-table-column>
      <el-table-column prop="ip" min-width="130" label="IP" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.ip"
            placeholder="Please Input!"
            clearable
            style="width:100%;"/>
        </template>
      </el-table-column>
      <el-table-column prop="port" min-width="120" label="Port" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.port"
            placeholder="Please Input!"
            clearable
            style="width:100%;"/>
        </template>
      </el-table-column>
      <el-table-column prop="connectionMode" min-width="150" label="ConnectionMode" align="center">
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.connectionMode"
            placeholder="Please Input!"
            clearable
            style="width:100%;"/>
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="80" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button type="danger" icon="el-icon-delete" @click="removeHandler(curr)"/>
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
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
import ShopLineFilter from '@/components/ShopLineFilter'
import { copyConfXml } from '@/api/lineGenerator'
import { t } from '@/utils'
export default {
  name: 'LineGenerator',
  components: { ShopLineFilter },
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
      filter: {},
      dataList: []
    }
  },
  methods: {
    t,
    copyConfXml() {
      return copyConfXml({
        itemList: this.dataList,
        shop: this.filter.shop,
        lineId: this.filter.lineId,
        lineConfigPath: this.detailData.lineConfigPath,
        sourceCodePath: this.detailData.sourceCodePath
      }).then(res => {
        this.$emit('successEvent')
      }).catch(() => {
        this.loading = false
      })
      // console.log(this.filter.shop && this.filter.lineId)
      // if (this.filter.shop && this.filter.lineId) {
      //   return copyConfXml({
      //     condition: this.dataList,
      //     shop: this.filter.shop,
      //     lineId: this.filter.lineId,
      //     lineConfigPath: this.detailData.lineConfigPath,
      //     sourceCodePath: this.detailData.sourceCodePath
      //   }).then(res => {
      //     this.$emit('successEvent')
      //   }).catch(() => {
      //     this.loading = false
      //   })
      // } else {
      //   notice.error('Please Select Shop&LineId !')
      // }
    },
    addHandler() {
      this.dataList.unshift({
        eqpNo: '',
        ip: '',
        port: '',
        connectionMode: ''
      })
    },
    removeHandler(curr) {
      this.dataList.splice(curr.$index, 1)
    },
    saveHandler() {
      this.copyConfXml()
    },
    closeHandler() {
      this.$emit('cancelEvent')
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
    },
    indexHandler(index) {
      return index + 1
    }
  }
}
</script>

