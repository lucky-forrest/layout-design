<template>
  <div class="detail-container">
    <div class="filter-container">
      <el-row :gutter="20">
        <el-col :md="isEdit||(!constansType)?20:22">
          <el-select v-model="constansType" :disabled="isEdit" :placeholder="t('tip.pleaseSelectConstanstype')" clearable filterable class="filter-item" style="width:180px">
            <el-option v-for="(item,index) in constansTypeList" :key="index" :label="item.dataName" :value="item.dataName"/>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <el-table
      v-loading.body="loading"
      ref="constansTable"
      :data="showDataList"
      :default-sort="{prop:'createtime',order:'descending'}"
      stripe
      border>
      <el-table-column type="index" fixed>#</el-table-column>
      <el-table-column label="ItemName" prop="dataName">
        <template slot-scope="curr">
          <span v-if="!!curr.row.objectId">
            {{ curr.row.dataName }}
          </span>
          <el-input v-else v-model="curr.row.dataName" />
        </template>
      </el-table-column>
      <el-table-column label="ItemDesc" prop="dataDesc">
        <template slot-scope="curr">
          <el-input v-if="!curr.row.objectId||isEdit" v-model="curr.row.dataDesc" />
          <span v-else >
            {{ curr.row.dataDesc }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="!isEdit" width="141px" label="Actions" align="center" >
        <template slot-scope="curr">
          <el-button v-show="!curr.row.objectId" type="danger" icon="el-icon-delete" @click="removeHandler(curr.$index)"/>
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-button v-if="!isEdit" v-show="constansType" type="success" @click="addhandler">+1</el-button>
      <el-button :loading="loading" type="primary" @click="saveHandler()">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="closeHandler">
        <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { getDropDownList, saveDropDownInfo } from '@/api/eqpmodel/dropDown'
import notice from '@/utils/notice'
import { t } from '@/utils'
export default {
  name: 'ConstansDetail',
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
      loading: false,
      isEdit: false,
      detailInfo: {},
      constansType: '',
      constansTypeList: [{ dataName: 'Root' }],
      dataList: []
    }
  },
  computed: {
    showDataList() {
      return this.dataList.filter(({ dataType }) => { return dataType === this.constansType })
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.detailInfo = Object.assign({}, this.detailInfo, this.detailData)
      this.getDropDownList().then(() => {
        this.isEdit = !!this.detailInfo.objectId
        this.constansType = this.detailInfo.dataType
      })
    })
  },
  methods: {
    t,
    getDropDownList() {
      this.loading = true
      return getDropDownList({
        condition: {},
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      }).then(res => {
        this.dataList = res.body.rows
        this.constansTypeList = this.constansTypeList.concat(res.body.rows.filter(({ dataType }) => { return dataType === 'Root' }))
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    addhandler() {
      this.showDataList.push({
        createUser: this.$store.state.user.userName,
        dataDesc: '',
        dataName: '',
        dataType: this.constansType || 'Root',
        objectId: 0,
        sort: this.showDataList.length
      })
    },
    removeHandler(index) {
      this.showDataList.splice(index, 1)
    },
    saveHandler() {
      if (this.showDataList.length === 0) {
        notice.error('There are currently no changes!')
        return false
      } else {
        let errorTip = ''
        const tempItemNameList = []
        for (const [key, item] of Object.entries(this.showDataList)) {
          if (!item.dataName) {
            errorTip = `Row-${+key + 1} ItemName is required!`
            break
          }
          tempItemNameList.push(item.dataName)
          if (this.$lodash.groupBy(tempItemNameList)[item.dataName].length > 1) {
            errorTip = `Row-${+key + 1} ItemName [${item.dataName}] is existed!`
            break
          }
        }
        if (errorTip) {
          notice.error(errorTip)
          return false
        } else {
          const tempList = this.showDataList.filter(item => {
            if (this.isEdit) {
              return item.objectId > 0
            } else {
              return !item.objectId
            }
          })
          if (tempList.length > 0) {
            this.loading = true
            return saveDropDownInfo({
              actionType: this.isEdit ? 'Update' : 'Add',
              itemList: tempList
            }).then(res => {
              this.$emit('saveEvent')
            }).catch(() => {
              this.loading = false
            })
          } else {
            notice.error('There are currently no changes!')
          }
        }
      }
    },
    closeHandler() {
      this.$emit('cancelEvent')
    }
  }
}
</script>
<style lang="scss" scoped>
.el-select{
  width:100%;
}
</style>
