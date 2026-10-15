import { service as request, requestData } from '@/utils/request'

export function getPortList(condition) {
  return request({
    url: '/blockcontroller/getPortList',
    method: 'post',
    data: requestData({
      messageName: 'getPortList',
      body: condition
    })
  })
}

export function savePortInfo(condition, common) {
  return request({
    url: '/blockcontroller/savePortInfo',
    method: 'post',
    data: requestData({
      messageName: 'savePortInfo',
      body: condition,
      common: common
    })
  })
}

export function deletePortInfo(condition) {
  return request({
    url: '/blockcontroller/deletePortInfo',
    method: 'post',
    data: requestData({
      messageName: 'deletePortInfo',
      body: condition
    })
  })
}

export function importPortList(condition) {
  return request({
    url: '/blockcontroller/importPortList',
    method: 'post',
    data: requestData({
      messageName: 'importPortList',
      body: condition
    })
  })
}
