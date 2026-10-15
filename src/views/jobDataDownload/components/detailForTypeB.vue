<template>
  <div>
    <el-form ref="oxrForm" label-width="150px" label-position="right">
      <el-row :gutter="10">
        <el-col>
          <el-form-item label="Total Count">
            <el-input v-model="totalCount" clearable>
              <el-button slot="append" icon="el-icon-check" style="margin: 1px -16px 0px -16px;" @click="setAllOXRInfoHandler">SetALL</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col
          v-for="(item,index) in dataList"
          :key="index"
          :sm="24"
          class="el-col-item">
          <el-form-item
            :label="item.label"
            :prop="item.value">
            <el-input v-model="item.value" clearable>
              <el-button slot="append" :disabled="item.value===''" icon="el-icon-check" style="margin: 1px -16px 0px -16px;" @click="setOXRInfoHandler(item.value,index)">Set</el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :sm="24">
          <el-form-item label="Choose Value">
            <el-radio-group v-model="radio">
              <el-radio label="0">0</el-radio>
              <el-radio label="1">1</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" style="text-align:right;">
          <el-button type="primary" @click="saveHandler">{{ t('btn.save') }}</el-button>
          <el-button type="primary" @click="cancelHandler">{{ t('btn.cancel') }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import { t } from '@/utils'
export default {
  name: 'DetailForTypeB',
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      totalCount: 1,
      radio: '0',
      dataList: []
    }
  },
  created() {
    this.setTargetList()
  },
  methods: {
    t,
    setTargetList() {
      this.dataList.splice(0, this.dataList.length)
      this.totalCount = (this.data.points === 0) ? 1 : this.data.points * 16
      const Num = Number.parseInt(`${this.totalCount / 10}`.split('.')[0], 10)
      let i = 0
      for (i; i < Num; i++) {
        this.dataList.push({
          label: `${i * 10 + 1} ~ ${(i + 1) * 10}`,
          value: this.$lodash.padEnd('', 10, '0')
        })
        if ((i + 1) === Num && (this.totalCount % 10) !== 0) {
          this.dataList.push({
            label: `${Num * 10 + 1} ~ ${this.totalCount}`,
            value: this.$lodash.padEnd('', this.totalCount % 10, '0')
          })
        }
      }
    },
    saveHandler() {
      let temp = ''
      temp = this.dataList.map(({ value }) => temp + value).join('')
      this.$emit('successEvent', temp)
    },
    cancelHandler() {
      this.$emit('cancelEvent')
    },
    setOXRInfoHandler(value, index) {
      this.dataList[index].value = this.$lodash.padEnd('', value.length, this.radio)
    },
    setAllOXRInfoHandler() {
      this.dataList.map(item => { Object.assign(item, { value: this.$lodash.padEnd('', item.value.length, this.radio) }) })
    }
  }
}
</script>
