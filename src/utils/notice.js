import { MessageBox } from 'element-ui'
import Cookies from 'js-cookie'

function getlanguage() {
  const notice =
    Cookies.get('language') === 'zh'
      ? { systemTip: '系统提示', sure: '确认', cancel: '取消' }
      : { systemTip: 'System Tip', sure: 'Sure', cancel: 'Cancel' }
  return notice
}

function success(content = '', okCallback = res => {}) {
  if (!content) {
    return false
  }
  const notice = getlanguage()
  MessageBox.alert(content, notice.systemTip, {
    confirmButtonText: notice.sure,
    type: 'success',
    callback: okCallback
  })
}

function error(content = '', okCallback = () => {}) {
  const notice = getlanguage()
  MessageBox.alert(content, notice.systemTip, {
    confirmButtonText: notice.sure,
    type: 'warning',
    callback: okCallback
  })
}

function confirm(content = '', okCallBack, cancelCallBack = () => {}) {
  const notice = getlanguage()
  MessageBox.confirm(content, notice.systemTip, {
    confirmButtonText: notice.sure,
    cancelButtonText: notice.cancel,
    type: 'info'
  })
    .then(() => {
      okCallBack()
    })
    .catch(() => {
      cancelCallBack()
    })
}

const message = {
  time: 0,
  timer: null,
  show: (title = '') => {
    const tempTitle = title.replace('【　　　】', '').replace('【Alarm】', '')
    message.timer = setInterval(() => {
      message.time++
      if (message.time % 2 === 0) {
        document.title = `${tempTitle}【Alarm】`
      } else {
        document.title = tempTitle + '【　　　】'
      }
    }, 300)
    return [message.timer, tempTitle]
  },
  clear: (title = '') => {
    clearInterval(message.timer)
    document.title = title
  }
}

export default {
  success,
  error,
  confirm,
  message
}
