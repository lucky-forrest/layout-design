/*
 * @Description  :
 * @Author       : forrest
 * @Date         : 2020-01-20 15:08:23
 * @LastEditors  : forrest
 * @LastEditTime : 2020-09-24 09:38:21
 * @LastEditDesc :
 * @FilePath     : /Layout-Design-UI/src/main.js
 * @知识越丰富就越明白自己有多无知——托马斯.杰斐逊
 */

import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import '@/assets/icons' // global svg icons
import './permission' // permission control

Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})

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
  class: 'tooltip',
  placement: 'top',
  delay: 50
})

import '@/styles/design.scss'

Vue.config.productionTip = false
Vue.config.errorHandler = (err, vm, info) => {
  console.log(err, vm, info)
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
