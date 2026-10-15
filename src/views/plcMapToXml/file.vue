
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :sm="5">
          <el-select v-model="fabType" :placeholder="t('tip.pleaseSelectFabType')" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in fabTypeList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :sm="5">
          <el-select v-model="lineType" :placeholder="t('tip.pleaseSelectLineType')" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :sm="5">
          <el-input v-model="version" :placeholder="t('tip.pleaseInputVersion')" clearable class="filter-item"/>
        </el-col>
        <el-col :sm="4">
          <el-button type="primary" icon="el-icon-search">{{ t('btn.search') }}</el-button>
        </el-col>
        <el-col :sm="5">
          <el-select v-model="importType" :placeholder="t('tip.pleaseSelectImportType')" class="filter-item">
            <el-option :label="'xml'" :value="'xml'"><svg-icon :icon-class="'xml'"/>&nbsp;&nbsp;{{ 'xml' }}</el-option>
            <el-option :label="'excel'" :value="'excel'"><svg-icon :icon-class="'excel'"/>&nbsp;&nbsp;{{ 'excel' }}</el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <!-- v-mousewheelX="'el-table__body-wrapper'" -->
    <el-table
      v-loading.body="loading"
      :data="pageInfo.dataList"
      :default-sort="{prop:'createtime',order:'descending'}"
      stripe
      border
      @selection-change="selsChange">
      <el-table-column type="selection" width="30" reserve-selection=""/>
      <el-table-column :index="indexHandler" type="index" fixed>#</el-table-column>
      <el-table-column label="PLC Mappijng Name" min-width="100" prop="fileName"/>
      <el-table-column label="Version" min-width="100" prop="version"/>
      <el-table-column label="Fab" min-width="100" prop="fab"/>
      <el-table-column label="Shop" min-width="100" prop="shop"/>
      <el-table-column label="LineType" min-width="100" prop="lineType"/>
      <el-table-column label="EqpType" min-width="100" prop="eqpType"/>
      <el-table-column label="LocalNo" min-width="100" prop="localNo"/>
      <el-table-column label="Remark" min-width="100" prop="remark"/>
      <el-table-column label="UpdatedBy" min-width="100" prop="updatedBy"/>
      <el-table-column label="UpdatedTime" min-width="100" prop="updatedTime"/>
      <el-table-column label="ModifyBy" min-width="100" prop="modifyBy"/>
      <el-table-column label="ModifyTime" min-width="100" prop="modifyTime"/>
    </el-table>
    <div class="card-footer">
      <el-pagination
        :total="pageInfo.total"
        :page-size="pageInfo.pageSize"
        :page-sizes="pageInfo.pageSizeList"
        :current-page="pageInfo.currPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import { getFileList } from '@/api/plcMapToXml/plc'
import { fabTypeList, lineTypeList } from '@/config/dropdown'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'PlcMapFile',
  components: { },
  data() {
    return {
      eqpId: '',
      version: '',
      fabType: '',
      lineType: '',
      loading: true,
      importType: '',
      showUpload: false,
      fabTypeList: fabTypeList,
      lineTypeList: lineTypeList,
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        currPage: 1,
        dataList: []
      }
    }
  },
  watch: {
    importType() {
      if (this.importType === 'xml') {
        this.downloadXML(true)
      } else if (this.importType === 'excel') {
        this.downloadExcel(true)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getFileList()
    })
  },
  methods: {
    t,
    search() {
      this.pageInfo.currPage = 1
      this.getFileList()
    },
    getFileList() {
      return new Promise((resolve, reject) => {
        try {
          this.loading = true
          return getFileList({
            condition: {
              lineId: this.lineId,
              eqpId: this.eqpId
            },
            pageNo: this.pageInfo.pageNo,
            pageSize: this.pageInfo.pageSize
          }).then(res => {
            this.pageInfo.total = res.body.total
            this.pageInfo.dataList = res.body.rows
            this.loading = false
            resolve()
          }).catch(() => {
            this.loading = false
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    successHandler(title, res) {
      this.showUpload = false
      notice.success(res.result.message, () => {
        this.getFileList()
      })
    },
    cancelHandler() {
      this.showUpload = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getFileList()
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getFileList()
    },
    indexHandler(index) {
      return (this.pageInfo.currPage - 1) * this.pageInfo.pageSize + index + 1
    },
    selsChange(sels) {
      this.sels = sels
    },
    downloadExcel() {
      this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const tHeader = this.tableHeader
      //   const tableList = this.dataList.filter(curr => { return curr.tableName === this.dataType })[0].tableList
      //   require.ensure([], () => {
      //     const data = convertDataToJson(tHeader, tableList)
      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       data,
      //       filename: this.dataType
      //     })
      //     this.loading = false
      //     this.downloadLoading = false
      //   }).catch(() => {
      //     this.loading = false
      //   })
      // })
      console.log(this.sels)
    },
    downloadXML() {
      this.downloadLoading = true
      // const json = JSON.stringify(this.sels[0].file)
      // console.log(json)
      // this.loading = false
      // this.downloadLoading = false
      console.log(this.sels)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select{
  width: 100%;
}
.fieldset{
    margin-bottom:10px;
    border: 1px solid #dcdfe6;
    legend{
      font-weight: bold;
    }
  }
</style>
