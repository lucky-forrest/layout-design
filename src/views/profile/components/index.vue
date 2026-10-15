<template>
  <div>
    <fieldset class="fieldset">
      <legend style="padding:0px 10px">Setting</legend>
      <el-form label-width="120px" style="margin-top:10px;">
        <el-row :gutter="20">
          <el-col :lg="6" :md="12">
            <el-form-item label="BlockType:">
              <span>
                {{ blockType }}
              </span>
            </el-form-item>
          </el-col>
          <el-col :lg="6" :md="12">
            <el-form-item label="ReportType:">
              <el-select v-model="reportType" :placeholder="t('tip.pleaseSelectReportType')" clearable>
                <el-option v-for="(item,index) in reportTypeList" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg="12">
            <el-form-item label="Report To:">
              <el-checkbox-group v-model="reportTo">
                <el-checkbox v-for="(item,index) in reportGroupList" :label="item.label" :key="index">{{ item.label }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </fieldset>
    <div class="panel">
      <el-row class="title">
        <el-input v-model="searchForTable" :placeholder="t('tip.pleasesearchbyParameterName')" style="width: 400px;margin:10px" prefix-icon="el-icon-search" clearable />
        <div class="card-footer">
          <el-button :loading="loading" type="success" style="margin-right:10px" @click="addHandler">
            <svg-icon :icon-class="'add'" />&nbsp;1
          </el-button>
        </div>
      </el-row>
      <el-table
        :data="(pageInfo.dataList||[]).filter(data => !searchForTable || data.parameterName.toLowerCase().includes(searchForTable.toLowerCase()))"
        highlight-current-row
        stripe
        fit
        border>
        <el-table-column :index="indexHandler" type="index" align="center" label="#" fixed />
        <el-table-column prop="svid" label="SVID" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.svid" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column prop="parameterName" min-width="170" label="Parameter Name" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.parameterName" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column v-if="!['EFU', 'IonizerFan'].includes(blockType)" prop="item" label="ITEM" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.item" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column v-if="!['EFU', 'IonizerFan'].includes(blockType)" prop="site" label="SITE" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.site" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column prop="description" min-width="180" label="Parameter Description" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.description" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column prop="mapId" min-width="140" label="MapId" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.mapId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="range" label="Range" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.range" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column prop="reportUnitNo" min-width="120" label="ReportUnit" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.reportUnitNo" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column prop="unit" label="Unit" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.unit" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column prop="dotratio" label="Dot/Rate" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.dotratio" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column prop="size" label="Size" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input-number :min="0" v-model="scope.row.size" controls-position="right" />
          </template>
        </el-table-column>
        <el-table-column prop="expression" label="Format" min-width="120" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.expression" :placeholder="t('tip.pleaseSelectFabType')">
              <el-option v-for="(item,index) in formatList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="jobDataItem" label="#N2" align="center" min-width="120">
          <template slot-scope="scope">
            <el-input v-model="scope.row.jobDataItem" :disabled="!(scope.$index===0&&pageInfo.pageNo===1)" placeholder="Please Input!" />
          </template>
        </el-table-column>
        <el-table-column :label="t('column.operate')" width="80" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" @click="removeHandler(scope)" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="card-footer">
      <el-pagination :total="pageInfo.total" :page-size="pageInfo.pageSize" :page-sizes="pageInfo.pageSizeList" :current-page="pageInfo.currPage" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <el-row style="text-align:right;">
      <span style="color:red;">修改完成后，请点击“确认修改”按钮，保存修改，以防丢失！</span>
      <el-button :loading="loading" type="primary" @click="setMapIdHandler('button')">
        <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
      </el-button>
    </el-row>
  </div>
</template>
<script>
import { formatList, reportTypeList, reportGroupList } from '@/config/dropdown'
import { autoGenerateAddress } from '@/api/eqprofile'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'EqprofileDetail',
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
      reportType: '',
      radio: '',
      reportTo: [],
      newDatas: [],
      blockType: '',
      searchForTable: '',
      formatList: formatList,
      reportTypeList: reportTypeList,
      reportGroupList: reportGroupList,
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        pageNo: 1,
        dataList: []
      }
    }
  },
  created() {
    this.readerData()
  },
  mounted() {
    this.$nextTick(() => {
      this.autoGenerateAddressHandler('')
    })
  },
  methods: {
    t,
    getTargetData() {
      return new Promise((resolve, reject) => {
        for (const [key, item] of Object.entries(this.detailData.tpDatas)) {
          const rowIndex = +key + 1
          const flag = /^[A-Z]+[A-Za-z0-9_]*$/.test(item.parameterName)
          if (!flag) {
            notice.error(`Row ${rowIndex} Parameter Name字段只能由字母、下划线(_)、数字组成，Parameter Name首字符为大写字母，不能是数字、下划线与小写字母。`)
            reject()
          }
          if (!item.expression) {
            notice.error(`Row ${rowIndex} Format is null !`)
            reject()
          }
          if (this.blockType === 'Energy Visualization' && !item.item) {
            notice.error(`Row ${rowIndex} ITEM is null !`)
            reject()
          }
          if (this.blockType === 'Energy Visualization' && !item.site) {
            notice.error(`Row ${rowIndex} SITE is null !`)
            reject()
          }
          if (this.blockType === 'APC Data Download') {
            const reportUnitNoFlag = /^([E|U]\w*)|\d+$/.test(item.reportUnitNo)
            if (!reportUnitNoFlag) {
              notice.error(`Row ${rowIndex} ReportUnit字段必需以字母'E'或者字母'U'开头，或者为数字。`)
              reject()
            }
            if (!item.reportUnitNo) {
              notice.error(`Row ${rowIndex} ReportUnit is null !`)
              reject()
            }
          }
        }
        resolve()
      })
    },
    setMapIdHandler(type) {
      switch (this.blockType) {
        case 'EFU':
          this.detailData.tpDatas.map((item, index) => Object.assign(item, { mapId: `EFU${index}_` }))
          break
        case 'IonizerFan':
          this.detailData.tpDatas.map((item, index) => Object.assign(item, { mapId: `IonizerFan${index}_` }))
          break
        default:
          this.detailData.tpDatas.map(item => Object.assign(item, { mapId: `${item.parameterName}${item.site}` }))
      }
      this.autoGenerateAddressHandler(type)
    },
    autoGenerateAddressHandler(type) {
      this.loading = true
      return autoGenerateAddress({
        blockType: this.blockType,
        reportType: this.reportType,
        reportTo: this.reportTo,
        description: this.description,
        tpDatas: this.detailData.tpDatas
      }).then(res => {
        if (res.body.tpDatas) {
          this.detailData.tpDatas = res.body.tpDatas
          this.getTargetData().then(() => {
            const temp = {
              blockType: this.blockType,
              reportType: this.reportType,
              reportTo: this.reportTo,
              tpDatas: this.detailData.tpDatas
            }
            const childList = Object.assign({}, this.detailData, temp)
            this.$emit('childEvent', childList)
            this.getDataListByPage()
          })
          this.loading = false
        } else {
          this.detailData.tpDatas = []
          this.getDataListByPage()
          this.loading = false
        }
        if (type === 'button') {
          this.$message({
            message: 'Success',
            type: 'success'
          })
        }
      }).catch(() => {
        this.loading = false
      })
    },
    readerData() {
      this.blockType = this.detailData.blockType
      this.reportType = this.detailData.reportType
      this.reportTo = this.detailData.reportTo
      if (this.detailData.tpDatas) {
        this.getDataListByPage()
      } else {
        this.detailData.tpDatas = []
        this.getDataListByPage()
      }
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
    addHandler() {
      if (['EFU', 'IonizerFan'].includes(this.blockType)) {
        this.detailData.tpDatas.push({
          svid: '',
          parameterName: '',
          description: '',
          range: '',
          reportUnitNo: '',
          unit: '',
          dotratio: '',
          size: '',
          expression: '',
          jobDataItem: '',
          mapId: ''
        })
      } else {
        this.detailData.tpDatas.push({
          svid: '',
          parameterName: '',
          item: '',
          site: '',
          description: '',
          range: '',
          reportUnitNo: '',
          unit: '',
          dotratio: '',
          size: '',
          expression: '',
          jobDataItem: '',
          mapId: ''
        })
      }
      const maxPageNo = Math.ceil(this.detailData.tpDatas.length / this.pageInfo.pageSize)
      this.pageInfo.pageNo = maxPageNo
      this.getDataListByPage()
    },
    removeHandler(scope) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        if (scope.row.objectId) {
          const temp = this.detailData.tpDatas.find(item => item.objectId === scope.row.objectId)
          const num = this.detailData.tpDatas.indexOf(temp)
          this.detailData.tpDatas.splice(num, 1)
          this.getDataListByPage()
        } else {
          const temp = this.detailData.tpDatas.find(item => item.parameterName === scope.row.parameterName)
          const num = this.detailData.tpDatas.indexOf(temp)
          this.detailData.tpDatas.splice(num, 1)
          this.getDataListByPage()
        }
      })
    },
    indexHandler(index) {
      return (this.pageInfo.pageNo - 1) * this.pageInfo.pageSize + index + 1
    }
  }
}

</script>
<style lang="scss" scoped>
  .el-input,
  .el-input-number,
  .el-select {
    width: 100%;
  }

  .fieldset {
    min-width: 100px;
    height: 100%;
    border: 1px solid #e3e3e3;
    border-radius: 5px;

    legend {
      margin-left: 20px;
      font-weight: bold;
      margin-left: 20px;
    }
  }

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
