import { service as request, requestData } from '@/utils/request'

export function getUnitList(condition) {
  return request({
    url: '/blockcontroller/getUnitList',
    method: 'post',
    data: requestData({
      messageName: 'getUnitList',
      body: condition
    })
  })
}

export function saveUnitInfo(condition, common) {
  return request({
    url: '/blockcontroller/saveUnitInfo',
    method: 'post',
    data: requestData({
      messageName: 'saveUnitInfo',
      body: condition,
      common: common
    })
  })
}

export function deleteUnitInfo(condition) {
  return request({
    url: '/blockcontroller/deleteUnitInfo',
    method: 'post',
    data: requestData({
      messageName: 'deleteUnitInfo',
      body: condition
    })
  })
}

export function importUnitList(condition) {
  return request({
    url: '/blockcontroller/importUnitList',
    method: 'post',
    data: requestData({
      messageName: 'importUnitList',
      body: condition
    })
  })
}
