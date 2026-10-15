import { requestData, parseJson } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(11, 18)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    lineId: '@pick(["THCVD800","THCVD800","THCVD800","THCVD800","THCVD800","FBMQC800","CHPOL300"])',
    lineName: '@word(5)',
    lineType: '@pick(["ATS_AKT","FBMQC_TYPE1","CHPOL_TYPE1","CBPOL_1","CBLOI","FBMQC_TYPE1","PRO","CAC"])',
    shopName: '@pick(["ARRAY","CELL","CF"])',
    serverName: '@word(5)',
    ip: '127.0.0.1',
    'port': '8082',
    'port2': '8086',
    info: '@cparagraph'
  }))
}
const getLineList = config => {
  const { currPage = 1, pageSize = Number.MAX_VALUE, fabType } = parseJson(config.body)
  let total = 0
  let tempList = Array.from(DataList)
  if (fabType) {
    tempList = tempList.filter(item => {
      return item.fabType === fabType
    })
  }
  total = tempList.length
  tempList = tempList.slice((currPage - 1) * pageSize, currPage * pageSize)
  return requestData({
    messageName: 'getLineList',
    body: {
      total: total,
      rows: tempList
    }
  })
}

Mock.mock(/\/blockcontroller\/getLineList/, 'post', getLineList)
