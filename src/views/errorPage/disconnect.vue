<template>
  <div class="errPage-container">
    <el-row>
      <el-col :sm="12">
        <h1 class="text-jumbo">BC-Server</h1>
        <h3 class="text-jumbo text-ginormous">Disconnect!</h3>
        <h2>BC-Server连接已中断...</h2>
        <ul class="list-unstyled">
          <li>请检查BC-Server是否正常？</li>
          <li>
            您可以尝试 <el-button type="text" @click="gohome">返回首页</el-button> 或者<el-button type="text" @click="relogin">重新登录</el-button>
          </li>
        </ul>
      </el-col>
      <el-col :sm="12">
        <svg
          t="1530173114857"
          class="icon"
          style=""
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2996"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          width="400"
          height="400">
          <path
            :fill="animateColor"
            d="M866.994 966.217a57.27 57.27 0 0 1-57.052 57.564H214.121a57.27 57.27 0 0 1-57.052-57.637c0-31.817 25.6-57.563 57.052-57.563h595.968c31.451 0 56.978 25.746 56.978 57.563zM512.03 194.341a30.866 30.866 0 0 1-30.72-31.013V31.013C481.385 13.897 495.062 0 512.105 0c16.969 0 30.72 13.897 30.72 31.013V163.4a30.866 30.866 0 0 1-30.72 31.013z m-229.96 84.626a30.354 30.354 0 0 1-23.553-11.045l-84.114-101.376a31.232 31.232 0 0 1 3.803-43.666 30.354 30.354 0 0 1 43.155 3.803l84.114 101.376c10.971 13.166 9.29 32.695-3.657 43.667a30.427 30.427 0 0 1-19.749 7.314zM159.774 493.275a29.55 29.55 0 0 1-5.412-0.438l-128.951-23.04a31.013 31.013 0 0 1-24.869-35.84 30.72 30.72 0 0 1 35.548-25.235l128.95 23.04a31.013 31.013 0 0 1-5.266 61.587zM741.993 279.04a30.427 30.427 0 0 1-19.749-7.314 31.232 31.232 0 0 1-3.803-43.593l84.114-101.45a30.427 30.427 0 0 1 43.227-3.803c13.02 10.971 14.629 30.574 3.804 43.666l-84.115 101.45a30.354 30.354 0 0 1-23.552 11.044z m122.294 214.309a31.013 31.013 0 0 1-5.266-61.587l128.878-23.04a30.793 30.793 0 0 1 35.547 25.161c2.926 16.823-8.192 32.915-24.868 35.914l-128.951 23.04a29.477 29.477 0 0 1-5.34 0.438z m-98.084 55.808c0-144.823-113.81-262.144-254.172-262.144-140.434 0-254.171 117.394-254.171 262.144v297.325h508.343V549.157z"
            p-id="2997"/>
        </svg>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Disconnect',
  data() {
    return {
      animateColor: 'red'
    }
  },
  mounted() {
    setInterval(() => {
      this.animateColor = this.animateColor === 'red' ? 'yellow' : 'red'
    }, 500)
  },
  methods: {
    gohome() {
      this.$router.push({ path: '/' })
    },
    relogin() {
      this.$store.dispatch('LogOut').then(() => {
        window.location.reload()
      })
    }
  }
}
</script>

<style>
  #app {
    height: 100%;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 800px;
    margin: 100px auto;
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
        button>span{
          color: #1482f0;
          padding: 0 20px;
          font-weight: 700;
        }
      }
    }
  }
</style>
