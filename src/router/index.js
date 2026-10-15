import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
* 精简模式：站点仅保留两个页面
*  - /        项目介绍页
*  - /design  Layout 设计页（全屏，无侧边栏/顶部菜单）
* 其余页面与模块路由已移除
**/
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/dashboard/index'),
    name: 'Home',
    meta: { title: '首页' }
  },
  {
    path: '/design',
    component: () => import('@/views/layouteditor/index'),
    name: 'LayoutDesign',
    meta: { title: 'Layout 设计' }
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

// 历史模块路由已移除。精简模式下不再存在异步路由
export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
