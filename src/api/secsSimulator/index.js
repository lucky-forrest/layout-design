import { service as request, requestData } from '@/utils/request'

export function getMessageFileList(condition) {
  return request({
    url: '/SecsMessageService/getMessageFileList',
    method: 'post',
    data: requestData({
      messageName: 'getMessageFileList',
      body: condition
    })
  })
}

export function newMessageFile(condition) {
  return request({
    url: '/SecsMessageService/newMessageFile',
    method: 'post',
    data: requestData({
      messageName: 'newMessageFile',
      body: condition
    })
  })
}

export function saveMessage(condition) {
  return request({
    url: '/SecsMessageService/saveMessage',
    method: 'post',
    data: requestData({
      messageName: 'saveMessage',
      body: condition
    })
  })
}

export function getMessageList(condition) {
  return request({
    url: '/SecsMessageService/getMessageList',
    method: 'post',
    data: requestData({
      messageName: 'getMessageList',
      body: condition
    })
  })
}

export function sendMessage(condition) {
  return request({
    url: '/SecsMessageService/sendMessage',
    method: 'post',
    data: requestData({
      messageName: 'sendMessage',
      body: condition
    })
  })
}

export function startSimulator(condition) {
  return request({
    url: '/SecsService/startSimulator',
    method: 'post',
    data: requestData({
      messageName: 'startSimulator',
      body: condition
    })
  })
}

export function stopSimulator(condition) {
  return request({
    url: '/SecsService/stopSimulator',
    method: 'post',
    data: requestData({
      messageName: 'stopSimulator',
      body: condition
    })
  })
}

export function deleteMessageFile(condition) {
  return request({
    url: '/SecsMessageService/deleteMessageFile',
    method: 'post',
    data: requestData({
      messageName: 'deleteMessageFile',
      body: condition
    })
  })
}

export function copyMessageFile(condition) {
  return request({
    url: '/SecsMessageService/copyMessageFile',
    method: 'post',
    data: requestData({
      messageName: 'copyMessageFile',
      body: condition
    })
  })
}

export function getAutoMessageNameList(condition) {
  return request({
    url: '/SecsMessageService/getAutoMessageNameList',
    method: 'post',
    data: requestData({
      messageName: 'getAutoMessageNameList',
      body: condition
    })
  })
}

export function settingMessage(condition) {
  return request({
    url: '/SecsMessageService/settingMessage',
    method: 'post',
    data: requestData({
      messageName: 'settingMessage',
      body: condition
    })
  })
}

