import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import app from './modules/app'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import createLine from './modules/createLine'
import socket from './modules/webSocket'
import layoutEditor from './modules/layoutEditor'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  actions,
  modules: {
    app,
    permission,
    tagsView,
    user,
    createLine,
    socket,
    layoutEditor
  },
  getters
})
