<template>
  <div class="menus-wrapper">
    <div :title="selectionTitle" class="selection-title__wrapper">
      <svgicon :icon="'system/elements/'+selectionIcon" :original="true" width="22" height="22" />
      <span class="selection-title">{{ selectionTitle }}</span>
    </div>
    <page-settings
      v-if="(selectionType === 'page')"
      :height="height"
      :width="width"
      :styles="styles"
      :attrs="attrs"
      @propchange="onPropChange" />
    <global-settings
      v-if="(selectionType === 'global')"
      :z-index="zIndex"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      @propchange="onPropChange" />
    <component-settings
      v-if="(selectionType === 'component' || selectionType === 'multiple')"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      :z-index="zIndex"
      :height="height"
      :width="width"
      :styles="styles"
      @propchange="onPropChange" />
    <element-settings
      v-if="(selectionType === 'element')"
      :top="top"
      :left="left"
      :bottom="bottom"
      :right="right"
      :z-index="zIndex"
      :height="height"
      :width="width"
      :primary-key="primaryKey"
      :name="name"
      :text="text"
      :styles="styles"
      :attrs="attrs"
      @propchange="onPropChange" />
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import { mapState, mapMutations } from 'vuex'
import { updatePage, updateElement } from '@/store/types'
import PageSettings from './submenus/PageSettings.vue'
import ComponentSettings from './submenus/ComponentSettings.vue'
import ElementSettings from './submenus/ElementSettings.vue'
import GlobalSettings from './submenus/GlobalSettings.vue'
import WebSafeFonts from '@/assets/design/WebSafeFonts'
import '@/assets/design/icons/system/editor/'
import '@/assets/design/icons/system/elements/'

/** 文本类输入合并提交的等待时间（ms） */
const TEXT_CHANGE_DELAY = 400

export default {
  name: 'SettingsMenu',
  components: {
    PageSettings,
    ComponentSettings,
    ElementSettings,
    GlobalSettings
  },
  data: function() {
    return {
      primaryKey: null,
      name: null,
      text: null,
      height: null,
      width: null,
      top: null,
      left: null,
      bottom: null,
      right: null,
      zIndex: 'auto',
      attrs: {},
      styles: {},
      classes: {},
      webSafeFonts: WebSafeFonts,
      textChangeTimer: null,
      pendingTextChange: null
    }
  },
  computed: {
    selectionTitle() {
      return (this.selectedElements.length === 0)
        ? '画布'
        : (this.selectedElements.length > 1)
          ? '多个元素'
          : this.selectedElements[0].name
    },
    selectionIcon() {
      return (this.selectedElements.length === 0)
        ? 'page'
        : (this.selectedElements.length > 1)
          ? 'multiple'
          : (this.selectedElements[0].global)
            ? 'globe'
            : this.selectedElements[0].name.toLowerCase()
    },
    selectionType() {
      return (this.selectedElements.length === 0)
        ? 'page'
        : (this.selectedElements.length > 1)
          ? 'multiple'
          : (this.selectedElements[0].global)
            ? 'global'
            : 'element'
    },
    selectedItem() {
      return (this.selectedElements.length === 0)
        ? this.activePage
        : (this.selectedElements.length > 1)
          ? this.selectedElements
          : this.selectedElements[0]
    },

    ...mapState({
      activePage: state => state.layoutEditor.selectedPage,
      selectedElements: state => state.layoutEditor.selectedElements
    })
  },
  watch: {
    'selectedItem': function(val) {
      if (val !== null) {
        if (Array.isArray(val)) {
          this.primaryKey = this.name = this.text = this.height = this.width = this.top = this.left = this.bottom =
              this.right = null
          this.attrs = this.styles = this.classes = {}
          this.zIndex = 'auto'
        } else {
          this.primaryKey = (val.primaryKey) ? val.primaryKey : null
          this.name = (val.name) ? val.name : null
          this.text = (val.text) ? val.text : null
          this.height = (typeof val.height !== 'undefined') ? val.height.toString() : null
          this.width = (typeof val.width !== 'undefined') ? val.width.toString() : null
          this.top = (typeof val.top !== 'undefined') ? val.top.toString() : null
          this.left = (typeof val.left !== 'undefined') ? val.left.toString() : null
          this.bottom = (typeof val.bottom !== 'undefined') ? val.bottom.toString() : null
          this.right = (typeof val.right !== 'undefined') ? val.right.toString() : null
          this.zIndex = (typeof val.zIndex !== 'undefined') ? val.zIndex : 'auto'
          this.attrs = (val.attrs) ? cloneDeep(val.attrs) : {}
          this.styles = (val.styles) ? cloneDeep(val.styles) : {}
          this.classes = (val.classes) ? cloneDeep(val.classes) : {}
        }
      }
    }
  },
  beforeDestroy: function() {
    // 销毁前把待提交的文本改动落回「输入时选中的那个对象」，避免输入丢失
    this.flushTextChange()
  },
  methods: {
    /** 当前编辑对象及其类型，用于把提交绑定到发起输入的那个对象 */
    targetContext() {
      return {
        selectionType: this.selectionType,
        item: this.selectedItem
      }
    },

    onPropChange(changeData) {
      if (changeData.value === '') return
      const newValue = {}
      if (typeof changeData.value === 'string' && !isNaN(changeData.value) && changeData.value.indexOf('%') === -1 &&
          changeData.value !== 'auto') {
        this[changeData.type] = newValue[changeData.type] = parseInt(changeData.value)
      } else {
        this[changeData.type] = newValue[changeData.type] = changeData.value
      }

      if (changeData.isText) {
        // 文本/数值输入逐字符触发，合并成一次提交，保证撤销是一步一步的
        this.scheduleTextChange(newValue)
        return
      }

      this.flushTextChange()
      this.saveChanges(newValue)
    },

    scheduleTextChange(newValue) {
      this.pendingTextChange = {
        value: newValue,
        context: this.targetContext()
      }
      if (this.textChangeTimer) window.clearTimeout(this.textChangeTimer)
      this.textChangeTimer = window.setTimeout(() => {
        this.textChangeTimer = null
        this.flushTextChange()
      }, TEXT_CHANGE_DELAY)
    },

    flushTextChange() {
      if (this.textChangeTimer) {
        window.clearTimeout(this.textChangeTimer)
        this.textChangeTimer = null
      }
      const pending = this.pendingTextChange
      this.pendingTextChange = null
      if (pending) this.saveChanges(pending.value, pending.context)
    },

    saveChanges(newValue, context) {
      const target = context || this.targetContext()
      if (target.selectionType === 'page') {
        this.updatePage({
          page: target.item,
          ...newValue
        })
      } else if (target.selectionType === 'multiple') {
        target.item.map(element => this.updateElement({
          element,
          ...newValue
        }))
      } else {
        this.updateElement({
          element: target.item,
          ...newValue
        })
      }
    },

    ...mapMutations([updatePage, updateElement])
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

  .selection-title__wrapper {
    position: sticky;
    top: 0;
    z-index: 5;
    display: inline-flex;
    user-select: none;
    padding: 12px 16px;
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .selection-title__wrapper svg {
    min-width: 22px;
  }

  .selection-title {
    padding: 2px 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
