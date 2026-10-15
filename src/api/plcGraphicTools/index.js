import { service as request, requestData } from '@/utils/request'

export function getGraphidToolList(condition) {
  return request({
    url: '/blockcontroller/getgraphidtoollist',
    method: 'post',
    data: requestData({
      messageName: 'getgraphidtoollist',
      body: condition
    })
  })
}

export function updateitemvalueintoplc(condition) {
  return request({
    url: '/blockcontroller/updateitemvalueintoplc',
    method: 'post',
    data: requestData({
      messageName: 'updateitemvalueintoplc',
      body: condition
    })
  })
}

export function getGraphidToolListByName(condition) {
  return request({
    url: '/blockcontroller/getGraphidToolListByName',
    method: 'post',
    data: requestData({
      messageName: 'GetGraphidToolListByName',
      body: condition
    })
  })
}
