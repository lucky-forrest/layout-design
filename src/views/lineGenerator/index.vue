<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :lg="24">
          <el-input v-model="sourceCodePath" :placeholder="t('tip.sourceCodeConfigPath')" style="width:20%;"/>
          <el-input v-model="lineConfigPath" :placeholder="t('tip.lineTypeConfigPath')" style="width:20%;"/>
          <el-button type="primary" icon="el-icon-search" @click="searchHandler">{{ t('btn.search') }}</el-button>
        </el-col>
      </el-row>
    </div>
    <fieldset class="fieldset">
      <el-button type="primary" style="margin-bottom:10px;" icon="el-icon-plus" @click="addLineHandler">ADD Line</el-button>
      <el-table
        v-loading="loading"
        :data="pageInfo.dataList"
        highlight-current-row
        stripe
        border>
        <el-table-column :index="indexHandler" align="center" type="index" fixed>#</el-table-column>
        <el-table-column label="Shop" min-width="100" prop="shop"/>
        <el-table-column label="LineId" min-width="100" prop="lineId"/>
        <el-table-column label="EQP NO" min-width="100" prop="eqpNo"/>
        <el-table-column label="IP" min-width="100" prop="ip"/>
        <el-table-column label="Port" min-width="100" prop="port"/>
        <el-table-column :label="t('column.operate')" width="240" align="center" fixed="right">
          <template slot-scope="curr">
            <el-button type="primary" @click="editHandler(curr.row)">{{ t('btn.edit') }}</el-button>
            <el-button v-authorize="'mini'" type="danger" icon="el-icon-remove" @click="removeHandler(curr.row)">
              {{ t('btn.remove') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </fieldset>
    <div class="card-footer">
      <el-pagination
        :total="pageInfo.total"
        :page-size="pageInfo.pageSize"
        :page-sizes="pageInfo.pageSizeList"
        :current-page="pageInfo.currPage"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="900px"
      top="8vh"
      title="Detail Form">
      <detail v-if="showDetail" :detail-data="datailData" @successEvent="handleSuccess" @cancelEvent="cancelHandler"/>
    </el-dialog>
  </div>
</template>
<script>
import { t } from '@/utils'
import detail from './detail'
import notice from '@/utils/notice'
import { getLineConfigList } from '@/api/lineGenerator/index'
export default {
  name: 'AddModifyLine',
  components: {
    detail
  },
  data() {
    return {
      loading: false,
      showDetail: false,
      lineConfigPath: '',
      sourceCodePath: '',
      datailData: {},
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        currPage: 1,
        dataList: []
      }
    }
  },
  methods: {
    t,
    editHandler() {},
    removeHandler() {},
    searchHandler() {
      this.getLineConfigList()
    },
    handleSuccess() {
      notice.success(this.t('tip.saveSuccess'))
      this.getLineConfigList()
      this.showDetail = false
    },
    addLineHandler() {
      this.showDetail = true
      this.datailData = {
        lineConfigPath: this.lineConfigPath,
        sourceCodePath: this.sourceCodePath
      }
    },
    getLineConfigList() {
      this.loading = true
      return getLineConfigList({
        condition: { lineConfigPath: this.lineConfigPath },
        pageNo: this.pageInfo.currPage,
        pageSize: this.pageInfo.pageSize,
        from: 0
      }).then(res => {
        this.lineConfigPath = res.body.lineConfigPath
        this.sourceCodePath = res.body.sourceCodePath
        this.pageInfo.dataList = res.body.rows
        this.pageInfo.total = res.body.total
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    indexHandler(index) {
      return (this.pageInfo.currPage - 1) * this.pageInfo.pageSize + index + 1
    },
    cancelHandler() {
      this.showDetail = false
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getLineConfigList()
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getLineConfigList()
    }
  }
}
</script>
<style scoped>
  .el-input {
    width: 60%;
    margin: 5px;
  }
  .fieldset {
    min-width: 100px;
    height: 100%;
    border: 1px solid #e3e3e3;
    border-radius: 5px;
    padding: 10px;
  }
</style>

