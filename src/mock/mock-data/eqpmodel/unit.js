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
    equipmentNo: '@pick(["L2","L3","L4","L5","L6","L7","L8","L9","L02","L03","L04","L05","L06","L07","L08","L09"])',
    equipmentId: '@word(5)',
    unitNo: '@pick(1,2,3,4,5,6,7,8,9)',
    unitId: '@word(4)@pick(1,2,3,4,5,6,7,8,9)',
    attribute: '@pick(["NORMAL","VIRTUAL"])',
    name: '@word(5)',
    positionPlcTrxName: '@pick(1,2,3,4,5,6,7,8,9)'
  }))
}

const getUnitList = config => {
  const { currPage = 1, pageSize = 10 } = parseJson(config.body)
  let total = 0
  let tempList = Array.from(DataList)
  total = tempList.length
  for (let i = 0; i < total; i++) {
    tempList[i].name = tempList[i].name.toUpperCase()
    tempList[i].unitId = tempList[i].unitId.toUpperCase()
    tempList[i].equipmentId = tempList[i].equipmentId.toUpperCase()
    tempList[i].equipmentNo = tempList[i].equipmentNo.toUpperCase()
  }
  tempList = tempList.slice((currPage - 1) * pageSize, currPage * pageSize)
  return requestData({
    messageName: 'getUnitList',
    body: {
      total: total,
      rows: tempList
    }
  })
}

Mock.mock(/\/blockcontroller\/getUnitList/, 'post', getUnitList)
