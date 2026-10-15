<template>
  <div class="app-container">
    <div class="filter-container">
      <shop-line-filter :disabled="shopLine" @changeEvent="changeHandler" >
        <el-col :lg="6" :md="8" :sm="24" style="text-align:right;white-space:nowrap;">
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'upload'" type="primary" icon="el-icon-upload" @click="showUploadFile=true;tableName='Address'"> {{ t('btn.upload') }} </el-button>
          <el-button v-authorize="'uploadXmlAll'" type="primary" icon="el-icon-upload" @click="downLoadXmlByShop"> {{ t('btn.uploadAllXml') }} </el-button>
        </el-col>
      </shop-line-filter>
    </div>
    <el-table
      v-loading="loading"
      :data="pageInfo.dataList"
      highlight-current-row
      stripe
      border
      @selection-change="selsChange">
      <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
      <el-table-column label="File" min-width="190" prop="fileName">
        <template slot-scope="curr">
          <el-tooltip :content="curr.row.fileName" placement="top-start">
            <span>{{ curr.row.fileName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Version" min-width="100" prop="fileVersion" align="center" />
      <el-table-column label="Shop" min-width="100" prop="shopName" align="center" />
      <el-table-column label="LineId" min-width="100" prop="lineId" align="center" />
      <el-table-column label="Update User" min-width="100" prop="updateUser" align="center" />
      <el-table-column label="UpdateTime" min-width="110" prop="updateTime" />
      <el-table-column label="Description" min-width="100" prop="fileDesc" />
      <el-table-column :label="t('column.operate')" width="230" align="center" fixed="right">
        <template slot-scope="curr">
          <el-tooltip :open-delay="500" :content="t('btn.upgrade')" placement="top">
            <el-button v-authorize="'update'" v-if="!curr.row.isDownFile" type="primary" @click="updateHandler(curr.row)">
              <svg-icon :icon-class="'upgrade'"/>
            </el-button>
          </el-tooltip>
          <el-tooltip :open-delay="500" :content="t('btn.download')" placement="top">
            <el-dropdown split-button type="primary" @command="handleCommand($event,curr.row)">
              <svg-icon :icon-class="'download'" />
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="downLoadExcel"><svg-icon :icon-class="'excel'" />{{ "Excel" }}</el-dropdown-item>
                <el-dropdown-item command="downLoadXml"><svg-icon :icon-class="'xml'" />&nbsp;{{ "Xml" }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
          <el-button v-authorize="'remove'" :loading="loading" type="danger" icon="el-icon-delete" @click="removeHandler(curr.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-pagination
        :total="pageInfo.total"
        :page-size="pageInfo.pageSize"
        :page-sizes="pageInfo.pageSizeList"
        :current-page="pageInfo.currPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      :visible.sync="showUploadFile"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="800px"
      top="8vh"
      title="Upload Form">
      <upload
        v-if="showUploadFile"
        :before-upload="beforeUpload"
        @successEvent="handleSuccess"
        @cancelEvent="cancelHandler" />
    </el-dialog>
    <el-dialog
      :visible.sync="showAddressEdit"
      :fullscreen="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="Upgrade Form">
      <component :is="currDialog" :detail-data="rowData" @successEvent="successHandle" />
    </el-dialog>
  </div>
</template>

<script>
import { getFileList, downLoadXml, exportExcel, updateFile, saveDateToFile, deleteFile, downLoadXmlByShop } from '@/api/plcMapToXml/plc'
import Import from '@/components/UploadExcel/plcImport.vue'
import ShopLineFilter from '@/components/ShopLineFilter'
import { t, convertDataToJson } from '@/utils'
import { download } from '@/utils/file-utils'
import components from '@/views/plcConfig'
import PlcMapDetail from './plcEdit'
import upload from './upload'
import notice from '@/utils/notice'

export default {
  name: 'PlcMapFile',
  components: {
    ...components,
    Import,
    PlcMapDetail,
    upload,
    convertDataToJson,
    ShopLineFilter
  },
  data() {
    return {
      loading: false,
      shopLine: false,
      currIndex: -1,
      importType: '',
      showUploadFile: false,
      showAddressEdit: false,
      rowData: {},
      currDialog: 'addressEdit',
      sels: [], // 选中的值显示
      shop: '',
      lineId: '',
      filter: {},
      showFileList: [],
      functionList: [],
      addressList: [],
      blockList: [],
      wordList: [],
      bitList: [],
      eqpInterfaceList: [],
      constantsList: [],
      linkSignalList: [],
      cassetteMapList: [],
      addressMaps: [],
      data: {},
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        currPage: 1,
        dataList: []
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
    downLoadXmlByShop() {
      this.loading = true
      return downLoadXmlByShop({
        shopName: this.filter.shop,
        lineId: this.filter.lineId
      }).then(res => {
        res.body.forEach(item => {
          download(item)
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleCommand(command, $event) {
      if (command === 'downLoadExcel') {
        this.downLoadExcel($event)
      }
      if (command === 'downLoadXml') {
        this.downLoadXml($event)
      }
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        this.loading = true
        delete row.isDownFile
        return deleteFile(row).then(res => {
          this.loading = false
          notice.success(this.t('tip.removeSuccess'), () => {
            this.getFileList()
          })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
      this.shop = this.filter.shop
      this.lineId = this.filter.lineId
      this.getFileList()
    },
    getFileList() {
      this.loading = true
      return getFileList({
        condition: {
          shopName: this.shop,
          lineId: this.lineId
        },
        pageNo: this.pageInfo.currPage,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.dataList = res.body.rows
        this.pageInfo.dataList.forEach(item => {
          this.$set(item, 'isDownFile', false)
        })
        this.pageInfo.total = res.body.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    updateHandler(row) {
      this.loading = true
      return saveDateToFile({
        version: row.fileVersion,
        lineId: row.lineId,
        shopName: row.shopName
      }).then(res => {
        this.currDialog = 'addressEdit'
        this.showAddressEdit = true
        this.rowData.isShowBtn = true
        this.rowData.row = row
        this.rowData.shopLine = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    successHandle(type, dataList) {
      switch (type) {
        case 'addressEdit':
          this.currDialog = type
          break
        case 'function':
          this.currDialog = type
          this.addressList = dataList
          break
        case 'block':
          this.currDialog = type
          this.functionList = dataList
          break
        case 'fileEdit':
          this.currDialog = type
          this.bitList = dataList
          break
        case 'wordEdit':
          this.currDialog = type
          this.blockList = dataList
          break
        case 'bitEdit':
          this.currDialog = type
          this.wordList = dataList
          break
        case 'constants':
          this.currDialog = type
          this.linkSignalList = dataList
          break
        case 'eqpInterface':
          this.currDialog = type
          this.bitList = dataList
          break
        case 'cassetteMap':
          this.currDialog = type
          this.eqpInterfaceList = dataList
          break
        case 'linkSignal':
          this.currDialog = type
          this.cassetteMapList = dataList
          break
        case 'editAddress':
          this.currDialog = type
          this.constantsList = dataList
          break
        case 'end':
          this.addressMaps = dataList
          this.showAddressEdit = false
          this.updateFile()
          break
        default:
          this.showAddressEdit = false
          break
      }
    },
    updateFile() {
      this.loading = true
      return updateFile({
        shopName: this.rowData.row.shopName,
        lineId: this.rowData.row.lineId,
        version: this.rowData.row.fileVersion
      }).then(res => {
        this.getFileList()
        notice.success(this.t('tip.saveSuccess'))
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    downLoadHandler(file) {
      file.isDownFile = true
    },
    downLoadXml(file) {
      file = Object.assign(file, { targetPath: 'plcConfig' })
      this.loading = true
      delete file.isDownFile
      delete file.file
      return downLoadXml(file).then(res => {
        download(res.body)
        this.loading = false
        this.getFileList()
      }).catch(() => {
        this.loading = false
      })
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess(files) {
      notice.success(this.t('tip.saveSuccess'), () => {
        this.getFileList()
        this.showUploadFile = false
      })
    },
    getFormatDate() {
      const date = new Date()
      let month = date.getMonth() + 1
      let strDate = date.getDate()
      if (month >= 1 && month <= 9) {
        month = '0' + month
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
      }
      var currentDate = date.getFullYear() + '-' + month + '-' + strDate +
          ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      return currentDate
    },
    downLoadExcel(file) {
      this.loading = true
      delete file.isDownFile
      delete file.file
      return exportExcel(file).then(res => {
        download(res.body.filePath)
        this.loading = false
        this.getFileList()
      }).catch(() => {
        this.loading = false
      })
      // this.$router.push({ name: 'PlcEdit', params: row })
      // row.updatedTime = this.getFormatDate()
    },
    cancelHandler() {
      this.showUploadFile = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getFileList()
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getFileList()
    },
    searchHandler() {
      this.getFileList()
    },
    doFilter() {
      const filtersShop = this.shop.trim()
      const filtersLineId = this.lineId.trim()
      const filtersShowFileList = this.pageInfo.dataList.filter(item => {
        var isFiltersShop = true
        var isFiltersLineId = true
        if (filtersShop.length !== 0) {
          isFiltersShop = filtersShop === item.shop
        }
        if (filtersLineId.length !== 0) {
          isFiltersLineId = filtersLineId === item.lineId
        }
        return isFiltersShop && isFiltersLineId
      })
      this.showFileList = this.$lodash.slice(filtersShowFileList)
      this.pageInfo.total = this.showFileList.length
    },
    selsChange(sels) {
      this.sels = sels
    },
    indexHandler(index) {
      return (this.pageInfo.currPage - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}

</script>
<style scoped>
  .fieldset {
    min-width: 100px;
    height: 100%;
    border: 1px solid #409EFF;
    border-radius: 3px;
    background-color: #409EFF;
    color: #FFF;
    font-size: 12px;
    padding: 6px 15px;
    margin: 8px;
  }

</style>
