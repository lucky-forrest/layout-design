import { requestData } from '@/utils/request'
import Mock from 'mockjs'

const DataList = []
const TotalCount = 20
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    blockName: '@word(5)Block',
    bitName: '@word(5)',
    'offSet|+1': 0,
    event: '@pick("T","S","O")',
    shop: '@pick("Array","Cf","Cell")',
    lineId: '@pick("TBATS100","TBCAC100","TBPRO100")'
  }))
}
const getBitList = config => {
  const tempList = Array.from(DataList)
  return requestData({
    messageName: 'getBitList',
    body: tempList
  })
}

Mock.mock(/\/blockcontroller\/getBitList/, 'post', getBitList)
