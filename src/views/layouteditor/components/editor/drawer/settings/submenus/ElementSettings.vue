<template>
  <div>
    <menu-toggle v-if="primaryKey" menu-header="基础">
      <div class="setting-row">
        <span class="setting-label">主键</span>
        <el-input
          v-model="title"
          @input="value => emitChanges('primaryKey', value, true)"
        />
      </div>
      <div class="setting-row">
        <span class="setting-label">别名</span>
        <el-input
          v-model="att.nickName"
          @input="value => onAttrsChanges('nickName', value, true)"
        />
      </div>
      <div v-if="att.hasOwnProperty('row')" class="setting-row">
        <span class="setting-label">行</span>
        <el-input
          v-model="att.row"
          @input="value => onAttrsChanges('row', value)"
        />
      </div>
      <div v-if="att.hasOwnProperty('col')" class="setting-row">
        <span class="setting-label">列</span>
        <el-input
          v-model="att.col"
          @input="value => onAttrsChanges('col', value)"
        />
      </div>
      <div v-if="att.hasOwnProperty('direction')" class="setting-row">
        <span class="setting-label">方向</span>
        <el-radio-group
          v-model="att.direction"
          @change="value => onAttrsChanges('direction', value)"
        >
          <el-radio label="left">向左</el-radio>
          <el-radio label="right">向右</el-radio>
        </el-radio-group>
      </div>
      <div v-if="['dynamictags'].includes(type)" class="setting-block">
        <span class="setting-label">动态标签</span>
        <table class="tags-table">
          <thead>
            <tr>
              <th>值</th>
              <th>颜色</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in att.children" :key="index">
              <td>
                <el-input
                  v-model="item.value"
                  placeholder="请输入..."
                  @change="e => onAttrsChanges('children', att.children)"
                />
              </td>
              <td>
                <el-color-picker
                  v-model="item.color"
                  style="margin-top:5px;"
                  @change="e => onAttrsChanges('children', att.children)"
                />
              </td>
              <td>
                <el-button
                  type="text"
                  icon="el-icon-delete"
                  @click="removeItemHandler(att.children, index)"
                />
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align:right;">
                <a @click="addItemHandler(att.children)">
                  <svg-icon :icon-class="'plus'" />新增
                </a>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <text-align
        v-if="['custom-text', 'dynamictags'].includes(type)"
        :text-align="sty['text-align']"
        label="对齐"
        @change="newValue => onStyleChanges('text-align', newValue)"
      />
      <slider
        v-if="['custom-text', 'dynamictags'].includes(type)"
        :value="parseInt(sty['font-size']) || 16"
        label="字号"
        min="1"
        max="100"
        step="1"
        @change="
          currentValue => onStyleChanges('font-size', currentValue + 'px')
        "
      />
      <color-picker
        v-if="['custom-text', 'dynamictags'].includes(type)"
        :color="sty['color']"
        label="文字颜色"
        @input="newColor => onStyleChanges('color', newColor)"
      />
      <icon-select
        v-if="att.hasOwnProperty('bgColor')"
        :value="att['bgColor'] || ''"
        label="背景色"
        @change="currentValue => onAttrsChanges('bgColor', currentValue)"
      >
        <el-option
          v-for="(item, index) in pageGlobal[type]"
          :key="`bgColor-option${index}`"
          :label="item.nickName"
          :value="item.bindKey"
        />
      </icon-select>
      <icon-select
        v-if="att.hasOwnProperty('borderColor')"
        :value="att['borderColor'] || ''"
        label="边框色"
        @change="currentValue => onAttrsChanges('borderColor', currentValue)"
      >
        <el-option
          v-for="(item, index) in pageGlobal[type]"
          :key="`borderColor-option${index}`"
          :label="item.nickName"
          :value="item.bindKey"
        />
      </icon-select>
    </menu-toggle>
    <menu-toggle menu-header="状态">
      <div class="setting-row">
        <span class="setting-label">锁定</span>
        <el-switch
          :value="locked"
          @change="onLockedChange"
        />
        <span class="setting-state">{{ locked ? '已锁定' : '未锁定' }}</span>
      </div>
      <div class="setting-row">
        <span class="setting-label">隐藏</span>
        <el-switch
          :value="!!att.hidden"
          @change="onHiddenChange"
        />
        <span class="setting-state">{{ att.hidden ? '编辑态隐藏' : '显示' }}</span>
      </div>
      <p class="setting-hint">
        锁定后不可选中、不可拖动，按住 Alt 点击可临时选中；
        隐藏只在编辑态生效，导出的图片与设备清单仍然包含它。
      </p>
    </menu-toggle>
    <menu-toggle :hidden="!sty || !sty.hasOwnProperty('clip-path')" menu-header="裁剪路径" >      <playground :clip-path="sty['clip-path']" :coords="getPointsBycss(sty['clip-path'])" @change="clipPath => onStyleChanges('clip-path', clipPath)" />
    </menu-toggle>
    <menu-toggle :hidden="!att.hasOwnProperty('src')" menu-header="图片">
      <ul class="flex-container">
        <li
          v-tooltip="item.replace('layout-', '')"
          v-for="(item, index) in iconList"
          :key="index"
          class="li-svg-icon"
          @click="onAttrsChanges('src', `equipment/${item}`)"
        >
          <svgicon :icon="`equipment/${item}`" width="24" height="24" />
        </li>
      </ul>
      <div class="setting-row">
        <span class="setting-label">旋转</span>
        <el-input-number
          v-model="att['rotate']"
          :step="45"
          :min="-360"
          :max="360"
          :precision="0"
          class="setting-row__control"
          @change="currentValue => onAttrsChanges('rotate', currentValue)"
        />
      </div>
    </menu-toggle>
    <menu-toggle menu-header="常规">
      <dim-pos
        :height="h"
        :width="w"
        :top="t"
        :bottom="b"
        :left="l"
        :right="r"
        @change="onDimPosChange"
      />
      <color-picker
        :color="sty['background-color']"
        label="背景颜色"
        @input="newColor => onStyleChanges('background-color', newColor)"
      />
      <stack-order
        :z-index="z"
        @change="newValue => emitChanges('zIndex', newValue)"
      />
      <slider
        :value="sty['opacity'] || 1"
        label="不透明度"
        min="0"
        max="1"
        @change="currentValue => onStyleChanges('opacity', currentValue)"
      />
    </menu-toggle>
    <menu-toggle
      :hidden="!att.hasOwnProperty('backgroundImage')"
      menu-header="背景图片"
    >
      <ul class="flex-container">
        <li
          v-tooltip="item.name"
          v-for="(item, index) in imageList"
          :key="index"
          class="img-item"
          @click="onAttrsChanges('backgroundImage', item.path)"
        >
          <el-image
            :src="item.path"
            :alt="item.name"
            :fit="'scale-down'"
            style="width:100%;height:100%;"
          />
        </li>
      </ul>
    </menu-toggle>
    <menu-toggle menu-header="边框">
      <icon-select
        :value="borderSelected"
        label="边框"
        @change="newValue => (borderSelected = newValue)"
      >
        <el-option label="全部边框" value=""/>
        <el-option label="上" value="-top"/>
        <el-option label="下" value="-bottom"/>
        <el-option label="左" value="-left"/>
        <el-option label="右" value="-right"/>
      </icon-select>
      <slider
        :value="parseInt(sty['border-radius']) || 0"
        label="圆角"
        min="0"
        max="500"
        step="1"
        @change="
          currentValue => onStyleChanges('border-radius', currentValue + 'px')
        "
      />
      <icon-select
        :value="sty['border' + borderSelected + '-style'] || 'inherit'"
        label="样式"
        @change="
          currentValue =>
            onStyleChanges('border' + borderSelected + '-style', currentValue)
        "
      >
        <el-option label="无" value="none"/>
        <el-option label="点线" value="dotted"/>
        <el-option label="虚线" value="dashed"/>
        <el-option label="实线" value="solid"/>
        <el-option label="双线" value="double"/>
        <el-option label="槽线" value="groove"/>
        <el-option label="脊线" value="ridge"/>
        <el-option label="内嵌" value="inset"/>
        <el-option label="外凸" value="outset"/>
        <el-option label="继承" value="inherit"/>
      </icon-select>
      <slider
        :value="parseInt(sty['border' + borderSelected + '-width']) || 0"
        label="边框宽度"
        min="0"
        max="25"
        step="1"
        @change="
          currentValue =>
            onStyleChanges(
              'border' + borderSelected + '-width',
              currentValue + 'px'
            )
        "
      />
      <color-picker
        :color="sty['border' + borderSelected + '-color']"
        label="边框颜色"
        @input="
          newColor =>
            onStyleChanges('border' + borderSelected + '-color', newColor)
        "
      />
    </menu-toggle>
  </div>
</template>
<script>
import MenuToggle from '@/views/layouteditor/components/editor/common/MenuToggle'
import WebSafeFonts from '@/assets/design/WebSafeFonts'
import { getPointsBycss } from './../clip-path/lib/utilities'
import Playground from './../clip-path/Playground'
import ColorPicker from './controls/ColorPicker'
import IconSelect from './controls/IconSelect'
import StackOrder from './controls/StackOrder'
import TextAlign from './controls/TextAlign'
import FontStyle from './controls/FontStyle'
import '@/assets/design/icons/equipment/index'
import iconList from '@/assets/design/unit-port'
import DimPos from './controls/DimPos'
import Slider from './controls/Slider'
import cloneDeep from 'clone-deep'
import { mapActions, mapState } from 'vuex'
import { setElementsFlag } from '@/store/types'
import notify from '@/views/layouteditor/components/mixins/notify'

const iconReqest = require.context(
  '@/assets/images',
  true,
  /\.(jpe?g|gif|png|svg)$/
)
const requireAll = (requireContext, floder) => {
  return requireContext
    .keys()
    .filter(path => {
      return path.includes(floder)
    })
    .map(path => {
      return {
        id: '',
        name: path.replace(/^\.\/\w*\//, '').replace(/\.\w+/, ''),
        type: floder,
        extName: path.substr(path.lastIndexOf('.') + 1),
        path: `${requireContext(path)}`
      }
    })
    .filter(({ path }) => path.includes('/static'))
}
export default {
  name: 'ElementSettings',
  components: {
    Playground,
    MenuToggle,
    Slider,
    IconSelect,
    ColorPicker,
    StackOrder,
    TextAlign,
    FontStyle,
    DimPos
  },
  mixins: [notify],
  /* eslint-disable */
  props: [
    "height",
    "width",
    "top",
    "left",
    "bottom",
    "right",
    "zIndex",
    "primaryKey",
    "name",
    "text",
    "styles",
    "attrs"
  ],
  data: function() {
    return {
      h: this.height,
      w: this.width,
      t: this.top,
      l: this.left,
      b: this.bottom,
      r: this.right,
      z: this.zIndex,
      txt: this.text,
      sty: cloneDeep(this.styles),
      att: cloneDeep(Object.assign({}, this.attrs, { nickName: (this.attrs && this.attrs.nickName) || '' })),
      fonts: WebSafeFonts,
      borderSelected: "",
      title: this.primaryKey,
      type: this.name,
      iconList: iconList,
      pageGlobal: window.config,
      imageList: requireAll(iconReqest, "equipment")
    };
  },
  watch: {
    height(val) {
      this.h = val.toString();
    },
    width(val) {
      this.w = val.toString();
    },
    top(val) {
      this.t = val.toString();
    },
    left(val) {
      this.l = val.toString();
    },
    bottom(val) {
      this.b = val.toString();
    },
    right(val) {
      this.r = val.toString();
    },
    zIndex(val) {
      this.z = val;
    },
    text(val) {
      this.txt = val;
    },
    styles(val) {
      this.sty = cloneDeep(val);
    },
    attrs(val) {
      this.att = cloneDeep(Object.assign({}, val, { nickName: (val && val.nickName) || '' }));
    },
    primaryKey(val) {
      this.title = val;
    },
    name(val) {
      this.type = val;
    }
  },
  computed: {
    locked() {
      const element = this.selectedElements[0]
      return !!(element && element.locked)
    },
    ...mapState({
      selectedElements: state => state.layoutEditor.selectedElements || []
    })
  },
  methods: {
    /** 锁定：不可选中、不可拖动，鼠标悬停不显示可拖拽光标 */
    onLockedChange(value) {
      const result = this.setElementsFlag({ flag: 'locked', value })
      if (result.ok) {
        this.notifySuccess(value ? "已锁定，可在「图层」面板解锁" : "已解锁");
      } else {
        this.notifyWarning(result.error);
      }
    },
    /** 编辑态隐藏：只在画布上不显示，导出图片与清单仍然包含 */
    onHiddenChange(value) {
      this.att.hidden = !!value;
      this.onAttrsChanges("hidden", !!value);
      this.notifySuccess(value ? "已在编辑态隐藏，导出仍然包含" : "已恢复显示");
    },
    onStyleChanges(prop, value) {
      this.sty[prop] = value;
      this.emitChanges("styles", this.sty);
    },
    onAttrsChanges(prop, value, isText) {
      this.att[prop] = value;
      this.emitChanges("attrs", this.att, isText);
    },
    /** 尺寸/位置输入：手动输入合并提交，勾选框这类离散操作立即提交 */
    onDimPosChange({ type, value, instant }) {
      this.emitChanges(type, value, !instant);
    },
    emitChanges(type, value, isText) {
      this.$emit("propchange", { type, value, isText: !!isText });
    },
    addItemHandler(children) {
      children.push({ value: "", color: "red" });
      this.onAttrsChanges("children", children);
    },
    removeItemHandler(children, removeIndex) {
      children.splice(removeIndex, 1);
      this.onAttrsChanges("children", children);
    },
    getPointsBycss,
    ...mapActions([setElementsFlag])
  }
};
</script>

<style lang="scss" scoped>
.setting-row {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 14px;
}

.setting-hint {
  padding: 0 20px 4px;
  margin: -6px 0 10px;
  color: #8b9696;
  font-size: 11px;
  line-height: 16px;
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

/* 开关右侧的当前状态文字，避免 el-switch 双文字并排拥挤 */
.setting-state {
  margin-left: 10px;
  font-size: 12px;
  color: #606266;
  white-space: nowrap;
}

.setting-row > .el-input,
.setting-row > .el-radio-group {
  flex: 1;
  min-width: 0;
}

.setting-row > .el-input-number.setting-row__control {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.setting-block {
  padding: 0 20px;
  margin-bottom: 14px;
}

.setting-block .setting-label {
  display: block;
  margin-bottom: 6px;
}

.tags-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 2px 4px;
    text-align: center;
    line-height: 26px;
    border: 1px solid #e3e3e3;
  }
}

.flex-container {
  display: flex;
  flex-flow: row wrap;
  padding: 10px 20px;
  list-style: none;

  .li-svg-icon {
    display: inline-block;
    width: 24%;
    height: 40px;
    text-align: center;
    .vue-svg-icon {
      vertical-align: -18px;
      line-height: 40px;
    }
  }
  .img-item {
    width: 45%;
    height: 80px;
    padding: 5px;
    &:hover {
      box-shadow: 0px 0px 5px 1px #000;
    }
  }
}

.li-svg-icon:hover {
  border: 1px solid black;
  background-color: #e3e3e3;
}
</style>
