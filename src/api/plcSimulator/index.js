import { service as request, requestData } from '@/utils/request'

export function getLineNameList(condition) {
  return request({
    url: '/blockcontroller/getlinenamelist',
    method: 'post',
    data: requestData({
      messageName: '',
      body: condition
    })
  })
}

export function getPlcBlockList(condition) {
  return request({
    url: '/blockcontroller/getplcblocklist',
    method: 'post',
    data: requestData({
      messageName: 'getplcblocklist',
      body: condition
    })
  })
}

export function sendPlcCommand(condition) {
  return request({
    url: '/blockcontroller/updateitemvalueintoplc',
    method: 'post',
    data: requestData({
      messageName: '',
      body: condition
    })
  })
}

export function updateBlockInfo(condition) {
  return request({
    url: '/blockcontroller/getblockinfo',
    method: 'post',
    data: requestData({
      messageName: 'UpdateBlockInfoRequest',
      body: condition
    })
  })
}

export function getLinkSignalTemplateName(condition) {
  return request({
    url: '/linkSignalSpec/getLinkSignalTemplateName',
    method: 'post',
    data: requestData({
      messageName: 'getLinkSignalTemplateName',
      body: condition
    })
  })
}

export function getLiksignalSpec(condition) {
  return request({
    url: '/linkSignalSpec/getLiksignalSpec',
    method: 'post',
    data: requestData({
      messageName: 'getLiksignalSpec',
      body: condition
    })
  })
}

export function updateLinkSignalSpecInfo(condition) {
  return request({
    url: '/linkSignalSpec/updateLinkSignalSpecInfo',
    method: 'post',
    data: requestData({
      messageName: 'updateLinkSignalSpecInfo',
      body: condition
    })
  })
}

export function getPlcSimulatorConstants(condition) {
  return request({
    url: '/blockcontroller/getPlcSimulatorConstants',
    method: 'post',
    data: requestData({
      messageName: 'getPlcSimulatorConstants',
      body: condition
    })
  })
}

export function startEquipmentAlive(condition) {
  return request({
    url: '/blockcontroller/startEquipmentAlive',
    method: 'post',
    data: requestData({
      messageName: 'startEquipmentAlive',
      body: condition
    })
  })
}

export function getConnectByName(condition) {
  return request({
    url: '/blockcontroller/getConnectByName',
    method: 'post',
    data: requestData({
      messageName: 'getConnectByName',
      body: condition
    })
  })
}
