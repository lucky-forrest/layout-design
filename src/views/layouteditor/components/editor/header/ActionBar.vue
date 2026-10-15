<template>
  <div class="action-bar__wrapper">
    <button v-if="isSyncing" :disabled="true" title="syncing" class="action-btn syncing">
      <svgicon icon="system/actions/sync" width="24" height="24" color="rgba(0,0,0,.38)"/>
    </button>
    <button v-tooltip="'Undo'" :disabled="!canUndo" class="action-btn" @click="$root.$emit('undo')">
      <svgicon
        :color="canUndo ? '#2b6a73' : 'rgba(0,0,0,.38)'"
        icon="system/actions/undo"
        width="24"
        height="24"/>
    </button>
    <button v-tooltip="'Redo'" :disabled="!canRedo" class="action-btn" @click="$root.$emit('redo')">
      <svgicon
        :color="canRedo ? '#2b6a73' : 'rgba(0,0,0,.38)'"
        icon="system/actions/redo"
        width="24"
        height="24"/>
    </button>
    <div class="separator"/>
    <button
      v-tooltip="'Clear project'"
      :disabled="isLoading"
      class="action-btn"
      @click="$root.$emit('open-confirm-dialog')">
      <svgicon icon="system/actions/delete" width="24" height="24" color="#2b6a73"/>
    </button>
    <mdc-menu-anchor>
      <button v-tooltip="'Open...'" :disabled="isLoading" class="action-btn" @click="showLoadFromMenu">
        <svgicon icon="system/actions/folder" width="24" height="24" color="#2b6a73"/>
      </button>
      <mdc-menu ref="loadFromMenu" @select="onSelectLoadFrom">
        <mdc-menu-item disabled>Open project:</mdc-menu-item>
        <mdc-menu-divider/>
        <mdc-menu-item>
          <input ref="inputOpenLocal" :value="fileValue" type="file" accept=".gg" @change="openLocalFile">
          Computer
        </mdc-menu-item>
      </mdc-menu>
    </mdc-menu-anchor>
    <mdc-menu-anchor>
      <button v-tooltip="'Download...'" :disabled="isLoading" class="action-btn" @click="showDownloadMenu">
        <svgicon icon="system/actions/download" width="24" height="24" color="#2b6a73"/>
      </button>
    </mdc-menu-anchor>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { downloadProject, loadVueggProject } from '@/store/types'
import '@/assets/design/icons/system/actions'

export default {
  name: 'ActionBar',
  data: function() {
    return {
      fileValue: null
    }
  },
  computed: {
    ...mapState({
      isLoading: state => state.layoutEditor.isLoading,
      isSyncing: state => state.layoutEditor.isSyncing,
      canUndo: state => state.layoutEditor.canUndo,
      canRedo: state => state.layoutEditor.canRedo
    })
  },
  methods: {
    showDownloadMenu() {
      this.downloadProject()
    },
    showLoadFromMenu() {
      this.fileValue = null
      this.$refs.inputOpenLocal.click()
    },
    onSelectLoadFrom(selected) {
      const PC = 1
      const GITHUB = 2

      switch (selected.index) {
        case GITHUB: this.$root.$emit('open-load-dialog'); break
        case PC:
          this.fileValue = null
          this.$refs.inputOpenLocal.click()
          break
      }
    },
    openLocalFile(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = e => this.loadVueggProject({ origin: 'pc', content: e.target.result })
      reader.readAsText(file)
    },
    ...mapActions([downloadProject, loadVueggProject])
  }
}
</script>

<style scoped>
.action-bar__wrapper {
  height: 100%;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-self: stretch;
  align-items: center;
  box-sizing: border-box;
}

.action-btn {
  height: 36px;
  width: 36px;
  min-width: 28px;
  min-height: 28px;
  padding: 1px;
  margin: 0 6px;
  border-radius: 100%;

  background-color: transparent;
  border: 0px none;
  user-select: none;
  outline: none;
}
.action-btn:hover {
  background-color: rgba(43, 106, 115, 0.038);
}
.action-btn:active {
  background-color: rgba(43, 106, 115, 0.38);
}
.action-btn * {
  vertical-align: middle;
}

.mdc-menu {
  background-color: #fff;
  transform-origin: right top 0 !important;
  top: 0px !important;
  right: 0px;
  left: auto !important;
}
.mdc-menu-item input {
  display: none;
}

.separator {
  width: 1px;
  height: 16px;
  margin: 0 6px;
  background-color: rgba(0, 0, 0, 0.12);
}

.syncing {
  animation:spin 1s linear infinite;
}
@keyframes spin { 100% { transform:rotate(360deg); }}

</style>
