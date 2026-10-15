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
            @change="getLineTypeListByShop(curr.row)">
            <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="LineType" min-width="100" prop="lineType">
        <template slot-scope="curr">
          <el-select
            v-model="curr.row.lineType"
            :placeholder="t('tip.pleaseSelectLineId')"
            clearable
            filterable
            class="filter-item"
            @change="getEquipmentNoList(curr.row)">
            <el-option
              v-for="(item,index) in curr.row.lineTypeList"
              :key="index"
              :label="item"
              :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <!-- <el-table-column label="EqpType" min-width="100" prop="eqpType">
        <template slot-scope="curr">
          <el-select
            v-model="curr.row.eqpType"
            :placeholder="t('tip.pleaseSelectLineId')"
            clearable
            filterable
            class="filter-item"
            @change="getEquipmentNoList(curr.row)">
            <el-option
              v-for="(item,index) in curr.row.eqpTypeList"
              :key="index"
              :label="item"
              :value="item" />
          </el-select>
        </template>
      </el-table-column> -->
      <el-table-column label="EqpNo" min-width="100" prop="equipmentNo">
        <template slot-scope="curr">
          <el-select
            v-model="curr.row.equipmentNo"
            :placeholder="t('tip.pleaseSelectEquipmentNo')"
            clearable
            filterable
            class="filter-item">
            <el-option
              v-for="(item,index) in curr.row.equipmentList"
              :key="index"
              :label="item"
              :value="item" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="E-Mail Notification" min-width="100" prop="email">
        <template slot-scope="curr">
          <el-input v-model="curr.row.email" clearable />
        </template>
      </el-table-column>
      <el-table-column label="Status" width="120" align="center">
        <template slot-scope="curr">
          <el-progress :percentage="Math.floor(curr.row.progress)">{{ `${Math.floor(curr.row.progress)}%` }}
          </el-progress>
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
        <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.cancel') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { getLineTypeListByShop, getEquipmentTypeList, getEquipmentNoList } from '@/api/eqprofile'
import FileUpload from 'vue-upload-component'
import { uploadFile } from '@/api/eqprofile'
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
      equipmentList: [],
      files: [],
      uploadConfig: {
        postAction: `http://${window.config.serverIp}:${window.config.serverPort}/UpLoadFileServiceImpl/upload`,
        data: { moduleName: 'eqpprofile', factoryName: '', shopName: '', lineId: '', lineType: '' },
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
    }
  },
  methods: {
    t,
    getLineTypeListByShop(row) {
      if (row.shopName !== '') {
        row.data = Object.assign({}, row.data, {
          factoryName: this.$store.state.user.userInfo.factory,
          shopName: row.shop,
          lineId: '',
          lineType: row.lineType
        })
        return getLineTypeListByShop({ shopName: row.shop }).then(res => {
          row.lineTypeList = res.body
        })
      } else {
        row.lineType = ''
        row.eqpType = ''
        row.equipmentNo = ''
        row.lineTypeList = []
        row.eqpTypeList = []
      }
    },
    getEquipmentTypeList(row) {
      if (row.lineType !== '') {
        row.data = Object.assign({}, row.data, {
          factoryName: this.$store.state.user.userInfo.factory,
          shopName: row.shop,
          lineId: '',
          lineType: row.lineType
        })
        return getEquipmentTypeList({
          shopName: row.shop,
          lineType: row.lineType
        }).then(res => {
          row.eqpTypeList = res.body
        })
      } else {
        row.eqpType = ''
        row.equipmentNo = ''
        row.eqpTypeList = []
      }
    },
    getEquipmentNoList(row) {
      if (row.lineType !== '') {
        row.data = Object.assign({}, row.data, {
          factoryName: this.$store.state.user.userInfo.factory,
          shopName: row.shop,
          lineId: '',
          lineType: row.lineType
        })
        return getEquipmentNoList({
          shopName: row.shop,
          lineType: row.lineType
        }).then(res => {
          row.equipmentList = res.body
        })
      } else {
        row.equipmentNo = ''
        row.equipmentList = []
      }
    },
    cancelHandler() {
      this.$emit('cancelEvent', 'upload')
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
        console.log('files', this.files)
        this.files = this.files.map(item => {
          return item.shop ? item : Object.assign({}, item, { shop: '', lineType: '', lineTypeList: [], eqpType: '', eqpTypeList: [], equipmentNo: '', equipmentList: [], email: '' })
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
          if (!file.lineType) {
            errMsg = `Row ${rowIndex} lineType is null !`
            break
          }
          // if (!file.eqpType) {
          //   errMsg = `Row ${rowIndex} eqpType is null !`
          //   break
          // }
          if (!file.equipmentNo) {
            errMsg = `Row ${rowIndex} EqplNo is null !`
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
          lineType: element.lineType,
          eqpType: element.eqpType,
          eqpNo: element.equipmentNo,
          fileName: element.name,
          eMail: element.email
        })
      })
      this.loading = true
      return uploadFile({ list: tempList }).then(res => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.files.splice(0, this.files.length)
          this.$emit('successEvent', 'upload')
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
