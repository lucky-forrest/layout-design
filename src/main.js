/*
 * @Description  :
 * @Author       : forrest
 * @Date         : 2020-01-20 15:08:23
 * @LastEditors  : forrest
 * @LastEditTime : 2020-09-24 09:38:21
 * @LastEditDesc :
 * @FilePath     : /CSOT-Tools-UI/src/main.js
 * @知识越丰富就越明白自己有多无知——托马斯.杰斐逊
 */

import Vue from 'vue'
import Cookies from 'js-cookie'
import _ from 'lodash'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './permission' // permission control
import './mock' // simulation data

import * as filters from './filters' // global filters
import * as directives from './directive'

Vue.use(Element, {
  size: Cookies.get('size') || 'mini', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// register global utility directive.
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

// [ 可选插件组件 ] 分割面板
import 'splitpanes/dist/splitpanes.css'
// import splitpanes from 'splitpanes'
// Vue.component('splitpanes', splitpanes)

// [ 可选插件组件 ] 右键菜单
import contentmenu from 'v-contextmenu'
import 'v-contextmenu/dist/index.css'
Vue.use(contentmenu)

// [ 可选插件组件 ] iview
import 'iview/dist/styles/iview.css'
import { Split } from 'iview'
Vue.component('Split', Split)

import VueSVGIcon from 'vue-svgicon'
Vue.use(VueSVGIcon, {
  tagName: 'svgicon',
  classPrefix: 'vue-svg',
  defaultWidth: '1em',
  defaultHeight: '1em',
  isStroke: false, // 默认情况下使用笔触样式
  isOriginalDefault: true // 默认情况下使用原始色
})

import Tooltip from 'vue-directive-tooltip'
Vue.use(Tooltip, {
  class: 'tooltip-vuegg',
  placement: 'top',
  delay: 50
})

import '@/styles/design.scss'
import VueMDCAdapter from 'vue-mdc-adapter'
Vue.use(VueMDCAdapter)

Object.defineProperty(Vue.prototype, '$lodash', { value: _ })
Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info)
}

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
