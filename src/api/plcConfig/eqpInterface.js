import { service as request, requestData } from '@/utils/request'

export function saveEqpInterface(condition) {
  return request({
    url: '/EqpInterfaceService/saveEqpInterface',
    method: 'post',
    data: requestData({
      messageName: 'saveEqpInterface',
      body: condition
    })
  })
}

export function deleteEqpInterface(condition) {
  return request({
    url: '/EqpInterfaceService/deleteEqpInterface',
    method: 'post',
    data: requestData({
      messageName: 'deleteEqpInterface',
      body: condition
    })
  })
}

export function getEqpDetail(condition) {
  return request({
    url: '/EqpInterfaceService/getEqpDetail',
    method: 'post',
    data: requestData({
      messageName: 'getEqpDetail',
      body: condition
    })
  })
}

export function selectInterfaceAddress(condition) {
  return request({
    url: '/addressMapService/selectInterfaceAddress',
    method: 'post',
    data: requestData({
      messageName: 'SelectInterfaceAddress',
      body: condition
    })
  })
}
