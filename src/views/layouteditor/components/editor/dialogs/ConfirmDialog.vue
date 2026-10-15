<template>
  <dialog>
    <p class="confirm-dialog__title">确定要清空"{{ project.title }}"吗？</p>
    <div class="confirm-dialog__content">
      <p>
        页面与元件都会被移除，可用 Ctrl+Z 撤销。
      </p>
    </div>
    <div class="confirm-dialog__actions">
      <el-button class="confirm-dialog__delete-btn" type="danger" @click="onConfirm">清空</el-button>
      <el-button @click="closeDialog">取消</el-button>
    </div>
  </dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { clearProject } from '@/store/types'
import notify from '@/views/layouteditor/components/mixins/notify'
import dialogPolyfill from 'dialog-polyfill/dist/dialog-polyfill'

export default {
  name: 'ConfirmDialog',
  mixins: [notify],
  computed: {
    ...mapState({
      project: state => state.layoutEditor.project
    })
  },
  created: function() {
    this.$root.$on('open-confirm-dialog', this.openDialog)
  },
  beforeDestroy: function() {
    this.$root.$off('open-confirm-dialog', this.openDialog)
  },
  methods: {
    openDialog() {
      if (!this.$el.showModal) {
        dialogPolyfill.registerDialog(this.$el)
      }
      this.$el.showModal()
    },

    async onConfirm() {
      const result = await this.clearProject()
      this.closeDialog()
      if (result && result.ok === false) {
        this.notifyError(result.error)
      } else {
        this.notifySuccess('已清空项目，可用 Ctrl+Z 撤销')
      }
    },

    closeDialog() {
      this.$el.close()
    },

    ...mapActions([clearProject])
  }
}
</script>

<style scoped>
.confirm-dialog__title {
  font-size: 24px;
  font-weight: 500;
  padding: 24px 24px 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.confirm-dialog__content {
  padding: 20px 24px 24px;
  color: rgba(0,0,0,.54);
}
.confirm-dialog__content .confirm-dialog__input{
  width: 100%;
}

.confirm-dialog__actions {
  padding: 8px 8px 8px 24px;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
}

.confirm-dialog__delete-btn {
  background-color: #ea493f !important;
  border-color: #ea493f !important;
}
</style>
