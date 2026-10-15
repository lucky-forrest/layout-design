<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <el-col :sm="20">
          <el-input v-model="filterText" prefix-icon="el-icon-search" placeholder="search" clearable/>
        </el-col>
        <el-col :sm="4">
          <input ref="excel-upload-input" class="excel-upload-input" type="file" multiple @change="handleClick" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
          <el-button :loading="loading" style="margin-left:16px;" type="primary" @click="handleUpload">浏览</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading.body="loading" :data="showFileList" :default-sort="{prop:'createtime',order:'descending'}" stripe border>
      <el-table-column :index="indexHandler" type="index" fixed>#</el-table-column>
      <el-table-column label="FileName" min-width="100" prop="fileName"/>
      <el-table-column label="FabType" min-width="100" prop="fabType">
        <template slot-scope="curr">
          <el-select v-model="curr.row.fabType" :placeholder="t('tip.pleaseSelectFabType')" clearable class="filter-item">
            <el-option v-for="(item,index) in fabTypeList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="EqpType" min-width="100" prop="eqpType">
        <template slot-scope="curr">
          <el-select v-model="curr.row.eqpType" :placeholder="t('tip.pleaseSelectLineType')" clearable class="filter-item">
            <el-option v-for="(item,index) in eqpNoTypeList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="LineType" min-width="100" prop="lineType">
        <template slot-scope="curr">
          <el-select v-model="curr.row.lineType" :placeholder="t('tip.pleaseSelectLineType')" clearable class="filter-item">
            <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.label" :value="item.value"/>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="Shop" min-width="100" prop="shop">
        <template slot-scope="curr">
          <el-input v-model="curr.row.shop" clearable/>
        </template>
      </el-table-column>
      <el-table-column label="LineID" min-width="100" prop="lineId">
        <template slot-scope="curr">
          <el-input v-model="curr.row.lineId" clearable/>
        </template>
      </el-table-column>
      <el-table-column label="LocalNo" min-width="100" prop="localNo">
        <template slot-scope="curr">
          <el-input v-model="curr.row.localNo" clearable/>
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="240" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="deleteHandler(curr)">
            {{ t('btn.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top:10px;text-align:center;">
      <el-button :loading="loading" type="primary" @click="saveHandler">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="cancelHandler">
        <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.cancel') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { t } from '@/utils'
import notice from '@/utils/notice'
import { fabTypeList, lineTypeList, eqpNoTypeList } from '@/config/dropdown'
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function// eslint-disable-line
  },
  data() {
    return {
      dataList: [],
      showFileList: [],
      loading: false,
      filterText: '',
      fabTypeList: fabTypeList,
      lineTypeList: lineTypeList,
      eqpNoTypeList: eqpNoTypeList
    }
  },
  watch: {
    filterText() {
      if (this.filterText) {
        this.showFileList = this.$lodash.slice(this.dataList.filter(data => {
          return data.fileName.replace(/\s/g, '').toUpperCase().includes(this.filterText.replace(/\s/g, '').toUpperCase())
        }))
      } else {
        this.showFileList = this.$lodash.slice(this.dataList)
      }
    }
  },
  methods: {
    t,
    handleDrop(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.loading) return
      const files = e.dataTransfer.files
      if (files.length !== 1) {
        this.$message.error('Only support uploading one file!')
        return
      }
      const rawFile = files[0]

      if (!this.isExcel(rawFile)) {
        this.$message.error('Only supports upload .xlsx, .xls, .csv suffix files')
        return false
      }
      this.upload(rawFile)
      e.stopPropagation()
      e.preventDefault()
    },
    handleDragover(e) {
      e.stopPropagation()
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    handleUpload() {
      this.$refs['excel-upload-input'].click()
    },
    handleClick(e) {
      const files = e.target.files
      for (let i = 0; i < files.length; i++) {
        const data = []
        this.$set(data, 'fileName', files[i].name)
        this.$set(data, 'file', files[i])
        this.dataList.push(data)
      }
      this.showFileList = this.$lodash.slice(this.dataList)
    },
    isExcel(file) {
      return /\.(xlsx|xls|csv)$/.test(file.name)
    },
    saveHandler() {
      this.beforeUpload
      this.onSuccess && this.onSuccess(this.dataList)
    },
    cancelHandler() {
      this.$emit('cancelEvent', 'statusDetail')
    },
    deleteHandler(curr) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        this.showFileList.splice(curr.$index, 1)
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
.excel-upload-input{
  display: none;
  z-index: -9999;
}
</style>
