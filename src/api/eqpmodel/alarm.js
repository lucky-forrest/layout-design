import { service as request, requestData } from '@/utils/request'

export function getAlarmList(condition) {
  return request({
    url: '/blockcontroller/getAlarmList',
    method: 'post',
    data: requestData({
      messageName: 'getAlarmList',
      body: condition
    })
  })
}

export function saveAlarmInfo(condition, common) {
  return request({
    url: '/blockcontroller/saveAlarmInfo',
    method: 'post',
    data: requestData({
      messageName: 'saveAlarmInfo',
      body: condition,
      common: common
    })
  })
}

export function deleteAlarmInfo(condition) {
  return request({
    url: '/blockcontroller/deleteAlarmInfo',
    method: 'post',
    data: requestData({
      messageName: 'deleteAlarmInfo',
      body: condition
    })
  })
}

export function importAlarmList(condition) {
  return request({
    url: '/blockcontroller/importAlarmList',
    method: 'post',
    data: requestData({
      messageName: 'importAlarmList',
      body: condition
    })
  })
}
