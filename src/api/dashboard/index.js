import { service as request, requestData } from '@/utils/request'

export function getAllLineList(condition) {
  return request({
    url: '/blockcontroller/getLineList',
    method: 'post',
    data: requestData({
      messageName: 'GetLineListRequest',
      body: condition
    })
  })
}

export function getBundleList(baseURL, condition) {
  return request({
    baseURL,
    url: '/blockcontroller/getbundlelist',
    method: 'post',
    data: requestData({
      messageName: 'GetBundleListRequest',
      body: condition
    })
  })
}

export function getBundleInfo(baseURL, condition) {
  return request({
    baseURL,
    url: '/blockcontroller/selectbundleinfo',
    method: 'post',
    data: requestData({
      messageName: 'SelectBundleInfoRequest',
      body: condition
    })
  })
}

export function operationBundle(baseURL, userName, condition) {
  return request({
    baseURL,
    url: '/blockcontroller/operationbundle',
    method: 'post',
    data: requestData({
      userName,
      messageName: 'OperationBundleRequest',
      body: condition
    })
  })
}
