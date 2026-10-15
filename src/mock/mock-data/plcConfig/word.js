import { requestData } from '@/utils/request'
import Mock from 'mockjs'

const DataList = []
const TotalCount = 40
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    itemName: '@word',
    shop: '@pick("Array","Cf","Cell")',
    blockName: '@word(5)Block',
    point: '@pick(1,2,3,4,5,6,7,8,9)',
    type: '@pick("ATS_AKT","CAC","PRO","FBMQC_TYPE1","CBLOI","CBPOL_1","CHPOL_TYPE1")',
    lineId: '@pick("TBATS100","TBCAC100","TBPRO100")',
    functionType: '@pick("Request","Command","Reply")',
    equipmentName: '@word(5)@pick(1,2,3,4,5,6,7,8,9)'
  }))
}
const getWordList = config => {
  const tempList = Array.from(DataList)
  return requestData({
    messageName: 'getWordList',
    body: tempList
  })
}

Mock.mock(/\/blockcontroller\/getWordList/, 'post', getWordList)
