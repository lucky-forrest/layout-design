<template>
  <div class="upload-container">
    <div class="file-upload-component">
      <file-upload
        ref="upload"
        v-bind="uploadConfig"
        v-model="files"
        class="el-button el-button--primary el-button--medium"
        @input-filter="inputFilter"
        @input-file="inputFile">
        <svg-icon :icon-class="'add'"/>
        {{ t('btn.selectFiles') }}
      </file-upload>
      <span class="upload-tip">
        (只能上传xlsx,xls,csv文件)
      </span>
    </div>
    <el-table
      :data="files"
      :default-sort="{prop:'createtime',order:'descending'}"
      stripe
      border
      style="margin-top:10px;">
      <el-table-column type="index" align="center" fixed>#</el-table-column>
      <el-table-column label="FileName" min-width="100">
        <template slot-scope="curr">
          <el-tooltip :content="curr.row.name" placement="top-start">
            <span>{{ curr.row.name }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Shop" min-width="100" prop="shop">
        <template slot-scope="curr">
          <el-select
            v-model="curr.row.shop"
            :placeholder="t('tip.pleaseSelectShop')"
            clearable
            class="filter-item"
            @change="getLineListHandler(curr.row)">
            <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="LineId" min-width="100" prop="lineId">
        <template slot-scope="curr">
          <el-select
            v-model="curr.row.lineId"
            :placeholder="t('tip.pleaseSelectLineId')"
            clearable
            filterable
            class="filter-item"
            @change="lineChangeHandler(curr.row)">
            <el-option
              v-for="(item,index) in curr.row.lineList"
              :key="index"
              :label="item.lineId"
              :value="item.lineId" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="UpLoad Status" width="160" align="center">
        <template slot-scope="curr">
          <el-progress :percentage="Math.floor(curr.row.progress)">{{ `${Math.floor(curr.row.progress)}%` }}
          </el-progress>
          <span v-if="spanFlag">waitting for server...</span>
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="120" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button
            v-authorize="'remove'"
            :loading="loading"
            type="danger"
            icon="el-icon-delete"
            @click="deleteHandler(curr.$index)">
            {{ t('btn.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click.prevent="uploadHandler">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="cancelHandler">
        <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { uploadFile } from '@/api/plcMapToXml/plc'
import { getLineList } from '@/api/eqpmodel/line'
import FileUpload from 'vue-upload-component'
import notice from '@/utils/notice'
import { shopList } from '@/config'
import { t } from '@/utils'

export default {
  components: {
    FileUpload
  },
  data() {
    return {
      loading: false,
      spanFlag: false,
      shopList: shopList,
      lineList: [],
      files: [],
      uploadConfig: {
        postAction: `http://${window.config.serverIp}:${window.config.serverPort}/UpLoadFileServiceImpl/upload`,
        data: { moduleName: 'plcConfig', factoryName: '', shopName: '', lineId: '' },
        accept: 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/comma-separated-values',
        extensions: /\.(xlsx?|csv)$/i,
        multiple: true,
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
        this.uploadFile()
      }
    },
    files() {
      if (this.files.every(this.checkAdult)) {
        this.spanFlag = true
      }
    }
  },
  created() {
    this.getLineList()
  },
  methods: {
    t,
    checkAdult(item) {
      return item.progress === '100.00'
    },
    getLineList() {
      this.loading = true
      return getLineList({
        condition: {
          shopName: this.shop
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.lineList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getLineListHandler(row) {
      row.lineId = ''
      row.equipmentNo = ''
      row.lineList = this.lineList.filter(({ shopName }) => {
        return row.shop === shopName
      })
      row.data = Object.assign({}, row.data, {
        factoryName: this.$store.state.user.userInfo.factory,
        shopName: row.shop,
        lineId: row.lineId
      })
    },
    lineChangeHandler(row) {
      row.data = Object.assign({}, row.data, {
        factory: this.$store.state.user.userInfo.factory,
        shop: row.shop,
        lineId: row.lineId
      })
    },
    cancelHandler() {
      this.$emit('cancelEvent')
    },
    deleteHandler(index) {
      this.files.splice(index, 1)
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
            Object.assign(objFiles, { [file.name]: index })
          } else {
            this.$message.error(`文件${newFile.name}已存在!`)
            this.files.splice(index, 1)
            break
          }
        }

        this.files = this.files.map(item => {
          return item.shop ? item : Object.assign({}, item, { shop: '', lineId: '', lineList: [] })
        })
        console.log(this.files)
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
    uploadHandler() {
      let errMsg = ''
      if (this.files.length === 0) {
        errMsg = 'Please select file !'
      } else {
        for (const [key, file] of Object.entries(this.files)) {
          console.log(file)
          const rowIndex = +key + 1
          if (!file.shop) {
            errMsg = `Row ${rowIndex} shop is null !`
            break
          }
          if (!file.lineId) {
            errMsg = `Row ${rowIndex} lineId is null !`
            break
          }
        }
      }
      if (errMsg) {
        notice.error(errMsg)
      } else {
        this.loading = true
        this.$refs.upload.active = true
      }
    },
    uploadFile() {
      const tempList = []
      this.files.forEach(element => {
        tempList.push({
          shopName: element.shop,
          lineId: element.lineId,
          fileName: element.name
        })
      })
      this.loading = true
      return uploadFile({ list: tempList }).then(res => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.files.splice(0, this.files.length)
          this.$emit('successEvent')
          this.loading = false
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
  .file-upload-component {
    .upload-tip {
      display: inline-block;
      vertical-align: top;
      height: 36px;
      line-height: 36px;
    }
  }

</style>
