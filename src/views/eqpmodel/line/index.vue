<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <shop-line-filter @changeEvent="changeHandler" >
          <el-col :md="8" :lg="12">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search">{{ t('btn.search') }}</el-button>
              <el-button v-authorize="'import'" type="primary" class="el-button+el-button" @click="importHandler">
              <svg-icon icon-class="import" /><span style="margin-left:8px">{{ t('btn.import') }}</span></el-button>
              <el-dropdown @command="exportData">
                <el-button v-authorize="'export'" type="primary">
                  <svg-icon icon-class="excel" /><span style="margin-left:7px">{{ t('btn.export') }}</span><i
                    class="el-icon-arrow-down el-icon--right" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="Template">{{ t('btn.exportTemplate') }}</el-dropdown-item>
                  <el-dropdown-item command="DataList">{{ t('btn.exportData') }}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-form-item>
          </el-col>
        </shop-line-filter>
      </el-row>
    </div>
    <el-table v-loading.body="loading" :data="pageInfo.dataList" stripe border>
      <el-table-column :index="indexHandler" type="index" fixed>#</el-table-column>
      <el-table-column min-width="120px" label="LineId" prop="lineId" fixed />
      <el-table-column min-width="120px" label="LineName" prop="lineName" />
      <el-table-column min-width="120px" label="shopName" prop="shopName" />
      <el-table-column min-width="120px" label="LineType" prop="lineType" />
      <el-table-column min-width="120px" label="ServerName" prop="serverName" />
      <el-table-column min-width="120px" label="ServerIp" prop="ip" />
      <el-table-column min-width="120px" label="Port1" prop="port" />
      <el-table-column min-width="120px" label="Port2" prop="port2" />
      <el-table-column min-width="240px" label="Description" prop="info" />
      <el-table-column min-width="120px" label="CreateUser" prop="createUser" />
      <el-table-column min-width="160px" label="CreateTime" prop="createTime">
        <template slot-scope="curr">
          {{ curr.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="UpdateUser" prop="updateUser" />
      <el-table-column min-width="160px" label="UpdateTime" prop="updateTime">
        <template slot-scope="curr">
          {{ curr.row.updateTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="160" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" type="primary" icon="el-icon-edit" @click="editHandler(curr.row)"/>
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="removeHandler(curr.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-pagination :total="pageInfo.total" :page-size="pageInfo.pageSize" :page-sizes="pageInfo.pageSizeList" :current-page="pageInfo.pageNo" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :visible="showDetail" :before-close="() => {showDetail = false}" :close-on-click-modal="false" :close-on-press-escape="false" width="800px" top="10vh" title="LineDetail">
      <line-detail v-if="showDetail" :detail-data="rowData" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
    <el-dialog v-el-drag-dialog :visible="showImport" :show-close="true" :fullscreen="false" :close-on-click-modal="false" :close-on-press-escape="false" :before-close="()=>{showImport = false}" title="UploadFile">
      <div class="file-upload-component">
        <file-upload ref="upload" v-bind="uploadConfig" v-model="files" class="el-button el-button--primary el-button--medium" @input-filter="inputFilter" @input-file="inputFile">
          <svg-icon :icon-class="'add'" />
          {{ t('btn.selectFiles') }}
        </file-upload>
        <span class="upload-tip">
          (只能上传xlsx,xls,csv文件)
        </span>
      </div>
      <template v-for="(item,index) in files">
        <p :key="`p-${index}`"> {{ item.name }} </p>
        <el-progress :key="`el-progress-${index}`" :percentage="Math.floor(item.progress)">
          {{ `${Math.floor(item.progress)}%` }}
        </el-progress>
      </template>
    </el-dialog>
  </div>

</template>
<script>
import { getLineList, saveLineInfo, deleteLineInfo, importList, exportList } from '@/api/eqpmodel/line'
import UploadExcelComponent from '@/components/UploadExcel/index.vue'
import ShopLineFilter from '@/components/ShopLineFilter'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import { t, convertDataToJson } from '@/utils'
import { download } from '@/utils/file-utils'
import FileUpload from 'vue-upload-component'
import { lineTable } from '@/config/table'
import LineDetail from './detail'
import notice from '@/utils/notice'

export default {
  name: 'LineList',
  components: {
    UploadExcelComponent,
    ShopLineFilter,
    LineDetail,
    FileUpload
  },
  directives: {
    elDragDialog
  },
  data() {
    return {
      loading: true,
      filter: {},
      showImport: false,
      showDetail: false,
      showInfo: false,
      exportDataList: [],
      importDataList: [],
      lineTable: lineTable,
      tableHeader: [],
      fileName: '',
      rowData: {},
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        pageNo: 1,
        dataList: []
      },
      files: [],
      uploadConfig: {
        postAction: `http://${window.config.serverIp}:${window.config.serverPort}/TestFileServiceImpl/test`,
        data: {
          targetPath: 'template/EQPModeling/import',
          factory: '',
          shop: '',
          lineId: ''
        },
        accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/comma-separated-values',
        extensions: /\.(xlsx?|csv)$/i,
        multiple: false,
        directory: false,
        timeout: 600 * 1000
      }
    }
  },
  computed: {
    uploaded() {
      let file
      for (let i = 0; i < this.files.length; i++) {
        file = this.files[i]
        if (file.fileObject && !file.error && !file.success) {
          return false
        }
      }
      return true
    }
  },
  watch: {
    uploaded() {
      if (this.uploaded) {
        this.importList()
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.tableHeader = this.$lodash.map(this.lineTable.columnList, 'label')
      this.getLineList()
    })
  },
  methods: {
    t,
    convertDataToJson,
    changeHandler($event) {
      this.filter = Object.assign({}, this.filter, $event)
    },
    search() {
      this.pageInfo.pageNo = 1
      this.getLineList()
    },
    getLineList() {
      this.loading = true
      return getLineList({
        condition: {
          lineType: '',
          shopName: this.filter.shop,
          lineId: this.filter.lineId
        },
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.total = res.body.total
        this.pageInfo.dataList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addHandler() {
      this.showDetail = true
      this.rowData = {}
    },
    editHandler(row) {
      this.showDetail = true
      this.rowData = row
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        deleteLineInfo(row).then(res => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.pageNo = 1
            this.getLineList()
          })
        })
      })
    },
    exportData(fileType) {
      this.loading = true
      return exportList({
        fileType: fileType,
        shopName: this.filter.shop,
        lineId: this.filter.lineId
      }).then(res => {
        download(res.body.filePath)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    importHandler() {
      this.showImport = true
    },
    showInfoHandler(row) {
      this.showInfo = true
      this.rowData = row
    },
    successHandler(line, isEdit) {
      saveLineInfo(line).then(res => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.showDetail = false
          this.pageNo = 1
          this.getLineList()
        })
      })
    },
    cancelHandler(dialogName) {
      switch (dialogName) {
        case 'lineDetail':
          this.showDetail = false
          break
        case 'lineInfo':
          this.showInfo = false
          break
      }
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getLineList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getLineList()
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Before adding a file
        // 添加文件前

        // Filter system files or hide files
        // 过滤系统文件 和隐藏文件
        if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
          return prevent()
        }

        // Filter php html js file
        // 过滤 php html js 文件
        if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
          return prevent()
        }
      }
    },
    inputFile(newFile, oldFile) {
      if (newFile && !oldFile) {
        // 校验文件是否已存在相同的文件
        const objFiles = {}
        for (const [index, file] of Object.entries(this.files)) {
          if (!objFiles.hasOwnProperty(file.name)) {
            Object.assign(objFiles, {
              [file.name]: index
            })
          } else {
            this.$message.error(`文件${newFile.name}已存在!`)
            this.files.splice(index, 1)
            break
          }
        }

        this.files = this.files.map(item => {
          return item.shop ? item : Object.assign({}, item, {
            shop: '',
            lineId: '',
            lineList: []
          })
        })
        console.log(this.files)
        this.$refs.upload.active = true
        // console.log('add', newFile)
      }
      if (newFile && oldFile) {
        // update
        console.log('update', newFile)
      }

      if (!newFile && oldFile) {
        // remove
        console.log('remove', oldFile)
      }
    },

    importList() {
      this.loading = true
      const fileName = (this.$lodash.head(this.files) || {}).name
      return importList({ fileName: fileName }
      ).then(res => {
        this.loading = false
        notice.success(res.result.message, () => {
          this.files.splice(0, this.files.length)
          this.showImport = false
        })
      }).catch(() => {
        this.files.splice(0, this.files.length)
        this.loading = false
      })
    }
  }
}

</script>
<style lang="scss" scoped>
  .el-select,
  .el-input-number,
  .el-date-editor {
    width: 100%;
  }

  .file-upload-component {
    .upload-tip {
      display: inline-block;
      vertical-align: top;
      height: 36px;
      line-height: 36px;
    }
  }
.el-button+.el-button{
  margin: 0px;
}
</style>
