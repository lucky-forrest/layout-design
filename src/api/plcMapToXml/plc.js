import { service as request, requestData } from '@/utils/request'

export function getFileList(condition) {
  return request({
    url: '/blockcontroller/getFileList',
    method: 'post',
    data: requestData({
      messageName: 'getFileList',
      body: condition
    })
  })
}

export function importPlcMapList(condition) {
  return request({
    url: '/PLCService/importPlcMapList',
    method: 'post',
    data: requestData({
      messageName: 'importPlcMapList',
      body: condition
    })
  })
}

export function uploadFile(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/uploadFile',
    method: 'post',
    data: requestData({
      messageName: 'uploadFile',
      body: condition
    })
  })
}

export function downLoadXml(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/downLoadXml',
    method: 'post',
    data: requestData({
      messageName: 'downLoadXml',
      body: condition
    })
  })
}

export function exportExcel(condition) {
  return request({
    url: '/excelExportService/exportExcel',
    method: 'post',
    data: requestData({
      messageName: 'exportExcel',
      body: condition
    })
  })
}

export function updatePlcMap(condition) {
  return request({
    url: '/blockcontroller/updatePlcMap',
    method: 'post',
    data: requestData({
      messageName: 'updatePlcMap',
      body: condition
    })
  })
}

export function saveDateToFile(condition) {
  return request({
    url: '/blockcontroller/saveDateToFile',
    method: 'post',
    data: requestData({
      messageName: 'saveDateToFile',
      body: condition
    })
  })
}

export function updateFile(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/updateFile',
    method: 'post',
    data: requestData({
      messageName: 'updateFile',
      body: condition
    })
  })
}

export function deletePlcMapById(condition) {
  return request({
    url: '/PLCService/deletePlcMapById',
    method: 'post',
    data: requestData({
      messageName: 'deletePlcMapById',
      body: condition
    })
  })
}

export function savePlcMap(condition) {
  return request({
    url: '/PLCService/savePlcMap',
    method: 'post',
    data: requestData({
      messageName: 'savePlcMap',
      body: condition
    })
  })
}

export function downLoadFile(condition) {
  return request({
    url: '/PLCService/downLoadFile',
    method: 'post',
    data: requestData({
      messageName: 'downLoadFile',
      body: condition
    })
  })
}

export function deleteFile(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/deleteFile',
    method: 'post',
    data: requestData({
      messageName: 'deleteFile',
      body: condition
    })
  })
}

export function downLoadXmlByShop(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/downLoadXmlByShop',
    method: 'post',
    data: requestData({
      messageName: 'downLoadXmlByShop',
      body: condition
    })
  })
}
