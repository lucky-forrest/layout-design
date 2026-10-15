<template>
  <dialog>
    <p class="confirm-dialog__title">Do you want to delete "{{ project.title }}" ?</p>
    <div class="confirm-dialog__content">
      <p>
        If you do, all local changes will be lost!<br >
        ... although in reality you can undo it
      </p>
    </div>
    <div class="confirm-dialog__actions">
      <mdc-button class="confirm-dialog__delete-btn" unelevated @click="onConfirm">Delete</mdc-button>
      <mdc-button @click="closeDialog">Cancel</mdc-button>
    </div>
  </dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { clearProject } from '@/store/types'
import dialogPolyfill from 'dialog-polyfill/dist/dialog-polyfill'

export default {
  name: 'ConfirmDialog',
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

    onConfirm() {
      this.clearProject()
      this.closeDialog()
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
}
</style>
