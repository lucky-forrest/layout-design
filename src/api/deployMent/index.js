import { service as request, requestData } from '@/utils/request'

export function uploadfiletobc(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/uploadfiletobc',
    method: 'post',
    data: requestData({
      messageName: 'uploadfiletobc',
      body: condition
    })
  })
}

export function common(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/common',
    method: 'post',
    data: requestData({
      messageName: 'common',
      body: condition
    })
  })
}

export function getConfVersionHistoryList(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/getconfversionhistorylist',
    method: 'post',
    data: requestData({
      messageName: 'GetConfVersionHistoryList',
      body: condition
    })
  })
}

export function getConfVersionFileList(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/getconfversionfilelist',
    method: 'post',
    data: requestData({
      messageName: 'getConfVersionFileList',
      body: condition
    })
  })
}

export function uploadfile(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/uploadfile',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: requestData({
      messageName: 'uploadfile',
      body: condition
    })
  })
}

export function getalltoolsmonitortobcfiles(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/getalltoolsmonitortobcfiles',
    method: 'post',
    data: requestData({
      messageName: 'Getalltoolsmonitortobcfiles',
      body: condition
    })
  })
}

export function uploadFileToRemote(condition) {
  return request({
    timeout: 0,
    url: '/blockcontroller/uploadFileToRemote',
    method: 'post',
    data: requestData({
      messageName: 'UploadFileToRemote',
      body: condition
    })
  })
}
