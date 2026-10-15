import { requestData } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(3, 7)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'code': '@word',
    'eventEmailDetailId': '@pick(1,2,3,4,5,6,7,8,9)',
    'groupId': '@pick(1,2,3,4,5,6,7,8,9)',
    'isEnabled': '@integer(0,1)',
    'name': '@cname',
    'receivers': '@email'
  }))
}
const UserDataList = []
for (let i = 0; i < TotalCount; i++) {
  UserDataList.push(Mock.mock({
    'userId': 'G5ELA',
    'client_id': 'G5ELA',
    'comments': '1',
    'createtime': '2017-08-05 12:27:43',
    'department': 'G5ELA',
    'group_id': '1',
    'ic_account': '10',
    'ic_password': '1',
    'islogin': false,
    'isuse': 1,
    'level': 2,
    'password': '1',
    'user_id': '@name',
    'user_name': '@cname',
    'writepassword': '123456'

  }))
}

const userMap = {
  admin: {
    toolBcUser: {
      userId: 'admin',
      userName: 'Super Admin'
    },
    authorities:
      [
        {
          'groupId': 'SuperGroup',
          'menuName': 'design',
          'pageName': 'layoutdesign',
          'factoryName': 'T2'
        }
      ]
  },
  design: {
    toolBcUser: {
      userId: 'design',
      userName: 'Designer'
    },
    authorities:
      [{
        'groupId': 'SuperGroup',
        'menuName': 'design',
        'pageName': 'layoutdesign',
        'factoryName': 'T2'
      }
      ]
  }
}

const getUserList = config => {
  return requestData({
    messageName: 'GetEmailGroupDetailInfoList',
    body: {
      total: 2,
      rows: [
        {
          objectId: 32,
          factoryName: 'T2',
          userId: 'glory',
          userName: 'glory-dev',
          password: '83nq88gxsE3hU0adG+w0Xg==',
          mail: 'glory@126.com',
          department: '研发部',
          sex: 'M',
          phone: '11242223232',
          isEnable: 'Y',
          createTime: '2019-07-04 14:18:55',
          createUser: 'Super Admin',
          updateUser: 'glory-dev',
          updateTime: '2019-07-04 14:27:49'
        },
        {
          objectId: 31,
          factoryName: 'T2',
          userId: 'test-admin',
          userName: 'wxx-abc',
          password: '83nq88gxsE3hU0adG+w0Xg==',
          mail: 'wxx@126.com',
          department: '测试部',
          sex: 'M',
          phone: '12233333333',
          isEnable: 'Y',
          createTime: '2019-07-05 12:54:03',
          createUser: 'glory-dev',
          updateUser: 'glory-dev',
          updateTime: '2019-07-05 12:54:03'
        }
      ],
      from: 0,
      pageNo: 1,
      pageSize: 10,
      sort: 'seq',
      order: 'asc',
      size: 10,
      condition: {
        factoryName: 'T2',
        userName: '',
        userId: ''
      }
    }
  })
}

const loginByUsername = req => {
  const { userId } = JSON.parse(req.body).body
  const user = userMap[userId]
  let result = {
    returnCode: '0',
    returnMessageEN: 'Operation sucessful !',
    returnMessageCH: '操作成功！'
  }
  if (!user) {
    result = Object.assign(result, {
      returnCode: '1',
      returnMessageEN: 'User name or password is error',
      returnMessageCH: '用户名或者密码错误'
    })
  }
  return requestData({
    messageName: 'loginByUsername',
    body: userMap[userId],
    result
  })
}

Mock.mock(/\/ToolBcLoginImpl\/loginByUser/, 'post', loginByUsername)
Mock.mock(/\/ToolBcUserService\/getUserList/, 'post', getUserList)
