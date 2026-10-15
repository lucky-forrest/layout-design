import { service as request, requestData } from '@/utils/request'

export function getConnectionList(condition) {
  return request({
    url: '/SecsService/getConnectionList',
    method: 'post',
    data: requestData({
      messageName: 'getConnectionList',
      body: condition
    })
  })
}

export function saveConnection(condition) {
  return request({
    url: '/SecsService/saveConnection',
    method: 'post',
    data: requestData({
      messageName: 'saveConnection',
      body: condition
    })
  })
}

export function deleteConnection(condition) {
  return request({
    url: '/SecsService/removeConnection',
    method: 'post',
    data: requestData({
      messageName: 'removeConnection',
      body: condition
    })
  })
}

export function testConnection(condition) {
  return request({
    url: '/SecsService/testConnection',
    method: 'post',
    data: requestData({
      messageName: 'testConnection',
      body: condition
    })
  })
}
