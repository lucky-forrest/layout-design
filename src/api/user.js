import { service as request, requestData } from '@/utils/request'

export function getUserList(condition) {
  return request({
    url: '/ToolBcUserService/getUserList',
    method: 'post',
    data: requestData({
      messageName: 'getUserList',
      body: condition
    })
  })
}

export function getUserGroupInfo(condition) {
  return request({
    url: '/ToolBcUserGroupService/getUserGroupInfo',
    method: 'post',
    data: requestData({
      messageName: 'getUserGroupInfo',
      body: condition
    })
  })
}

export function saveUser(condition) {
  return request({
    url: '/ToolBcUserService/saveUser',
    method: 'post',
    data: requestData({
      messageName: 'saveUser',
      body: condition
    })
  })
}

export function deleteusers(condition) {
  return request({
    url: '/ToolBcUserService/deleteusers',
    method: 'post',
    data: requestData({
      messageName: 'deleteusers',
      body: condition
    })
  })
}

export function loginByUsername(condition) {
  return request({
    url: '/ToolBcLoginImpl/loginByUser',
    method: 'post',
    data: requestData({
      messageName: 'loginByUser',
      body: condition
    })
  })
}

export function resetUserPwd(condition) {
  return request({
    url: '/ToolBcUserService/resetUserPwd',
    method: 'post',
    data: requestData({
      messageName: 'resetUserPwd',
      body: condition
    })
  })
}

export function updateUserInfo(condition) {
  return request({
    url: '/ToolBcUserService/updateUserInfo',
    method: 'post',
    data: requestData({
      messageName: 'updateUserInfo',
      body: condition
    })
  })
}
