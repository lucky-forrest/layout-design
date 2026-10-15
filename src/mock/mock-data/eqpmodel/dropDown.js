import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getDropDownList = config => {
  return requestData({
    messageName: 'getDropDownList',
    body: {
      'total': 8,
      'rows': [
        {
          'objectId': 9,
          'dataType': 'Root',
          'dataName': 'Shop',
          'dataDesc': '',
          'createUser': 'Super Admin',
          'createTime': 1556451550072,
          'updateUser': 'Super Admin',
          'updateTime': 1556451550072,
          'sort': 0,
          'dataAttr': null
        },
        {
          'objectId': 10,
          'dataType': 'Root',
          'dataName': 'CassetteType',
          'dataDesc': '',
          'createUser': 'Super Admin',
          'createTime': 1556451628441,
          'updateUser': 'Super Admin',
          'updateTime': 1556451628441,
          'sort': 0,
          'dataAttr': null
        },
        {
          'objectId': 11,
          'dataType': 'Root',
          'dataName': 'PortAttribute',
          'dataDesc': '',
          'createUser': 'Super Admin',
          'createTime': 1556451628445,
          'updateUser': 'Super Admin',
          'updateTime': 1556451628445,
          'sort': 0,
          'dataAttr': null
        },
        {
          'objectId': 14,
          'dataType': 'Root',
          'dataName': 'UnitAttribute',
          'dataDesc': null,
          'createUser': 'Super Admin',
          'createTime': 1556458930452,
          'updateUser': 'Super Admin',
          'updateTime': 1556458930452,
          'sort': 0,
          'dataAttr': null
        },
        {
          'objectId': 27,
          'dataType': 'Root',
          'dataName': 'EquipmentAttribute',
          'dataDesc': '',
          'createUser': 'Super Admin',
          'createTime': 1557284152618,
          'updateUser': 'Super Admin',
          'updateTime': 1557284152618,
          'sort': 0,
          'dataAttr': null
        },
        {
          'objectId': 16,
          'dataType': 'Shop',
          'dataName': 'ARRAY',
          'dataDesc': 'ARRAY Shop',
          'createUser': 'Super Admin',
          'createTime': 1556462076322,
          'updateUser': 'Super Admin',
          'updateTime': 1556462076322,
          'sort': 0,
          'dataAttr': null
        },
        {
          'objectId': 17,
          'dataType': 'Shop',
          'dataName': 'CELL',
          'dataDesc': 'CELL Shop',
          'createUser': 'Super Admin',
          'createTime': 1556462089928,
          'updateUser': 'Super Admin',
          'updateTime': 1556462089928,
          'sort': 0,
          'dataAttr': null
        },
        {
          'objectId': 18,
          'dataType': 'Shop',
          'dataName': 'CF',
          'dataDesc': 'CF Shop',
          'createUser': 'Super Admin',
          'createTime': 1556462089934,
          'updateUser': 'Super Admin',
          'updateTime': 1556462089934,
          'sort': 0,
          'dataAttr': null
        }
      ],
      'from': 0,
      'pageNo': 1,
      'pageSize': 2147483647,
      'condition': {},
      'sort': 'seq',
      'order': 'asc',
      'size': 2147483647
    }
  })
}
Mock.mock(/\/blockcontroller\/getDropDownList/, 'post', getDropDownList)
