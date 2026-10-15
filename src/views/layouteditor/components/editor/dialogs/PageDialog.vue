<template>
  <dialog>
    <p :title="dialogTitle" class="page-dialog__title">{{ dialogTitle }}</p>
    <div class="page-dialog__content">
      <el-input
        v-model="name"
        :class="{'is-error': nameError}"
        placeholder="名称"
        class="page-dialog__input"
        @input="checkName"/>
      <p v-if="nameError" class="dialog-error">{{ nameError }}</p>

      <el-input
        v-model="path"
        :class="{'is-error': pathError}"
        placeholder="路径"
        class="page-dialog__input"
        @input="checkPath"/>
      <p v-if="pathError" class="dialog-error">{{ pathError }}</p>
    </div>
    <div class="page-dialog__actions">
      <el-button :disabled="!valid" type="primary" @click="savePageAndClose({id, name, path})">保存</el-button>
      <el-button @click="_togglePageDialog({isOpen: false, isNew: pageDialog.isNew})">取消</el-button>
    </div>
  </dialog>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import { pathInUse, nameInUse, savePageAndClose, _togglePageDialog } from '@/store/types'
import dialogPolyfill from 'dialog-polyfill/dist/dialog-polyfill'

export default {
  name: 'PageDialog',
  data: function() {
    return {
      valid: false,
      id: null,
      name: '',
      nameError: '',
      path: '',
      pathError: ''
    }
  },
  computed: {
    dialogTitle() {
      return this.pageDialog.isNew ? '新建页面' : '编辑：' + this.activePage.name
    },

    ...mapState({
      activePage: state => state.layoutEditor.selectedPage,
      pageDialog: state => state ? state.layoutEditor.pageDialog : { isNew: true, isOpen: false }
    }),

    ...mapGetters([pathInUse, nameInUse])
  },
  watch: {
    'pageDialog.isOpen': function(val) {
      const dialog = this.$el

      if (!val) {
        this.resetDialog()
        dialog.close()
      } else {
        if (!dialog.showModal) {
          dialogPolyfill.registerDialog(dialog)
        }
        dialog.showModal()

        if (!this.pageDialog.isNew) {
          this.setEditDialog(this.activePage)
        }
      }
    }
  },
  methods: {
    checkName() {
      if (!this.pageDialog.isNew && (this.name === this.activePage.name)) {
        this.nameError = ''
      } else if (!this.name) {
        this.nameError = '请为页面选择名称'
      } else if (!this.name.match(/[a-z]+/g)) {
        this.nameError = '名称中至少包含一个字母'
      } else if (this.nameInUse(this.name)) {
        this.nameError = '已存在同名页面'
      } else {
        this.nameError = ''
      }
      this.valid = (this.name && !this.nameError && this.path && !this.pathError)
    },

    checkPath() {
      if (!this.pageDialog.isNew && (this.path === this.activePage.path)) {
        this.pathError = ''
      } else if (!this.path) {
        this.pathError = '请选择页面路径'
      } else if (this.path[0] !== '/') {
        this.pathError = '路径必须以 / 开头'
      } else if (!this.path.match(/^\/([A-Za-z0-9/_-])+$/g)) {
        this.pathError = '路径无效'
      } else if (this.pathInUse(this.path)) {
        this.pathError = '该路径已存在'
      } else {
        this.pathError = ''
      }
      this.valid = (this.name && !this.nameError && this.path && !this.pathError)
    },

    resetDialog() {
      this.valid = false
      this.id = null
      this.name = ''
      this.nameError = ''
      this.path = ''
      this.pathError = ''
    },

    setEditDialog(activePage) {
      this.id = activePage.id
      this.name = activePage.name
      this.path = activePage.path
    },

    ...mapActions([savePageAndClose]),
    ...mapMutations([_togglePageDialog])
  }

}
</script>

<style scoped>
.page-dialog__title {
  font-size: 24px;
  font-weight: 500;
  padding: 24px 24px 0;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

.page-dialog__content {
  padding: 20px 24px 24px;
  color: rgba(0,0,0,.54);
}
.page-dialog__content .page-dialog__input{
  width: 100%;
}
.page-dialog__content .el-input.is-error >>> .el-input__inner {
  border-color: #f56c6c;
}
.dialog-error {
  margin: 4px 0 8px;
  font-size: 12px;
  color: #f56c6c;
  line-height: 1.2;
}

.page-dialog__actions {
  padding: 8px 8px 8px 24px;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
}
</style>
