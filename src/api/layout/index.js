import { service as request, requestData } from '@/utils/request'

export function getPLCAllConnections(condition) {
  return request({
    url: '/blockcontroller/getPLCAllConnections',
    method: 'post',
    data: requestData({
      messageName: 'getPLCAllConnections',
      body: condition
    })
  })
}

export function stopPLCConnectionByName(condition) {
  return request({
    url: '/blockcontroller/stopPLCConnectionByName',
    method: 'post',
    data: requestData({
      messageName: 'stopPLCConnectionByName',
      body: condition
    })
  })
}
