<template>
  <div>
    <div class="navbar">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
      <div class="top-status">
        <div style="display:inline-block;width:1000px;">
          <span class="item-status">
            Server
            <el-button :style="{'background-color':isConnected? '#89CA18':'#C24648','border-color':isConnected?'#89CA18':'#C24648'}" type="info" style="width:130px" round>
              {{ isConnected ? 'CONNECTED' : 'DISCONNECTED' }}
            </el-button>
          </span>
          <span class="item-status">
            PLC Connect
            <el-button :style="{'background-color':plcConnect? '#89CA18':'#C24648','border-color':plcConnect?'#89CA18':'#C24648'}" type="info" style="width:130px" round @click="navbarHandler">
              {{ plcConnect ? 'CONNECTED' : 'DISCONNECTED' }}
            </el-button>
          </span>
        </div>
      </div>
      <div class="right-menu">
        <template v-if="device!=='mobile'">
          <el-tooltip :content="$t('navbar.screenfull')" effect="dark" placement="bottom">
            <screenfull class="screenfull right-menu-item"/>
          </el-tooltip>
          <lang-select class="international right-menu-item"/>
        </template>
        <div class="avatar-container">
          <el-dropdown trigger="click" @command="commandHandler">
            <div class="avatar-wrapper">
              <svg-icon :icon-class="'user'" class="user-avatar"/>
              {{ userName }}
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <el-dropdown-item disabled>
                <svg-icon :icon-class="'version'"/>
                {{ version }}
              </el-dropdown-item>
              <el-dropdown-item command="userInfo" divided>
                <span style="font-size:20px;"><svg-icon :icon-class="'user'"/></span>
                <span>UserInfo</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

    </div>
    <el-dialog
      v-el-drag-dialog
      :visible="showUserDetailForm"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="backHandler"
      width="400px"
      top="10vh"
      title="UserDetail">
      <modify-pwd v-if="showUserDetailForm" @successEvent="closeUserDetailForm" @cancelEvent="backHandler"/>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :visible="showPLCConnect"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="()=>showPLCConnect=false"
      width="700px"
      top="10vh"
      title="PLC Connect">
      <el-table v-if="showPLCConnect" :data="dataList" border>
        <el-table-column label="ConnectName" prop="connectionName" width="140" align="center"/>
        <el-table-column label="EQ/BC" prop="isEqSimulator" align="center">
          <template slot-scope="curr">
            {{ curr.row.isEqSimulator === '0' ? 'EQ' : 'BC' }}
          </template>
        </el-table-column>
        <el-table-column label="IP" prop="ip" align="center"/>
        <el-table-column label="Port" prop="port" align="center"/>
        <el-table-column label="DeviceType" prop="deviceType" width="140" align="center"/>
        <el-table-column :label="t('column.operate')" width="120" align="center" fixed="right">
          <template slot-scope="curr">
            <el-button
              v-authorize="'remove'"
              :loading="loading"
              type="danger"
              icon="el-icon-delete"
              @click="deleteHandler(curr.row)">
              {{ t('btn.remove') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getPLCAllConnections, stopPLCConnectionByName } from '@/api/layout'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import LangSelect from '@/components/LangSelect'
import ThemePicker from '@/components/ThemePicker'
import ModifyPwd from '@/views/user/modifyPwd'
import notice from '@/utils/notice'
import system from '@/config/app'
import { mapGetters } from 'vuex'
import { t } from '@/utils'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    SizeSelect,
    LangSelect,
    ThemePicker,
    ModifyPwd
  },
  directives: {
    elDragDialog
  },
  data() {
    return {
      version: system.version,
      loading: false,
      showUserDetailForm: false,
      showPLCConnect: false,
      currUser: {},
      dataList: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'sidebarOpened',
      'userName',
      'language',
      'isConnected',
      'plcConnect'
    ])
  },
  methods: {
    t,
    navbarHandler() {
      return getPLCAllConnections({}).then(res => {
        this.dataList = res.body
        this.showPLCConnect = true
      })
    },
    deleteHandler(row) {
      this.loading = true
      return stopPLCConnectionByName(row).then(res => {
        this.dataList = res.body
        this.$message({ message: 'Success', type: 'success' })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    commandHandler(command) {
      switch (command) {
        case 'userInfo':
          this.showUserDetailForm = true
          break
      }
    },
    closeUserDetailForm($event) {
      notice.success($event)
      this.showUserDetailForm = false
    },
    backHandler() {
      this.showUserDetailForm = false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    position: absolute;
    right: 0;
    height: 50px;
    background-color: #fff;
    &:focus{
     outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      vertical-align: top;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 20px;
    }
    .avatar-container {
      display: inline-block;
      height: 50px;
      overflow: hidden;;
      margin-right: 30px;
      .avatar-wrapper {
        .user-avatar {
          cursor: pointer;
          margin-top:8px;
          width: 30px;
          height: 30px;
          border-radius: 10px;
        }
      }
    }
  }
  .top-status{
  float: left;
  z-index: 0;
  height: 50px;
  width: calc(100% - 60px);
  overflow: hidden;
  .item-status{
    margin-left: 20px;
  }
  }
}
</style>
