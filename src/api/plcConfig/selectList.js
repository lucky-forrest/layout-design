import { service as request, requestData } from '@/utils/request'

export function getShopList(condition) {
  return request({
    url: '/blockcontroller/getShopList',
    method: 'post',
    data: requestData({
      messageName: 'getShopList',
      body: condition
    })
  })
}

export function getLineIdList(condition) {
  return request({
    url: '/blockcontroller/getLineByFactory',
    method: 'post',
    data: requestData({
      messageName: 'getLineByFactory',
      body: condition
    })
  })
}

export function getVersionList(condition) {
  return request({
    url: '/blockcontroller/getVersionList',
    method: 'post',
    data: requestData({
      messageName: 'getVersionList',
      body: condition
    })
  })
}
