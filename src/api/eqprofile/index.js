import { service as request, requestData } from '@/utils/request'

// 导入EQP Profile文件后，自动生成SQL文件并存入工具使用的DB。
export function uploadFile(condition) {
  return request({
    timeout: 0,
    url: '/ProfileService/uploadFile',
    method: 'post',
    // headers: { 'Content-Type': 'multipart/form-data' },
    data: requestData({
      messageName: 'uploadFile',
      body: condition
    })
  })
}

export function getProfileList(condition) {
  return request({
    url: '/ProfileService/getProfileList',
    method: 'post',
    data: requestData({
      messageName: 'getProfileList',
      body: condition
    })
  })
}

export function updateProfileStatus(condition) {
  return request({
    url: '/ProfileService/updateProfileStatus',
    method: 'post',
    data: requestData({
      messageName: 'updateProfileStatus',
      body: condition
    })
  })
}

export function saveProfileInfo(condition) {
  return request({
    url: '/ProfileService/saveProfileInfo',
    method: 'post',
    data: requestData({
      messageName: 'saveProfileInfo',
      body: condition
    })
  })
}

export function getProfileInfo(condition) {
  return request({
    url: '/ProfileService/getProfileInfo',
    method: 'post',
    data: requestData({
      messageName: 'getProfileInfo',
      body: condition
    })
  })
}

export function getEditProfileList(condition) {
  return request({
    timeout: 0,
    url: '/ProfileService/getEditProfileList',
    method: 'post',
    data: requestData({
      messageName: 'getEditProfileList',
      body: condition
    })
  })
}

export function downloadFile(condition) {
  return request({
    url: '/ProfileService/downloadFile',
    method: 'post',
    data: requestData({
      messageName: 'downloadFile',
      body: condition
    })
  })
}

export function deleteProfile(condition) {
  return request({
    url: '/ProfileService/deleteProfile',
    method: 'post',
    data: requestData({
      messageName: 'deleteProfile',
      body: condition
    })
  })
}

export function autoGenerateFileName(condition) {
  return request({
    url: '/ProfileService/autoGenerateFileName',
    method: 'post',
    data: requestData({
      messageName: 'autoGenerateFileName',
      body: condition
    })
  })
}

export function sendDataToBc(condition) {
  return request({
    timeout: 0,
    url: '/ProfileService/sendDataToBc',
    method: 'post',
    data: requestData({
      messageName: 'sendDataToBc',
      body: condition
    })
  })
}

export function autoGenerateAddress(condition) {
  return request({
    url: '/ProfileService/autoGenerateAddress',
    method: 'post',
    data: requestData({
      messageName: 'autoGenerateAddress',
      body: condition
    })
  })
}

export function getLineTypeListByShop(condition) {
  return request({
    url: '/blockcontroller/getLineTypeListByShop',
    method: 'post',
    data: requestData({
      messageName: 'getLineTypeListByShop',
      body: condition
    })
  })
}

export function getEquipmentTypeList(condition) {
  return request({
    url: '/blockcontroller/getEquipmentTypeList',
    method: 'post',
    data: requestData({
      messageName: 'getEquipmentTypeList',
      body: condition
    })
  })
}

export function getEquipmentNoList(condition) {
  return request({
    url: '/blockcontroller/getEquipmentNoList',
    method: 'post',
    data: requestData({
      messageName: 'getEquipmentNoList',
      body: condition
    })
  })
}

export function updateProfileXml(condition) {
  return request({
    url: '/ProfileService/updateProfileXml',
    method: 'post',
    data: requestData({
      messageName: 'UpdateProfileXml',
      body: condition
    })
  })
}

// 发消息到BC Server
export function receiveProfileList(baseURL, condition) {
  return request({
    baseURL,
    url: '/blockcontroller/receiveProfileList',
    method: 'post',
    data: requestData({
      messageName: 'receiveProfileList',
      body: condition
    })
  })
}
