
import { getToken, setToken, removeToken, setLocalStorage, getLocalStorage, cleanLocalStorage } from '@/utils/auth'
import { loginByUsername } from '@/api/user'
import _ from 'lodash'

const user = {
  state: {
    token: getToken(),
    userId: '',
    userName: '',
    menuList: [],
    authorityList: [],
    currPageName: '',
    userInfo: {},
    userInited: false
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERID: (state, userId) => {
      state.userId = userId
    },
    SET_USERNAME: (state, userName) => {
      state.userName = userName
    },
    SET_MENULIST: (state, menuList) => {
      state.menuList = menuList
    },
    SET_AUTHORITYLIST: (state, authorityList) => {
      state.authorityList = authorityList
    },
    SET_CURRPAGENAME: (state, pageName) => {
      state.currPageName = pageName
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
    SET_USERINITED: (state, userInited) => {
      state.userInited = userInited
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername({
          factoryName: userInfo.factory,
          userId: username,
          password: userInfo.password
        }).then(({ body }) => {
          const menuList = Array.from(new Set(_.map(body.authorities, 'menuName')))
          const currUserInfo = Object.assign({}, body.toolBcUser, { menuList: menuList, authorityList: body.authorities, factory: userInfo.factory })
          commit('SET_TOKEN', currUserInfo.userId)
          setToken(currUserInfo.userId)
          setLocalStorage('login.user', currUserInfo)
          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    SetPageName({ commit }, pageName) {
      return new Promise((resolve, reject) => {
        commit('SET_CURRPAGENAME', pageName)
        resolve()
      })
    },
    // 获取用户信息（免登录模式：默认以管理员身份进入，拥有全部模块与操作权限）
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          const currUser = {
            userId: 'admin',
            userName: 'Super Admin',
            menuList: [],
            authorityList: []
          }
          commit('SET_TOKEN', currUser.userId)
          commit('SET_USERID', currUser.userId)
          commit('SET_USERNAME', currUser.userName)
          commit('SET_MENULIST', currUser.menuList)
          commit('SET_AUTHORITYLIST', currUser.authorityList)
          commit('SET_USERINFO', currUser)
          commit('SET_USERINITED', true)
          resolve(currUser)
        } catch (err) {
          reject(err)
        }
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
        removeToken()
        cleanLocalStorage()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        cleanLocalStorage()
        resolve()
      })
    }
  }
}

export default user
