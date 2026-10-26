<template>
  <div class="layers-menu">
    <div class="layers-toolbar">
      <el-input
        v-model="keyword"
        size="mini"
        clearable
        placeholder="按主键 / 别名搜索"
        prefix-icon="el-icon-search"/>
    </div>

    <div class="layers-tree">
      <div
        :class="['layer-row', 'layer-row--root', { 'layer-row--active': !selectedElements.length }]"
        @click="clearSelection">
        <span class="layer-caret"/>
        <span class="layer-icon">
          <svgicon :original="true" icon="system/elements/page" width="16" height="16"/>
        </span>
        <span class="layer-name">画布<span class="layer-count">{{ total }}</span></span>
        <button
          :title="isAllExpanded ? '收起全部' : '展开全部'"
          type="button"
          class="layer-expand-toggle"
          @click.stop="toggleExpandAll">
          <svgicon
            :icon="isAllExpanded ? 'system/collapse' : 'system/expand'"
            width="14"
            height="14"
            color="#2b6a73"/>
        </button>
      </div>

      <div
        v-for="row in rows"
        :key="row.node.id"
        :class="['layer-row', {
          'layer-row--active': row.active,
          'layer-row--hidden': !!(row.node.attrs && row.node.attrs.hidden),
          'layer-row--locked': !!row.node.locked
        }]"
        :style="{ paddingLeft: 8 + row.depth * 12 + 'px' }"
        :title="row.tip"
        @click="selectNode(row, $event)">
        <span
          :class="['layer-caret', { 'layer-caret--open': row.opened, 'layer-caret--empty': !row.hasChildren }]"
          @click.stop="toggleExpand(row)">
          <svg viewBox="0 0 24 24" width="12" height="12">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" fill="currentColor"/>
          </svg>
        </span>
        <span class="layer-icon">
          <svgicon :icon="'system/elements/' + row.icon" :original="true" width="14" height="14"/>
        </span>

        <input
          v-if="editingId === row.node.id"
          ref="renameInput"
          v-model="editingName"
          class="layer-rename"
          type="text"
          @click.stop
          @blur="commitRename(row)"
          @keyup.enter="commitRename(row)"
          @keyup.esc="cancelRename">
        <span
          v-else
          class="layer-name"
          @dblclick.stop="startRename(row)">{{ row.label }}</span>

        <span class="layer-tools">
          <button
            :title="row.node.locked ? '解锁' : '锁定（不可选中、不可拖动）'"
            type="button"
            @click.stop="toggleLocked(row)">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <path
                :d="row.node.locked
                  ? 'M17 9V7a5 5 0 0 0-10 0v2H5.6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12.8a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H17zM9 7a3 3 0 0 1 6 0v2H9V7z'
                : 'M17 9V7a5 5 0 0 0-9.9-.9 1 1 0 1 0 2 .4A3 3 0 0 1 15 7v2H5.6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12.8a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H17z'"
                fill="currentColor"/>
            </svg>
          </button>
          <button
            :title="(row.node.attrs && row.node.attrs.hidden) ? '恢复显示' : '编辑态隐藏（导出仍包含）'"
            type="button"
            @click.stop="toggleHidden(row)">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <path
                :d="(row.node.attrs && row.node.attrs.hidden)
                  ? 'M12 6.5c-4.4 0-8 3.1-9.6 5.5 1.6 2.4 5.2 5.5 9.6 5.5s8-3.1 9.6-5.5C20 9.6 16.4 6.5 12 6.5zm0 8.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6zM3.3 3.3 2 4.6l16.4 16.4 1.3-1.3z'
                : 'M12 6.5c-4.4 0-8 3.1-9.6 5.5 1.6 2.4 5.2 5.5 9.6 5.5s8-3.1 9.6-5.5C20 9.6 16.4 6.5 12 6.5zm0 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z'"
                fill="currentColor"/>
            </svg>
          </button>
        </span>
      </div>

      <p v-if="!rows.length" class="layers-empty">
        {{ keyword ? '没有匹配的元件' : '画布上还没有元件，从左侧「元素」面板拖一个进来' }}
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import basicElements from '@/assets/design/BasicElements'
import { elementKeywords, elementLabel, flattenPage } from '@/helpers/nodeInfo'
import {
  _addSelectedElement,
  _clearSelectedElements,
  _setEditorScope,
  updateElement
} from '@/store/types'
import notify from '@/views/layouteditor/components/mixins/notify'
import '@/assets/design/icons/system/expand'
import '@/assets/design/icons/system/collapse'

/** 能用图标表示的元件名（其余统一用通用图标） */
const ICON_NAMES = basicElements.map(item => item.name).concat(['page', 'globe'])

export default {
  name: 'LayersMenu',
  mixins: [notify],
  data: function() {
    return {
      keyword: '',
      /** 展开状态：{ [id]: true }，默认展开层级一，嵌套容器按需展开 */
      expanded: {},
      editingId: null,
      editingName: ''
    }
  },
  computed: {
    page() {
      return this.selectedPage
    },

    total() {
      return this.page ? flattenPage(this.page).length : 0
    },

    /** 是否所有可展开节点都已展开，用于画布行的展开/收起图标切换 */
    isAllExpanded() {
      if (!this.page) return false
      return flattenPage(this.page).every(entry =>
        !(entry.node.children && entry.node.children.length) || !!this.expanded[entry.node.id]
      )
    },

    rows() {
      const keyword = this.keyword.trim().toLowerCase()
      const rows = []

      const walk = (parent, depth) => {
        const siblings = parent.children || []
        siblings.forEach(node => {
          if (keyword && !matchNode(node, keyword)) return

          const descendants = node.children || []
          // 搜索时自动展开，直接看到命中的层级
          const opened = !!this.expanded[node.id] || !!keyword
          rows.push({
            node,
            depth,
            hasChildren: descendants.length > 0,
            opened,
            active: this.isActive(node),
            label: elementLabel(node) || node.name,
            icon: ICON_NAMES.indexOf(node.name) !== -1 ? node.name : 'widgets',
            tip: node.name + ' · ' + node.id
          })

          if (descendants.length && opened) walk(node, depth + 1)
        })
      }

      if (this.page) walk(this.page, 0)
      return rows
    },

    ...mapState({
      selectedPage: state => state.layoutEditor.selectedPage,
      selectedElements: state => state.layoutEditor.selectedElements || [],
      editorScopeId: state => state.layoutEditor.editorScopeId,
      projectComponents: state => state.layoutEditor.project.components || []
    })
  },
  methods: {
    isActive(node) {
      return this.selectedElements.some(el => el.id === node.id)
    },

    toggleExpand(row) {
      if (!row.hasChildren) return
      this.$set(this.expanded, row.node.id, !this.expanded[row.node.id])
    },

    expandAll() {
      const state = {}
      if (this.page) {
        flattenPage(this.page).forEach(entry => {
          if (entry.node.children && entry.node.children.length) state[entry.node.id] = true
        })
      }
      this.expanded = state
    },

    collapseAll() {
      this.expanded = {}
    },

    /** 画布行右侧按钮：在展开全部 / 收起全部之间切换 */
    toggleExpandAll() {
      if (this.isAllExpanded) this.collapseAll()
      else this.expandAll()
    },

    clearSelection() {
      this._clearSelectedElements()
      this._setEditorScope(null)
    },

    /** 点选：必要时把编辑层级切到它的父容器，并把元件滚动到可视区 */
    selectNode(row, event) {
      const node = row.node
      const parentId = node.id.substring(0, node.id.lastIndexOf('.'))
      const pageId = this.page ? this.page.id : null

      if (parentId && parentId !== pageId && parentId !== this.editorScopeId) {
        this._setEditorScope(parentId)
      } else if (parentId === pageId && this.editorScopeId) {
        this._setEditorScope(null)
      }

      const additive = event && (event.shiftKey || event.ctrlKey || event.metaKey)
      if (!additive) this._clearSelectedElements()

      // 全局元件在画布上以引用组件渲染，这里补回组件字段
      const globalComp = node.global
        ? this.projectComponents[
          this.projectComponents.findIndex(comp => comp.name === node.name)
        ]
        : null

      this._addSelectedElement(globalComp ? { ...node, ...globalComp, id: node.id } : node)
      this.$root.$emit('reveal-element', node.id)
    },

    startRename(row) {
      this.editingId = row.node.id
      this.editingName = row.label
      this.$nextTick(() => {
        const input = this.$refs.renameInput
        const target = Array.isArray(input) ? input[0] : input
        if (target && target.focus) target.focus()
      })
    },

    commitRename(row) {
      if (this.editingId !== row.node.id) return

      const name = String(this.editingName || '').trim()
      this.editingId = null
      if (!name || name === row.label) return

      this.updateElement({ element: row.node, primaryKey: name })
      this.notifySuccess('已重命名为「' + name + '」')
    },

    cancelRename() {
      this.editingId = null
    },

    toggleLocked(row) {
      const next = !row.node.locked
      this.updateElement({ element: row.node, locked: next })
      if (next && this.isActive(row.node)) this._clearSelectedElements()
      this.notifySuccess(next ? '已锁定「' + row.label + '」' : '已解锁「' + row.label + '」')
    },

    toggleHidden(row) {
      const attrs = Object.assign({}, row.node.attrs, {
        hidden: !(row.node.attrs && row.node.attrs.hidden)
      })
      this.updateElement({ element: row.node, attrs })
    },

    ...mapMutations([
      _addSelectedElement,
      _clearSelectedElements,
      _setEditorScope,
      updateElement
    ])
  }
}

/** 自身或任一后代命中关键词即显示 */
function matchNode(node, keyword) {
  if (elementKeywords(node).toLowerCase().indexOf(keyword) !== -1) return true
  return (node.children || []).some(child => matchNode(child, keyword))
}
</script>

<style scoped>
.layers-menu {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.layers-toolbar {
  padding: 10px 14px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, .06);
}

.layers-tree {
  flex: 1;
  min-height: 0;
  padding-bottom: 16px;
  overflow-y: auto;
}

.layer-row {
  display: flex;
  align-items: center;
  height: 28px;
  padding-right: 8px;
  font-size: 12px;
  color: #3a474d;
  cursor: pointer;
  user-select: none;
  border-left: 2px solid transparent;
  transition: background-color .15s ease, border-color .15s ease;
}

.layer-row:hover {
  background-color: rgba(43, 106, 115, .1);
}

/* 根节点（画布）：常驻浅青绿底 + 主色左边条，滚动时固定在顶部 */
.layer-row--root {
  position: sticky;
  top: 0;
  z-index: 2;
  height: 32px;
  margin: 6px 0 4px;
  padding-left: 8px;
  color: #2b6a73;
  font-size: 13px;
  font-weight: 700;
  background: #eef4f4;
  border-left: 2px solid #2b6a73;
  border-bottom: 1px solid rgba(0, 0, 0, .06);
  box-shadow: 0 1px 2px rgba(0, 0, 0, .05);
}

.layer-row--root .layer-icon {
  color: #2b6a73;
}

.layer-row--root .layer-count {
  color: #2b6a73;
}

/* 根节点即当前画布（未选中任何元件）时加深 */
.layer-row--root.layer-row--active {
  background: #e6f1f1;
}

/* 画布行右侧的展开/收起全部按钮 */
.layer-expand-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  margin: 0 2px 0 auto;
  padding: 0;
  border: 0 none;
  border-radius: 4px;
  background: none;
  color: #2b6a73;
  cursor: pointer;
  outline: none;
  opacity: .7;
  transition: opacity .15s ease, background-color .15s ease, transform .15s cubic-bezier(.4, 0, .2, 1);
}

.layer-expand-toggle:hover {
  opacity: 1;
  background-color: rgba(43, 106, 115, .12);
  transform: scale(1.1);
}

.layer-expand-toggle:focus-visible {
  outline: 2px solid #2b6a73;
  outline-offset: 1px;
}

.layer-row--active {
  background-color: rgba(43, 106, 115, .12);
  color: #2b6a73;
  border-left: 2px solid #2b6a73;
}

.layer-row--active .layer-icon {
  color: #2b6a73;
}

.layer-row--locked .layer-name {
  color: #6f7d7d;
}

.layer-row--hidden .layer-icon {
  opacity: .5;
}

.layer-row--hidden .layer-name {
  color: #6f7d7d;
  text-decoration: line-through;
}

.layer-caret {
  flex: 0 0 14px;
  width: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6f7d7d;
  cursor: pointer;
}
.layer-caret svg {
  transition: transform .18s cubic-bezier(.4, 0, .2, 1);
  transform: rotate(-90deg);
}
.layer-caret--open svg {
  transform: rotate(0deg);
}
.layer-caret--empty {
  visibility: hidden;
  pointer-events: none;
}

.layer-icon {
  flex: 0 0 18px;
  width: 18px;
  text-align: center;
  color: #42575c;
}

.layer-name {
  flex: 1;
  min-width: 0;
  padding: 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.layer-count {
  padding-left: 6px;
  color: #8b9696;
  font-size: 11px;
  font-weight: 400;
}

.layer-rename {
  flex: 1;
  min-width: 0;
  height: 20px;
  margin: 0 6px;
  padding: 0 4px;
  border: 1px solid #2b6a73;
  border-radius: 3px;
  font-size: 12px;
  outline: none;
}

.layer-tools {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  opacity: 0;
  transition: opacity .15s ease;
}

.layer-row:hover .layer-tools,
.layer-row--active .layer-tools {
  opacity: 1;
}

.layer-tools button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0 none;
  background: none;
  color: #4b6161;
  cursor: pointer;
  outline: none;
  transition: color .15s ease, transform .15s cubic-bezier(.4, 0, .2, 1);
}

.layer-tools button:hover {
  color: #2b6a73;
  transform: scale(1.15);
}

.layer-tools button:focus-visible {
  outline: 2px solid #2b6a73;
  outline-offset: 1px;
}

.layers-empty {
  padding: 16px 18px;
  color: #a8b1b1;
  font-size: 11px;
  line-height: 18px;
}
</style>
