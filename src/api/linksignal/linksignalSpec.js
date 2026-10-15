import { service as request, requestData } from '@/utils/request'

export function saveLinkSignalSpce(condition) {
  return request({
    url: '/linkSignalSpec/saveLinkSignalSpce',
    method: 'post',
    data: requestData({
      messageName: 'saveLinkSignalSpce',
      body: condition
    })
  })
}

export function getLinkSignalTemplateByLineId(condition) {
  return request({
    url: '/linkSignalSpec/getLinkSignalTemplateByLineId',
    method: 'post',
    data: requestData({
      messageName: 'getLinkSignalTemplateByLineId',
      body: condition
    })
  })
}

export function getLiksignalSpec(condition) {
  return request({
    url: '/linkSignalSpec/getLiksignalSpec',
    method: 'post',
    data: requestData({
      messageName: 'getLiksignalSpec',
      body: condition
    })
  })
}

export function getLinkSignalFlowNameList(condition) {
  return request({
    url: '/linkSignalSpec/getLinkSignalFlowNameList',
    method: 'post',
    data: requestData({
      messageName: 'getLinkSignalFlowNameList',
      body: condition
    })
  })
}

export function getLinkSignalTempName(condition) {
  return request({
    url: '/LinkSignalService/getLinkSignalTempName',
    method: 'post',
    data: requestData({
      messageName: 'getLinkSignalTempName',
      body: condition
    })
  })
}

export function deleteLinkSignalByFlowName(condition) {
  return request({
    url: '/linkSignalSpec/deleteLinkSignalByFlowName',
    method: 'post',
    data: requestData({
      messageName: 'deleteLinkSignalByFlowName',
      body: condition
    })
  })
}

export function getLinkSignalTempByFlowName(condition) {
  return request({
    url: '/linkSignalSpec/getLinkSignalTempByFlowName',
    method: 'post',
    data: requestData({
      messageName: 'getLinkSignalTempByFlowName',
      body: condition
    })
  })
}
