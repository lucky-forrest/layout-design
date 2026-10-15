import { requestData, parseJson } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(10, 20)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    pattern: 'MessageName-@word-00@pick(["1","2","3","4"])',
    content: 'AlarmReport',
    key: '@string(20,30)',
    historyList: [
      {
        content: 'test11111',
        saveTime: '20190415121212323'
      },
      {
        content: 'test2222222',
        saveTime: '20190420121212323'
      }
    ]
  }))
}
const getMessageList = config => {
  const { currPage = 1, pageSize = 10 } = parseJson(config.body)
  let total = 0
  let tempList = Array.from(DataList)
  total = tempList.length
  tempList = tempList.slice((currPage - 1) * pageSize, currPage * pageSize)
  return requestData({
    messageName: 'getMessageList',
    body: {
      total: total,
      rows: tempList
    }
  })
}

Mock.mock(/\/RvMessageService\/getMessageList/, 'post', getMessageList)
