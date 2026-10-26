<template>
  <div class="menus-wrapper">
    <div class="elements-toolbar">
      <el-input
        v-model="keyword"
        size="mini"
        clearable
        placeholder="搜索元件（名称 / 类型）"
        prefix-icon="el-icon-search"/>
    </div>

    <template v-if="!keyword">
      <menu-toggle v-if="recentItems.length" menu-header="最近使用">
        <div class="el-menu">
          <div
            v-for="element in recentItems"
            :key="'recent-' + element.name"
            :title="element.name"
            class="el-menu__el"
            draggable="true"
            @dragstart="e => dragstartHandler(e, element)"
            @click="e => addItemToStage(e, element)">
            <svgicon :icon="'system/elements/'+element.name" width="24" height="24" color="rgba(0,0,0,.87)"/>
            <span>{{ element.displayName || element.name }}</span>
          </div>
        </div>
      </menu-toggle>

      <menu-toggle v-if="favoriteItems.length" menu-header="收藏">
        <div class="el-menu">
          <div
            v-for="element in favoriteItems"
            :key="'fav-' + element.name"
            :title="element.name"
            class="el-menu__el"
            draggable="true"
            @dragstart="e => dragstartHandler(e, element)"
            @click="e => addItemToStage(e, element)">
            <svgicon :icon="'system/elements/'+element.name" width="24" height="24" color="rgba(0,0,0,.87)"/>
            <span>{{ element.displayName || element.name }}</span>
          </div>
        </div>
      </menu-toggle>
    </template>

    <menu-toggle
      v-for="group in groups"
      :key="group.name"
      :menu-header="group.name">
      <div class="el-menu">
        <div
          v-for="element in group.items"
          :key="element.name"
          :title="element.name"
          :class="['el-menu__el', { 'el-menu__el--fav': isFavorite(element) }]"
          draggable="true"
          @dragstart="e => dragstartHandler(e, element)"
          @click="e => addItemToStage(e, element)">
          <button
            :title="isFavorite(element) ? '取消收藏' : '收藏'"
            :aria-pressed="isFavorite(element) ? 'true' : 'false'"
            class="el-menu__star"
            type="button"
            @click.stop="toggleFavorite(element)">
            <svg
              :fill="isFavorite(element) ? 'currentColor' : 'none'"
              viewBox="0 0 24 24"
              width="14"
              height="14"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linejoin="round">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          </button>
          <svgicon :icon="'system/elements/'+element.name" width="24" height="24" color="rgba(0,0,0,.87)"/>
          <span>{{ element.displayName || element.name }}</span>
        </div>
      </div>
    </menu-toggle>

    <p v-if="keyword && !groups.length" class="elements-empty">
      没有匹配「{{ keyword }}」的元件
    </p>
  </div>
</template>

<script>
import MenuToggle from '@/views/layouteditor/components/editor/common/MenuToggle'
import basicElements from '@/assets/design/BasicElements'
import { registerElement } from '@/store/types'
import { findFreeSlot } from '@/helpers/positionDimension'
import notify from '@/views/layouteditor/components/mixins/notify'
import '@/assets/design/icons/system/elements/'
import { mapState, mapActions } from 'vuex'

/** 元件分类：按用途组织，未登记的类型归入「其他」 */
const CATEGORY_MAP = {
  container: '容器',
  dataItem: '容器',
  equipment: '设备',
  oven: '设备',
  port: '设备',
  unit: '设备',
  vcr: '设备',
  carrier: '载具',
  basket: '载具',
  car: '载具',
  arrows: '连线与信号',
  'path-setting': '路径与工具',
  'custom-text': '文字与标签',
  dynamictags: '文字与标签',
  'custom-button': '文字与标签',
  'custom-image': '图片与底图'
}

const CATEGORY_ORDER = [
  '容器', '设备', '载具', '连线与信号', '路径与工具', '文字与标签', '图片与底图', '其他'
]

const RECENT_KEY = 'layout-recent-elements'
const FAVORITE_KEY = 'layout-favorite-elements'
const RECENT_LIMIT = 6

function readList(key) {
  try {
    const raw = window.localStorage.getItem(key)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch (error) {
    // 存储不可用时按空处理，不影响拖拽新增
    return []
  }
}

function writeList(key, list) {
  try {
    window.localStorage.setItem(key, JSON.stringify(list))
  } catch (error) {
    // 忽略隐私模式下的写入失败
  }
}

export default {
  name: 'ElementsMenu',
  components: { MenuToggle },
  mixins: [notify],
  data: function() {
    return {
      elements: basicElements,
      keyword: '',
      recentNames: readList(RECENT_KEY),
      favoriteNames: readList(FAVORITE_KEY)
    }
  },
  computed: {
    /** 按关键词过滤后的分类分组；搜索时不再显示最近/收藏，直接给结果 */
    groups() {
      const keyword = this.keyword.trim().toLowerCase()
      const buckets = {}

      this.elements.forEach(element => {
        if (keyword && !this.matchElement(element, keyword)) return
        const category = CATEGORY_MAP[element.name] || '其他'
        if (!buckets[category]) buckets[category] = []
        buckets[category].push(element)
      })

      return CATEGORY_ORDER
        .filter(name => buckets[name] && buckets[name].length)
        .map(name => ({ name, items: buckets[name] }))
    },

    recentItems() {
      return this.pickByNames(this.recentNames)
    },

    favoriteItems() {
      return this.pickByNames(this.favoriteNames)
    },

    ...mapState({
      activePage: state => state.layoutEditor.selectedPage,
      editorZoom: state => state.layoutEditor.editorZoom
    })
  },
  methods: {
    matchElement(element, keyword) {
      const text = [
        element.name,
        element.displayName,
        CATEGORY_MAP[element.name]
      ].filter(Boolean).join(' ').toLowerCase()
      return text.indexOf(keyword) !== -1
    },

    pickByNames(names) {
      return (names || [])
        .map(name => this.elements.find(element => element.name === name))
        .filter(element => !!element)
    },

    isFavorite(element) {
      return this.favoriteNames.indexOf(element.name) !== -1
    },

    toggleFavorite(element) {
      const index = this.favoriteNames.indexOf(element.name)
      if (index === -1) this.favoriteNames.push(element.name)
      else this.favoriteNames.splice(index, 1)
      writeList(FAVORITE_KEY, this.favoriteNames)
    },

    /** 记一笔最近使用（去重、置顶、限量） */
    markRecent(element) {
      const index = this.recentNames.indexOf(element.name)
      if (index !== -1) this.recentNames.splice(index, 1)
      this.recentNames.unshift(element.name)
      if (this.recentNames.length > RECENT_LIMIT) {
        this.recentNames = this.recentNames.slice(0, RECENT_LIMIT)
      }
      writeList(RECENT_KEY, this.recentNames)
    },

    dragstartHandler(e, item) {
      e.dataTransfer.dropEffect = 'copy'
      e.dataTransfer.effectAllowed = 'all'
      e.dataTransfer.setData('text/plain', JSON.stringify(this.initItem(item)))
      this.markRecent(item)
    },

    addItemToStage(e, item) {
      if (!this.activePage) return

      const element = this.initItem(item)
      const slot = findFreeSlot(element, this.activePage, this.getViewportCenter())

      this.registerElement({
        pageId: this.activePage.id,
        el: { ...element, top: slot.top, left: slot.left },
        global: e.shiftKey
      })
      this.markRecent(item)

      if (!slot.free) {
        this.notifyWarning('画布已排满，元件已就近放置，请拖动调整位置')
      }
    },

    initItem(item) {
      return { zIndex: 'auto', top: 0, left: 0, bottom: 'auto', right: 'auto', ...item }
    },

    /** 当前画布可视区域中心，换算到未缩放的页面坐标 */
    getViewportCenter() {
      const container = document.getElementById('canvas-main')
      const stage = document.getElementById(this.activePage.id)
      if (!container || !stage) return null

      const containerRect = container.getBoundingClientRect()
      const stageRect = stage.getBoundingClientRect()
      const zoom = this.editorZoom || 1

      return {
        left: (containerRect.left + container.clientWidth / 2 - stageRect.left) / zoom,
        top: (containerRect.top + container.clientHeight / 2 - stageRect.top) / zoom
      }
    },

    ...mapActions([registerElement])
  }
}
</script>

<style scoped>
.menus-wrapper {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  height: calc(100% - 58px);
  width: 100%;
  position: absolute;
  overflow-y: auto;
}

.elements-toolbar {
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 10px 14px 8px;
  border-bottom: 1px solid rgba(0, 0, 0, .06);
  /* 与抽屉面板底色一致，滚动时遮挡下方内容 */
  background-color: #fafafa;
}

.elements-empty {
  padding: 16px 18px;
  color: #a8b1b1;
  font-size: 11px;
  line-height: 18px;
}

.el-menu {
  width: 100%;
  height: 100%;
  display: grid;
  margin: 1px;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(1px, 72px);
}
.el-menu::before{
  content: normal;
}
.el-menu__el {
  position: relative;
  width: 79px;
  cursor: pointer;
  padding-top: 1em;
  color: rgba(0,0,0,.87);
  text-align: center;
  border-radius: 2px;
  background-color: transparent;
  transition: transform .16s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.20s cubic-bezier(0.4, 0, 0.2, 1);
}
.el-menu__el:hover{
  background-color: rgba(0,0,0,.08);
  transform: translateY(-2px);
}
.el-menu__el:active{
  transform: translateY(0) scale(.96);
}
.el-menu__el .vue-svg-icon {
  transition: transform .16s cubic-bezier(0.4, 0, 0.2, 1);
}
.el-menu__el:hover .vue-svg-icon {
  transform: scale(1.12);
}
.el-menu__el span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: small;
  padding: 0 8px;
}

.el-menu__star {
  position: absolute;
  top: 4px;
  right: 6px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0 none;
  border-radius: 50%;
  background: none;
  color: #8b9696;
  cursor: pointer;
  outline: none;
  opacity: 0;
  transition: opacity .15s ease, color .15s ease, background-color .15s ease, transform .15s cubic-bezier(.4, 0, .2, 1);
}

/* 悬停卡片时星标浮现；已收藏的常显 */
.el-menu__el:hover .el-menu__star,
.el-menu__el--fav .el-menu__star {
  opacity: 1;
}

.el-menu__star:hover {
  background-color: rgba(0, 0, 0, .06);
  color: #2b6a73;
  transform: scale(1.18);
}

.el-menu__star:focus-visible {
  outline: 2px solid #2b6a73;
  outline-offset: 1px;
}

/* 已收藏：金色实心星 */
.el-menu__el--fav .el-menu__star {
  color: #e6a23c;
}
</style>
