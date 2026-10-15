<template>
  <div>

    <el-row>
      <el-col :span="16" :offset="4">
        <el-form ref="commonForm" :model="commonForm" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12" >
              <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="Shop" prop="shopName">
                <el-select :disabled="!!detailData.objectId" v-model="commonForm.shopName" :placeholder="t('tip.pleaseSelectShop')" clearable @change="getLineTypeListByShop">
                  <el-option v-for="(item,index) in shopList" :key="index" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="LineType" prop="lineType">
                <el-select :disabled="!!detailData.objectId" v-model="commonForm.lineType" :placeholder="t('tip.pleaseSelect')" clearable @change="getEquipmentTypeList">
                  <el-option v-for="(item,index) in lineTypeList" :key="index" :label="item.lineTypeName" :value="item.lineTypeName"/>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12" >
              <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="EqpType" prop="equipmentType">
                <el-select :disabled="!!detailData.objectId" v-model="commonForm.equipmentType" :placeholder="t('tip.pleaseSelect')" clearable @change="getEquipmentNoList">
                  <el-option
                    v-for="(item,index) in eqpTypeList"
                    :key="index"
                    :label="item"
                    :value="item" />
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :span="12" >
              <el-form-item :rules="[{required: true,message:t('tip.pleaseSelect')}]" label="EqpNo" prop="equipmentNo">
                <el-select :disabled="!!detailData.objectId" v-model="commonForm.equipmentNo" :placeholder="t('tip.pleaseSelect')" clearable >
                  <el-option
                    v-for="(item,index) in equipmentList"
                    :key="index"
                    :label="item"
                    :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" >
              <el-form-item label="FileName">
                <el-tooltip :open-delay="500" :content="commonForm.fileName" placement="top">
                  <el-input v-model="commonForm.fileName" disabled class="filter-item"/>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="12" >
              <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="CurrVersion" prop="fileVersion">
                <el-input :disabled="!!detailData.objectId" v-model="commonForm.fileVersion" :placeholder="t('tip.exampleVer')" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="24" >
              <el-form-item
                :rules="[{required: true,message:t('tip.pleaseInput')}]"
                label="UpdateNotes"
                prop="fileDesc">
                <el-input v-model="commonForm.fileDesc" :rows="4" type="textarea"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="childHandler">
                <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}
              </el-button>
              <span style="color:red;">修改完成后，请点击“确认修改”按钮，保存修改，以防丢失！</span>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>

import { getLineTypeListByShop, getEquipmentTypeList, getEquipmentNoList } from '@/api/eqprofile'
import { autoGenerateFileName } from '@/api/eqprofile'
import notice from '@/utils/notice'
import { shopList } from '@/config'
import { t } from '@/utils'

export default {
  name: 'EqprofileCommonDetail',
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
      blockType: 'Common',
      commonForm: {
        shopName: '',
        lineType: '',
        equipmentType: '',
        equipmentNo: '',
        fileVersion: '',
        fileName: '',
        fileDesc: ''
      },
      equipmentList: [],
      emailGroup: [],
      shopList: shopList,
      lineTypeList: [],
      eqpTypeList: []
    }
  },
  created() {
    if (this.detailData.objectId) {
      this.readerData()
    }
  },
  methods: {
    t,
    getLineTypeListByShop() {
      if (this.commonForm.shopName !== '') {
        return getLineTypeListByShop({ shopName: this.commonForm.shopName }).then(res => {
          this.lineTypeList = res.body.rows
        })
      } else {
        this.commonForm.lineType = ''
        this.commonForm.equipmentType = ''
        this.commonForm.equipmentNo = ''
        this.lineTypeList = []
      }
    },
    getEquipmentTypeList() {
      if (this.commonForm.lineType !== '') {
        return getEquipmentTypeList({
          shopName: this.commonForm.shopName,
          lineType: this.commonForm.lineType
        }).then(res => {
          this.eqpTypeList = res.body
        })
      } else {
        this.commonForm.equipmentType = ''
        this.commonForm.equipmentNo = ''
        this.eqpTypeList = []
      }
    },
    getEquipmentNoList() {
      if (this.commonForm.equipmentType !== '') {
        return getEquipmentNoList({
          shopName: this.commonForm.shopName,
          lineType: this.commonForm.lineType
        }).then(res => {
          this.equipmentList = res.body
        })
      } else {
        this.commonForm.equipmentNo = ''
        this.equipmentList = []
      }
    },
    childHandler() {
      this.$refs['commonForm'].validate(valid => {
        if (valid) {
          if (this.detailData.objectId) {
            this.commonForm.blockType = this.blockType
            const childList = Object.assign({}, this.detailData, this.commonForm)
            this.$emit('childEvent', childList)
            this.$message({
              message: 'Success',
              type: 'success'
            })
          } else {
            return autoGenerateFileName(this.commonForm).then(res => {
              notice.success(this.t('tip.saveSuccess'), () => {
                this.commonForm.fileName = res.body.fileName
                const consition = res.body
                consition.blockType = this.blockType
                const childList = Object.assign({}, res.body, consition)
                this.$emit('childEvent', childList)
              })
            })
          }
        }
      })
    },
    readerData() {
      this.commonForm.shopName = this.detailData.shopName
      this.commonForm.lineType = this.detailData.lineType
      this.commonForm.equipmentType = this.detailData.equipmentType
      this.commonForm.fileName = this.detailData.fileName
      this.commonForm.fileVersion = this.detailData.fileVersion
      this.commonForm.equipmentNo = this.detailData.equipmentNo
    }
  }
}
</script>
<style scoped>
.div {
    position: relative;
    left: 750px;
    height: 40px;
    width: 100%;
  }
</style>
