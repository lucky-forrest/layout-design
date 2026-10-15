import { asyncRouterMap, constantRouterMap } from '@/router'
import system from '@/config/app'
import _ from 'lodash'
function hasPermissionByName(menuList, authorityList, route) {
  if (route.meta && route.meta.title) {
    return _.map(authorityList, 'pageName').concat(menuList).includes(route.meta.title)
  } else {
    return true
  }
}
function filterAsyncRouterByName(asyncRouterMap, menuList, authorityList) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermissionByName(menuList, authorityList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouterByName(route.children, menuList, authorityList)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, { userId, menuList, authorityList }) {
      return new Promise((resolve, reject) => {
        try {
          let accessedRouters = []
          if (new RegExp(system.privilege, 'i').test(userId)) {
            accessedRouters = asyncRouterMap
          } else {
            accessedRouters = filterAsyncRouterByName(asyncRouterMap, menuList, authorityList).filter(route => {
              return route.children && route.children.length
            })
          }
          // 修复地址输入错误显示404页面问题
          accessedRouters.push({ path: '*', redirect: '/404', hidden: true })
          commit('SET_ROUTERS', accessedRouters)
          resolve()
        } catch (err) {
          reject(err)
        }
      })
    }
  }
}

export default permission
