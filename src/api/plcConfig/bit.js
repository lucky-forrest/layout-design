import { service as request, requestData } from '@/utils/request'

export function getBitList(condition) {
  return request({
    url: '/blockcontroller/getBitList',
    method: 'post',
    data: requestData({
      messageName: 'getBitList',
      body: condition
    })
  })
}

export function saveBit(condition) {
  return request({
    url: '/blockcontroller/saveBit',
    method: 'post',
    data: requestData({
      messageName: 'saveBit',
      body: condition
    })
  })
}

export function deleteBitByObject(condition) {
  return request({
    url: '/blockcontroller/deleteBitByObject',
    method: 'post',
    data: requestData({
      messageName: 'deleteBitByObject',
      body: condition
    })
  })
}
