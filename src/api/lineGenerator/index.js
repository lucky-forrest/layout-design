import { service as request, requestData } from '@/utils/request'

export function getLineConfigList(condition) {
  return request({
    url: '/lineConfService/getLineConfigList',
    method: 'post',
    data: requestData({
      messageName: 'getLineConfigList',
      body: condition
    })
  })
}

export function copyConfXml(condition) {
  return request({
    url: '/lineConfService/copyConfXml',
    method: 'post',
    data: requestData({
      messageName: 'copyConfXml',
      body: condition
    })
  })
}
