import { service as request, requestData } from '@/utils/request'

export function getLineList(condition) {
  return request({
    url: '/blockcontroller/getLineList',
    method: 'post',
    data: requestData({
      messageName: 'getLineList',
      body: condition
    })
  })
}

export function saveLineInfo(condition, common) {
  return request({
    url: '/blockcontroller/saveLineInfo',
    method: 'post',
    data: requestData({
      messageName: 'saveLineInfo',
      body: condition,
      common: common
    })
  })
}

export function importList(condition) {
  return request({
    url: '/blockcontroller/importList',
    method: 'post',
    data: requestData({
      messageName: 'importList',
      body: condition
    })
  })
}

export function deleteLineInfo(condition) {
  return request({
    url: '/blockcontroller/deleteLineInfo',
    method: 'post',
    data: requestData({
      messageName: 'deleteLineInfo',
      body: condition
    })
  })
}

export function exportList(condition) {
  return request({
    url: '/blockcontroller/exportList',
    method: 'post',
    data: requestData({
      messageName: 'exportList',
      body: condition
    })
  })
}

