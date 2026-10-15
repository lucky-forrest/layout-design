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
import { updatePage, updateEgglement } from '@/store/types'
import PageSettings from './submenus/PageSettings.vue'
import ComponentSettings from './submenus/ComponentSettings.vue'
import ElementSettings from './submenus/ElementSettings.vue'
import GlobalSettings from './submenus/GlobalSettings.vue'
import WebSafeFonts from '@/assets/design/WebSafeFonts'
import '@/assets/design/icons/system/editor/'
import '@/assets/design/icons/system/elements/'

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
      webSafeFonts: WebSafeFonts
    }
  },
  computed: {
    selectionTitle() {
      return (this.selectedElements.length === 0)
        ? 'Page'
        : (this.selectedElements.length > 1)
          ? 'Multiple Items'
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
  methods: {
    onPropChange(changeData) {
      if (changeData.value === '') return
      const newValue = {}
      if (typeof changeData.value === 'string' && !isNaN(changeData.value) && changeData.value.indexOf('%') === -1 &&
          changeData.value !== 'auto') {
        this[changeData.type] = newValue[changeData.type] = parseInt(changeData.value)
      } else {
        this[changeData.type] = newValue[changeData.type] = changeData.value
      }

      this.saveChanges(newValue)
    },

    saveChanges(newValue) {
      if (this.selectionType === 'page') {
        this.updatePage({
          page: this.activePage,
          ...newValue
        })
      } else if (this.selectionType === 'multiple') {
        this.selectedItem.map(egglement => this.updateEgglement({
          egglement,
          ...newValue
        }))
      } else {
        this.updateEgglement({
          egglement: this.selectedItem,
          ...newValue
        })
      }
    },

    ...mapMutations([updatePage, updateEgglement])
  }
}
</script>

<style>
  .menus-wrapper input {
    font-size: .813rem !important;
  }
</style>

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
    display: inline-flex;
    user-select: none;
    /*  min-height: 22px;
max-height: 22px; */
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

  .menu {
    width: 100%;
    height: 100%;
    margin: 1px;
    margin-bottom: 10px;
    display: grid;
  }

  .dimension-menu,
  .position-menu {
    grid-template-columns: repeat(2, 1fr);
  }

  .text-menu,
  .color-menu,
  .image-menu {
    grid-template-columns: repeat(1, 1fr);
  }

  .icon-bar {
    user-select: none;
    text-align: center;
    margin: 16px 0 4px;
  }

  .icon-bar svg {
    margin: 0 15px;
    cursor: pointer;
  }

  .text-input,
  .item-wrapper {
    margin: 0 20px 10px;
  }

  .color-picker__wrapper {
    display: inline-flex;
    margin: 16px 20px 8px;
  }

  .slider__wrapper {
    display: inline-flex;
    margin: 0 20px;
  }

  .slider__wrapper svg {
    margin: 12px 0 0 10px;
  }

  .mini-text-input {
    margin: 0 20px;
  }
</style>
