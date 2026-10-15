import { service as request, requestData } from '@/utils/request'

export function getDropDownList(condition) {
  return request({
    url: '/blockcontroller/getDropDownList',
    method: 'post',
    data: requestData({
      messageName: 'getDropDownList',
      body: condition
    })
  })
}

export function saveDropDownInfo(condition) {
  return request({
    url: '/blockcontroller/saveDropDownInfo',
    method: 'post',
    data: requestData({
      messageName: 'saveDropDownInfo',
      body: condition
    })
  })
}

export function deleteDropDownItem(condition) {
  return request({
    url: '/blockcontroller/deleteDropDownItem',
    method: 'post',
    data: requestData({
      messageName: 'deleteDropDownItem',
      body: condition
    })
  })
}

export function importDropDownList(condition) {
  return request({
    url: '/blockcontroller/importDropDownList',
    method: 'post',
    data: requestData({
      messageName: 'importDropDownList',
      body: condition
    })
  })
}
