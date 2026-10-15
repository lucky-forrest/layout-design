import { service as request, requestData } from '@/utils/request'

export function getAllEqpWorkflow(baseURL, condition) {
  return request({
    baseURL,
    url: '/blockcontroller/getalleqpworkflow',
    method: 'post',
    data: requestData({
      messageName: 'GetAllWorkFlowRequest',
      body: condition
    })
  })
}

export function getEqpWorkflow(baseURL, condition) {
  return request({
    baseURL,
    url: '/blockcontroller/geteqpworkflow',
    method: 'post',
    data: requestData({
      messageName: 'GetEqpWorkFlowRequest',
      body: condition
    })
  })
}
