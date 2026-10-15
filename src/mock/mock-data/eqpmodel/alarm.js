import { requestData, parseJson } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(200, 500)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    lineId: '@pick(["ATS_AKT","FBMQC_TYPE1","CHPOL_TYPE1","CBPOL_1","CBLOI","FBMQC_TYPE1","PRO","CAC"])',
    serverName: '@pick(["ATS_AKT","FBMQC_TYPE1","CHPOL_TYPE1","CBPOL_1","CBLOI","FBMQC_TYPE1","PRO","CAC"])',
    equipmentNo: '@word(1)@pick(1,2,3,4,5,6,7,8,9)',
    unitNo: '@pick(1,2,3,4,5,6,7,8,9)',
    alarmLevel: '@word(1)',
    alarmId: '@word(4)@pick(1,2,3,4,5,6,7,8,9)',
    alarmCode: '@word(5)',
    alarmText: '@word'
  }))
}
const getAlarmList = config => {
  const { currPage = 1, pageSize = 10 } = parseJson(config.body)
  let total = 0
  let tempList = Array.from(DataList)
  total = tempList.length
  for (let i = 0; i < total; i++) {
    tempList[i].alarmId = tempList[i].alarmId.toUpperCase()
    tempList[i].alarmText = tempList[i].alarmText.toUpperCase()
    tempList[i].alarmCode = tempList[i].alarmCode.toUpperCase()
    tempList[i].alarmLevel = tempList[i].alarmLevel.toUpperCase()
    tempList[i].equipmentNo = tempList[i].equipmentNo.toUpperCase()
  }
  tempList = tempList.slice((currPage - 1) * pageSize, currPage * pageSize)
  return requestData({
    messageName: 'getAlarmList',
    body: {
      total: total,
      rows: tempList
    }
  })
}

Mock.mock(/\/AlarmService\/getAlarmList/, 'post', getAlarmList)
Mock.mock(/\/AlarmService\/importElementList/, 'post', getAlarmList)
