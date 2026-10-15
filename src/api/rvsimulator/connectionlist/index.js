import { service as request, requestData } from '@/utils/request'

export function saveConnection(condition) {
  return request({
    url: '/RvConnectionService/saveConnection',
    method: 'post',
    data: requestData({
      messageName: 'saveConnection',
      body: condition
    })
  })
}

export function deleteConnection(condition) {
  return request({
    url: '/RvConnectionService/deleteConnection',
    method: 'post',
    data: requestData({
      messageName: 'deleteConnection',
      body: condition
    })
  })
}

export function getConnectionList(condition) {
  return request({
    url: '/RvConnectionService/getConnectionList',
    method: 'post',
    data: requestData({
      messageName: 'getConnectionList',
      body: condition
    })
  })
}
