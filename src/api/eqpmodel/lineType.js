import { service as request, requestData } from '@/utils/request'

export function getLineTypeList(condition) {
  return request({
    url: '/blockcontroller/getLineTypeList',
    method: 'post',
    data: requestData({
      messageName: 'getLineTypeList',
      body: condition
    })
  })
}

export function deleteLineTypeInfo(condition) {
  return request({
    url: '/blockcontroller/deleteLineTypeInfo',
    method: 'post',
    data: requestData({
      messageName: 'deleteLineTypeInfo',
      body: condition
    })
  })
}

export function saveLineTypeInfo(condition) {
  return request({
    url: '/blockcontroller/saveLineTypeInfo',
    method: 'post',
    data: requestData({
      messageName: 'saveLineTypeInfo',
      body: condition
    })
  })
}
