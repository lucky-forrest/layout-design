import { service as request, requestData } from '@/utils/request'

export function sendLinksignal(condition) {
  return request({
    url: '/blockcontroller/updatelinksignalvalueintoplc',
    method: 'post',
    data: requestData({
      messageName: 'sendLinksignal',
      body: condition
    })
  })
}

export function getlinksignalbolcklist(condition) {
  return request({
    url: '/blockcontroller/getlinksignalbolcklist',
    method: 'post',
    data: requestData({
      messageName: 'getLinkSignalList',
      body: condition
    })
  })
}

export function getLinkSignalLogByTime(condition) {
  return request({
    url: '/linkSignalSpec/getLinkSignalLogByTime',
    method: 'post',
    data: requestData({
      messageName: 'getLinkSignalLogByTime',
      body: condition
    })
  })
}

export function getGraphidJobData(condition) {
  return request({
    url: '/blockcontroller/getGraphidJobData',
    method: 'post',
    data: requestData({
      messageName: 'getGraphidJobData',
      body: condition
    })
  })
}

export function getLinkSignalFlowList(condition) {
  return request({
    url: '/blockcontroller/getLinkSignalFlowList',
    method: 'post',
    data: requestData({
      messageName: 'getLinkSignalFlowList',
      body: condition
    })
  })
}

export function filterLinkSignalFlowList(condition) {
  return request({
    url: '/blockcontroller/filterLinkSignalFlowList',
    method: 'post',
    data: requestData({
      messageName: 'filterLinkSignalFlowList',
      body: condition
    })
  })
}

export function updateJobDataValue(condition) {
  return request({
    url: '/blockcontroller/updateJobDataValue',
    method: 'post',
    data: requestData({
      messageName: 'updateJobDataValue',
      body: condition
    })
  })
}

export function getGraphidSendOutJobData(condition) {
  return request({
    url: '/blockcontroller/getGraphidSendOutJobData',
    method: 'post',
    data: requestData({
      messageName: 'GraphidSendOutJobData',
      body: condition
    })
  })
}
