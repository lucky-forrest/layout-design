import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import layoutEditor from './modules/layoutEditor'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    layoutEditor
  }
})
