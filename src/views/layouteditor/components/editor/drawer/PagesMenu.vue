<template>
  <div class="pages-wrapper">
    <div class="pages-header">
      <span>页面</span>
      <span class="pages-count">{{ pages.length }} 个</span>
    </div>

    <ul class="page-list">
      <li
        v-for="(page, index) in pages"
        :key="page.id"
        :class="{'page-item--active': isActive(page)}"
        :title="page.path"
        class="page-item"
        @click="selectPage(page)"
      >
        <svgicon
          :color="isActive(page) ? '#2b6a73' : 'rgba(0,0,0,.38)'"
          icon="system/page"
          width="18"
          height="18"
        />
        <span class="page-index">{{ index + 1 }}</span>
        <span class="page-name">{{ page.name }}</span>
        <span class="page-ops">
          <a title="重命名 / 修改路径" @click.stop="editPage(page)">
            <svgicon icon="system/settings" width="14" height="14" color="#606266"/>
          </a>
          <a title="复制页面" @click.stop="copyPage(page)">
            <svgicon icon="system/add_page" width="14" height="14" color="#606266"/>
          </a>
          <a title="删除页面" @click.stop="deletePage(page)">
            <svgicon icon="system/close" width="14" height="14" color="#606266"/>
          </a>
        </span>
      </li>
    </ul>

    <div class="pages-footer">
      <el-button size="mini" type="primary" @click="addPage">新建页面</el-button>
      <p class="pages-tip">新建或重命名页面会打开页面设置对话框</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  _changeActivePage,
  _clearSelectedElements,
  _togglePageDialog,
  savePageAndClose,
  duplicatePage,
  removePage
} from '@/store/types'
import notify from '@/views/layouteditor/components/mixins/notify'

import '@/assets/design/icons/system/page'
import '@/assets/design/icons/system/settings'
import '@/assets/design/icons/system/add_page'
import '@/assets/design/icons/system/close'

export default {
  name: 'PagesMenu',
  mixins: [notify],
  computed: {
    ...mapState({
      pages: state => state.layoutEditor.project.pages,
      activePage: state => state.layoutEditor.selectedPage
    })
  },
  methods: {
    isActive(page) {
      return !!this.activePage && this.activePage.id === page.id
    },

    selectPage(page) {
      if (this.isActive(page)) return
      this._changeActivePage(page)
      this._clearSelectedElements()
    },

    addPage() {
      this._togglePageDialog({ isNew: true, isOpen: true })
    },

    editPage(page) {
      this._changeActivePage(page)
      this._togglePageDialog({ isNew: false, isOpen: true })
    },

    copyPage(page) {
      this.duplicatePage({ page })
      this.notifySuccess('已复制页面《' + page.name + '》')
    },

    deletePage(page) {
      if (this.pages.length <= 1) {
        this.notifyWarning('至少要保留一个页面')
        return
      }

      this.$confirm(
        '删除后该页面上的所有元件都会一起删除，是否继续？',
        '删除页面《' + page.name + '》',
        {
          type: 'warning',
          confirmButtonText: '删除',
          cancelButtonText: '取消'
        }
      ).then(() => {
        const pageIndex = this.pages.findIndex(item => item.id === page.id)
        if (pageIndex === -1) return

        const wasActive = this.isActive(page)
        this.removePage({ pageIndex })

        if (wasActive) {
          const nextPage = this.pages[0]
          this._changeActivePage(nextPage)
        }
        this.notifySuccess('已删除页面《' + page.name + '》，可用 Ctrl+Z 撤销')
      }).catch(() => {})
    },

    ...mapActions([savePageAndClose, duplicatePage, removePage]),
    ...mapMutations([
      _changeActivePage,
      _clearSelectedElements,
      _togglePageDialog
    ])
  }
}
</script>

<style scoped>
.pages-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: calc(100% - 58px);
  width: 100%;
  position: absolute;
  overflow-y: auto;
}

.pages-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 25px;
  font-size: small;
  font-weight: bold;
  color: rgba(0, 0, 0, .54);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.pages-count {
  font-weight: normal;
  color: rgba(0, 0, 0, .38);
}

.page-list {
  list-style: none;
  margin: 0;
  padding: 4px 0;
}

.page-item {
  display: flex;
  align-items: center;
  padding: 8px 12px 8px 20px;
  cursor: pointer;
  font-size: 13px;
  color: rgba(0, 0, 0, .78);
  border-left: 3px solid transparent;
}

.page-item:hover {
  background-color: rgba(0, 0, 0, .05);
}

.page-item--active {
  background-color: rgba(43, 106, 115, .08);
  border-left-color: #2b6a73;
  color: #2b6a73;
}

.page-index {
  min-width: 18px;
  margin-left: 6px;
  color: rgba(0, 0, 0, .38);
  font-size: 12px;
}

.page-item--active .page-index {
  color: rgba(43, 106, 115, .6);
}

.page-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.page-ops {
  flex-shrink: 0;
  display: none;
  align-items: center;
}

.page-item:hover .page-ops,
.page-item--active .page-ops {
  display: inline-flex;
}

.page-ops a {
  padding: 0 3px;
  line-height: 1;
  cursor: pointer;
}

.pages-footer {
  padding: 12px 20px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.pages-footer .el-button {
  width: 100%;
}

.pages-tip {
  margin: 8px 0 0;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(0, 0, 0, .38);
}
</style>
