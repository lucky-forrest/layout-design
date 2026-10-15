import { service as request, requestData } from '@/utils/request'

export function getMessageList(condition) {
  return request({
    url: '/RvMessageService/getMessageList',
    method: 'post',
    data: requestData({
      messageName: 'getMessageList',
      body: condition
    })
  })
}

export function getMessageFileList(condition) {
  return request({
    url: '/RvMessageService/getMessageFileList',
    method: 'post',
    data: requestData({
      messageName: 'getMessageFileList',
      body: condition
    })
  })
}

export function deleteMessage(condition) {
  return request({
    url: '/RvMessageService/deleteMessage',
    method: 'post',
    data: requestData({
      messageName: 'deleteMessage',
      body: condition
    })
  })
}

export function newMessageFile(condition) {
  return request({
    url: '/RvMessageService/NewMessageFile',
    method: 'post',
    data: requestData({
      messageName: 'NewMessageFile',
      body: condition
    })
  })
}

export function saveMessage(condition) {
  return request({
    url: '/RvMessageService/saveMessage',
    method: 'post',
    data: requestData({
      messageName: 'saveMessage',
      body: condition
    })
  })
}

export function sendMessage(condition) {
  return request({
    url: '/RvMessageService/sendMessage',
    method: 'post',
    data: requestData({
      messageName: 'sendMessage',
      body: condition
    })
  })
}

export function deleteMessageFile(condition) {
  return request({
    url: '/RvMessageService/deleteMessageFile',
    method: 'post',
    data: requestData({
      messageName: 'deleteMessageFile',
      body: condition
    })
  })
}

export function getBodyTreeList(condition) {
  return request({
    url: '/RvMessageService/getBodyTreeList',
    method: 'post',
    data: requestData({
      messageName: 'GetBodyTreeList',
      body: condition
    })
  })
}
