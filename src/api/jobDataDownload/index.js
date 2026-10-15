import { service as request, requestData } from '@/utils/request'

export function getJobDataBlock(condition) {
  return request({
    url: '/blockcontroller/getJobDataList',
    method: 'post',
    data: requestData({
      messageName: 'getJobDataList',
      body: condition
    })
  })
}
export function getPortByLineId(condition) {
  return request({
    url: '/blockcontroller/getPortByLineId',
    method: 'post',
    data: requestData({
      messageName: 'getPortByLineId',
      body: condition
    })
  })
}
export function updateRedisCassetteMap(condition) {
  return request({
    url: '/blockcontroller/updateRedisCassetteMap',
    method: 'post',
    data: requestData({
      messageName: 'updateRedisCassetteMap',
      body: condition
    })
  })
}

