import { service as request, requestData } from '@/utils/request'

export function getLinkSignalListByPage(condition) {
  return request({
    url: '/LinkSignalService/getLinkSignalListByPage',
    method: 'post',
    data: requestData({
      messageName: 'getLinkSignalListByPage',
      body: condition
    })
  })
}

export function deleteLinkSignalById(condition) {
  return request({
    url: '/LinkSignalService/deleteLinkSignalById',
    method: 'post',
    data: requestData({
      messageName: 'deleteLinkSignalById',
      body: condition
    })
  })
}

export function createLinkSignal(condition) {
  return request({
    url: '/LinkSignalService/createLinkSignal',
    method: 'post',
    data: requestData({
      messageName: 'createLinkSignal',
      body: condition
    })
  })
}

export function saveLinkSignal(condition) {
  return request({
    url: '/LinkSignalService/saveLinkSignal',
    method: 'post',
    data: requestData({
      messageName: 'saveLinkSignal',
      body: condition
    })
  })
}
