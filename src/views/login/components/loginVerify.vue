<template>
  <div class="login-form">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginFormRules"
      auto-complete="on"
      label-position="left"
      label-width="0px"
      class="card-box login-form">
      <h3 class="title">{{ websiteTitle }}</h3>
      <el-form-item prop="userId">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
        <el-input v-model="loginForm.userId" name="userId" type="text" auto-complete="on" placeholder="userId"/>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="password"
          @keyup.enter.native="handleLogin"/>
        <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye"/></span>
      </el-form-item>
    </el-form>
    <el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
      Sign in
    </el-button>
  </div>
</template>
<script>
import { getLocalStorage } from '@/utils/auth'
import { isvalidUsername } from '@/utils/validate'
import { loginByUsername } from '@/api/user'
import { t } from '@/utils'
import system from '@/config/app'

export default {
  name: 'LoginVerify',
  props: {
    serviceAddress: {
      type: String,
      default() {
        return {}
      },
      validator(serviceAddress) {
        if (serviceAddress) {
          return true
        } else {
          console.error('serviceAddres is wrong !')
          return false
        }
      }
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error(this.t('tip.pleaseInput')))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error(this.t('tip.passwordMessage')))
      } else {
        callback()
      }
    }
    return {
      websiteTitle: system.title,
      loading: false,
      service: {},
      loginForm: {
        fabType: '',
        lineType: '',
        lineId: '',
        userId: '',
        password: ''
      },
      loginFormRules: {
        userId: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      pwdType: 'password'
    }
  },
  methods: {
    t,
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
        setTimeout(() => {
          this.pwdType = 'password'
        }, 1500)
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      const service = JSON.parse(getLocalStorage('cm.service'))
      console.log('service', service)
      if (service) {
        this.loginForm = Object.assign({}, this.loginForm, {
          fabType: service.fabType,
          lineType: service.lineType,
          lineId: service.lineId
        })
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          return loginByUsername(this.loginForm).then(res => {
            this.loading = false
            this.loginForm.userId = ''
            this.loginForm.password = ''
            if (this.$store.state.app.eventHandler) {
              this.$emit('loginVerifySuccess', this.$store.state.app.eventHandler, res)
            } else {
              this.$emit('loginVerifyError', '请设置EventHandler！')
            }
          }).catch(error => {
            this.loading = false
            this.$emit('loginVerifyError', error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
  .login-form {
    .el-form-item{
      margin:10px 0
    }
    .el-form-item__content {
      border: 1px solid #d8dce5;
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .svg-container {
      padding: 0 5px;
    }
    .el-input {
      width: 80%;
      input {
        border: none;
        padding: 0;
      }
    }
  }

</style>
