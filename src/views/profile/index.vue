<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :md="3">
          <el-select
            v-model="shopName"
            :placeholder="t('tip.pleaseSelectShop')"
            clearable
            filterable
            class="filter-item"
            @change="getLineTypeListByShop">
            <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :md="3">
          <el-select
            v-model="lineType"
            :placeholder="t('tip.pleaseSelectLineType')"
            clearable
            filterable
            class="filter-item"
            @change="getEquipmentNoList">
            <el-option
              v-for="(item,index) in lineTypeList"
              :key="index"
              :label="item"
              :value="item"/>
          </el-select>
        </el-col>
        <!-- <el-col :md="3">
          <el-select
            v-model="eqpType"
            :placeholder="t('tip.pleaseSelectEquipmentType')"
            clearable
            filterable
            class="filter-item"
            @change="getEquipmentNoList">
            <el-option
              v-for="(item,index) in eqpTypeList"
              :key="index"
              :label="item"
              :value="item" />
          </el-select>
        </el-col> -->
        <el-col :md="4">
          <el-select v-model="equipmentNo" :placeholder="t('tip.pleaseSelectEquipmentNo')" clearable filterable class="filter-item">
            <el-option v-for="(item,index) in equipmentList" :key="index" :label="item" :value="item" />
          </el-select>
        </el-col>
        <el-col :md="8">
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
          <el-button v-authorize="'add'" :loading="loading" type="primary" icon="el-icon-plus" @click="addHandler">{{ t('btn.add') }}</el-button>
          <el-button v-authorize="'upload'" :loading="loading" type="primary" icon="el-icon-upload" @click="showUploadFile=true">
            {{ t('btn.upload') }}
          </el-button>
        </el-col>
      </el-row>
    </div>
    <el-table :data="pageInfo.dataList" highlight-current-row stripe border>
      <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
      <el-table-column label="EQP Profile Name" width="190" align="center" prop="fileName">
        <template slot-scope="curr">
          <el-tooltip :open-delay="500" :content="curr.row.fileName" placement="top">
            <span>{{ curr.row.fileName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="Version" min-width="100" align="center" prop="fileVersion" />
      <el-table-column label="Factory" min-width="100" align="center" prop="factoryName" />
      <el-table-column label="Shop" min-width="100" align="center" prop="shopName" />
      <el-table-column label="LineType" min-width="100" align="center" prop="lineType" />
      <el-table-column label="EqpNo" min-width="100" align="center" prop="equipmentNo" />
      <el-table-column label="UpdatedBy" min-width="100" align="center" prop="updateUser" />
      <el-table-column label="UpdatedTime" min-width="120" align="center" prop="updateTime" />
      <el-table-column label="Description" min-width="100" align="center" prop="fileDesc" />
      <el-table-column label="Status" min-width="100" align="center" prop="activeStatus" />
      <el-table-column :label="t('column.operate')" width="350" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button v-authorize="'update'" :loading="loading" :disabled="curr.row.activeStatus==='Active'" type="primary" icon="el-icon-edit" @click="editList(curr.row)" />
          <el-tooltip :open-delay="500" content="Active" placement="top">
            <el-button v-authorize="'update'" v-show="curr.row.activeStatus==='InActive'" :loading="loading" type="success" icon="el-icon-check" @click="aliveHandler(curr.row)" />
          </el-tooltip>
          <el-tooltip :open-delay="500" content="InActive" placement="top">
            <el-button v-authorize="'update'" v-show="curr.row.activeStatus==='Active'" :loading="loading" type="warning" @click="aliveHandler(curr.row)">
              <svg-icon :icon-class="'error'" />
            </el-button>
          </el-tooltip>
          <el-tooltip :open-delay="500" :content="t('btn.download')" placement="top">
            <el-button v-authorize="'download'" :loading="loading" type="primary" @click="downLoadHandler(curr.row)">
              <svg-icon :icon-class="'down'" />
            </el-button>
          </el-tooltip>
          <el-tooltip :open-delay="500" :content="t('btn.send')" placement="top">
            <el-button v-authorize="'send'" :disabled="curr.row.activeStatus==='InActive'" :loading="loading" type="primary" @click="onlineHandler(curr.row)" >
              <svg-icon :icon-class="'send'"/>
            </el-button>
          </el-tooltip>
          <el-button v-authorize="'remove'" :disabled="curr.row.activeStatus==='Active'" :loading="loading" type="danger" icon="el-icon-delete" @click="deleteProfileHandler(curr.row)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-pagination :total="pageInfo.total" :page-size="pageInfo.pageSize" :page-sizes="pageInfo.pageSizeList" :current-page="pageInfo.currPage" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-dialog :visible.sync="showUploadFile" :fullscreen="false" :close-on-click-modal="false" :close-on-press-escape="false" width="800px" top="8vh" title="Upload Form">
      <upload v-if="showUploadFile" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
    <el-dialog :visible.sync="showOnLineDetail" :fullscreen="false" :close-on-click-modal="false" :close-on-press-escape="false" width="1000px" top="8vh" title="OnLine Form">
      <onLineDetail :detail-data="detailData" @successEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>

<script>
import { sendDataToBc, getProfileList, updateProfileStatus, getEditProfileList, downloadFile, deleteProfile, getLineTypeListByShop, getEquipmentTypeList, getEquipmentNoList } from '@/api/eqprofile'
import { download } from '@/utils/file-utils'
import onLineDetail from './onLineDetail'
import notice from '@/utils/notice'
import { shopList } from '@/config'
import upload from './upload'
import { t } from '@/utils'

export default {
  name: 'ImportEqpProfile',
  components: {
    upload,
    onLineDetail
  },
  data() {
    return {
      loading: false,
      detailData: {},
      equipmentNo: '',
      shopName: '',
      lineType: '',
      eqpType: '',
      showUploadFile: false,
      showOnLineDetail: false,
      shopList: shopList,
      equipmentList: [],
      lineTypeList: [],
      // eqpTypeList: [],
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
      this.getProfileList()
    })
  },
  methods: {
    t,
    getLineTypeListByShop() {
      if (this.shopName !== '') {
        return getLineTypeListByShop({ shopName: this.shopName }).then(res => {
          this.lineTypeList = res.body
        })
      } else {
        this.lineType = ''
        this.eqpType = ''
        this.equipmentNo = ''
        this.lineTypeList = []
      }
    },
    getEquipmentTypeList() {
      if (this.lineType !== '') {
        return getEquipmentTypeList({
          shopName: this.shopName,
          lineType: this.lineType
        }).then(res => {
          this.eqpTypeList = res.body
        })
      } else {
        this.eqpType = ''
        this.equipmentNo = ''
        this.eqpTypeList = []
      }
    },
    getEquipmentNoList() {
      if (this.lineType !== '') {
        return getEquipmentNoList({
          shopName: this.shopName,
          lineType: this.lineType
        }).then(res => {
          this.equipmentList = res.body
        })
      } else {
        this.equipmentNo = ''
        this.equipmentList = []
      }
    },
    deleteProfileHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        this.loading = true
        return deleteProfile(row).then(() => {
          notice.success(this.t('tip.removeSuccess'))
          this.loading = false
          this.getProfileList()
        }).catch(() => {
          this.loading = false
        })
      })
    },
    downLoadHandler(row) {
      this.loading = true
      return downloadFile(row).then(res => {
        download(res.body)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getProfileList() {
      this.loading = true
      return getProfileList({
        condition: {
          shopName: this.shopName,
          lineType: this.lineType,
          equipmentNo: this.equipmentNo
        },
        pageNo: this.pageInfo.currPage,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.dataList = res.body.rows
        this.pageInfo.total = res.body.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    aliveHandler(row) {
      return updateProfileStatus(row).then(res => {
        notice.success(this.t('tip.saveSuccess'))
        this.showDetail = false
        this.getProfileList()
      })
    },
    editList(row) {
      this.loading = true
      return getEditProfileList(row).then(res => {
        this.loading = false
        this.$router.push({
          name: 'EditProfile',
          params: {
            isEdit: true,
            dataDetail: res.body
          }
        })
      }).catch(() => {
        this.loading = false
      })
    },
    onlineHandler(row) {
      this.loading = true
      return sendDataToBc(row).then(res => {
        this.showOnLineDetail = true
        this.detailData = res.body
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addHandler() {
      this.$router.push({
        name: 'EditProfile'
      })
    },
    successHandler(type) {
      if (type === 'online') {
        this.showOnLineDetail = false
      } else {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.getProfileList()
          this.showUploadFile = false
        })
      }
    },
    cancelHandler(type) {
      if (type === 'online') {
        this.showOnLineDetail = false
      } else {
        this.showUploadFile = false
      }
    },
    searchHandler() {
      this.getProfileList()
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getProfileList()
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getProfileList()
    },
    indexHandler(index) {
      return (this.pageInfo.currPage - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}

</script>

<style scoped>
  .excel-upload-input {
    display: none;
    z-index: -9999;
  }

</style>
