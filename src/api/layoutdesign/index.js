import { service as request, requestData } from '@/utils/request'

export function getLayoutTemplate(condition) {
  return request({
    url: '/LayoutService/getLayoutTemplate',
    method: 'post',
    data: requestData({
      messageName: 'getLayoutTemplate',
      body: condition
    })
  })
}

export function saveLayoutTemplate(condition) {
  return request({
    url: '/LayoutService/saveLayoutTemplate',
    method: 'post',
    data: requestData({
      messageName: 'saveLayoutTemplate',
      body: condition
    })
  })
}

