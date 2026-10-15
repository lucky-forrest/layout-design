import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
NProgress.configure({ showSpinner: false })// NProgress Configuration

// 精简模式：无需登录、无动态路由，首次进入仅初始化默认用户（保持权限指令可用）
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (!store.state.user.userInited) {
    store.dispatch('GetUserInfo').then(() => {
      next()
    }).catch(() => {
      next()
    })
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
