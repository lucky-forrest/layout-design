<template>
  <dialog>
    <p class="load-dialog__title">加载工程</p>
    <div class="load-dialog__content">
      <el-input
        v-model="owner"
        :class="{'is-error': ownerError}"
        placeholder="所有者"
        class="load-dialog__input"
        @input="checkOwner"/>
      <p v-if="ownerError" class="dialog-error">{{ ownerError }}</p>

      <el-input
        v-model="repo"
        :class="{'is-error': repoError}"
        placeholder="仓库"
        class="load-dialog__input"
        @input="checkRepo"/>
      <p v-if="repoError" class="dialog-error">{{ repoError }}</p>

      <p class="dialog-hint">当前版本读取的是本地已保存的工程草稿，远端仓库加载尚未接入。</p>
    </div>
    <div class="load-dialog__actions">
      <el-button :disabled="!valid" type="primary" @click="onLoad">加载</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { loadProject } from '@/store/types'
import notify from '@/views/layouteditor/components/mixins/notify'
import dialogPolyfill from 'dialog-polyfill/dist/dialog-polyfill'

export default {
  name: 'LoadDialog',
  mixins: [notify],
  data: function() {
    return {
      valid: false,
      owner: '',
      ownerError: '',
      repo: '',
      repoError: ''
    }
  },
  computed: {
    ...mapState({
      loggedUser: state => state.layoutEditor.oauth.authenticatedUser
    })
  },
  created: function() {
    this.$root.$on('open-load-dialog', this.openDialog)
  },
  beforeDestroy: function() {
    this.$root.$off('open-load-dialog', this.openDialog)
  },
  methods: {
    checkOwner() {
      if (!this.owner) {
        this.ownerError = '请输入仓库所有者的用户名'
      } else if (!this.owner.match(/^[a-z0-9]([a-z0-9-]*){0,38}$/i)) {
        this.ownerError = '用户名无效'
      } else {
        this.ownerError = ''
      }
      this.valid = (this.owner && !this.ownerError && this.repo && !this.repoError)
    },

    checkRepo() {
      if (!this.repo) {
        this.repoError = '请输入要加载的仓库名称'
      } else if (!this.repo.match(/^[a-z0-9-]+$/i)) {
        this.repoError = '仓库名称无效'
      } else {
        this.repoError = ''
      }
      this.valid = (this.owner && !this.ownerError && this.repo && !this.repoError)
    },

    openDialog() {
      if (!this.$el.showModal) {
        dialogPolyfill.registerDialog(this.$el)
      }

      this.owner = this.loggedUser ? this.loggedUser.login : ''
      this.$el.showModal()
    },

    async onLoad() {
      const result = await this.loadProject({
        origin: 'github',
        userName: this.owner,
        repoName: this.repo
      })
      this.closeDialog()

      if (result && result.ok) {
        this.notifySuccess('已加载工程《' + result.title + '》')
      } else if (result && result.empty) {
        this.notifyWarning('本地还没有保存过的工程草稿')
      } else {
        this.notifyError((result && result.error) || '工程加载失败')
      }
    },

    resetDialog() {
      this.isValid = false
      this.owner = ''
      this.ownerError = ''
      this.repo = ''
      this.repoError = ''
    },

    closeDialog() {
      this.resetDialog()
      this.$el.close()
    },

    ...mapActions([loadProject])
  }
}
</script>

<style scoped>
.load-dialog__title {
  font-size: 24px;
  font-weight: 500;
  padding: 24px 24px 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.load-dialog__content {
  padding: 20px 24px 24px;
  color: rgba(0,0,0,.54);
}
.load-dialog__content .load-dialog__input{
  width: 100%;
}
.load-dialog__content .el-input.is-error >>> .el-input__inner {
  border-color: #f56c6c;
}
.dialog-error {
  margin: 4px 0 8px;
  font-size: 12px;
  color: #f56c6c;
  line-height: 1.2;
}

.dialog-hint {
  margin: 4px 0 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, .38);
  line-height: 1.4;
}

.load-dialog__actions {
  padding: 8px 8px 8px 24px;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
}
</style>
