import { service as request, requestData } from '@/utils/request'

export function getAPCCommandDataByLineId(condition) {
  return request({
    url: '/blockcontroller/getAPCDataDownLoadCommandList',
    method: 'post',
    data: requestData({
      messageName: 'GetAPCDataDownLoadCommandList',
      body: condition
    })
  })
}

export function updateAPCCommandData(condition) {
  return request({
    url: '/blockcontroller/updateAPCCommandSetting',
    method: 'post',
    data: requestData({
      messageName: 'UpdateAPCCommandSetting',
      body: condition
    })
  })
}

// 发消息到BC Server
export function updateAPCCommandDataFromTools(baseURL, condition) {
  return request({
    baseURL,
    url: '/blockcontroller/updateAPCCommandSettingFromTools',
    method: 'post',
    data: requestData({
      messageName: 'updateAPCCommandDataFromTools',
      body: condition
    })
  })
}

export function getLineByLineType(condition) {
  return request({
    url: '/blockcontroller/getLineByLineType',
    method: 'post',
    data: requestData({
      messageName: 'getLineByLineType',
      body: condition
    })
  })
}
