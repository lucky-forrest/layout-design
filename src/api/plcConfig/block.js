import { service as request, requestData } from '@/utils/request'

export function getBlockList(condition) {
  return request({
    url: 'blockcontroller/getPlcMapBlockList',
    method: 'post',
    data: requestData({
      messageName: 'getBlockList',
      body: condition
    })
  })
}

export function updatePlcMapBlockSort(condition) {
  return request({
    url: '/blockcontroller/updatePlcMapBlockSort',
    method: 'post',
    data: requestData({
      messageName: 'updatePlcMapBlockSort',
      body: condition
    })
  })
}

export function saveBlockList(condition) {
  return request({
    url: '/blockcontroller/saveBlockList',
    method: 'post',
    data: requestData({
      messageName: 'saveBlockList',
      body: condition
    })
  })
}

export function getWordBlockList(condition) {
  return request({
    url: '/blockcontroller/getWordBlockList',
    method: 'post',
    data: requestData({
      messageName: 'getWordBlockList',
      body: condition
    })
  })
}

export function getBitNameList(condition) {
  return request({
    url: '/blockcontroller/getBitNameList',
    method: 'post',
    data: requestData({
      messageName: 'getBitNameList',
      body: condition
    })
  })
}

export function updatePlcMapBitBlockSort(condition) {
  return request({
    url: '/blockcontroller/updatePlcMapBitBlockSort',
    method: 'post',
    data: requestData({
      messageName: 'updatePlcMapBitBlockSort',
      body: condition
    })
  })
}
