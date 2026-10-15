<template>
  <div class="app-container">
    <el-form name="addressForm" label-width="120px" >
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :sm="5">
            <el-select v-model="importType" :placeholder="t('tip.pleaseSelectImportType')" class="filter-item">
              <el-option :label="'xml'" :value="'xml'"><svg-icon :icon-class="'xml'"/>&nbsp;&nbsp;{{ 'xml' }}</el-option>
              <el-option :label="'excel'" :value="'excel'"><svg-icon :icon-class="'excel'"/>&nbsp;&nbsp;{{ 'excel' }}</el-option>
            </el-select>
          </el-col>
          <el-col :sm="4">
            <el-button v-authorize="'upload'" type="primary" icon="el-icon-upload" @click="showUploadFile=true;tableName='Address'">
              {{ t('btn.import') }}
            </el-button>
          </el-col>
          <el-col :sm="14"/>
        </el-row>
      </div>
      <transition name="el-zoom-in-center">
        <el-card style="margin:10px auto;" body-style="padding:10px 0;">
          <el-table
            :data="pageInfo.dataList"
            highlight-current-row
            stripe
            border
            @selection-change="selsChange">
            <el-table-column type="selection" width="30" reserve-selection=""/>
            <el-table-column label="File" min-width="100" prop="file"/>
            <el-table-column label="Version" min-width="100" prop="version"/>
            <el-table-column label="Fab" min-width="100" prop="fab"/>
            <el-table-column label="Shop" min-width="100" prop="shop"/>
            <el-table-column label="LineType" min-width="100" prop="lineType"/>
            <el-table-column label="EqpType" min-width="100" prop="eqpType"/>
            <el-table-column label="Remark" min-width="100" prop="remark"/>
            <el-table-column label="LocalNo" min-width="100" prop="localNo"/>
            <el-table-column :label="t('column.operate')" width="240" align="center" fixed="right">
              <template slot-scope="curr">
                <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" @click="editList(curr.row)">
                  {{ t('btn.edit') }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </transition>
    </el-form>
    <el-dialog
      :visible.sync="showUploadFile"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
      top="8vh"
      title="Upload Form">
      <upload v-if="showUploadFile" :on-success="handleSuccess" :before-upload="beforeUpload" @cancelEvent="cancelHandler"/>
    </el-dialog>
  </div>
</template>

<script>
import { getFileList, importPlcMapList } from '@/api/plcMapToXml/plc'
import { t, convertDataToJson } from '@/utils'
import Import from '@/components/UploadExcel/plcImport.vue'
import PlcMapDetail from './plcEdit'
import notice from '@/utils/notice'
import upload from './upload'
export default {
  name: 'PlcImport',
  components: {
    Import,
    PlcMapDetail,
    upload,
    convertDataToJson
  },
  data() {
    return {
      loading: true,
      currIndex: -1,
      importType: '',
      showUploadFile: false,
      sels: [], // 选中的值显示
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
    getFileList() {
      return new Promise((resolve, reject) => {
        try {
          this.loading = true
          return getFileList({
            currPage: this.pageInfo.currPage,
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
      this.loading = true
      return importPlcMapList(files).then(res => {
        notice.success(name + this.t('tip.importSuccess'), () => {
          this.loading = false
          this.showUploadFile = false
          this.getDataList(files)
        })
      }).catch(() => {
        this.loading = false
        this.showUploadFile = false
      })
    },
    indexHandler(index) {
      return index + 1
    },
    getDataList(files) {
      const fileList = []
      for (let i = 0; i < files.length; i++) {
        const file = []
        const version = files[i].fileName.substring((files[i].fileName.lastIndexOf('.') - 4), files[i].fileName.lastIndexOf('.'))
        this.$set(file, 'file', files[i].fileName)
        this.$set(file, 'fab', 'T6')
        this.$set(file, 'shop', files[i].shop)
        this.$set(file, 'localNo', files[i].localNo)
        this.$set(file, 'remark', 'XXXXX')
        this.$set(file, 'lineType', files[i].lineType)
        this.$set(file, 'eqpType', files[i].eqpType)
        this.$set(file, 'version', 'v' + version)
        this.$set(file, 'list', files[i].file)
        this.$set(file, 'isEdit', false)
        fileList.push(file)
      }
      this.pageInfo.dataList = this.$lodash.slice(fileList)
      this.loading = false
    },
    editList(row) {
      this.$router.push({ name: 'PlcEdit', params: row })
    },
    cancelHandler() {
      this.showUploadFile = false
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
    },
    selsChange(sels) {
      this.sels = sels
    }
  }
}
</script>
