import { service as request, requestData } from '@/utils/request'

export function startSimulator(condition) {
  return request({
    url: '/RVSimulatorService/startSimulator',
    method: 'post',
    data: requestData({
      messageName: 'startSimulator',
      body: condition
    })
  })
}

export function stopSimulator(condition) {
  return request({
    url: '/RVSimulatorService/stopSimulator',
    method: 'post',
    data: requestData({
      messageName: 'stopSimulator',
      body: condition
    })
  })
}

export function sendMessage(condition) {
  return request({
    url: '/RVSimulatorService/sendMessage',
    method: 'post',
    data: requestData({
      messageName: 'sendMessage',
      body: condition
    })
  })
}

export function saveMessageHistory(condition) {
  return request({
    url: '/RVSimulatorService/saveMessageHistory',
    method: 'post',
    data: requestData({
      messageName: 'saveMessageHistory',
      body: condition
    })
  })
}

export function deleteMessageHistory(condition) {
  return request({
    url: '/RVSimulatorService/deleteMessageHistory',
    method: 'post',
    data: requestData({
      messageName: 'deleteMessageHistory',
      body: condition
    })
  })
}
