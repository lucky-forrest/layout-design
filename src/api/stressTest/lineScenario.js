import { service as request, requestData } from '@/utils/request'

export function getLineScenarioList(condition) {
  return request({
    url: '/LineScenarioService/getLineScenarioList',
    method: 'post',
    data: requestData({
      messageName: 'getLineScenarioList',
      body: condition
    })
  })
}

export function saveLineScenario(condition) {
  return request({
    url: '/LineScenarioService/saveLineScenario',
    method: 'post',
    data: requestData({
      messageName: 'saveLineScenario',
      body: condition
    })
  })
}

export function deleteLineScenario(condition) {
  return request({
    url: '/LineScenarioService/deleteLineScenario',
    method: 'post',
    data: requestData({
      messageName: 'deleteLineScenario',
      body: condition
    })
  })
}

export function startLineScenario(condition) {
  return request({
    url: '/LineScenarioService/startLineScenario',
    method: 'post',
    data: requestData({
      messageName: 'startLineScenario',
      body: condition
    })
  })
}

export function stopLineScenario(condition) {
  return request({
    url: '/LineScenarioService/stopLineScenario',
    method: 'post',
    data: requestData({
      messageName: 'stopLineScenario',
      body: condition
    })
  })
}
