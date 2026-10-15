<template>
  <div class="app-container">
    <el-upload
      ref="upload"
      :file-list="fileList"
      v-bind="uploadConfig"
      :on-success="uploadSuccessHandler"
      :on-change="uploadChangeHandler"
    >
      <el-button slot="trigger" :loading="loading" type="primary">{{ t('selectFiles') }}</el-button>
      <span slot="tip">只能上传xlsx,xls,csv文件</span>
    </el-upload>
    <el-table :data="fileList" :default-sort="{prop:'createtime',order:'descending'}" stripe border style="margin-top:10px;">
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
            class="filter-item">
            <el-option
              v-for="(item,index) in curr.row.lineList"
              :key="index"
              :label="item.lineId"
              :value="item.lineId" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="LocalNo" min-width="100" prop="eqpNo">
        <template slot-scope="curr">
          <el-input v-model="curr.row.eqpNo" clearable />
        </template>
      </el-table-column>
      <el-table-column label="E-Mail Notification" min-width="100" prop="email">
        <template slot-scope="curr">
          <el-input v-model="curr.row.email" clearable />
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120" align="center" >
        <template slot-scope="curr">
          <el-progress :percentage="Math.floor(curr.row.percentage)">{{ `${Math.floor(curr.row.percentage)}%` }}</el-progress>
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
    <div style="margin-top:10px;text-align:center;">
      <el-button :loading="loading" type="primary" @click.prevent="submitUpload">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="cancelHandler">
        <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.cancel') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { uploadFile } from '@/api/eqprofile/eqprofile'
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
      shopList: shopList,
      lineList: [],
      fileList: [],
      uploadConfig: {
        action: `http://${window.config.serverIp}:${window.config.serverPort}/TestFileServiceImpl/test`,
        multiple: true,
        data: { targetPath: 'eqpprofile' },
        name: 'file',
        showFileList: false,
        accept: 'xlsx,xls,csv',
        autoUpload: false
      }
    }
  },
  created() {
    this.getLineList()
  },
  methods: {
    t,
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
      row.lineList = this.lineList.filter(({ shopName }) => { return row.shop === shopName })
    },
    cancelHandler() {
      this.$emit('cancelEvent')
    },
    deleteHandler(index) {
      this.fileList.splice(index, 1)
    },
    submitUpload() {
      let errMsg = ''
      if (this.fileList.length === 0) {
        errMsg = 'Please select file !'
      } else {
        for (const [key, file] of Object.entries(this.fileList)) {
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
        this.$refs.upload.submit()
      }
    },
    uploadChangeHandler(file, fileList) {
      const tempName = file.name
      const extension = tempName.substr(tempName.lastIndexOf('.') + 1)

      // 校验文件扩展名是否正确
      if (!this.uploadConfig.accept.split(',').includes(extension)) {
        this.$message.error('上传文件格式不正确!')
        const errIndex = fileList.findIndex(({ raw }) => raw.lastModified === file.raw.lastModified)
        fileList.splice(errIndex, 1)
      }

      // 校验文件是否已存在相同的文件
      if (fileList.slice(0, fileList.length - 1).filter(({ status }) => status !== 'success').find(({ name, raw }) => raw.lastModified === file.raw.lastModified && name === file.name)) {
        this.$message.error(`文件${file.name}已存在!`)
        fileList.pop()
      }
      this.fileList = fileList.map(item => {
        if (item.percentage > 97) {
          item = Object.assign({}, item, { percentage: 98 })
        }
        return item.shop ? item : Object.assign({}, item, { shop: '', lineId: '', lineList: [] })
      })
    },
    uploadSuccessHandler(response, file, fileList) {
      return new Promise((resolve, reject) => {
        if (fileList.every(({ status }) => status === 'success')) {
          resolve(fileList)
        }
      }).then(res => {
        const list = []
        this.fileList = res.map(file => {
          return Object.assign({}, file, { percentage: 100 })
        })
        this.fileList.forEach(element => {
          const temp = {
            shopName: element.shop,
            lineId: element.lineId,
            eqpNo: element.eqpNo,
            fileName: element.name,
            eMail: element.email
          }
          list.push(temp)
        })
        return uploadFile({ list: list }).then(res => {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.fileList.splice(0, this.fileList.length)
            this.$emit('successEvent')
            this.loading = false
          })
        }).catch(() => {
          this.fileList.splice(0, this.fileList.length)
          this.loading = false
        })
      })
    }
  }
}

</script>

<style scoped>
  .file-upload {
    display: inline-block;
    height: 36px;
    padding: 0 10px;
    line-height: 36px;
    vertical-align: top;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
  }

  .excel-upload-input {
    display: none;
    z-index: -9999;
  }

</style>
