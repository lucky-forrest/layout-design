<template>
  <div >
    <div class="panel">
      <el-row class="title">
        <el-input v-model="searchForTable" :placeholder="t('tip.pleasesearchbyPositionName')" style="width: 400px;margin:10px" prefix-icon="el-icon-search" clearable class="filter-item" />
        <div class="card-footer">
          <el-button :loading="loading" type="primary" @click="addHandler">
            <svg-icon :icon-class="'add'" />&nbsp;1
          </el-button>
          <el-button type="danger" plain style="margin-right:10px" @click="childHandler('button')" >确认修改</el-button>
        </div>
      </el-row>
      <el-table :data="pageInfo.dataList.filter(data => !searchForTable || data.positionName.toLowerCase().includes(searchForTable.toLowerCase()))" highlight-current-row stripe fit border>
        <el-table-column prop="positionSeq" label="PositionNo" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.positionSeq"
              placeholder="Please Input!"
              clearable
              class="filter-item" />
          </template>
        </el-table-column>
        <el-table-column prop="positionName" label="PositionName" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.positionName"
              placeholder="Please Input!"
              clearable
              class="filter-item" />
          </template>
        </el-table-column>
        <el-table-column prop="type" label="PositionType" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.type"
              placeholder="Please Input!"
              clearable
              class="filter-item" />
          </template>
        </el-table-column>
        <el-table-column prop="unitNo" label="TypeNo" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.unitNo"
              placeholder="Please Input!"
              clearable
              class="filter-item" />
          </template>
        </el-table-column>
        <el-table-column prop="positionDescription" label="PositionDescription" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.positionDescription"
              placeholder="Please Input!"
              clearable
              class="filter-item" />
          </template>
        </el-table-column>
        <el-table-column prop="address" label="PlcAddress" align="center">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.address"
              placeholder="Please Input!"
              clearable
              class="filter-item" />
          </template>
        </el-table-column>
        <el-table-column :label="t('column.operate')" width="80" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" circle @click="removeHandler(scope)"/>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
  </div>
</template>
<script>
import {
  t
} from '@/utils'
import notice from '@/utils/notice'
export default {
  name: 'PositionDetail',
  props: {
    detailData: {
      type: Object,
      default() {
        return {
        }
      }
    }
  },
  data() {
    return {
      loading: false,
      newDatas: [],
      blockType: 'Position',
      searchForTable: '',
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
      this.getDataListByPage()
      this.childHandler('')
    })
  },
  methods: {
    t,
    getTargetData() {
      return new Promise((resolve, reject) => {
        if (this.detailData.tpDatas.find(({ positionSeq }) => positionSeq === '')) {
          this.detailData.tpDatas = this.detailData.tpDatas.filter(({ positionSeq }) => positionSeq !== '')
        }
        resolve()
      })
    },
    childHandler(type) {
      if (this.detailData.tpDatas) {
        this.getTargetData().then(() => {
          const temp = {
            blockType: this.blockType,
            tpDatas: this.detailData.tpDatas
          }
          const childList = Object.assign({}, this.detailData, temp)
          this.$emit('childEvent', childList)
          this.getDataListByPage()
          if (type === 'button') {
            this.$message({
              message: 'Success',
              type: 'success'
            })
          }
        })
      } else {
        this.detailData.tpDatas = []
        this.getDataListByPage()
      }
    },
    addHandler() {
      this.detailData.tpDatas.push({
        positionSeq: '',
        type: '',
        unitNo: '',
        positionName: '',
        positionDescription: '',
        address: ''
      })
      const maxPageNo = Math.ceil(this.detailData.tpDatas.length / this.pageInfo.pageSize)
      this.pageInfo.pageNo = maxPageNo
      this.getDataListByPage()
    },
    getDataListByPage() {
      this.loading = true
      this.pageInfo.total = this.detailData.tpDatas.length
      this.pageInfo.dataList = this.$lodash.slice(this.detailData.tpDatas, (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize, this.pageInfo.pageNo * this.pageInfo.pageSize)
      if (this.pageInfo.dataList.length === 0) {
        this.pageInfo.pageNo = this.pageInfo.pageNo - 1
        this.pageInfo.dataList = this.$lodash.slice(this.detailData.tpDatas, (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize, this.pageInfo.pageNo * this.pageInfo.pageSize)
      }
      this.loading = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getDataListByPage()
    },
    handleCurrentChange(val) {
      this.pageInfo.pageNo = val
      this.getDataListByPage()
    },
    removeHandler(scope) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        if (scope.row.objectId) {
          console.log(scope.row)
          const temp = this.detailData.tpDatas.find(item => item.objectId === scope.row.objectId)
          const num = this.detailData.tpDatas.indexOf(temp)
          this.detailData.tpDatas.splice(num, 1)
          this.getDataListByPage()
        } else {
          console.log(scope.row)
          const temp = this.detailData.tpDatas.find(item => item.positionSeq === scope.row.positionSeq)
          const num = this.detailData.tpDatas.indexOf(temp)
          this.detailData.tpDatas.splice(num, 1)
          this.getDataListByPage()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .panel {
    margin: 10px 0;
    border: 1px solid #e3e3e3;
    border-radius: 5px;

    .title {
      border-bottom: 1px solid #e3e3e3;
    }

    .el-table {
      margin: 10px;
      width: calc(100% - 20px);
    }
  }
</style>

