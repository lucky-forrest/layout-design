import { requestData } from '@/utils/request'
import Mock from 'mockjs'

const DataList = []
const TotalCount = 5
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    fileName: 'CSOT_G8.5B_BC_@pick("Array","Cell","CF")_21_TBPHL-@pick("PLC","CBLOI","PRO","CAC") Address Map ver @pick(1,2,3,4,5,6,7,8,9).00.xls',
    version: 'v@pick(1,2,3,4,5,6,7,8,9).00',
    fab: 'T6',
    shop: '@pick("ARRAY","CF","CELL")',
    lineType: 'TBPHL',
    eqpType: '@pick("PLC","CBLOI","PRO","CAC")',
    lineId: 'L@pick(1,2,3,4,5,6,7,8,9)',
    remark: 'XXXXX',
    updatedBy: 'admin',
    updatedTime: '2019-12-32-23',
    modifyBy: 'admin',
    modifyTime: '@data'
  }))
}
const getPlcMapList = config => {
  let total = 0
  const tempList = Array.from(DataList)
  total = tempList.length
  for (let i = 0; i < total; i++) {
    tempList[i].shop = tempList[i].shop.toUpperCase()
    tempList[i].lineType = tempList[i].lineType.toUpperCase()
  }
  return requestData({
    messageName: 'getPlcMapList',
    body: {
      total: total,
      row: tempList
    }
  })
}
const updatePlcMap = config => {
  return requestData({
    messageName: 'updatePlcMap',
    body: true
  })
}
const importPlcMapList = config => {
  return requestData({
    messageName: 'importPlcMapList',
    body: true
  })
}
const savePlcMap = config => {
  return requestData({
    messageName: 'savePlcMap',
    body: true
  })
}
const downLoadFile = config => {
  return requestData({
    messageName: 'downLoadFile',
    body: true
  })
}
const savePlcMapList = config => {
  return requestData({
    messageName: 'savePlcMapList',
    body: true
  })
}
const getFileList = config => {
  return requestData({
    messageName: 'getFileList',
    body: {
      'total': 66,
      'rows': [
        {
          'objectId': 327,
          'factoryName': 'T7',
          'shopName': 'CF',
          'lineId': 'FJDCN100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_CF_08_FJDCN-PLC IO Mapping Specification_20191120_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/CF/FJDCN100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-12-12 15:49:34',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-18 09:57:22',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        },
        {
          'objectId': 281,
          'factoryName': 'T7',
          'shopName': 'ARRAY',
          'lineId': 'TJNAN100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_Array_11_TJNAN-PLC IO Mapping Specification_20191029_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/ARRAY/TJNAN100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-12-02 10:45:26',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-17 20:25:24',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        },
        {
          'objectId': 287,
          'factoryName': 'T7',
          'shopName': 'ARRAY',
          'lineId': 'TJILC100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_Array_17_TJILC-PLC IO Mapping Specification_20191028_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/ARRAY/TJILC100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-12-02 11:12:21',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-17 20:28:03',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        },
        {
          'objectId': 284,
          'factoryName': 'T7',
          'shopName': 'ARRAY',
          'lineId': 'TJTPE100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_Array_14_TJTPE-PLC IO Mapping Specification_20191031_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/ARRAY/TJTPE100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-12-02 10:57:30',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-17 20:26:28',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        },
        {
          'objectId': 330,
          'factoryName': 'T7',
          'shopName': 'ARRAY',
          'lineId': 'TJSTR100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_Array_06_TJSTR-PLC IO Mapping Specification_20191105_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/ARRAY/TJSTR100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-12-12 18:31:39',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-17 20:38:31',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        },
        {
          'objectId': 282,
          'factoryName': 'T7',
          'shopName': 'ARRAY',
          'lineId': 'TJCDO100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_Array_12_TJCDO-PLC IO Mapping Specification_20191029_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/ARRAY/TJCDO100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-12-02 10:49:55',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-17 20:27:16',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        },
        {
          'objectId': 286,
          'factoryName': 'T7',
          'shopName': 'ARRAY',
          'lineId': 'TJTEG100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_Array_16_TJTEG-PLC IO Mapping Specification_20191028_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/ARRAY/TJTEG100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-12-02 11:07:16',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-18 09:25:26',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        },
        {
          'objectId': 285,
          'factoryName': 'T7',
          'shopName': 'ARRAY',
          'lineId': 'TJATS100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_Array_15_TJATS-PLC IO Mapping Specification_20191029_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/ARRAY/TJATS100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-12-02 11:02:21',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-18 09:26:38',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        },
        {
          'objectId': 288,
          'factoryName': 'T7',
          'shopName': 'ARRAY',
          'lineId': 'TJFLC100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_Array_18_TJFLC-PLC IO Mapping Specification_20191028_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/ARRAY/TJFLC100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-12-02 11:17:33',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-17 20:33:48',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        },
        {
          'objectId': 235,
          'factoryName': 'T7',
          'shopName': 'CF',
          'lineId': 'FJMAC100',
          'fileName': 'CSOT-SD_t7_CIM_BCS_CF_13_FJMAC-PLC IO Mapping Specification_20191120_V1.00.xls',
          'filePath': 'excel/plcConfig/T7/CF/FJMAC100',
          'fileVersion': 'V1.00',
          'fileDesc': null,
          'createUser': 'Super Admin',
          'createTime': '2019-11-29 14:24:04',
          'updateUser': 'Super Admin',
          'updateTime': '2019-12-18 09:58:12',
          'update': false,
          'time': null,
          'targetPath': null,
          'status': 1,
          'list': null
        }
      ],
      'from': 0,
      'size': 10,
      'pageNo': 1,
      'pageSize': 10,
      'condition': {
        'shopName': '',
        'lineId': '',
        'userName': 'glory-dev',
        'factoryName': 'T7'
      },
      'list': null,
      'sort': 'seq',
      'order': 'asc'
    }
  })
}
Mock.mock(/\/PLCService\/updatePlcMap/, 'post', updatePlcMap)
Mock.mock(/\/PLCService\/savePlcMap/, 'post', savePlcMap)
Mock.mock(/\/PLCService\/getPlcMapList/, 'post', getPlcMapList)
Mock.mock(/\/PLCService\/importPlcMapList/, 'post', importPlcMapList)
Mock.mock(/\/PLCService\/downLoadFile/, 'post', downLoadFile)
Mock.mock(/\/blockcontroller\/getFileList/, 'post', getFileList)
Mock.mock(/\/PLCService\/savePlcMapList/, 'post', savePlcMapList)
