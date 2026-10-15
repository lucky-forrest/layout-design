<template>
  <div class="app-container">
    <el-container>
      <el-aside width="300px" style="height:calc(100vh - 125px);border:1px solid #dcdee2;">
        <el-row>
          <el-col :sm="24" :md="24" style="padding:5px;20px;5px;20px;">
            <el-select
              v-model="shopName"
              :disabled="isDisabled"
              :placeholder="t('tip.pleaseSelectShop')"
              clearable
              filterable
              class="el-col"
              @change="getLineListHandler"
            >
              <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="24" style="padding:5px;20px;5px;20px;">
            <el-select
              v-model="lineId"
              :disabled="isDisabled"
              :placeholder="t('tip.pleaseSelectLineId')"
              clearable
              filterable
              class="el-col"
              @change="getWordBlockListHandler"
            >
              <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineId" :value="item.lineId" />
            </el-select>
          </el-col>
          <el-col :sm="24" :md="24" style="padding:5px;20px;5px;20px;">
            <el-input
              v-model="blockName"
              prefix-icon="el-icon-search"
              placeholder="search"
              clearable
              class="el-col"
              @keyup.enter.native="searchHandler"
            />
          </el-col>
          <el-col :sm="24" :md="24">
            <div class="box-container">
              <el-tree :data="showTreeList" :expand-on-click-node="true" class="el-tree" accordion>
                <span slot-scope="{ node, data }">
                  <span @click="getTreeList(data,node)">{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </el-col>
        </el-row>
      </el-aside>
      <el-main style="height:calc(100vh - 125px);border:1px solid #dcdee2;">
        <div v-if="showTreeTable" class="table">
          <table class="custom-table">
            <thead>
              <tr>
                <th width="70px">#</th>
                <th>ItemName</th>
                <th>Offset</th>
                <th>Point</th>
                <th>Type</th>
                <th width="180px">{{ t('column.operate') }}</th>
              </tr>
            </thead>
            <draggable v-model="dataList" element="tbody" @update="bitNameDatadragEnd">
              <tr v-for="(item,index) in dataList" :key="index">
                <td align="center">{{ item.sort }}</td>
                <td align="center" style="padding:4px;">
                  <el-input v-model="item.itemName" placeholder="Please Input!" clearable class="filter-item" />
                </td>
                <td align="center" style="width:120px">
                  <span>{{ item.offSet }}</span>
                </td>
                <td align="center" style="padding:4px;">
                  <el-input-number
                    :min="0"
                    :precision="0"
                    v-model="item.point"
                    clearable
                    controls-position="right"
                    placeholder="Please Input!"
                    style="width:100%;"
                  />
                </td>
                <td align="center" style="padding:4px;">
                  <el-select
                    :placeholder="t('tip.pleaseSelectType')"
                    v-model="item.dataType"
                    filterable
                    allow-create
                    class="filter-item"
                  >
                    <el-option
                      v-for="(item,index) in itemTypeList"
                      :label="item.label"
                      :value="item.value"
                      :key="index"
                    />
                  </el-select>
                </td>
                <td align="center" style="width:280px">
                  <el-button type="primary" icon="el-icon-upload2" @click="upHandler(item)"/>
                  <el-button type="primary" icon="el-icon-download" @click="downHandler(item)"/>
                  <el-button
                    v-authorize="'contains'"
                    :disabled="!item.itemName"
                    type="success"
                    @click="containsHandler(item)"
                  >
                    <svg-icon :icon-class="'contains'" />
                  </el-button>
                  <el-button
                    v-authorize="'remove'"
                    type="danger"
                    icon="el-icon-delete"
                    @click="deleteHandler(item)"
                  />
                </td>
              </tr>
            </draggable>
            <tfoot>
              <tr>
                <td colspan="6">
                  <div class="card-footer">
                    <el-form label-width="80px" style="width:250px;height:36px;float:left;">
                      <el-form-item label="Total">
                        <el-input-number
                          :min="0"
                          :precision="0"
                          v-model="totalPoints"
                          clearable
                          controls-position="right"
                        />
                      </el-form-item>
                    </el-form>
                    <span style="float:right;margin-right:10px;">
                      <el-button :loading="loading" type="success" @click="addHandler">
                        <svg-icon :icon-class="'add'" />&nbsp;1
                      </el-button>
                      <el-button :loading="loading" type="primary" @click="saveHandler(true)">
                        <svg-icon :icon-class="'save'" />
                        &nbsp;{{ t('btn.save') }}
                      </el-button>
                    </span>
                    <div style="clear:both;" />
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <NoData v-else/>
      </el-main>
    </el-container>
    <div v-if="showNextBtn" class="card-footer">
      <el-button type="primary" @click="nextHandler('back')">{{ t('btn.back') }}</el-button>
      <el-button type="primary" @click="nextHandler('next')">{{ t('btn.next') }}</el-button>
    </div>
    <el-dialog
      :visible.sync="showDetail"
      :fullscreen="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="600px"
      top="8vh"
      title="ContainsDetail"
      append-to-body
    >
      <el-form label-width="120px" style="margin-top:10px;">
        <el-form-item label="Description" prop="Description">
          <el-input v-model="description" :rows="5" type="textarea" />
        </el-form-item>
      </el-form>
      <div class="card-footer">
        <el-button :loading="loading" type="primary" @click="successHandler">
          <svg-icon :icon-class="'save'" />
          &nbsp;{{ t('btn.save') }}
        </el-button>
        <el-button :loading="loading" type="primary" @click="cancelHandler">
          <svg-icon :icon-class="'cancel'" />
          &nbsp;{{ t('btn.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getWordList, saveWord, removeWord } from '@/api/plcConfig/word'
import { itemTypeList, functionList } from '@/config/dropdown'
import { getWordBlockList } from '@/api/plcConfig/block'
import { getLineList } from '@/api/eqpmodel/line'
import NoData from '@/components/Nodata'
import { shopList } from '@/config'
import draggable from 'vuedraggable'
import notice from '@/utils/notice'
import { t } from '@/utils'

export default {
  name: 'WordEdit',
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
      blockData: {},
      lineId: '',
      shopName: '',
      version: '',
      blockList: [],
      treeList: [],
      dataList: [],
      wordList: [],
      currWord: '',
      targetObj: {},
      description: '',
      blockName: '',
      totalPoints: 0,
      shopList: shopList,
      lineList: [],
      allLineList: [],
      loading: false,
      showTreeTable: false,
      isDisabled: false,
      factoryName: '',
      showTreeList: [],
      showDetail: false,
      showNextBtn: false,
      update: false,
      functionType: functionList,
      itemTypeList: itemTypeList
    }
  },
  watch: {
    blockName() {
      if (this.shopName && this.lineId) {
        this.treeList = []
        this.getWordBlockList()
      }
    }
  },
  created() {
    this.getLineList()
  },
  mounted() {
    this.$nextTick(() => {
      if (this.detailData.isShowBtn) {
        this.showNextBtn = this.detailData.isShowBtn
        this.shopName = this.detailData.row.shopName
        this.update = true
        this.isDisabled = this.detailData.shopLine
        this.lineId = this.detailData.row.lineId
        this.version = this.detailData.row.version
        this.factoryName = this.detailData.row.factoryName
        this.getWordBlockList()
      }
    })
  },
  methods: {
    t,
    bitNameDatadragEnd(evt) {
      this.dataList = this.datadrag(evt, this.wordList, this.dataList)
      this.counterDataList()
      this.wordList = this.$lodash.slice(this.dataList)
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
    upHandler(curr) {
      const upCurr = this.dataList[curr.sort - 1]
      this.dataList[curr.sort - 1] = curr
      this.dataList[curr.sort] = upCurr
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i].sort = i
      }
      this.counterDataList()
      this.wordList = this.$lodash.slice(this.dataList)
    },
    downHandler(curr) {
      const downCurr = this.dataList[curr.sort + 1]
      this.dataList[curr.sort + 1] = curr
      this.dataList[curr.sort] = downCurr
      for (let i = 0; i < this.dataList.length; i++) {
        this.dataList[i].sort = i
      }
      this.counterDataList()
      this.wordList = this.$lodash.slice(this.dataList)
    },
    counterDataList() {
      let sort = 0
      this.dataList.forEach(item => {
        item.offSet = sort
        sort += item.point
      })
    },
    getLineListHandler() {
      this.lineId = ''
      this.lineList = this.allLineList.filter(({ shopName }) => {
        return this.shopName === shopName
      })
    },
    getWordBlockListHandler() {
      this.blockList = []
      this.getWordBlockList()
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
    nextHandler(type) {
      if (type === 'next') {
        this.$emit('successEvent', 'bitEdit', this.dataList)
      } else {
        this.$emit('successEvent', 'block')
      }
    },
    searchHandler() {
      this.treeList = []
      this.getWordList()
    },
    getWordBlockList() {
      this.loading = true
      return getWordBlockList({
        condition: {
          shopName: this.shopName,
          lineId: this.lineId,
          version: this.version,
          factoryName: this.factoryName,
          update: this.update
        }
      }).then(res => {
        this.blockList = res.body.rows
        this.loading = false
        let list = this.blockList
        this.showTreeList = []
        this.treeList = []
        if (this.blockName) {
          list = this.$lodash.slice(list).filter(curr => {
            return curr.blockName
              .toUpperCase()
              .includes(this.blockName.toUpperCase())
          })
        }
        this.functionType.forEach(type => {
          const tree = {
            label: type.value,
            type: 'functionType',
            children: []
          }
          const blockName = this.$lodash
            .chain(
              this.$lodash.slice(list).filter(curr => {
                return curr.functionType === type.value
              })
            )
            .map('blockName')
            .uniq()
            .value()
          blockName.forEach(name => {
            tree.children.push({
              label: name,
              type: 'blockName'
            })
          })
          this.treeList.push(tree)
        })
        this.showTreeList = this.$lodash.slice(this.treeList)
      }).catch(() => {
        this.loading = false
      })
    },
    getWordList() {
      return getWordList({
        shopName: this.blockData.shopName,
        lineId: this.blockData.lineId,
        update: this.update,
        blockName: this.blockData.blockName,
        version: this.blockData.version,
        blockObjectId: this.blockData.objectId,
        factoryName: this.blockData.factoryName
      }).then(res => {
        this.loading = false
        this.dataList = res.body
        this.wordList = this.$lodash.slice(this.dataList)
      }).catch(() => {
        this.loading = false
      })
    },
    getTreeList(data, node) {
      if (data.type === 'blockName') {
        this.showTreeTable = true
        const tree = this.$lodash.slice(this.blockList).filter(curr => {
          return (
            curr.blockName === data.label &&
            curr.functionType === node.parent.label
          )
        })
        this.blockData = tree[0]
        this.totalPoints = this.blockData.points
        this.getWordList()
      } else {
        this.showTreeTable = false
      }
    },
    containsHandler(row) {
      this.targetObj = row
      this.description = this.targetObj.description
      this.showDetail = true
    },
    deleteHandler(curr) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        if (curr.objectId) {
          curr.update = this.update
          return removeWord(curr).then(res => {
            this.loading = false
            this.dataList.splice(curr.sort, 1)
            this.wordList = this.$lodash.slice(this.dataList)
            this.getWordList()
            notice.success(this.t('tip.removeSuccess'), () => {
              for (let i = 0; i < this.wordList.length; i++) {
                this.wordList[i].sort = i
              }
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          notice.success(this.t('tip.removeSuccess'), () => {
            for (let i = 0; i < this.wordList.length; i++) {
              this.wordList[i].sort = i
            }
            this.loading = false
            this.dataList.splice(curr.sort, 1)
            this.wordList = this.$lodash.slice(this.dataList)
          })
        }
      })
    },
    addHandler() {
      const offSet =
        this.dataList.length === 0
          ? 0
          : this.dataList[this.dataList.length - 1].offSet +
            this.dataList[this.dataList.length - 1].point
      this.dataList.push({
        isSaveWord: true,
        shopName: this.blockData.shopName,
        lineId: this.blockData.lineId,
        functionType: this.blockData.functionType,
        factoryName: this.blockData.factoryName,
        version: this.blockData.version,
        blockName: this.blockData.blockName,
        blockObjectId: this.blockData.objectId,
        itemName: '',
        point: 0,
        dataType: '',
        offSet: offSet,
        sort: this.dataList.length
      })
    },
    successHandler() {
      this.dataList.forEach(item => {
        if (item.sort === this.targetObj.sort) {
          return Object.assign(item, { description: this.description })
        }
      })
      this.showDetail = false
    },
    cancelHandler() {
      this.showDetail = false
    },
    saveHandler(flag) {
      this.dataList.forEach(curr => {
        delete curr.isSaveWord
      })
      return saveWord({
        list: this.dataList,
        shopName: this.blockData.shopName,
        lineId: this.blockData.lineId,
        blockObjectId: this.blockData.objectId,
        factoryName: this.blockData.factoryName,
        version: this.blockData.version,
        update: this.update,
        totalPoints: this.totalPoints
      })
        .then(res => {
          if (flag) {
            notice.success(this.t('tip.saveSuccess'), () => {
              this.loading = false
              this.getWordList()
            })
          } else {
            this.loading = false
            this.getWordList()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    handleSuccess(word) {
      this.dataList.forEach(curr => {
        if (curr === this.currWord) {
          this.$set(curr, 'wordList', word)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box-container {
  padding: 10px;

  .el-tree {
    width: 100%;
    height: calc(100vh - 290px);
    overflow-y: auto;
  }
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

.table {
  height: 100%;
  padding: 5px 5px 5px 10px;
  overflow-y: auto;
}

.split {
  height: 100%;
  padding: 5px 5px;
}

.el-col {
  width: 100%;
}
</style>
