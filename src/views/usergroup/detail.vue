<template>
  <div v-loading="loading" class="app-container group-container">
    <el-form ref="usergroupForm" :model="usergroupForm" label-width="120px">
      <el-form-item :rules="[{required: true,message:t('tip.pleaseInput')}]" label="GroupName" prop="groupId">
        <el-input v-model="usergroupForm.groupId" :disabled="isEdit" :placeholder="t('tip.pleaseInput')" clearable />
      </el-form-item>
      <el-form-item label="Description" prop="description">
        <el-input v-model="usergroupForm.description" type="textarea" rows="3" />
      </el-form-item>
      <el-form-item label="Grouping">
        <!-- <el-transfer
              v-model="reUserGroupList"
              :data="userList"
              :titles="['Exclude','Include']"
              :props="{key:'userId',label:'userName' }"
              filterable
              filter-placeholder="filter"
              class="process-data-name" /> -->
        <SelectUser
          :checked-type="'checkbox'"
          :data-list="dataList"
          :checked-list="checkedList"
          :props="{value:'userId',label:'userName',category:'department'}"
          style="padding:0;"
        />
      </el-form-item>
      <el-form-item>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span><svg-icon :icon-class="'authority'" />&nbsp;{{ t('dialog.authorityDetail') }}</span>
          </div>
          <authority :authority-list="usergroupForm.authorities" @updateEvent="updateAuthorityHandler($event)"/>
        </el-card>
      </el-form-item>
    </el-form>
    <div class="card-footer">
      <el-button :loading="loading" type="primary" @click="saveHandler('usergroupForm')">
      <svg-icon :icon-class="'save'" />&nbsp;{{ t('btn.save') }}</el-button>
      <el-button type="primary" @click="cancelHandler">
      <svg-icon :icon-class="'cancel'" />&nbsp;{{ t('btn.close') }}</el-button>
    </div>
  </div>
</template>
<script>
import { getUserList, getUserGroupInfo } from '@/api/user'
import { saveUserGroup } from '@/api/usergroup'
import gloryComponents from 'glory-components'
import notice from '@/utils/notice'
import Authority from './authority'
import { t } from '@/utils'
export default {
  name: 'UsergroupDetail',
  components: {
    Authority,
    ...gloryComponents
  },
  props: {
    groupInfo: {
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
      userList: [],
      reUserGroupList: [],
      authorityList: [],
      usergroupForm: {
        objectId: '',
        groupId: '',
        description: ''
      },
      departmentList: [],
      dataList: [],
      checkedList: []
    }
  },
  mounted() {
    this.$nextTick().then(() => {
      this.usergroupForm = Object.assign({}, this.usergroupForm, this.groupInfo)
      this.isEdit = !!this.usergroupForm.groupId
      this.getUserList().then(() => {
        if (this.usergroupForm.groupId) {
          this.getUserGroupInfo()
        }
      })
    })
  },
  methods: {
    t,
    getUserGroupInfo() {
      return getUserGroupInfo(this.groupInfo).then(res => {
        res.body.users.forEach(item => { this.reUserGroupList.push(item.userId) })
        this.authorityList = res.body.authorities
        this.usergroupForm = Object.assign({}, this.usergroupForm, res.body)
      })
    },
    getUserList() {
      this.loading = true
      return getUserList({}).then(res => {
        this.dataList = res.body.rows
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    getgroupuserList() {
      return getUserList({}).then(res => {
        res.body.rows.forEach(element => {
          this.reUserGroupList.push(element)
        })
      })
    },
    saveHandler(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const userList = this.reUserGroupList.reduce((userList, item) => {
            userList.push({ userId: item })
            return userList
          }, [])
          return saveUserGroup({
            objectId: this.usergroupForm.objectId,
            groupId: this.usergroupForm.groupId,
            description: this.usergroupForm.description,
            users: userList,
            authorities: this.authorityList
          }).then(res => {
            this.loading = false
            notice.success(this.t('tip.saveSuccess'), () => {
              this.$emit('successEvent', 'usergroupDetail', res)
            })
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
          return false
        }
      })
    },
    updateAuthorityHandler($event) {
      this.authorityList = $event.map(item => {
        Object.assign(item, { groupId: this.usergroupForm.groupId })
        return item
      })
    },
    cancelHandler() {
      this.$emit('cancelEvent', 'usergroupDetail')
    }
  }
}
</script>
<style lang="scss">
  .group-container {
    .el-select {
      width: 100%;
    }
    .el-transfer-panel {
      width: 260px !important;

      .el-transfer-panel__body {
        height: 300px !important;

        .el-checkbox-group {
          height: 252px !important;

          .el-checkbox {
            display: block;
          }
        }
      }
    }
    .el-card__header{
      padding:10px;
      background-color:#F5F7FA;
    }
  }
</style>
