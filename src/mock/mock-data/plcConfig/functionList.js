import { requestData, parseJson } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(20, 50)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    functionName: '@word(10)',
    shop: '@pick("Array","Cf","Cell")',
    commonOrSpec: '@pick("common","spec")',
    lineId: '@pick("TBATS100","TBCAC100","TBPRO100")',
    functionType: '@pick("Reply","Command","Request")',
    commandDetailList: [],
    isEdit: false
  }))
}
export default {
  getFunctionList: config => {
    const { currPage = 1, pageSize = 10 } = parseJson(config.body)
    let total = 0
    let tempList = Array.from(DataList)
    total = tempList.length
    tempList = tempList.slice((currPage - 1) * pageSize, currPage * pageSize)
    const detailList = ['Cmand Word', 'Reply Word', 'Cmand Bit', 'Reply Bit']
    tempList.forEach(curr => {
      curr.commandDetailList.push(detailList[_.random(0, 3)])
    })
    return requestData({
      messageName: 'getFunctionList',
      body: {
        total: total,
        rows: tempList
      }
    })
  },
  saveFunction: config => {
    return requestData({
      messageName: 'saveFunction',
      body: true
    })
  },
  removeFunction: config => {
    return requestData({
      messageName: 'removeFunction',
      body: true
    })
  }
}
