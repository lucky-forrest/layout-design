import { service as request, requestData } from '@/utils/request'

export function getCassetteMapList(condition) {
  return request({
    url: '/CassetteMapService/getCassetteMapList',
    method: 'post',
    data: requestData({
      messageName: 'getCassetteMapList',
      body: condition
    })
  })
}

export function saveCassetteMap(condition) {
  return request({
    url: '/CassetteMapService/saveCassetteMap',
    method: 'post',
    data: requestData({
      messageName: 'saveCassetteMap',
      body: condition
    })
  })
}

export function createCassetteMap(condition) {
  return request({
    url: '/CassetteMapService/createCassetteMap',
    method: 'post',
    data: requestData({
      messageName: 'createCassetteMap',
      body: condition
    })
  })
}

export function deleteCassetteMapById(condition) {
  return request({
    url: '/CassetteMapService/deleteCassetteMapById',
    method: 'post',
    data: requestData({
      messageName: 'deleteCassetteMapById',
      body: condition
    })
  })
}

export function getEquipMentRecipeByLineId(condition) {
  return request({
    url: '/blockcontroller/getEquipMentRecipeByLineId',
    method: 'post',
    data: requestData({
      messageName: 'getEquipMentRecipeByLineId',
      body: condition
    })
  })
}
