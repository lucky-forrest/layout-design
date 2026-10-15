<template>
  <div class="app-container monitorListPage">
    <el-card body-style="padding:10px;">
      <div slot="header">
        <el-form :inline="true">
          <el-form-item>
            <el-input v-model="filterText" placeholder="By Name Filter" clearable>
              <span slot="append">Filter</span>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-table v-mousewheelX="'is-scroll-left'" :data="boundleList.filter(item => { return !item.isHidden})" border @cell-click="getBundleInfo">
        <el-table-column type="index">#</el-table-column>
        <el-table-column min-width="300px" label="Name" prop="name">
          <template slot-scope="curr">
            <el-button type="text">{{ curr.row.name }}</el-button>
          </template>
        </el-table-column>
        <el-table-column min-width="100px" label="Version" prop="version" align="center"/>
        <el-table-column min-width="100px" label="Category" prop="category" align="center"/>
        <el-table-column min-width="100px" label="State" prop="state" align="center"/>
        <el-table-column :label="t('column.operate')" align="center" width="260px">
          <template slot-scope="curr">
            <el-tooltip v-if="curr.row.state === 'Resolved'" :open-delay="500" :content="t('btn.start')" placement="top" effect="light">
              <el-button type="primary" @click="operate('start',curr.row.id)">
                <svg-icon :icon-class="'start'"/>
              </el-button>
            </el-tooltip>
            <el-tooltip v-if="curr.row.state !== 'Resolved'" :open-delay="500" :content="t('btn.stop')" placement="top" effect="light">
              <el-button type="primary" @click="operate('stop',curr.row.id)">
                <svg-icon :icon-class="'stop'"/>
              </el-button>
            </el-tooltip>
            <el-tooltip :open-delay="500" :content="t('btn.refresh')" placement="top" effect="light">
              <el-button type="primary" @click="operate('refresh',curr.row.id)">
                <svg-icon :icon-class="'refresh'"/>
              </el-button>
            </el-tooltip>
            <el-tooltip :open-delay="500" :content="t('btn.update')" placement="top" effect="light">
              <el-button type="primary" icon="el-icon-edit" @click="operate('update',curr.row.id)"/>
            </el-tooltip>
            <el-tooltip :open-delay="500" :content="t('btn.remove')" placement="top" effect="light">
              <el-button type="primary" @click="operate('uninstall',curr.row.id)">
                <svg-icon :icon-class="'close'"/>
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible="showLoginForm"
      :before-close="closeLoginForm"
      width="400px"
      top="20vh">
      <login-verify :service-address="serviceAddress" @loginVerifySuccess="loginVerifySuccess" @loginVerifyError="loginVerifyError"/>
    </el-dialog>
    <el-dialog v-if="hasBundleInfo" :visible="showBundleForm" :before-close="closeBundelForm" width="80%" top="5vh" title="BoundleInfo">
      <el-card body-style="padding:10px">
        <div class="title">Status</div>
        {{ boundleInfo.status }}
      </el-card>
      <el-card body-style="padding:10px" style="margin-top:10px;">
        <div class="title">BaseInfo</div>
        <el-row
          v-for="(item,index) in $lodash.entries(boundleInfo.data[0]).filter(item => { return item[0] !== 'props'})"
          :gutter="20"
          :key="index">
          <el-col :span="5" class="propName">{{ item[0] }}</el-col>
          <el-col :span="19">{{ item[1] }}</el-col>
        </el-row>
      </el-card>
      <el-card body-style="padding:10px" style="margin-top:10px;">
        <div class="title">Props</div>
        <el-row
          v-for="(item,index) in $lodash.entries(boundleInfo.data[0]['props']).filter(item => { return item[1]['key'] === 'nfo'})"
          :gutter="20"
          :key="`n${index}`">
          <el-col :span="4" class="propName" v-html="item[1]['key']"/>
          <el-col :span="20">
            <el-row v-for="(nfo,nIndex) in $lodash.entries(item[1]['value'])" :gutter="20" :key="nIndex">
              <el-col :span="4" class="propName" v-html="nfo[0]"/>
              <el-col v-if="Array.isArray(nfo[1])" :span="20">
                <el-card v-for="(ccItem,ccIndex) in nfo[1]" :key="ccIndex" body-style="padding:10px;" style="margin-bottom:10px">
                  <!-- <div class="title">{{`Used Services ${ccIndex+1}`}}</div> -->
                  <el-row v-for="(uItem,uIndex) in $lodash.entries(ccItem)" :gutter="20" :key="uIndex">
                    <el-col :span="4" class="propName">{{ uItem[0] }}</el-col>
                    <el-col :span="20">{{ uItem[1] }}</el-col>
                  </el-row>
                </el-card>
              </el-col>
              <el-col v-else :span="20">
                {{ nfo[1] }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row
          v-for="(item,index) in $lodash.entries(boundleInfo.data[0]['props']).filter(item => { return item[1]['key'] !== 'nfo'})"
          :gutter="20"
          :key="`fn${index}`">
          <el-col :span="5" class="propName" v-html="item[1]['key']"/>
          <el-col v-if="Array.isArray(item[1]['value'])" :span="19">
            <div v-for="(prop,pIndex) in item[1]['value']" :key="pIndex">
              {{ `${pIndex+1}. ` }}
              <span v-html="prop"/>
            </div>
          </el-col>
          <el-col v-else :span="19">
            <span v-html="item[1]['value']"/>
          </el-col>
        </el-row>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import { getBundleList, operationBundle, getBundleInfo } from '@/api/dashboard'
import { setLocalStorage, getLocalStorage } from '@/utils/auth'
import LoginVerify from '@/views/login/components/LoginVerify'
import { t } from '@/utils'

export default {
  name: 'MonitorList',
  components: {
    LoginVerify
  },
  data() {
    return {
      showLoginForm: false,
      showBundleForm: false,
      loading: false,
      serviceAddress: '',
      lineId: '',
      filterText: '',
      boundleList: [],
      id: '',
      operation: '',
      userId: '',
      boundleInfo: {}
    }
  },
  computed: {
    hasBundleInfo() {
      return this.boundleInfo && Array.isArray(this.boundleInfo.data) && this.boundleInfo.data.length > 0
    }
  },
  watch: {
    filterText() {
      if (this.filterText) {
        this.boundleList.map(item => {
          item.isHidden = !item.name.toUpperCase().startsWith(this.filterText.toUpperCase())
          return item
        })
      } else {
        this.boundleList.map(item => {
          item.isHidden = false
          return item
        })
      }
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      const serviceAddress = (this.$route.params || {}).serviceAddress
      const lineId = (this.$route.params || {}).lineId
      if (serviceAddress) {
        setLocalStorage('cm.serviceAddress', serviceAddress)
      }
      if (lineId) {
        setLocalStorage('cm.lineId', lineId)
      }
      this.serviceAddress = serviceAddress || getLocalStorage('cm.serviceAddress')
      this.lineId = lineId || getLocalStorage('cm.lineId')
      setLocalStorage('cm.service', this.$route.params)
      this.getBundleList()
    })
  },
  methods: {
    t,
    getBundleList() {
      this.loading = true
      return getBundleList(this.serviceAddress, {
        lineName: this.lineId
      }).then(res => {
        this.loading = false
        this.boundleList = ((JSON.parse(res.body) || {}).data || []).filter(item => {
          return item.category === 'Glorysoft'
        })
      }).catch(() => {
        this.loading = false
      })
    },
    getBundleInfo(row, column) {
      if (column.property === 'name') {
        return getBundleInfo(this.serviceAddress, {
          lineId: this.lineId,
          id: row.id
        }).then(res => {
          this.showBundleForm = true
          this.boundleInfo = JSON.parse(res.body)
          console.log(this.boundleInfo)
        })
      }
    },
    closeBundelForm() {
      this.showBundleForm = false
    },
    operate(operate, id) {
      this.id = id
      this.operation = operate
      this.$store.dispatch('setEventHandler', 'operateBundleCommand').then(res => {
        this.showLoginForm = true
      })
    },
    closeLoginForm() {
      this.showLoginForm = false
    },
    loginVerifySuccess(eventHandler, res) {
      this.showLoginForm = false
      this.userId = res.body.userId
      switch (eventHandler) {
        case 'operateBundleCommand':
          this.operateBundleCommand()
          break
      }
    },
    loginVerifyError(error) {
      console.log(error)
      this.showLoginForm = false
    },
    operateBundleCommand() {
      return operationBundle(this.serviceAddress, this.userId, {
        id: this.id,
        lineId: this.lineId,
        operation: this.operation
      }).then(res => {
        this.getBundleList()
      })
    }
  }
}

</script>
<style lang="scss">
  .monitorListPage {
    .el-select,
    el-input {
      width: 140px;
    }
    .el-form-item {
      margin: 0;
    }
    .propName {
      text-align: right;
      font-weight: bold;
    }
  }

</style>
