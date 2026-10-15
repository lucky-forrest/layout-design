import { service as request, requestData } from '@/utils/request'

export function getWordList(condition) {
  return request({
    url: '/blockcontroller/getWordList',
    method: 'post',
    data: requestData({
      messageName: 'getWordList',
      body: condition
    })
  })
}

export function saveWord(condition) {
  return request({
    url: '/blockcontroller/saveWord',
    method: 'post',
    data: requestData({
      messageName: 'saveWord',
      body: condition
    })
  })
}

export function removeWord(condition) {
  return request({
    url: '/blockcontroller/removeWord',
    method: 'post',
    data: requestData({
      messageName: 'removeWord',
      body: condition
    })
  })
}
