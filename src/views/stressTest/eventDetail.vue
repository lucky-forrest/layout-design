<template>
  <div v-loading="loading" class="app-container">
    <fieldset class="fieldset">
      <legend>{{ t('dialog.basicInformation') }}</legend>
      <el-form ref="eventForm" :model="eventForm" label-width="180px">
        <el-row :gutter="20">
          <el-col :sm="12">
            <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="EventName" prop="eventName">
              <el-input v-model="eventForm.eventName" :placeholder="t('tip.pleaseInput')" :disabled="isEdit" />
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="BlockName" prop="blockName">
              <el-input v-show="!showBlockSelect" v-model="eventForm.blockName" @focus="showBlockSelect=true"/>
              <el-select
                v-show="showBlockSelect"
                v-model="blockName"
                :placeholder="t('tip.pleaseSelect')"
                filterable
                default-first-option>
                <el-option
                  v-for="(item,index) in blockList"
                  :key="index"
                  :label="item.blockName"
                  :value="item.blockName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item
              label="TriggerCondition"
              prop="triggerCondition">
              <el-select
                v-model="eventForm.triggerCondition"
                :placeholder="t('tip.pleaseSelect')"
                filterable
                default-first-option
                clearable>
                <el-option v-for="item in eventList" :key="item.value" :label="item.eventName" :value="item.eventName" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="Timeout(ms)" prop="timeOut">
              <el-input-number v-model="eventForm.timeOut" clearable />
            </el-form-item>
          </el-col>
          <el-col :sm="12">
            <el-form-item label="RepeatReportByGlass" prop="repeatReportByGlass">
              <el-switch v-model="eventForm.repeatReportByGlass" active-color="#13ce66" inactive-color="#ff4949" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </fieldset>
    <el-table
      v-loading="loading"
      v-mousewheelX="'el-table__body-wrapper'"
      :data="eventForm.items"
      border
      fit
      highlight-current-row>
      <el-table-column label="#" type="index" width="60" align="center" />
      <el-table-column min-width="150" label="ItemName" prop="name" />
      <el-table-column min-width="100" label="Offset" prop="offset" align="center" />
      <el-table-column min-width="100" label="Point" prop="points" align="center" />
      <el-table-column min-width="100" label="Type" prop="type" align="center" />
      <el-table-column min-width="150" label="Value" prop="value" align="center">
        <template slot-scope="curr">
          <el-select
            v-show="curr.row.constantItems"
            v-model="curr.row.value"
            placeholder="Please select"
            clearable
            filterable
            style="width:100%" >
            <el-option
              v-for="(item,index) in curr.row.constantItems"
              :key="index"
              :label="`${item.key}:${item.description}`"
              :value="item.key" />
          </el-select>
          <el-input
            v-show="!curr.row.constantItems"
            v-model="curr.row.value"
            clearable
            style="width:100%" />
        </template>
      </el-table-column>
    </el-table>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler('eventForm')">
      <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}</el-button>
      <el-button type="primary" @click="cancelHandler">
      <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getEventList, getBlockList, saveEvent } from '@/api/stressTest/eventList'
import { t } from '@/utils'

export default {
  name: 'EventDetail',
  components: {},
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
      showBlockSelect: false,
      blockName: '',
      blockList: [],
      eventList: [],
      eventForm: {
        eventName: '',
        blockName: '',
        repeatReportByGlass: false,
        triggerCondition: '',
        eventGroup: '',
        groupNo: 0,
        timeOut: 40,
        items: []
      }
    }
  },
  watch: {
    blockName(currVal) {
      const itemList = (this.blockList.find(item => {
        return item.blockName === currVal
      }) || {}).items
      this.eventForm = Object.assign({}, this.eventForm, {
        items: itemList,
        blockName: currVal
      })
      console.log(this.eventForm)
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.getBlockList().then(() => {
        this.getEventList().then(() => {
          const itemList = (this.blockList.find(item => {
            return item.blockName === this.detailData.blockName
          }) || {}).items
          this.eventForm = Object.assign({}, this.eventForm, this.detailData)
          this.isEdit = !!this.eventForm.eventName
          this.eventForm.items.forEach(element => {
            element.constantItems = (itemList.find(item => {
              return item.name === element.name
            }) || {}).constantItems
          })
        })
      })
    })
  },
  methods: {
    t,
    getEventList() {
      this.loading = true
      return getEventList({}).then(res => {
        this.eventList = res.body
        this.loading = false
      }).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getBlockList() {
      this.loading = true
      return getBlockList({}).then(res => {
        this.blockList = res.body
        this.loading = false
      }).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          return saveEvent(this.eventForm).then(res => {
            this.$emit('successEvent', res)
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    cancelHandler() {
      this.$emit('cancelEvent', 'eventDetail')
    }
  }
}

</script>
<style lang="scss" scoped>
.app-container{
  padding:0;
  .el-select,
  .el-input,
  .el-input-number{
    width: 100%;
  }
  .fieldset {
    legend{
      padding:0 10px;
    }
    width: 100%;
    padding:0 10px;
    margin-bottom:10px;
    border:1px solid #EBEEF5;
  }
}
</style>
