import { requestData, parseJson } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(20, 50)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    functionName: 'Glory-@word-00@pick(["1","2","3","4"])'
  }))
}

const getFunctionList = config => {
  const { currPage = 1, pageSize = 10 } = parseJson(config.body)
  let total = 0
  let tempList = Array.from(DataList)
  total = tempList.length
  tempList = tempList.slice((currPage - 1) * pageSize, currPage * pageSize)
  return requestData({
    messageName: 'getFunctionList',
    body: {
      total: total,
      rows: tempList
    }
  })
}
Mock.mock(/\/blockcontroller\/getFunctionList/, 'post', getFunctionList)
