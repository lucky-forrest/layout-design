import { service as request, requestData } from '@/utils/request'

export function getLocalScenarioList(condition) {
  return request({
    url: '/LocalScenarioService/getLocalScenarioList',
    method: 'post',
    data: requestData({
      messageName: 'getLocalScenarioList',
      body: condition
    })
  })
}

export function saveLocalScenario(condition) {
  return request({
    url: '/LocalScenarioService/saveLocalScenario',
    method: 'post',
    data: requestData({
      messageName: 'saveLocalScenario',
      body: condition
    })
  })
}

export function deleteLocalScenario(condition) {
  return request({
    url: '/LocalScenarioService/deleteLocalScenario',
    method: 'post',
    data: requestData({
      messageName: 'deleteLocalScenario',
      body: condition
    })
  })
}
