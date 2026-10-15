<template>
  <div>
    <menu-toggle menu-header="常规">
      <dim-pos
        :height="h"
        :width="w"
        :has-pos="false"
        @change="({type, value}) => emitChanges(type, value)"/>
      <slider
        :value="sty['opacity'] || 1"
        label="不透明度"
        min="0"
        max="1"
        @change="currentValue => onStyleChanges('opacity', currentValue)"/>
      <color-picker
        :color="sty['background-color']"
        label="背景颜色"
        @input="newColor => onStyleChanges('background-color', newColor)"/>
    </menu-toggle>
    <menu-toggle menu-header="实际尺寸与比例">
      <div class="setting-row">
        <span class="setting-label">总长</span>
        <el-input
          v-model="mmWidth"
          placeholder="未设置"
          @change="onMmChange">
          <template slot="append">mm</template>
        </el-input>
      </div>
      <div class="setting-row">
        <span class="setting-label">总宽</span>
        <el-input
          v-model="mmHeight"
          placeholder="未设置"
          @change="onMmChange">
          <template slot="append">mm</template>
        </el-input>
      </div>
      <p class="setting-hint">{{ scaleText }}</p>
      <p class="setting-hint">
        填了这一页在现场的实际长宽后，画布会给出比例尺，
        导出的设备清单也会同时给出毫米坐标。
      </p>
    </menu-toggle>
    <menu-toggle menu-header="底图">
      <div class="setting-row">
        <input
          ref="bgInput"
          class="bg-file"
          type="file"
          accept="image/*"
          @change="onPickBackground">
        <el-button size="mini" @click="pickBackground">
          {{ background ? '更换图片' : '选择图片' }}
        </el-button>
        <el-button v-if="background" size="mini" type="text" @click="removeBackground">
          移除
        </el-button>
      </div>
      <template v-if="background">
        <div class="setting-row">
          <span class="setting-label">宽度</span>
          <el-input-number
            :value="background.width"
            :min="20"
            :max="20000"
            size="mini"
            controls-position="right"
            @change="onBackgroundChange('width', $event)"/>
        </div>
        <div class="setting-row">
          <span class="setting-label">位置</span>
          <el-input-number
            :value="background.x"
            size="mini"
            controls-position="right"
            @change="onBackgroundChange('x', $event)"/>
          <el-input-number
            :value="background.y"
            size="mini"
            controls-position="right"
            @change="onBackgroundChange('y', $event)"/>
        </div>
        <div class="setting-row">
          <span class="setting-label">旋转</span>
          <el-slider
            :value="background.rotate || 0"
            :min="-180"
            :max="180"
            @change="onBackgroundChange('rotate', $event)"/>
        </div>
        <slider
          :value="typeof background.opacity === 'number' ? background.opacity : 1"
          label="不透明度"
          min="0"
          max="1"
          @change="currentValue => onBackgroundChange('opacity', currentValue)"/>
        <div class="setting-row">
          <span class="setting-label">导出</span>
          <el-switch
            :value="background.inExport !== false"
            active-text="成图包含底图"
            inactive-text="成图不含底图"
            @change="onBackgroundChange('inExport', $event)"/>
        </div>
        <p class="setting-hint">
          底图固定垫在元件之下，画布上不可点选、不可拖动（相当于已锁定），
          位置与尺寸在上方填写；原图请自行留存，底图会随工程一起保存。
        </p>
      </template>
      <p v-else class="setting-hint">
        导入现场照片或 CAD 导出图作为底图，方便对照实际产线摆放元件。
      </p>
    </menu-toggle>
  </div>
</template>

<script>
import cloneDeep from 'clone-deep'
import { mapMutations } from 'vuex'
import Slider from './controls/Slider'
import ColorPicker from './controls/ColorPicker'
import MenuToggle from '@/views/layouteditor/components/editor/common/MenuToggle'
import DimPos from './controls/DimPos'
import { scaleLabel } from '@/helpers/scale'
import { getNodeBoxSize } from '@/helpers/positionDimension'
import { updatePage } from '@/store/types'

export default {
  name: 'PageSettings',
  components: {
    Slider,
    ColorPicker,
    MenuToggle,
    DimPos
  },
  /* eslint-disable */
  props: ['height', 'width', 'styles','attrs'],
  data: function() {
    return {
      h: this.height,
      w: this.width,
      sty: cloneDeep(this.styles),
      att: cloneDeep(this.attrs),
      mmWidth: '',
      mmHeight: ''
    }
  },
  computed: {
    page() {
      return this.$store.state.layoutEditor.selectedPage
    },
    scaleText() {
      return scaleLabel(this.page)
    },
    background() {
      const bg = this.att && this.att.background
      return bg && bg.src ? bg : null
    },
    /** 页面实际像素宽度，用来给底图定一个合理初始宽度 */
    pagePixelWidth() {
      const size = getNodeBoxSize(this.page)
      return (size && size.width) || 1200
    }
  },
  watch: {
    'height'(val) { this.h = val.toString() },
    'width'(val) { this.w = val.toString() },
    'styles'(val) { this.sty = cloneDeep(val) },
    'attrs'(val) { this.att = cloneDeep(val) },
    page: {
      handler(val) { this.syncMm(val) },
      immediate: true
    }
  },
  methods: {
    /** 页面切换时同步已填写实际尺寸 */
    syncMm(page) {
      const mm = (page && page.mm) || {}
      this.mmWidth = (mm.width) ? String(mm.width) : ''
      this.mmHeight = (mm.height) ? String(mm.height) : ''
    },
    onMmChange() {
      if (!this.page) return
      this.updatePage({
        page: this.page,
        mm: { width: this.mmWidth, height: this.mmHeight }
      })
    },

    pickBackground() {
      const input = this.$refs.bgInput
      if (input) input.click()
    },

    /** 读取本地图片为 dataURL，随工程一起保存，换机器也还在 */
    onPickBackground(e) {
      const file = e.target.files && e.target.files[0]
      e.target.value = ''
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        const src = reader.result
        const image = new Image()
        image.onload = () => {
          const maxWidth = this.pagePixelWidth
          const natural = image.naturalWidth || maxWidth
          this.att.background = Object.assign({}, this.att.background, {
            src,
            name: file.name,
            width: Math.round(Math.min(natural, maxWidth)),
            x: 0,
            y: 0,
            rotate: 0,
            opacity: 1,
            inExport: true
          })
          this.emitChanges('attrs', this.att)
        }
        image.onerror = () => {
          if (this.$message) this.$message.warning('图片解析失败，请换一张试试')
        }
        image.src = src
      }
      reader.readAsDataURL(file)
    },

    onBackgroundChange(prop, value) {
      if (!this.background) return
      const next = Object.assign({}, this.att.background)
      next[prop] = value
      this.att.background = next
      this.emitChanges('attrs', this.att)
    },

    removeBackground() {
      const next = Object.assign({}, this.att)
      delete next.background
      this.att = next
      this.emitChanges('attrs', this.att)
    },
    onStyleChanges(prop, value) {
      this.sty[prop] = value
      this.emitChanges('styles', this.sty)
    },
    onAttrsChanges(prop, value) {
      this.att[prop] = value
      this.emitChanges('attrs', this.att)
    },
    emitChanges(type, value) {
      this.$emit('propchange', { type, value })
    },
    ...mapMutations([updatePage])
  }
}
</script>

<style scoped>
.setting-row {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 14px;
}

.setting-label {
  flex: 0 0 56px;
  min-width: 0;
  box-sizing: border-box;
  padding-right: 8px;
  font-size: 12px;
  color: #606266;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.setting-row > .el-input {
  flex: 1;
  min-width: 0;
}

.setting-row > .el-input-number {
  flex: 1;
  min-width: 0;
  width: auto;
}

.setting-row > .el-input-number + .el-input-number {
  margin-left: 8px;
}

.setting-row > .el-slider {
  flex: 1;
  min-width: 0;
}

.bg-file {
  display: none;
}

.setting-hint {
  padding: 0 20px;
  margin: -6px 0 12px;
  color: #8b9696;
  font-size: 11px;
  line-height: 16px;
}
</style>
