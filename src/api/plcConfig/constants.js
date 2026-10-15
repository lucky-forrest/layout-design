import { service as request, requestData } from '@/utils/request'

export function getConstantsList(condition) {
  return request({
    url: '/blockcontroller/getConstantsList',
    method: 'post',
    data: requestData({
      messageName: 'getConstantsList',
      body: condition
    })
  })
}

export function updateConstants(condition) {
  return request({
    url: '/blockcontroller/updateConstants',
    method: 'post',
    data: requestData({
      messageName: 'updateConstants',
      body: condition
    })
  })
}

export function saveConstants(condition) {
  return request({
    url: '/blockcontroller/updateConstants',
    method: 'post',
    data: requestData({
      messageName: 'updateConstants',
      body: condition
    })
  })
}

export function insertConstants(condition) {
  return request({
    url: '/blockcontroller/insertConstants',
    method: 'post',
    data: requestData({
      messageName: 'insertConstants',
      body: condition
    })
  })
}

export function getConstantsByWord(condition) {
  return request({
    url: '/blockcontroller/getConstantsByWord',
    method: 'post',
    data: requestData({
      messageName: 'getConstantsByWord',
      body: condition
    })
  })
}

export function deleteConstants(condition) {
  return request({
    url: '/blockcontroller/deleteConstants',
    method: 'post',
    data: requestData({
      messageName: 'deleteConstants',
      body: condition
    })
  })
}
