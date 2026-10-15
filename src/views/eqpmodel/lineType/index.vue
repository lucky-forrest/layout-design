<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :md="4">
          <el-select
            v-model="shopName"
            :placeholder="t('tip.pleaseSelectShop')"
            clearable
            filterable
            class="filter-item"
            @change="getLineTypeIdListHandler">
            <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-col>
        <el-col :md="4">
          <el-select v-model="lineTypeId" :placeholder="t('tip.pleaseSelectLineType')" clearable filterable class="filter-item">
            <el-option
              v-for="(item,index) in lineTypeIdList"
              :key="index"
              :label="item.lineTypeId"
              :value="item.lineTypeId" />
          </el-select>
        </el-col>
        <el-col :md="6">
          <el-button :loading="loading" type="primary" icon="el-icon-search" @click="search">{{ t('btn.search') }}
          </el-button>
          <el-button v-authorize="'add'" :loading="loading" type="primary" icon="el-icon-plus" @click="addHandler">
            {{ t('btn.add') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table v-loading.body="loading" :data="pageInfo.dataList" border>
      <el-table-column :index="indexHandler" type="index" align="center" label="#" fixed />
      <el-table-column min-width="120px" label="ShopName" prop="shopName" align="center" />
      <el-table-column min-width="120px" label="LineType" prop="lineTypeId" />
      <el-table-column min-width="120px" label="Descript" prop="lineTypeName">
        <template slot-scope="curr">
          <el-input v-if="curr.row.isEdit" v-model="curr.row.lineTypeName" clearable/>
          <span v-if="!curr.row.isEdit">{{ curr.row.lineTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="LineTypeSeqNo" prop="lineTypeSeqNo" align="center">
        <template slot-scope="curr">
          <el-input v-if="curr.row.isEdit" v-model="curr.row.lineTypeSeqNo" clearable />
          <span v-if="!curr.row.isEdit">{{ curr.row.lineTypeSeqNo }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="CreateUser" prop="createUser" />
      <el-table-column width="160px" label="CreateTime" prop="createTime" align="center">
        <template slot-scope="curr">
          {{ curr.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column min-width="120px" label="UpdateUser" prop="updateUser" />
      <el-table-column width="160px" label="UpdateTime" prop="updateTime" align="center">
        <template slot-scope="curr">
          {{ curr.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="130" align="center" fixed="right">
        <template slot-scope="curr">
          <el-button
            v-if="curr.row.isEdit"
            :loading="loading"
            type="primary"
            @click="saveHandler(curr.row)">
            <svg-icon :icon-class="'save'" />
          </el-button>
          <el-button
            v-authorize="'update'"
            v-if="!curr.row.isEdit"
            :loading="loading"
            type="primary"
            icon="el-icon-edit"
            @click="edit(curr.row)"/>
          <el-button
            v-authorize="'remove'"
            :loading="loading"
            type="danger"
            icon="el-icon-delete"
            @click="removeHandler(curr.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-pagination
        :total="pageInfo.total"
        :page-size="pageInfo.pageSize"
        :page-sizes="pageInfo.pageSizeList"
        :current-page="pageInfo.pageNo"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <el-dialog
      :visible="showDetail"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="() => {showDetail = false}"
      width="800px"
      top="10vh"
      title="LineType Form">
      <LinetypeDetail v-if="showDetail" @saveEvent="successHandler" @cancelEvent="cancelHandler" />
    </el-dialog>
  </div>
</template>
<script>
import { getLineTypeList, deleteLineTypeInfo, saveLineTypeInfo } from '@/api/eqpmodel/lineType'
import LinetypeDetail from './detail'
import { shopList } from '@/config'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'LineTypeList',
  components: {
    LinetypeDetail
  },
  data() {
    return {
      loading: false,
      showDetail: false,
      shopName: '',
      lineTypeId: '',
      shopList: shopList,
      lineTypeIdList: [],
      allLineTypeIdList: [],
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        pageNo: 1,
        dataList: []
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initLineTypeIdList().then(() => {
        this.getLineTypeList()
      })
    })
  },
  methods: {
    t,
    getLineTypeIdListHandler() {
      this.lineTypeId = ''
      this.lineTypeIdList = this.allLineTypeIdList.filter(({ shopName }) => this.shopName === shopName)
    },
    initLineTypeIdList() {
      return getLineTypeList({
        condition: {
          shopName: this.shopName,
          lineTypeId: this.lineTypeId
        },
        pageNo: this.pageInfo.pageNo,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.allLineTypeIdList = res.body.rows
      })
    },
    getLineTypeList() {
      return getLineTypeList({
        condition: {
          shopName: this.shopName,
          lineTypeId: this.lineTypeId
        },
        pageNo: this.pageInfo.pageNo,
        pageSize: this.pageInfo.pageSize
      }).then(res => {
        this.pageInfo.total = res.body.total
        this.pageInfo.dataList = res.body.rows
      })
    },
    search() {
      this.getLineTypeList()
    },
    addHandler() {
      this.showDetail = true
    },
    removeHandler(row) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        this.loading = true
        return deleteLineTypeInfo(row).then(() => {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.loading = false
            this.getLineTypeList()
          })
        }).catch(() => {
          this.loading = false
        })
      })
    },
    saveHandler(row) {
      row.isEdit = false
      delete row.isEdit
      return saveLineTypeInfo({
        actionType: 'Update',
        itemList: [row]
      }).then(() => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.loading = false
          this.getLineTypeList()
        })
      }).catch(() => {
        this.loading = false
      })
    },
    edit(row) {
      if (Object.hasOwnProperty('isEdit')) {
        row.isEdit = true
      } else {
        this.$set(row, 'isEdit', true)
      }
    },
    successHandler() {
      this.showDetail = false
      this.getLineTypeList()
      this.initLineTypeIdList()
    },
    cancelHandler() {
      this.showDetail = false
      this.getLineTypeList()
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getLineTypeList()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getLineTypeList()
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}
</script>

