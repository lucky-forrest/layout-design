<template>
  <div class="app-container">
    <el-form ref="interfaceForm" :model="interfaceForm" label-width="120px">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="Shop" prop="shopName">
            <el-select
              v-model="interfaceForm.shopName"
              :disabled="isEdit || update"
              :placeholder="t('tip.pleaseSelect')"
              clearable
              filterable
              class="el-input"
              @change="getLineListHandler"
            >
              <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="LineId" prop="lineId">
            <el-select
              v-model="interfaceForm.lineId"
              :disabled="isEdit || update"
              :placeholder="t('tip.pleaseSelect')"
              clearable
              filterable
              class="el-input"
              @change="getEquipmentListHandler"
            >
              <el-option v-for="(item,index) in lineList" :key="index" :label="item.lineId" :value="item.lineId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="EQP Name" prop="eqpName">
            <el-select
              v-model="interfaceForm.eqpName"
              :placeholder="t('tip.pleaseSelect')"
              clearable
              filterable
              class="el-input"
            >
              <el-option v-for="(item,index) in equipmentList" :key="index" :label="item.name" :value="item.name" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item
            :rules="[{required: true,message:t('tip.pleaseInput')}]"
            label="Inter Name"
            prop="eqpInterfaceName"
          >
            <el-input v-model="interfaceForm.eqpInterfaceName" disabled class="el-input" autofocus clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="From" prop="fromEqpNo">
            <el-select
              v-model="interfaceForm.fromEqpNo"
              :placeholder="t('tip.pleaseSelect')"
              clearable
              filterable
              class="el-input"
            >
              <el-option
                v-for="(item,index) in equipmentList"
                :key="index"
                :label="item.equipmentNo"
                :value="item.equipmentNo"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="To" prop="toEqpNo">
            <el-select
              v-model="interfaceForm.toEqpNo"
              :placeholder="t('tip.pleaseSelect')"
              clearable
              filterable
              class="el-input"
            >
              <el-option
                v-for="(item,index) in equipmentList"
                :key="index"
                :label="item.equipmentNo"
                :value="item.equipmentNo"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <fieldset class="fieldset">
        <legend class="word" style="padding:0px 10px">Self Equipment</legend>
        <el-row :gutter="20" class="el-row">
          <el-col :xs="24" :md="12">
            <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="Path No" prop="selfEqpPathNo">
              <el-input
                v-model="interfaceForm.selfEqpPathNo"
                :placeholder="t('tip.pleaseInput')"
                class="el-input"
                autofocus
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Event Report"
              prop="selfEqpEventRpt"
            >
              <el-select
                v-model="interfaceForm.selfEqpEventRpt"
                :placeholder="t('tip.pleaseSelect')"
                clearable
                filterable
                class="el-input"
              >
                <el-option
                  v-for="(item,index) in (allList.find(({ type }) => type === 'selfEqpEventReport')||{}).list || []"
                  :key="index"
                  :label="item.itemName"
                  :value="item.startAddress"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Bit Start"
              prop="selfEqpBitNoStart"
            >
              <el-select
                v-model="interfaceForm.selfEqpBitNoStart"
                :placeholder="t('tip.pleaseSelect')"
                clearable
                filterable
                class="el-input"
              >
                <el-option
                  v-for="(item,index) in (allList.find(({ type }) => type === 'selfEqpBit')||{}).list || []"
                  :key="index"
                  :label="item.itemName"
                  :value="item.startAddress"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Bit End"
              prop="selfEqpBitNoEnd"
            >
              <el-input v-model="interfaceForm.selfEqpBitNoEnd" disabled class="el-input" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="Job Data Start" prop="selfEqpJobDataStart">
              <el-select
                v-model="interfaceForm.selfEqpJobDataStart"
                :placeholder="t('tip.pleaseSelect')"
                clearable
                filterable
                class="el-input"
              >
                <el-option
                  v-for="(item,index) in (allList.find(({ type }) => type === 'selfEqpWord')||{}).list || []"
                  :key="index"
                  :label="item.itemName"
                  :value="item.startAddress"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="Job Data End" prop="selfEqpJobDataEnd">
              <el-input v-model="interfaceForm.selfEqpJobDataEnd" disabled class="el-input" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
      <fieldset class="fieldset">
        <legend class="word" style="padding:0px 10px">Other Equipment</legend>
        <el-row :gutter="20" class="el-row">
          <el-col :xs="24" :md="12">
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Path No"
              prop="otherEqpPathNo"
            >
              <el-input
                v-model="interfaceForm.otherEqpPathNo"
                :placeholder="t('tip.pleaseInput')"
                class="el-input"
                autofocus
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="Event Report" prop="otherEqpEventRpt">
              <el-select
                v-model="interfaceForm.otherEqpEventRpt"
                :placeholder="t('tip.pleaseSelect')"
                clearable
                filterable
                class="el-input"
              >
                <el-option
                  v-for="(item,index) in (allList.find(({ type }) => type === 'otherEqpEventReport')||{}).list || []"
                  :key="index"
                  :label="item.itemName"
                  :value="item.startAddress"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Bit Start"
              prop="otherEqpBitNoStart"
            >
              <el-select
                v-model="interfaceForm.otherEqpBitNoStart"
                :placeholder="t('tip.pleaseSelect')"
                clearable
                filterable
                class="el-input"
              >
                <el-option
                  v-for="(item,index) in (allList.find(({ type }) => type === 'otherEqpBit')||{}).list || []"
                  :key="index"
                  :label="item.itemName"
                  :value="item.startAddress"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item
              :rules="[{required: true,message:t('tip.pleaseInput')}]"
              label="Bit End"
              prop="otherEqpBitNoEnd"
            >
              <el-input v-model="interfaceForm.otherEqpBitNoEnd" disabled class="el-input" clearable />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="Job Data Start" prop="otherEqpJobDataStart">
              <el-select
                v-model="interfaceForm.otherEqpJobDataStart"
                :placeholder="t('tip.pleaseSelect')"
                clearable
                filterable
                class="el-input"
              >
                <el-option
                  v-for="(item,index) in (allList.find(({ type }) => type === 'otherEqpWord')||{}).list || []"
                  :key="index"
                  :label="item.itemName"
                  :value="item.startAddress"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :md="12">
            <el-form-item label="Job Data End" prop="otherEqpJobDataEnd">
              <el-input v-model="interfaceForm.otherEqpJobDataEnd" disabled class="el-input" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </fieldset>
    </el-form>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler">
        <svg-icon :icon-class="'save'" />
        &nbsp;{{ t('btn.save') }}
      </el-button>
      <el-button :loading="loading" type="primary" @click="closeHandler">
        <svg-icon :icon-class="'cancel'" />
        &nbsp;{{ t('btn.close') }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { selectInterfaceAddress } from '@/api/plcConfig/eqpInterface'
import { getEquipmentList } from '@/api/eqpmodel/equipment'
import { getLineList } from '@/api/eqpmodel/line'
import { shopList } from '@/config'
import { t } from '@/utils'
export default {
  name: 'EqpInterfaceDetail',
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
      update: false,
      shopList: shopList,
      lineList: [],
      equipmentList: [],
      allList: [],
      interfaceForm: {
        shopName: '',
        lineId: '',
        eqpName: '',
        eqpInterfaceName: '',
        fromEqpNo: '',
        toEqpNo: '',
        selfEqpPathNo: '',
        selfEqpBitNoStart: '',
        selfEqpBitNoEnd: '',
        selfEqpJobDataStart: '',
        selfEqpJobDataEnd: '',
        selfEqpEventRpt: '',
        otherEqpPathNo: '',
        otherEqpBitNoStart: '',
        otherEqpBitNoEnd: '',
        otherEqpJobDataStart: '',
        otherEqpJobDataEnd: '',
        otherEqpEventRpt: ''
      }
    }
  },
  watch: {
    'interfaceForm.fromEqpNo'() {
      if (this.interfaceForm.fromEqpNo && this.interfaceForm.toEqpNo) {
        this.selectInterfaceAddress()
      }
    },
    'interfaceForm.toEqpNo'() {
      if (this.interfaceForm.fromEqpNo && this.interfaceForm.toEqpNo) {
        this.selectInterfaceAddress()
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      if (this.detailData.objectId) {
        this.interfaceForm = Object.assign(
          {},
          this.interfaceForm,
          this.detailData
        )
        if (this.interfaceForm.eqpInterfaceName) {
          this.isEdit = true
          this.getEquipmentListHandler()
        }
      } else if (!this.detailData.objectId && this.detailData.update) {
        this.update = this.detailData.update
        this.interfaceForm.shopName = this.detailData.shop
        this.interfaceForm.lineId = this.detailData.lineId
        this.getEquipmentList()
      }
    })
  },
  methods: {
    t,
    selectInterfaceAddress() {
      return selectInterfaceAddress({
        shopName: this.interfaceForm.shopName,
        lineId: this.interfaceForm.lineId,
        fromEqpNo: this.interfaceForm.fromEqpNo,
        toEqpNo: this.interfaceForm.toEqpNo
      }).then(res => {
        this.allList = res.body || []
      })
    },
    getLineListHandler() {
      this.interfaceForm.lineId = ''
      this.interfaceForm.eqpName = ''
      this.interfaceForm.fromEqpNo = ''
      this.interfaceForm.toEqpNo = ''
      this.loading = true
      return getLineList({
        condition: {
          shopName: this.interfaceForm.shopName
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      })
        .then(res => {
          this.lineList = res.body.rows
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    getEquipmentListHandler() {
      if (!this.isEdit) {
        this.interfaceForm.eqpName = ''
        this.interfaceForm.fromEqpNo = ''
        this.interfaceForm.toEqpNo = ''
      }
      this.getEquipmentList()
    },
    getEquipmentList() {
      this.loading = true
      return getEquipmentList({
        condition: {
          lineId: this.interfaceForm.lineId
        },
        pageNo: 1,
        pageSize: Number.MAX_VALUE
      })
        .then(res => {
          this.equipmentList = res.body.rows
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    saveHandler() {
      this.$refs['interfaceForm'].validate(valid => {
        if (valid) {
          this.interfaceForm.update = this.update
          this.$emit('successEvent', this.interfaceForm)
        }
      })
    },
    closeHandler() {
      this.$emit('cancelEvent')
    }
  }
}
</script>
<style lang="scss" scoped>
.fieldset {
  margin-bottom: 10px;
  min-width: 100px;
  height: 100%;
  border: 1px solid #e3e3e3;
  border-radius: 5px;

  legend {
    font-weight: bold;
    margin-left: 20px;
  }
}
.el-row {
  margin: 5px;
  width: calc(100% - 10px);
}
.el-input,
.el-input-number {
  width: 100%;
  margin: 0 5px;
}

</style>
