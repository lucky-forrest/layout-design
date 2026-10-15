import { requestData, parseJson } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(10, 90)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    lineId: '@word(5)',
    equipmentNo: '@pick(["L2","L3","L4","L5","L6","L7","L8","L9","L02","L03","L04","L05","L06","L07","L08","L09"])',
    equipmentId: '@word(5)',
    portNo: '@pick(["1","2","3","4"])',
    portId: '@pick(["01","02","03","04"])',
    maxCount: '@integer(500,999)',
    attribute: '@pick(["NORMAL","VIRTUAL"])',
    processStartType: '@pick(["1","2","3"])',
    mappingEnable: '@boolean',
    cassetteType: '@pick(["NORMAL","BUFFER","CELL"])',
    serverName: '@word(5)'
  }))
}
const getPortList = config => {
  const { currPage = 1, pageSize = 10 } = parseJson(config.body)
  let total = 0
  let tempList = Array.from(DataList)
  total = tempList.length
  tempList = tempList.slice((currPage - 1) * pageSize, currPage * pageSize)
  return requestData({
    messageName: 'getPortList',
    body: {
      total: total,
      rows: tempList
    }
  })
}

Mock.mock(/\/blockcontroller\/getPortList/, 'post', getPortList)
