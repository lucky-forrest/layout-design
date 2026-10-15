<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12" >
          <el-form-item label="Shop">
            <el-input v-model="shopName" :disabled="isEdit" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item label="LineId">
            <el-input v-model="lineId" :disabled="isEdit" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item label="ConstantsName">
            <el-input v-model="constantsName" :disabled="isEdit" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item label="BlockName">
            <el-input v-model="blockName" :disabled="isEdit" clearable/>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" >
          <el-form-item label="DefaultValue">
            <el-select v-show="isEdit" v-model="defaultValue" clearable filterable class="filter-item">
              <el-option v-for="(item,index) in list" :key="index" :label="item" :value="item"/>
            </el-select>
            <el-input v-show="!isEdit" v-model="defaultValue" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="constants" stripe border>
      <el-table-column :index="indexHandler" label="#" type="index" align="center"/>
      <el-table-column label="Key" min-width="150" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.dataKey" style="width: 200px" class="filter-item"/>
        </template>
      </el-table-column>
      <el-table-column label="Value" min-width="150" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.dataValue" style="width: 200px" class="filter-item"/>
        </template>
      </el-table-column>
      <el-table-column label="Descript" min-width="150" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.dataDesc" style="width: 200px" class="filter-item"/>
        </template>
      </el-table-column>
      <el-table-column :label="t('column.operate')" width="120" align="center">
        <template slot-scope="curr">
          <el-button v-authorize="'remove'" type="danger" icon="el-icon-delete" @click="delHandler(curr)">
            {{ t('btn.remove') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-button :loading="loading" type="success" @click="addHandler">
        <svg-icon :icon-class="'add'"/>&nbsp;1
      </el-button>
      <el-button :loading="loading" type="primary" @click="saveHandler">
        <svg-icon :icon-class="'save'"/>&nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="closeHandler">
        <svg-icon :icon-class="'cancel'"/>&nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { t } from '@/utils'
import notice from '@/utils/notice'
import { deleteConstants } from '@/api/plcConfig/constants'
export default {
  name: 'Add',
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
      isEdit: false,
      update: false,
      version: '',
      blockName: '',
      loading: false,
      constants: [],
      defaultValue: '',
      constantsName: '',
      shopName: '',
      lineId: '',
      list: []
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      console.log(this.detailData)
      this.lineId = this.detailData.lineId
      this.version = this.detailData.version
      this.shopName = this.detailData.shopName
      this.blockName = this.detailData.blockName
      this.defaultValue = this.detailData.defaultValue
      this.constantsName = this.detailData.constantsName
      this.constants = this.detailData.constants
      this.isEdit = !!this.detailData.objectId
      this.update = this.detailData.update
      this.list = this.$lodash.chain(this.constants)
        .map('dataValue')
        .uniq()
        .value()
    })
  },
  methods: {
    t,
    addHandler() {
      this.constants.push({ version: this.version, shopName: this.shopName, blockName: this.blockName, lineId: this.lineId, constantsName: this.constantsName, dataKey: this.constants.length + 1, dataValue: '', dataDesc: '' })
    },
    saveHandler() {
      const consition = {
        lineId: this.lineId,
        shopName: this.shopName,
        blockName: this.blockName,
        constantsName: this.constantsName,
        defaultValue: this.defaultValue,
        constants: this.constants,
        update: this.update
      }
      this.$emit('successEvent', consition)
    },
    closeHandler() {
      this.$emit('cancelEvent', 'add')
    },
    delHandler(curr) {
      notice.confirm(this.t('tip.confirmRemoveThisItem'), () => {
        if (curr.row.objectId) {
          curr.row.update = this.update
          return deleteConstants(curr.row).then(res => {
            notice.success(this.t('tip.removeSuccess'), () => {
              this.loading = false
              this.constants.splice(curr.$index, 1)
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          notice.success(this.t('tip.removeSuccess'), () => {
            this.loading = false
            this.constants.splice(curr.$index, 1)
          })
        }
      })
    },
    indexHandler(index) {
      return index + 1
    },
    updateExpandList(curr) {
      const list = []
      this.constants.splice(curr.$index, 1)
      if (curr.dataKey === 0) {
        list.push(curr.row)
        for (let i = 0; i < this.constants.length; i++) {
          this.constants[i].dataKey += 1
          list.push(this.constants[i])
        }
      } else {
        for (let i = 0; i < curr.row.dataKey; i++) {
          list.push(this.constants[i])
        }
        list.push(curr.row)
        for (let i = curr.row.dataKey; i < this.constants.length; i++) {
          this.constants[i].dataKey += 1
          list.push(this.constants[i])
        }
      }
      this.constants = this.$lodash.slice(list)
    }
  }
}
</script>
