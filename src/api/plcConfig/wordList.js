import { service as request, requestData } from '@/utils/request'

export function getWordList(condition) {
  return request({
    url: '/PLCService/getWordList',
    method: 'post',
    data: requestData({
      messageName: 'getWordList',
      body: condition
    })
  })
}
