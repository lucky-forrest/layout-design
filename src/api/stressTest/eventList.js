import { service as request, requestData } from '@/utils/request'

export function getEventList(condition) {
  return request({
    url: '/EventService/getEventList',
    method: 'post',
    data: requestData({
      messageName: 'getEventList',
      body: condition
    })
  })
}

export function getBlockList(condition) {
  return request({
    url: '/EventService/getBlockList',
    method: 'post',
    data: requestData({
      messageName: 'getBlockList',
      body: condition
    })
  })
}

export function deleteEvent(condition) {
  return request({
    url: '/EventService/deleteEvent',
    method: 'post',
    data: requestData({
      messageName: 'deleteEvent',
      body: condition
    })
  })
}

export function saveEvent(condition) {
  return request({
    url: '/EventService/saveEvent',
    method: 'post',
    data: requestData({
      messageName: 'saveEvent',
      body: condition
    })
  })
}

