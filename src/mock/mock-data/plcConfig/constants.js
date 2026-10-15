import { requestData } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = 10
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    constantsName: '@word(10)',
    defaultValue: '@pick("OK","NG")',
    lineId: '@pick("TBATS100","TBCAC100","TBPRO100")',
    expandList: []
  }))
}
const getConstantsList = config => {
  let total = 0
  const tempList = Array.from(DataList)
  total = tempList.length
  const list = ['OK', 'NG']
  for (let i = 0; i < total; i++) {
    tempList[i].expandList = []
    for (let j = 0; j < 3; j++) {
      tempList[i].expandList.push({
        key: j,
        value: list[_.random(0, 1)],
        descript: list[_.random(0, 1)]
      })
    }
    tempList[i].constantsName = tempList[i].constantsName.toUpperCase()
  }
  return requestData({
    messageName: 'getConstantsList',
    body: {
      total: total,
      rows: tempList
    }
  })
}
const saveConstantsList = config => {
  return requestData({
    messageName: 'saveConstantsList',
    body: true
  })
}
const addConstants = config => {
  return requestData({
    messageName: 'addConstants',
    body: true
  })
}

Mock.mock(/\/blockcontroller\/getConstantsList/, 'post', getConstantsList)
Mock.mock(/\/PLCService\/saveConstantsList/, 'post', saveConstantsList)
Mock.mock(/\/PLCService\/addConstants/, 'post', addConstants)
