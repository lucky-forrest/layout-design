import { requestData } from '@/utils/request'
import Mock from 'mockjs'

const DataList = []
const TotalCount = 13
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    shop: '@pick("Array","Cf","Cell")',
    lineId: '@pick("TBATS100","TBCAC100","TBPRO100")',
    equipmentNo: '@pick(["L2","L3","L4","L5","L6","L7","L8","L9","L02","L03","L04","L05","L06","L07","L08","L09"])',
    name: '@word(5)',
    netWorkNo: '@pick("0","1")',
    'stationNo|+1': 1,
    pointB: '@pick(1,2,3,4,5,6,7,8,9)',
    startB: 'LB@word(5)',
    endB: 'LB@word(5)',
    pointW: '@pick(1,2,3,4,5,6,7,8,9)',
    startW: 'LB@word(5)',
    endW: 'LB@word(5)'
  }))
}
const getAddressList = config => {
  let total = 0
  const tempList = Array.from(DataList)
  total = tempList.length
  for (let i = 0; i < total; i++) {
    tempList[i].name = tempList[i].name.toUpperCase()
  }
  return requestData({
    messageName: 'getAddressList',
    body: {
      total: total,
      rows: tempList
    }
  })
}
const updateAddress = config => {
  return requestData({
    messageName: 'updateAddress',
    body: true
  })
}
const importAddressList = config => {
  return requestData({
    messageName: 'importAddressList',
    body: true
  })
}
const deleteAddressByFunction = config => {
  return requestData({
    messageName: 'deleteAddressByFunction',
    body: true
  })
}
const getAddressRangeList = config => {
  return requestData({
    messageName: 'getAddressRangeList',
    body: [
      {
        'objectId': 1777,
        'update': false,
        'factoryName': 'T7',
        'shopName': 'ARRAY',
        'lineId': 'TJAOH100',
        'equipmentNo': 'L02',
        'equipmentName': 'Indexer',
        'networkNo': '1',
        'stationNo': '2',
        'bPoints': 768,
        'bStartAddress': 'LB00600',
        'bEndAddress': 'LB008FF',
        'wPoints': 6400,
        'wStartAddress': 'LW01B00',
        'wEndAddress': 'LW033FF',
        'ewPoints': 0,
        'ewStartAddress': null,
        'ewEndAddress': null,
        'createUser': 'Super Admin',
        'createTime': '2019-12-02 10:38:14',
        'updateUser': null,
        'updateTime': null,
        'version': 'V1.00',
        'userName': null,
        'status': 1,
        'list': null
      },
      {
        'objectId': 1778,
        'update': false,
        'factoryName': 'T7',
        'shopName': 'ARRAY',
        'lineId': 'TJAOH100',
        'equipmentNo': 'L03',
        'equipmentName': 'AOH',
        'networkNo': '1',
        'stationNo': '3',
        'bPoints': 512,
        'bStartAddress': 'LB00900',
        'bEndAddress': 'LB00AFF',
        'wPoints': 9216,
        'wStartAddress': 'LW03400',
        'wEndAddress': 'LW057FF',
        'ewPoints': 0,
        'ewStartAddress': null,
        'ewEndAddress': null,
        'createUser': 'Super Admin',
        'createTime': '2019-12-02 10:38:14',
        'updateUser': null,
        'updateTime': null,
        'version': 'V1.00',
        'userName': null,
        'status': 1,
        'list': null
      }
    ]
  })
}
Mock.mock(/\/PLCService\/updateAddress/, 'post', updateAddress)
Mock.mock(/\/PLCService\/getAddressList/, 'post', getAddressList)
Mock.mock(/\/PLCService\/importAddressList/, 'post', importAddressList)
Mock.mock(/\/blockcontroller\/getAddressRangeList/, 'post', getAddressRangeList)
Mock.mock(/\/PLCService\/deleteAddressByFunction/, 'post', deleteAddressByFunction)
