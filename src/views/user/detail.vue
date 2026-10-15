<template>
  <div v-loading="loading" class="app-container">
    <el-form ref="userForm" :model="userForm" :rules="rules" label-width="120px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="UserId" prop="userId">
            <el-input v-model="userForm.userId" :disabled="isEdit" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="UserName" prop="userName">
            <el-input v-model="userForm.userName" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="Department" prop="department">
            <el-select v-model="userForm.department" :placeholder="t('tip.pleaseSelect')" filterable allow-create>
              <el-option v-for="(item, index) in departmentList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="E-Mail" prop="mail">
            <el-input v-model="userForm.mail" :placeholder="t('tip.pleaseInput')" type="email" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Phone" prop="phone">
            <el-input v-model="userForm.phone" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="SEX" prop="sex">
            <el-radio-group v-model="userForm.sex" :placeholder="t('tip.pleaseSelect')">
              <el-radio v-for="(item,index) in sexList" :key="index" :label="item.value">{{ item.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="IsEnable" prop="isEnable">
            <el-switch
              v-model="userForm.isEnable"
              active-value="Y"
              inactive-value="N"
              active-color="#13ce66"
              inactive-color="#ff4949" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler('userForm')">
      <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}</el-button>
      <el-button type="primary" @click="cancelHandler">
      <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}</el-button>
    </div>
  </div>
</template>
<script>
import { saveUser } from '@/api/user'
import { t } from '@/utils'
export default {
  name: 'UserDetail',
  components: {},
  props: {
    currUser: {
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
      sexList: [
        { value: 'F', label: '女' },
        { value: 'M', label: '男' }],
      departmentList: [],
      userForm: {
        userName: '',
        userId: '',
        sex: 'M',
        department: '',
        isEnable: 'Y',
        mail: '',
        phone: ''
      },
      rules: {
        mail: [
          { type: 'email', message: '电子邮件格式不正确！' }
        ],
        phone: [
          { pattern: /^1\d{10}$/, message: '电话号码格式不正确！' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.userForm = Object.assign({}, this.userForm, this.currUser)
      this.isEdit = !!this.userForm.objectId
    })
  },
  methods: {
    t,
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          return saveUser(this.userForm).then(res => {
            this.loading = false
            this.$emit('successEvent', 'userDetail', res)
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          return false
        }
      })
    },
    cancelHandler() {
      this.$emit('cancelEvent', 'userDetail')
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-select {
    width: 100%;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .fieldset {
    margin-bottom: 10px;
    border: 1px solid #dcdfe6;

    legend {
      font-weight: bold;
    }
  }
</style>
