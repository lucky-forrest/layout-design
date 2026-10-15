<template>
  <div v-loading="loading" class="app-container">
    <el-form ref="userForm" :model="userForm" :rules="rules" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="UserId" prop="userId">
            <el-input v-model="userForm.userId" :disabled="true" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="UserName" prop="userName">
            <el-input v-model="userForm.userName" :disabled="true" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Phone" prop="phone">
            <el-input v-model="userForm.phone" :placeholder="t('tip.pleaseInput')" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="E-Mail" prop="mail">
            <el-input v-model="userForm.mail" :placeholder="t('tip.pleaseInput')" type="email" clearable @keyup.enter.native="saveHandler('userForm')"/>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="Password" prop="password">
            <el-input v-model="userForm.password" placeholder="不修改密码可以忽略" type="password" minlength="6" maxlength="18" clearable @keyup.enter.native="saveHandler('userForm')"/>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="margin-top:10px;text-align:center;">
      <el-button :loading="loading" type="primary" @click="saveHandler('userForm')">
      <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}</el-button>
      <el-button type="primary" @click="cancelHandler">
      <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.cancel') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getLocalStorage, setLocalStorage } from '@/utils/auth'
import { updateUserInfo } from '@/api/user'
import { t } from '@/utils'
export default {
  name: 'ModifyPwd',
  data() {
    return {
      loading: false,
      storeUser: {},
      userForm: {
        userName: '',
        userId: '',
        sex: 'M',
        department: '',
        isEnable: 'Y',
        mail: '',
        phone: '',
        password: ''
      },
      rules: {
        mail: [
          { type: 'email', message: '电子邮件格式不正确！' }
        ],
        phone: [
          { pattern: /^1\d{10}$/, message: '电话号码格式不正确！' }
        ],
        password: [
          { pattern: /^[a-zA-Z]\w{5,17}$/, message: '格式错误(密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线)！' }
        ]
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.storeUser = JSON.parse(getLocalStorage('login.user'))
      const { objectId, userId, userName, phone, mail, sex, isEnable, department } = this.storeUser
      this.userForm = Object.assign({}, this.userForm, { objectId, userId, userName, phone, mail, sex, isEnable, department })
    })
  },
  methods: {
    t,
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          return updateUserInfo(this.userForm).then(res => {
            this.loading = false
            const { phone, mail } = this.userForm
            setLocalStorage('login.user', Object.assign({}, this.storeUser, { phone, mail }))
            this.$emit('successEvent', res.result.message)
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
