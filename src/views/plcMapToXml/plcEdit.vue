<template>
  <div class="app-container">
    <el-form name="addressForm" label-width="120px" >
      <div class="filter-container">
        <el-row :gutter="20">
          <el-col :sm="5" :lg="4">
            <el-select v-model="fabType" :placeholder="t('tip.pleaseSelectFabType')" clearable filterable class="filter-item">
              <el-option v-for="(item,index) in fabTypeList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-col>
          <el-col :sm="5" :lg="4">
            <el-select v-model="lineType" :placeholder="t('tip.pleaseSelectLineType')" clearable filterable class="filter-item">
              <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-col>
          <el-col :sm="5" :lg="4">
            <el-input v-model="lineId" :placeholder="t('tip.pleaseInputLineId')" clearable class="filter-item"/>
          </el-col>
          <el-col :sm="9" :lg="12">
            <el-button type="primary" icon="el-icon-search">{{ t('btn.search') }}</el-button>
            <el-button v-authorize="'save'" type="primary" icon="el-icon-plus">{{ t('btn.save') }}</el-button>
          </el-col>
        </el-row>
      </div>
      <transition name="el-zoom-in-center">
        <el-card style="margin:10px auto;" body-style="padding:10px 0;">
          <div slot="header">
            <el-radio-group v-model="dataType">
              <el-radio v-for="(item,index) in tableData" :key="index" :label="item.tableName" :value="item.tableName">{{ item.tableName }}</el-radio>
            </el-radio-group>
          </div>
          <el-table
            :data="pageInfo.dataList"
            highlight-current-row
            stripe
            border>
            <el-table-column :prop="firstHeader" :label="firstHeader" min-width="150" fixed="left">
              <template slot-scope="curr">
                <el-button v-show="currIndex!==curr.$index" v-if="!curr.row.isEdit && dataType === 'Address'" type="text" @click="edit(curr.row)">
                  {{ curr.row[firstHeader] }}
                </el-button>
                <span v-show="currIndex!==curr.$index" v-if="dataType !== 'Address' && curr.row === tableList[0]">
                  {{ curr.row[firstHeader] }}
                </span>
                <el-button v-show="currIndex!==curr.$index" v-if="!curr.row.isEdit && dataType !== 'Address' && curr.row !== tableList[0]" type="text" @click="edit(curr.row)">
                  {{ curr.row[firstHeader] }}
                </el-button>
                <el-button v-show="currIndex!==curr.$index" v-if="curr.row.isEdit" type="text" @click="editHandler(curr.row)">
                  {{ t('btn.save') }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column v-for="item of header" :prop="item" :label="item" :key="item" min-width="150">
              <template slot-scope="curr">
                <el-input v-show="currIndex!==curr.$index" v-if="curr.row.isEdit" v-model="curr.row[item]" clearable/>
                <span v-else-if="!curr.row.isEdit" v-show="currIndex!==curr.$index">
                  {{ curr.row[item] }}
                </span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </transition>
    </el-form>
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
  </div>
</template>

<script>
import { getFileList, updatePlcMap } from '@/api/plcMapToXml/plc'
import { fabTypeList, lineTypeList } from '@/config/dropdown'
import { t } from '@/utils'
import XLSX from 'xlsx'
import notice from '@/utils/notice'
export default {
  name: 'PlcEdit',
  data() {
    return {
      data: [],
      lineId: '',
      header: [],
      fabType: '',
      lineType: '',
      dataType: '',
      loading: true,
      currIndex: -1,
      tableList: [],
      tableData: [],
      firstHeader: '',
      tableHeader: {},
      importDataList: [],
      showUploadFile: false,
      downloadLoading: false,
      fabTypeList: fabTypeList,
      lineTypeList: lineTypeList,
      pageInfo: {
        total: 0,
        pageSize: 10,
        pageSizeList: [10, 15, 20, 50],
        currPage: 1,
        dataList: []
      }
    }
  },
  watch: {
    dataType() {
      this.tableHeader = this.tableData.filter(curr => { return curr.tableName === this.dataType })
      this.getDataList(this.dataType)
    }
  },
  mounted() {
    this.$nextTick(() => {
      // this.getAddressList()
      this.readerData(this.$route.params.list)
    })
  },
  methods: {
    t,
    getFileList() {
      return new Promise((resolve, reject) => {
        try {
          this.loading = true
          return getFileList({
            currPage: this.pageInfo.currPage,
            pageSize: this.pageInfo.pageSize
          }).then(res => {
            this.pageInfo.dataList = res.body.row
            this.loading = false
            resolve()
          }).catch(() => {
            this.loading = false
          })
        } catch (error) {
          reject(error)
        }
      })
    },
    beforeUpload(file) {
      this.tableData = []
      this.tableHeader = {}
      this.importDataList = []
      return true
    },
    edit(row) {
      if (Object.hasOwnProperty('isEdit')) {
        row.isEdit = true
      } else {
        this.$set(row, 'isEdit', true)
      }
    },
    indexHandler(index) {
      return index + 1
    },
    readerData(file) {
      this.loading = true
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = e => {
          const data = e.target.result
          const fixedData = this.fixData(data)
          const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
          const sheetName = workbook.SheetNames
          sheetName.forEach(sheet => {
            const worksheet = workbook.Sheets[sheet]
            let header = []
            const name = sheet
            const results = []
            let tableList = []
            if (name === 'Address') {
              header = ['Line Station Number', 'Equipment', 'Network No.', 'Station No.', 'Point1', 'Start_W', 'End_W', 'Point2', 'Start_B', 'End_B']
              tableList = XLSX.utils.sheet_to_json(worksheet)
              const column = (Object.keys(tableList[2]).map(prop => {
                return {
                  label: prop
                }
              }))
              for (let i = 2; i < tableList.length; i++) {
                const list = []
                for (let j = 0; j < column.length; j++) {
                  this.$set(list, header[j], tableList[i][column[j].label])
                }
                results.push(list)
              }
            } else {
              tableList = XLSX.utils.sheet_to_json(worksheet)
              const column = (Object.keys(tableList[2]).map(prop => {
                return {
                  label: prop,
                  prop: tableList[2][prop]
                }
              }))
              Object.keys(tableList[3]).map(prop => {
                column.forEach(curr => {
                  if (curr.label === prop) {
                    curr.prop = tableList[3][prop]
                  }
                })
              })
              column.filter(curr => { return curr.prop.indexOf('#') }).forEach(curr => header.push(curr.prop))
              for (let i = 4; i < tableList.length; i++) {
                const list = []
                for (let j = 0; j < column.length; j++) {
                  if (j === 0 && i >= 4 && !tableList[i][column[j].label]) {
                    tableList[i][column[j].label] = tableList[i - 1][column[j].label]
                  }
                  this.$set(list, column[j].prop, tableList[i][column[j].label])
                }
                results.push(list)
              }
            }
            this.generateData({ name, header, results })
          })
          this.loading = false
          resolve()
        }
        reader.readAsArrayBuffer(file)
      })
    },
    fixData(data) {
      let o = ''
      let l = 0
      const w = 10240
      for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
      o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
      return o
    },
    generateData({ name, header, results }) {
      this.onSuccess(name, header, results)
    },
    onSuccess(name, header, results) {
      this.loading = true
      const table = []
      const tableList = []
      table.tableName = name
      table.tableHeader = header
      this.$set(tableList, 'tableList', results.map(row => {
        const item = {}
        header.forEach(x => {
          Object.assign({}, item, {
            [x]: row[x] || row[x]
          })
        })
        return item
      }))
      this.tableData.push(table)
      this.$set(tableList, 'tableName', name)
      this.importDataList.push(tableList)
      if (name === this.tableData[0].tableName) {
        this.dataType = name
      }
    },
    getDataList(name) {
      this.tableList = this.importDataList.filter(curr => { return curr.tableName === name })[0].tableList
      this.tableHeader = this.tableData.filter(curr => { return curr.tableName === name })[0].tableHeader
      this.firstHeader = this.tableHeader[0]
      this.header = this.tableHeader.filter(curr => { return curr !== this.firstHeader })
      this.pageInfo.total = this.tableList.length
      this.pageInfo.dataList = this.$lodash.slice(this.tableList, (this.pageInfo.currPage - 1) * this.pageInfo.pageSize, this.pageInfo.currPage * this.pageInfo.pageSize)
      this.loading = false
    },
    editHandler(row) {
      return updatePlcMap(row).then(res => {
        row.isEdit = false
        notice.success(this.t('tip.saveSuccess'), () => {
          this.loading = false
        })
      }).catch(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getDataList(this.dataType)
    },
    handleCurrentChange(val) {
      this.pageInfo.currPage = val
      this.getDataList(this.dataType)
    }
  }
}
</script>
