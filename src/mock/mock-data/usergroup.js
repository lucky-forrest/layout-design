import { requestData } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(200, 500)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    user_count: '@pick(1,2,3,4,5,6,7,8,9)',
    group_name: 'Group-@word-00@pick(["1","2","3","4"])',
    isEnable: '@integer(0,1)',
    comments: '说明'
  }))
}

const getUsergroupList = config => {
  return requestData({
    messageName: 'getUsergroupList',
    body: {
      total: 2,
      rows: [
        {
          objectId: 27,
          groupId: '用户管理',
          description: '等待',
          factoryName: 'T2',
          createTime: '2019-07-04 14:21:12',
          createUser: 'Super Admin',
          updateUser: 'Super Admin',
          updateTime: '2019-07-04 14:21:12'
        },
        {
          objectId: 26,
          groupId: 'SuperGroup',
          description: '超级权限组',
          factoryName: 'T2',
          createTime: '2019-07-03 15:24:11',
          createUser: 'glory-dev',
          updateUser: 'glory-dev',
          updateTime: '2019-07-03 15:24:11'
        }
      ],
      condition: {
        groupId: '',
        factoryName: 'T2'
      },
      from: 0,
      pageNo: 1,
      pageSize: 10,
      sort: 'seq',
      order: 'asc',
      size: 10
    }
  })
}

Mock.mock(/\/ToolBcUserGroupService\/getUsergroupList/, 'post', getUsergroupList)
