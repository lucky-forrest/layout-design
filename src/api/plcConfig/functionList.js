import { service as request, requestData } from '@/utils/request'

export function getFunctionList(condition) {
  return request({
    url: '/blockcontroller/getFunctionList',
    method: 'post',
    data: requestData({
      messageName: 'getFunctionList',
      body: condition
    })
  })
}

export function cloneFunction(condition) {
  return request({
    url: '/blockcontroller/cloneFunction',
    method: 'post',
    data: requestData({
      messageName: 'cloneFunction',
      body: condition
    })
  })
}

export function saveFunction(condition) {
  return request({
    url: '/blockcontroller/saveFunction',
    method: 'post',
    data: requestData({
      messageName: 'saveFunction',
      body: condition
    })
  })
}

export function removeFunction(condition) {
  return request({
    url: '/blockcontroller/deleteFunction',
    method: 'post',
    data: requestData({
      messageName: 'deleteFunction',
      body: condition
    })
  })
}
