import { service as request, requestData } from '@/utils/request'

export function getAddressRangeList(condition) {
  return request({
    url: '/blockcontroller/getAddressRangeList',
    method: 'post',
    data: requestData({
      messageName: 'getAddressRangeList',
      body: condition
    })
  })
}

export function updateAddressRange(condition) {
  return request({
    url: '/blockcontroller/updateAddressRange',
    method: 'post',
    data: requestData({
      messageName: 'updateAddressRange',
      body: condition
    })
  })
}

export function getAddressMap(condition) {
  return request({
    url: '/addressMapService/getAddressMap',
    method: 'post',
    data: requestData({
      messageName: 'getAddressMap',
      body: condition
    })
  })
}

export function updateAddressMapData(condition) {
  return request({
    url: '/addressMapService/updateAddressMapData',
    method: 'post',
    data: requestData({
      messageName: 'updateAddressMapData',
      body: condition
    })
  })
}

export function saveAddressMap(condition) {
  return request({
    url: '/addressMapService/saveAddressMap',
    method: 'post',
    data: requestData({
      messageName: 'saveAddressMap',
      body: condition
    })
  })
}
