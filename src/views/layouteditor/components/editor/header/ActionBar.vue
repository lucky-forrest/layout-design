<template>
  <div class="action-bar__wrapper">
    <button
      v-tooltip="saveTooltip"
      :disabled="isLoading"
      class="action-btn"
      @click="saveHandler">
      <svgicon
        :color="hasChanges ? '#e6a23c' : '#2b6a73'"
        icon="system/actions/save"
        width="24"
        height="24"/>
    </button>
    <div class="separator"/>
    <button v-if="isSyncing" :disabled="true" title="同步中" class="action-btn syncing">
      <svgicon icon="system/actions/sync" width="24" height="24" color="rgba(0,0,0,.38)"/>
    </button>
    <button v-tooltip="'撤销'" :disabled="!canUndo" class="action-btn" @click="$root.$emit('undo')">
      <svgicon
        :color="canUndo ? '#2b6a73' : 'rgba(0,0,0,.38)'"
        icon="system/actions/undo"
        width="24"
        height="24"/>
    </button>
    <button v-tooltip="'重做'" :disabled="!canRedo" class="action-btn" @click="$root.$emit('redo')">
      <svgicon
        :color="canRedo ? '#2b6a73' : 'rgba(0,0,0,.38)'"
        icon="system/actions/redo"
        width="24"
        height="24"/>
    </button>
    <div class="separator"/>
    <button
      :title="linkMode ? '退出连线模式' : '连线模式：从元件拖到元件生成连线'"
      :disabled="isLoading"
      :class="['action-btn', { 'action-btn--on': linkMode }]"
      @click="toggleLinkMode">
      <svgicon
        :color="linkMode ? '#ffffff' : '#2b6a73'"
        icon="system/elements/link"
        width="24"
        height="24"/>
    </button>
    <div class="separator"/>
    <button
      v-tooltip="'清空项目'"
      :disabled="isLoading"
      class="action-btn"
      @click="$root.$emit('open-confirm-dialog')">
      <svgicon icon="system/actions/delete" width="24" height="24" color="#2b6a73"/>
    </button>
    <button
      v-tooltip="'打开本地工程文件'"
      :disabled="isLoading"
      class="action-btn"
      @click="openLocalProject">
      <svgicon icon="system/actions/folder" width="24" height="24" color="#2b6a73"/>
    </button>
    <input
      ref="inputOpenLocal"
      class="action-bar__file"
      type="file"
      accept=".gg,application/json"
      @change="openLocalFile">
    <button v-tooltip="'下载工程文件'" :disabled="isLoading" class="action-btn" @click="showDownloadMenu">
      <svgicon icon="system/actions/download" width="24" height="24" color="#2b6a73"/>
    </button>
    <el-dropdown :popper-append-to-body="false" trigger="click" @command="onSelectExport">
      <button v-tooltip="'导出图片 / 设备清单'" :disabled="isLoading" class="action-btn">
        <svgicon icon="system/actions/preview" width="24" height="24" color="#2b6a73"/>
      </button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item disabled>导出当前页图片：</el-dropdown-item>
        <el-dropdown-item command="png-1">PNG · 1 倍</el-dropdown-item>
        <el-dropdown-item command="png-2">PNG · 2 倍（高清）</el-dropdown-item>
        <el-dropdown-item command="png-2-grid">PNG · 2 倍 · 带网格</el-dropdown-item>
        <el-dropdown-item command="svg">SVG（矢量，可再编辑）</el-dropdown-item>
        <el-dropdown-item divided disabled>导出设备清单（CSV）：</el-dropdown-item>
        <el-dropdown-item command="csv-all">整线全部元件</el-dropdown-item>
        <el-dropdown-item :disabled="!hasSelection" command="csv-selected">
          仅当前选中的 {{ selectedCount }} 个元件
        </el-dropdown-item>
        <el-dropdown-item divided command="csv-links">连线关系表（CSV）</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  downloadProject,
  loadProject,
  saveProject,
  exportElementList,
  exportLinkList,
  _setLinkMode
} from '@/store/types'
import notify from '@/views/layouteditor/components/mixins/notify'
import '@/assets/design/icons/system/actions'
import '@/assets/design/icons/system/elements/link'

export default {
  name: 'ActionBar',
  mixins: [notify],
  computed: {
    saveTooltip() {
      return this.hasChanges ? '保存（存在未保存的改动）' : '保存'
    },

    hasSelection() {
      return this.selectedCount > 0
    },

    ...mapState({
      isLoading: state => state.layoutEditor.isLoading,
      isSyncing: state => state.layoutEditor.isSyncing,
      linkMode: state => state.layoutEditor.linkMode,
      hasChanges: state => state.layoutEditor.hasChanges,
      canUndo: state => state.layoutEditor.canUndo,
      canRedo: state => state.layoutEditor.canRedo,
      selectedCount: state => (state.layoutEditor.selectedElements || []).length
    })
  },
  methods: {
    async saveHandler() {
      const result = await this.saveProject()
      if (result && result.ok) {
        this.notifySuccess('已保存到本地快照')
      } else {
        this.notifyError((result && result.error) || '保存失败')
      }
    },

    async showDownloadMenu() {
      const result = await this.downloadProject()
      if (result && result.ok === false) {
        this.notifyError(result.error)
      } else {
        this.notifySuccess('工程文件已开始下载')
      }
    },
    /** 打开本地工程文件：点按钮直接唤起系统文件选择框，不再走下拉菜单 */
    openLocalProject() {
      const input = this.$refs.inputOpenLocal
      if (!input) return
      // 先清空上一次的选择，否则连续两次选同一个文件不会触发 change
      input.value = ''
      input.click()
    },

    /** 导出：图片交给画布组件渲染，清单在 store 里生成 */
    async onSelectExport(command) {
      if (command === 'csv-links') {
        const linkResult = await this.exportLinkList({ scope: 'all' })
        if (linkResult && linkResult.ok) {
          this.notifySuccess('已导出 ' + linkResult.count + ' 条连线关系')
        } else {
          this.notifyWarning((linkResult && linkResult.error) || '没有可导出的连线')
        }
        return
      }

      if (command.indexOf('png') === 0) {
        this.$root.$emit('export-png', {
          format: 'png',
          scale: command.indexOf('-2') !== -1 ? 2 : 1,
          withGrid: command.indexOf('grid') !== -1
        })
        return
      }

      if (command === 'svg') {
        this.$root.$emit('export-png', { format: 'svg' })
        return
      }

      const result = await this.exportElementList({
        scope: command === 'csv-selected' ? 'selected' : 'all'
      })
      if (result && result.ok) {
        this.notifySuccess('已导出 ' + result.count + ' 条设备清单')
      } else {
        this.notifyWarning((result && result.error) || '没有可导出的元件')
      }
    },

    toggleLinkMode() {
      const next = !this.linkMode
      this._setLinkMode(next)
      this.notifyInfo(
        next
          ? '连线模式：从元件拖到另一个元件即可生成连线，点连线可删除'
          : '已退出连线模式'
      )
    },
    openLocalFile(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = async e => {
        const result = await this.loadProject({ origin: 'pc', content: e.target.result })
        if (result && result.ok) {
          this.notifySuccess('已加载工程《' + result.title + '》')
        } else {
          this.notifyError((result && result.error) || '工程文件加载失败')
        }
      }
      reader.onerror = () => this.notifyError('文件读取失败，请重新选择工程文件')
      reader.readAsText(file)
    },
    ...mapActions([
      downloadProject,
      loadProject,
      saveProject,
      exportElementList,
      exportLinkList
    ]),
    ...mapMutations([_setLinkMode])
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

/* 连线模式：按钮点亮，避免用户不知道该在哪里点第二下 */
.action-btn--on,
.action-btn--on:hover {
  background-color: #2b6a73;
}

/* 隐藏的文件选择框：由文件夹按钮以编程方式唤起 */
.action-bar__file {
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
