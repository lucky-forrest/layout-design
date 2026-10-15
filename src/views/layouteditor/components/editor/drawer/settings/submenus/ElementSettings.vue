<template>
  <div>
    <menu-toggle v-if="primaryKey" menu-header="Basic">
      <div class="menu">
        <mdc-textfield
          v-model="title"
          class="text-item"
          label="PrimaryKey"
          dense
          required
          @keyup.native="e => emitChanges('primaryKey', e.target.value)"
        />
        <mdc-textfield
          v-model="att.nickName"
          class="text-item"
          label="NickName"
          dense
          required
          @keyup.native="e => onAttrsChanges('nickName', e.target.value)"
        />
        <mdc-textfield
          v-if="att.hasOwnProperty('row')"
          v-model="att.row"
          class="text-item"
          label="Row"
          dense
          @keyup.native="e => onAttrsChanges('row', e.target.value)"
        />
        <mdc-textfield
          v-if="att.hasOwnProperty('col')"
          v-model="att.col"
          class="text-item"
          label="Col"
          dense
          @keyup.native="e => onAttrsChanges('col', e.target.value)"
        />
        <div v-if="att.hasOwnProperty('direction')" class="inline-form">
          <el-radio-group
            v-model="att.direction"
            @change.native="e => onAttrsChanges('direction', e.target.value)"
          >
            <el-radio label="left">向左</el-radio>
            <el-radio label="right">向右</el-radio>
          </el-radio-group>
        </div>
        <div v-if="['dynamictags'].includes(type)" class="inline-form">
          <table>
            <thead>
              <tr>
                <th>Value</th>
                <th>Color</th>
                <th>Action</th>
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
                    <svg-icon :icon-class="'plus'" />1
                  </a>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <text-align
          v-if="['custom-text', 'dynamictags'].includes(type)"
          :text-align="sty['text-align']"
          @change="newValue => onStyleChanges('text-align', newValue)"
        />
        <slider
          v-if="['custom-text', 'dynamictags'].includes(type)"
          :value="parseInt(sty['font-size']) || 16"
          label="Font size"
          icon="system/editor/font_size"
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
          label="Text Color"
          icon="system/editor/text_color"
          @input="newColor => onStyleChanges('color', newColor)"
        />
        <icon-select
          v-if="att.hasOwnProperty('bgColor')"
          :value="att['bgColor'] || ''"
          class="text-item"
          icon="system/editor/list"
          label="BgColor"
          @change="currentValue => onAttrsChanges('bgColor', currentValue)"
        >
          <option
            v-for="(item, index) in pageGlobal[type]"
            :key="`bgColor-option${index}`"
            :value="item.bindKey"
          >
            {{ item.nickName }}
          </option>
        </icon-select>
        <icon-select
          v-if="att.hasOwnProperty('borderColor')"
          :value="att['borderColor'] || ''"
          class="text-item"
          icon="system/editor/list"
          label="BorderColor"
          @change="currentValue => onAttrsChanges('borderColor', currentValue)"
        >
          <option
            v-for="(item, index) in pageGlobal[type]"
            :key="`borderColor-option${index}`"
            :value="item.bindKey"
          >
            {{ item.nickName }}
          </option>
        </icon-select>
      </div>
    </menu-toggle>
    <menu-toggle :hidden="!sty || !sty.hasOwnProperty('clip-path')" menu-header="Clip-Path" >
      <playground :clip-path="sty['clip-path']" :coords="getPointsBycss(sty['clip-path'])" @change="clipPath => onStyleChanges('clip-path', clipPath)" />
    </menu-toggle>
    <menu-toggle :hidden="!att.hasOwnProperty('src')" menu-header="Image">
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
      <div class="menu">
        <div class="inline-form">
          <label>Rotate</label>
          <el-input-number
            v-model="att['rotate']"
            :step="45"
            :min="-360"
            :max="360"
            :precision="0"
            @change="currentValue => onAttrsChanges('rotate', currentValue)"
          />
        </div>
      </div>
    </menu-toggle>
    <menu-toggle menu-header="General">
      <dim-pos
        :height="h"
        :width="w"
        :top="t"
        :bottom="b"
        :left="l"
        :right="r"
        @change="({ type, value }) => emitChanges(type, value)"
      />
      <div class="menu">
        <color-picker
          :color="sty['background-color']"
          label="Background color"
          icon="system/editor/bg_color"
          @input="newColor => onStyleChanges('background-color', newColor)"
        />
        <stack-order
          :z-index="z"
          @change="newValue => emitChanges('zIndex', newValue)"
        />
      </div>
      <div class="menu">
        <slider
          :value="sty['opacity'] || 1"
          label="Opacity"
          icon="system/editor/opacity"
          min="0"
          max="1"
          @change="currentValue => onStyleChanges('opacity', currentValue)"
        />
      </div>
    </menu-toggle>
    <menu-toggle
      :hidden="!att.hasOwnProperty('backgroundImage')"
      menu-header="Background-Image"
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
    <menu-toggle menu-header="Border">
      <div class="menu">
        <icon-select
          :value="borderSelected"
          :icon="'system/editor/border' + borderSelected"
          class="text-item"
          label="Border"
          @change="newValue => (borderSelected = newValue)"
        >
          <option value="">All borders</option>
          <option value="-top">Top</option>
          <option value="-bottom">Bottom</option>
          <option value="-left">Left</option>
          <option value="-right">Right</option>
        </icon-select>
        <slider
          :value="parseInt(sty['border-radius']) || 0"
          label="Border radius"
          icon="system/editor/corner_radius"
          min="0"
          max="500"
          step="1"
          @change="
            currentValue => onStyleChanges('border-radius', currentValue + 'px')
          "
        />
        <icon-select
          :value="sty['border' + borderSelected + '-style'] || 'inherit'"
          class="text-item"
          icon="system/editor/border_style"
          label="Style"
          @change="
            currentValue =>
              onStyleChanges('border' + borderSelected + '-style', currentValue)
          "
        >
          <option value="none">none</option>
          <option value="dotted">dotted</option>
          <option value="dashed">dashed</option>
          <option value="solid">solid</option>
          <option value="double">double</option>
          <option value="groove">groove</option>
          <option value="ridge">ridge</option>
          <option value="inset">inset</option>
          <option value="outset">outset</option>
          <option value="inherit">inherit</option>
        </icon-select>
        <slider
          :value="parseInt(sty['border' + borderSelected + '-width']) || 0"
          label="Border width"
          icon="system/editor/border_weight"
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
          label="Border color"
          icon="system/editor/border_color"
          @input="
            newColor =>
              onStyleChanges('border' + borderSelected + '-color', newColor)
          "
        />
      </div>
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
      att: cloneDeep(this.attrs),
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
      this.att = cloneDeep(val);
    },
    primaryKey(val) {
      this.title = val;
    },
    name(val) {
      this.type = val;
    }
  },
  methods: {
    onStyleChanges(prop, value) {
      this.sty[prop] = value;
      this.emitChanges("styles", this.sty);
    },
    onAttrsChanges(prop, value) {
      this.att[prop] = value;
      this.emitChanges("attrs", this.att);
    },
    emitChanges(type, value) {
      this.$emit("propchange", { type, value });
    },
    addItemHandler(children) {
      children.push({ value: "", color: "red" });
      this.onAttrsChanges("children", children);
    },
    removeItemHandler(children, removeIndex) {
      children.splice(removeIndex, 1);
      this.onAttrsChanges("children", children);
    },
    getPointsBycss
  }
};
</script>

<style lang="scss" scoped>
.menu {
  width: 100%;
  height: 100%;
  margin: 1px;
  margin-bottom: 10px;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
}

.menu .text-item {
  margin: 0 20px 10px;
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
.inline-form {
  padding: 0 20px;
  label {
    font-size: 9px;
    color: #666;
    font-weight: normal;
  }
}
.inline-form > :last-child {
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 0 5px;
    text-align: center;
    line-height: 25px;
    border: 1px solid #e3e3e3;
  }
}
</style>
<style lang="scss">
.mdc-text-field__input {
  height: auto !important;
}
</style>
