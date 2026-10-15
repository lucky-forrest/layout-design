import { service as request, requestData } from '@/utils/request'

export function getUsergroupList(condition) {
  return request({
    url: '/ToolBcUserGroupService/getUsergroupList',
    method: 'post',
    data: requestData({
      messageName: 'getUsergroupList',
      body: condition
    })
  })
}
export function getAuthoritylist(condition) {
  return request({
    url: '/ToolBcUserGroupService/getAuthoritylist',
    method: 'post',
    data: requestData({
      messageName: 'getAuthoritylist',
      body: condition
    })
  })
}
export function deleteusergroups(condition) {
  return request({
    url: '/ToolBcUserGroupService/deleteusergroups',
    method: 'post',
    data: requestData({
      messageName: 'deleteusergroups',
      body: condition
    })
  })
}

export function saveUserGroup(condition) {
  return request({
    url: '/ToolBcUserGroupService/saveUserGroup',
    method: 'post',
    data: requestData({
      messageName: 'saveUserGroup',
      body: condition
    })
  })
}
export function saveAuthority(condition) {
  return request({
    url: '/ToolBcUserGroupService/saveAuthority',
    method: 'post',
    data: requestData({
      messageName: 'saveAuthority',
      body: condition
    })
  })
}

export function getUserListByGroupId(condition) {
  return request({
    url: '/ToolBcUserGroupService/getUserListByGroupId',
    method: 'post',
    data: requestData({
      messageName: 'getUserListByGroupId',
      body: condition
    })
  })
}
