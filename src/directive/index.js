import { addEvent } from '@/utils'
import system from '@/config/app'
import store from '@/store'

export const mousewheelX = {
  componentUpdated: function(el, binding, vnode, oldValue) {
    const target = binding.value
      ? el.getElementsByClassName(binding.value)[0]
      : el
    if (target) {
      addEvent(target, 'mousewheel', e => {
        if (e.delta > 0) {
          if (target.scrollLeft !== 0) {
            e.preventDefault()
          }
          target.scrollLeft -= 30
        } else {
          if (![0, 1].includes(Math.abs(Math.round(target.scrollLeft) + Math.round(target.offsetWidth) - target.scrollWidth))) {
            e.preventDefault()
          }
          target.scrollLeft += 30
        }
      })
    }
  }
}

export const authorize = {
  inserted: function(el, binding) {
    let isAuthorize = false
    if (new RegExp(system.privilege, 'i').test(store.state.user.userId)) {
      return true
    } else {
      if (!store.getters.actionList) {
        isAuthorize = false
      } else {
        if (Array.isArray(binding.value)) {
          for (const value of binding.value) {
            if (!store.getters.actionList.includes(value)) {
              isAuthorize = false
              break
            }
          }
        } else {
          isAuthorize = store.getters.actionList.includes(binding.value)
        }
      }
      if (!isAuthorize) {
        el.parentNode.removeChild(el)
      }
    }
  }
}

