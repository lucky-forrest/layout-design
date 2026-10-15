import { service as request, requestData } from '@/utils/request'

export function getEquipmentList(condition) {
  return request({
    url: '/blockcontroller/getEquipmentList',
    method: 'post',
    data: requestData({
      messageName: 'getEquipmentList',
      body: condition
    })
  })
}

export function saveEquipmentInfo(condition, common) {
  return request({
    url: '/blockcontroller/saveEquipmentInfo',
    method: 'post',
    data: requestData({
      messageName: 'saveEquipmentInfo',
      body: condition,
      common: common
    })
  })
}

export function deleteEquipmentInfo(condition) {
  return request({
    url: '/blockcontroller/deleteEquipmentInfo',
    method: 'post',
    data: requestData({
      messageName: 'deleteEquipmentInfo',
      body: condition
    })
  })
}

export function importEquipmentList(condition) {
  return request({
    url: '/blockcontroller/importEquipmentList',
    method: 'post',
    data: requestData({
      messageName: 'importEquipmentList',
      body: condition
    })
  })
}

export function getPlcEquipmentList(condition) {
  return request({
    url: '/blockcontroller/getPlcEquipmentList',
    method: 'post',
    data: requestData({
      messageName: 'getPlcEquipmentList',
      body: condition
    })
  })
}

export function getJobDataEquipmentList(condition) {
  return request({
    url: '/blockcontroller/getJobDataEquipmentList',
    method: 'post',
    data: requestData({
      messageName: 'getJobDataEquipmentList',
      body: condition
    })
  })
}
