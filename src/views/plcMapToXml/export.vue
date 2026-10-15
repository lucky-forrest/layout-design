<template>
  <div class="app-container">
    <el-form name="addressForm" label-width="120px" >
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :sm="3">
            <el-button v-authorize="'upload'" type="primary" icon="el-icon-upload" @click="showUploadFile=true;tableName='Address'">
              {{ t('btn.import') }}
            </el-button>
          </el-col>
          <el-col :sm="5">
            <el-select v-model="importType" :placeholder="t('tip.pleaseSelectImportType')" class="filter-item">
              <el-option :label="'xml'" :value="'xml'"><svg-icon :icon-class="'xml'"/>&nbsp;&nbsp;{{ 'xml' }}</el-option>
              <el-option :label="'excel'" :value="'excel'"><svg-icon :icon-class="'excel'"/>&nbsp;&nbsp;{{ 'excel' }}</el-option>
            </el-select>
          </el-col>
          <el-col :sm="5">
            <el-select v-model="dataType" :placeholder="t('tip.pleaseSelectSheetName')" class="filter-item">
              <el-option v-for="(item,index) in tableData" :key="index" :label="item.tableName" :value="item.tableName"/>
            </el-select>
          </el-col>
          <el-col :sm="11"/>
        </el-row>
      </div>
      <transition name="el-zoom-in-center">
        <el-card style="margin:10px auto;" body-style="padding:10px 0;">
          <div slot="header">
            {{ dataType }}
          </div>
          <el-table
            v-mousewheelX="'el-table__body-wrapper'"
            :data="pageInfo.dataList"
            highlight-current-row
            stripe
            border>
            <el-table-column :prop="firstHeader" :label="firstHeader" min-width="150" fixed="left">
              <template slot-scope="curr">
                <el-button v-show="currIndex!==curr.$index" v-if="!curr.row.isEdit && dataType === 'Address'" type="text" @click="edit(curr.row)">
                  {{ curr.row[firstHeader] }}
                </el-button>
                <span v-show="currIndex!==curr.$index" v-if="dataType !== 'Address' && curr.row === tableList[0]">
                  {{ curr.row[firstHeader] }}
                </span>
                <el-button v-show="currIndex!==curr.$index" v-if="!curr.row.isEdit && dataType !== 'Address' && curr.row !== tableList[0]" type="text" @click="edit(curr.row)">
                  {{ curr.row[firstHeader] }}
                </el-button>
                <el-button v-show="currIndex!==curr.$index" v-if="curr.row.isEdit" type="text" @click="editHandler(curr.row)">
                  {{ t('btn.save') }}
                </el-button>
                <el-button v-show="currIndex!==curr.$index" v-if="curr.row.isEdit" type="text" @click="deleteHandler(curr)">
                  {{ t('btn.remove') }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column v-for="item of header" :prop="item" :label="item" :key="item" min-width="150">
              <template slot-scope="curr">
                <el-input v-show="currIndex!==curr.$index" v-if="curr.row.isEdit" v-model="curr.row[item]" clearable/>
                <span v-else-if="!curr.row.isEdit" v-show="currIndex!==curr.$index">
                  {{ curr.row[item] }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </transition>
    </el-form>
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
    <el-dialog
      :title="t('dialog.uploadFile')"
      :visible.sync="showUploadFile"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :fullscreen="false"
      top="20vh"
      width="660px"
    >
      <address-import v-loading="loading" :on-success="handleSuccess" :before-upload="beforeUpload"/>
    </el-dialog>
  </div>
</template>

<script>
import { getAddressList, importAddressList, updateAddress, deleteAddressByFunction } from '@/api/plcConfig/address'
import { t, convertDataToJson } from '@/utils'
import { excelDataList } from '@/config'
import AddressImport from '@/components/UploadExcel/addressImport.vue'
import notice from '@/utils/notice'
export default {
  name: 'Export',
  components: {
    AddressImport
  },
  data() {
    return {
      loading: true,
      currIndex: -1,
      tableData: [],
      tableHeader: {},
      importDataList: [],
      firstHeader: '',
      header: [],
      showUploadFile: false,
      downloadLoading: false,
      excelDataList: excelDataList,
      tableList: [],
      data: [],
      dataType: '',
      importType: '',
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
    dataType() {
      this.tableHeader = this.tableData.filter(curr => { return curr.tableName === this.dataType })
      this.getDataList(this.tableHeader[0].tableName)
      this.importType = ''
    },
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
      this.getAddressList()
    })
  },
  methods: {
    t,
    getAddressList() {
      return new Promise((resolve, reject) => {
        try {
          this.loading = true
          return getAddressList({
            pageNum: this.pageInfo.currPage,
            pageSize: this.pageInfo.pageSize
          }).then(res => {
            this.pageInfo.dataList = res.body.row
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
    beforeUpload(file) {
      this.tableData = []
      this.tableHeader = {}
      this.importDataList = []
      return true
    },
    edit(row) {
      if (Object.hasOwnProperty('isEdit')) {
        row.isEdit = true
      } else {
        this.$set(row, 'isEdit', true)
      }
    },
    handleSuccess(name, header, results) {
      this.loading = true
      const table = []
      const tableList = []
      table.tableName = name
      table.tableHeader = header
      this.$set(tableList, 'tableList', results.map(row => {
        const item = {}
        header.forEach(x => {
          Object.assign({}, item, {
            [x]: row[x] || row[x]
          })
        })
        return item
      }))
      this.tableData.push(table)
      this.$set(tableList, 'tableName', name)
      this.importDataList.push(tableList)
      return importAddressList(this.importDataList).then(res => {
        notice.success(name + this.t('tip.importSuccess'), () => {
          this.loading = false
          this.dataType = 'Address'
          this.importType = ''
          this.showUploadFile = false
          if (name === 'Address') {
            this.getDataList(name)
          }
        })
      }).catch(() => {
        this.loading = false
        this.dataType = ''
        this.importType = ''
      })
    },
    indexHandler(index) {
      return index + 1
    },
    getDataList(name) {
      this.tableList = this.importDataList.filter(curr => { return curr.tableName === name })[0].tableList
      this.tableHeader = this.tableData.filter(curr => { return curr.tableName === name })[0].tableHeader
      this.firstHeader = this.tableHeader[0]
      this.header = this.tableHeader.filter(curr => { return curr !== this.firstHeader })
      this.pageInfo.total = this.tableList.length
      this.pageInfo.dataList = this.$lodash.slice(this.tableList, (this.pageInfo.currPage - 1) * this.pageInfo.pageSize, this.pageInfo.currPage * this.pageInfo.pageSize)
      this.loading = false
    },
    editHandler(row) {
      return updateAddress(row).then(res => {
        row.isEdit = false
        notice.success(this.t('tip.saveSuccess'), () => {
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    deleteHandler(curr) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        return deleteAddressByFunction(curr.row).then(res => {
          curr.row.isEdit = false
          this.pageInfo.dataList.splice(curr.$index, 1)
          notice.success(this.t('tip.removeSuccess'), () => {
            this.loading = false
          })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    downloadExcel() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.tableHeader
        const tableList = this.importDataList.filter(curr => { return curr.tableName === this.dataType })[0].tableList
        require.ensure([], () => {
          const data = convertDataToJson(tHeader, tableList)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.dataType
          })
          this.loading = false
          this.downloadLoading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    downloadXML() {
      this.downloadLoading = true
      const json = JSON.stringify(this.importDataList)
      console.log(json)
      this.loading = false
      this.downloadLoading = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getDataList(this.dataType)
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getDataList(this.dataType)
    }
  }
}
</script>
