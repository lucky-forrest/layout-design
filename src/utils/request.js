import axios from 'axios'
import store from '@/store'
import dayjs from 'dayjs'
import notice from '@/utils/notice'
// create an axios instance
const service = axios.create({
  // transformRequest: [data => {
  //   return `requestJson=${JSON.stringify(data)}`
  // }],
  baseURL: `http://${window.config.serverIp}:${window.config.serverPort}/`,
  timeout: 20000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // // Do something before request is sent
    // if (store.getters.token) {
    //   // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行∂修改
    //   config.headers['X-Token'] = getToken()
    // }
    console.group('请求的数据:')
    console.log(config.url)
    // console.log(config.data)
    console.log(JSON.stringify(config.data, null, 2))
    console.groupEnd()
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过xmlhttprequest来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    /**
     * code为非"0"则抛出错误
     */
    console.log('返回的数据：')
    console.log(response.data)
    const res = response.data
    // console.log(JSON.stringify(res, null, 2))
    const message = store.getters.language === 'zh' ? res.result.returnMessageCH : res.result.returnMessageEN
    if (res.result.returnCode !== '0') {
      notice.error(message)
      return Promise.reject('error')
    } else {
      response.data = Object.assign(response.data, { result: { message }})
      return response.data
    }
  },
  error => {
    console.log('err' + error)
    notice.error(error.message)
    return Promise.reject(error)
  }
)

function throwIfMissing(paraName) {
  console.error(`参数${paraName}是必须的!`)
  throw new Error(`参数${paraName}是必须的!`)
}
// 封装请求参数
function requestData({
  inboxName = store.getters.factory,
  body,
  messageName = throwIfMissing('messageName')(),
  userName = store.getters.userName,
  result = {
    returnCode: '0',
    returnMessageEN: 'Operation sucessful !',
    returnMessageCH: '操作成功！'
  }
}) {
  return {
    header: {
      messageName: messageName,
      transactionId: dayjs().format('YYYYMMDDHHmmssssss'),
      inboxName,
      userName
    },
    body,
    result
  }
}

// 转Json字符串到Json对象
function parseJson(value) {
  return JSON.parse(value).body
}

export { service, requestData, parseJson }
