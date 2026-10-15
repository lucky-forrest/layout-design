<template>
  <div class="app-container">
    <el-container>
      <el-aside width="300px" style="height:calc(100vh - 125px);border:1px solid #dcdee2;">
        <el-row>
          <el-col :sm="24" style="padding:5px;20px;5px;20px;">
            <el-select
              v-model="shop"
              :disabled="isDisabled"
              :placeholder="t('tip.pleaseSelectShop')"
              clearable
              filterable
              class="el-select"
              @change="getLineListHandler">
              <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :sm="24" style="padding:5px;20px;5px;20px;">
            <el-select
              v-model="lineId"
              :disabled="isDisabled"
              :placeholder="t('tip.pleaseSelectLineId')"
              clearable
              filterable
              class="el-select"
              @change="getBitListHandler">
              <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineId" :value="item.lineId" />
            </el-select>
          </el-col>
          <el-col :sm="24" style="padding:5px;20px;5px;20px;">
            <el-select
              v-model="blockCatory1"
              :placeholder="t('tip.pleaseSelectType')"
              clearable
              filterable
              class="el-select"
              @change="getBitListHandler">
              <el-option v-for="(item,index) in blockCatoryList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :sm="24" style="padding:5px;20px;5px;20px;">
            <draggable v-model="dataList" element="tbody" @update="blockNameDatadragEnd">
              <el-tooltip v-for="(item,index) in dataList" :key="index" :open-delay="500" :content="item.blockName" placement="top-start">
                <span
                  draggable="true"
                  class="message-item"
                  @click="getBitData(item.blockName)">
                  {{ item.blockName }}
                </span>
              </el-tooltip>
            </draggable>
          </el-col>
          <el-col :sm="24" style="padding:5px;20px;5px;20px;">
            <el-button v-authorize="'add'" v-if="shop && lineId" :loading="loading" style="width:100%;height:40px;" @click="addBlockName">
              <svg-icon :icon-class="'add'" />&nbsp;New Block
            </el-button>
          </el-col>
          <el-col :sm="24" style="padding:5px;20px;">
            <el-button :loading="loading" style="width:100%;height:40px;" @click="saveBlockSortHandle">
              <svg-icon :icon-class="'add'" />&nbsp;{{ t('btn.save') }}
            </el-button>
          </el-col>
        </el-row>
      </el-aside>
      <el-main style="height:calc(100vh - 125px);border:1px solid #dcdee2;">
        <div v-if="showBitName" class="right-container">
          <fieldset class="fieldset">
            <legend style="padding:0px 10px">
              BasicInfo
            </legend>
            <el-form :inline="true">
              <el-form-item label="blockCatory">
                <el-select
                  v-model="blockCatory2"
                  :disabled="isEdit"
                  :placeholder="t('tip.pleaseSelectType')"
                  clearable
                  filterable
                  class="el-select"
                  @change="getBitNameList">
                  <el-option v-for="(item,index) in blockCatoryList" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item label="blockName">
                <el-input v-model="blockName" :disabled="isEdit" />
              </el-form-item>
              <el-button :loading="loading" type="primary" @click="saveHandler">
                <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
              </el-button>
            </el-form>
          </fieldset>
          <table class="custom-table">
            <thead>
              <tr>
                <th width="70px">#</th>
                <th>BitName</th>
                <th>Sort</th>
                <th>Event</th>
                <th width="180px">{{ t('column.operate') }}</th>
              </tr>
            </thead>
            <draggable v-model="showDataList" element="tbody" @update="bitNameDatadragEnd">
              <tr v-for="(item,index) in showDataList" :key="index">
                <td align="center">{{ item.sort }}</td>
                <td align="center" style="padding:4px 10px 4px 10px;">
                  <el-select v-model="item.bitName" placeholder="Please Select" clearable filterable>
                    <el-option
                      v-for="(item,index) in bitNameList"
                      :key="index"
                      :label="item.blockName"
                      :value="item.blockName" />
                  </el-select>
                </td>
                <td align="center">
                  <span>
                    {{ item.sort }}
                  </span>
                </td>
                <td align="center">
                  <el-radio-group v-model="item.event">
                    <el-radio label="Y">Y</el-radio>
                    <el-radio label="N">N</el-radio>
                  </el-radio-group>
                </td>
                <td align="center">
                  <el-button type="primary" icon="el-icon-upload2" @click="upHandler(item)"/>
                  <el-button type="primary" icon="el-icon-download" @click="downHandler(item)"/>
                  <el-button type="danger" icon="el-icon-delete" @click="deleteHandler(item)"/>
                </td>
              </tr>
            </draggable>
          </table>
          <div class="card-footer">
            <el-button :loading="loading" type="success" @click="addBitName">
              <svg-icon :icon-class="'add'" />&nbsp;1
            </el-button>
          </div>
        </div>
        <NoData v-else/>
      </el-main>
    </el-container>
    <div v-if="showNextBtn" class="card-footer">
      <el-button type="primary" @click="nextHandler('back')">{{ t('btn.back') }}</el-button>
      <el-button type="primary" @click="nextHandler('next')">{{ t('btn.next') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getBitList, saveBit, deleteBitByObject } from '@/api/plcConfig/bit'
import { getBitNameList, updatePlcMapBitBlockSort } from '@/api/plcConfig/block'
import { getLineList } from '@/api/eqpmodel/line'
import { blockCatoryList } from '@/config/dropdown'
import NoData from '@/components/Nodata'
import draggable from 'vuedraggable'
import { shopList } from '@/config'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'BitEdit',
  components: {
    draggable,
    NoData
  },
  props: {
    detailData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      data: [],
      shop: '',
      lineId: '',
      bitList: [],
      blockName: '',
      treeList: [],
      blockSort: 0,
      dataList: [],
      bitNameList: [],
      version: '',
      isEdit: false,
      update: false,
      showNextBtn: false,
      shopList: shopList,
      lineList: [],
      allLineList: [],
      loading: false,
      isDisabled: false,
      showDataList: [],
      BlockNameList: [],
      showBitName: false,
      blockCatory1: '',
      blockCatory2: '',
      blockCatoryList: blockCatoryList
    }
  },
  created() {
    this.getLineList()
  },
  mounted() {
    this.$nextTick(() => {
      if (this.detailData.isShowBtn) {
        this.showNextBtn = this.detailData.isShowBtn
        this.shop = this.detailData.row.shopName
        this.lineId = this.detailData.row.lineId
        this.version = this.detailData.row.version
        this.isDisabled = this.detailData.shopLine
        this.update = true
        this.getBitList()
      }
    })
  },
  methods: {
    t,
    getBitListHandler() {
      if (this.shop && this.lineId) {
        this.getBitList()
      }
    },
    getLineListHandler() {
      this.lineId = ''
      this.lineList = this.allLineList.filter(({
        shopName
      }) => {
        return this.shop === shopName
      })
    },
    getLineList() {
      return getLineList({
        condition: {},
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.allLineList = res.body.rows
      })
    },
    getBitNameList() {
      return getBitNameList({
        shopName: this.shop,
        lineId: this.lineId,
        blockCatory: this.blockCatory2,
        version: this.version,
        update: this.update
      }).then(res => {
        this.bitNameList = res.body
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    nextHandler(type) {
      if (type === 'next') {
        this.$emit('successEvent', 'eqpInterface', this.dataList)
      } else {
        this.$emit('successEvent', 'wordEdit')
      }
    },
    getBitList() {
      return getBitList({
        shopName: this.shop,
        lineId: this.lineId,
        blockCatory: this.blockCatory1,
        update: this.update
      }).then(res => {
        this.loading = false
        this.dataList = res.body
        this.BlockNameList = res.body
        if (this.dataList.length > 0) {
          this.version = this.dataList[0].version
        }
        if (this.blockName) {
          this.getBitData(this.blockName)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    getBitData(blockName) {
      let list = []
      this.showDataList = []
      this.dataList.forEach(curr => {
        if (curr.blockName === blockName) {
          list = this.$lodash.slice(curr.list)
          this.blockCatory2 = curr.blockCatory
          this.blockSort = curr.sort
        }
      })
      this.blockName = blockName
      this.showBitName = true
      this.isEdit = true
      this.bitList = this.$lodash.slice(list)
      this.showDataList = this.$lodash.slice(list)
      this.getBitNameList()
    },
    addBitName() {
      this.showBitName = true
      this.showDataList.push({
        blockName: this.blockName,
        bitName: '',
        sort: this.showDataList.length,
        event: 'N',
        dataType: 'BIT',
        version: this.version
      })
      this.bitList = this.$lodash.slice(this.showDataList)
    },
    addBlockName() {
      this.blockCatory2 = ''
      this.blockName = ''
      this.isEdit = false
      this.showBitName = true
      this.showDataList = []
      this.getBitNameList()
    },
    saveHandler() {
      if (this.showDataList.length !== 0) {
        this.loading = true
        return saveBit({
          update: this.update,
          version: this.version,
          lineId: this.lineId,
          shopName: this.shop,
          blockName: this.blockName,
          sort: this.blockSort,
          blockCatory: this.blockCatory2,
          list: this.showDataList
        }).then(res => {
          notice.success(this.t('tip.saveSuccess'), () => {
            this.loading = false
            this.getBitList()
          })
        }).catch(() => {
          this.loading = false
        })
      } else {
        notice.error('Please Fill in the Data!')
      }
    },
    saveBlockSortHandle() {
      return updatePlcMapBitBlockSort({
        update: this.update,
        shopName: this.shop,
        lineId: this.lineId,
        version: this.version,
        list: this.dataList
      }).then(res => {
        notice.success(this.t('tip.saveSuccess'), () => {
          this.getBitList()
        })
      }).catch(err => {
        notice.error(err)
      })
    },
    bitNameDatadragEnd(evt) {
      this.showDataList = this.datadrag(evt, this.bitList, this.showDataList)
      this.bitList = this.$lodash.slice(this.showDataList)
    },
    blockNameDatadragEnd(evt) {
      this.dataList = this.datadrag(evt, this.BlockNameList, this.dataList)
      this.BlockNameList = this.$lodash.slice(this.dataList)
    },
    datadrag(evt, tempArr, targetArr) {
      let list = []
      const newIndex = evt.newIndex
      const oldIndex = evt.oldIndex
      if (newIndex < oldIndex) {
        if (newIndex !== 0) {
          for (let i = 0; i < newIndex; i++) {
            list.push(tempArr[i])
          }
          list.push(tempArr[oldIndex])
          for (let i = newIndex; i < tempArr.length; i++) {
            if (i !== oldIndex) {
              list.push(tempArr[i])
            }
          }
        } else {
          list.push(tempArr[oldIndex])
          for (let i = 0; i < tempArr.length; i++) {
            if (i !== oldIndex) {
              list.push(tempArr[i])
            }
          }
        }
      } else if (oldIndex < newIndex) {
        for (let i = 0; i <= newIndex; i++) {
          if (i !== oldIndex) {
            list.push(tempArr[i])
          }
        }
        list.push(tempArr[oldIndex])
        for (let i = newIndex + 1; i < tempArr.length; i++) {
          list.push(tempArr[i])
        }
      } else {
        list = this.$lodash.slice(tempArr)
      }
      targetArr = this.$lodash.slice(list)
      for (let i = 0; i < targetArr.length; i++) {
        targetArr[i].sort = i
      }
      return this.$lodash.slice(targetArr)
    },
    deleteHandler(curr) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        if (curr.objectId) {
          curr.update = this.update
          return deleteBitByObject(curr).then(res => {
            this.loading = false
            this.bitList.splice(curr.sort, 1)
            this.showDataList = this.$lodash.slice(this.bitList)
            this.getBitList()
            this.getBitNameList()
            notice.success(this.t('tip.removeSuccess'), () => {
              for (let i = 0; i < this.bitList.length; i++) {
                this.bitList[i].sort = i
              }
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          notice.success(this.t('tip.removeSuccess'), () => {
            for (let i = 0; i < this.bitList.length; i++) {
              this.bitList[i].sort = i
            }
            this.loading = false
            this.bitList.splice(curr.sort, 1)
            this.showDataList = this.$lodash.slice(this.bitList)
          })
        }
      })
    },
    upHandler(curr) {
      const upCurr = this.showDataList[curr.sort - 1]
      this.showDataList[curr.sort - 1] = curr
      this.showDataList[curr.sort] = upCurr
      for (let i = 0; i < this.showDataList.length; i++) {
        this.showDataList[i].sort = i
      }
      this.bitList = this.$lodash.slice(this.showDataList)
    },
    downHandler(curr) {
      const upCurr = this.showDataList[curr.sort + 1]
      this.showDataList[curr.sort + 1] = curr
      this.showDataList[curr.sort] = upCurr
      for (let i = 0; i < this.showDataList.length; i++) {
        this.showDataList[i].sort = i
      }
      this.bitList = this.$lodash.slice(this.showDataList)
    }
  }
}

</script>
<style lang="scss" scoped>
  .fieldset {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ebeef5;
  }

  .custom-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #ebeef5;

    th {
      font-size: 14px;
      color: #606266;
      text-align: center;
      background-color: #f2f6fc !important;
    }

    th,
    td {
      height: 40px;
      border: 1px solid #ebeef5;
    }
  }

  .right-text {
    font-size: 50px;
    font-weight: bold
  }

  .el-select {
    width: 100%;
  }

  .message-item {
      display: inline-block;
      margin: 2px 0;
      overflow: hidden;
      width: 100%;
      font-size: 16px;
      height: 30px;
      padding: 5px 10px;
      border: 1px solid #e3e3e3;
      border-radius: 4px;
      text-overflow: ellipsis;

      &:hover {
        box-shadow: 0 0 2px 3px #409EFF;
        cursor: pointer;
      }
    }

</style>
