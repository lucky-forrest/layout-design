import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getAddressMap = config => {
  return requestData({
    messageName: 'getAddressMap',
    body: {
      'type': null,
      'update': false,
      'shopName': 'ARRAY',
      'lineId': 'CHPOL200',
      'factoryName': 'T2',
      'versoin': null,
      'addressMaps': null,
      'list': [{
        'type': 'LB LTM(H)',
        'update': false,
        'shopName': null,
        'lineId': null,
        'factoryName': null,
        'versoin': null,
        'addressMaps': [{
          'objectId': 68216,
          'shopName': 'ARRAY',
          'factoryName': 'T2',
          'lineId': 'CHPOL200',
          'version': 'ver 3.00',
          'type': null,
          'update': false,
          'sort': 0,
          'size': 160,
          'count': 1,
          'blockCatory': 'LTM',
          'blockType': 'bit',
          'blockObjectId': 68216,
          'equipmentNo': 'L3',
          'startAddress': null,
          'blockName': 'LinkSignalforReceive',
          'bitGroupName': null,
          'eqpMap': {
            'L05': '01C00',
            'L04': '01800',
            'L07': '',
            'L06': '02000',
            'L3': '',
            'L03': '01400',
            'L02': '01000'
          }
        }, {
          'objectId': 68222,
          'shopName': 'ARRAY',
          'factoryName': 'T2',
          'lineId': 'CHPOL200',
          'version': 'ver 3.00',
          'type': null,
          'update': false,
          'sort': 1,
          'size': 160,
          'count': 1,
          'blockCatory': 'LTM',
          'blockType': 'bit',
          'blockObjectId': 68222,
          'equipmentNo': 'L3',
          'startAddress': null,
          'blockName': 'LinkSignalforSendOut',
          'bitGroupName': null,
          'eqpMap': {
            'L05': '01CA0',
            'L04': '018A0',
            'L07': '',
            'L06': '020A0',
            'L3': '',
            'L03': '014A0',
            'L02': '010A0'
          }
        }]
      }, {
        'type': 'LB MTL(H)',
        'update': false,
        'shopName': null,
        'lineId': null,
        'factoryName': null,
        'versoin': null,
        'addressMaps': [{
          'objectId': 68389,
          'shopName': 'ARRAY',
          'factoryName': 'T2',
          'lineId': 'CHPOL200',
          'version': 'ver 3.00',
          'type': null,
          'update': false,
          'sort': 20,
          'size': 8,
          'count': 1,
          'blockCatory': 'MTL',
          'blockType': 'bit',
          'blockObjectId': 68389,
          'equipmentNo': 'L3',
          'startAddress': null,
          'blockName': 'BCStatus',
          'bitGroupName': null,
          'eqpMap': {
            'L05': '00A00',
            'L04': '00700',
            'L07': '',
            'L06': '00D00',
            'L3': '',
            'L03': '00400',
            'L02': '00100'
          }
        }, {
          'objectId': 68392,
          'shopName': 'ARRAY',
          'factoryName': 'T2',
          'lineId': 'CHPOL200',
          'version': 'ver 3.00',
          'type': null,
          'update': false,
          'sort': 21,
          'size': 8,
          'count': 1,
          'blockCatory': 'MTL',
          'blockType': 'bit',
          'blockObjectId': 68392,
          'equipmentNo': 'L3',
          'startAddress': null,
          'blockName': 'SendOutJobDataReply',
          'bitGroupName': null,
          'eqpMap': {
            'L05': '00A08',
            'L04': '00708',
            'L07': '',
            'L06': '00D08',
            'L3': '',
            'L03': '00408',
            'L02': '00108'
          }
        }]
      }]
    }
    // [
    //   {
    //     'type': 'LBLTM(H)',
    //     'update': false,
    //     'shopName': null,
    //     'lineId': null,
    //     'list': [
    //       {
    //         'objectId': 62742,
    //         'shopName': null,
    //         'factoryName': 'T2',
    //         'lineId': 'CHPOL200',
    //         'version': 'ver 3.00',
    //         'type': null,
    //         'update': false,
    //         'blockCatory': 'LTM',
    //         'blockType': 'bit',
    //         'blockObjectId': 0,
    //         'equipmentNo': 'L02',
    //         'startAddress': '01000',
    //         'blockName': 'LinkSignalforReceive',
    //         'bitGroupName': null
    //       }, {
    //         'objectId': 62742,
    //         'shopName': null,
    //         'factoryName': 'T2',
    //         'lineId': 'CHPOL200',
    //         'version': 'ver3.00',
    //         'type': null,
    //         'update': false,
    //         'blockCatory': 'LTM',
    //         'blockType': 'bit',
    //         'blockObjectId': 0,
    //         'equipmentNo': 'L03',
    //         'startAddress': '01400',
    //         'blockName': 'LinkSignalforReceive',
    //         'bitGroupName': null
    //       }
    //     ]
    //   }, {
    //     'type': 'LB MTL(H)',
    //     'update': false,
    //     'shopName': null,
    //     'lineId': null,
    //     'list': [
    //       {
    //         'objectId': 62742,
    //         'shopName': null,
    //         'factoryName': 'T2',
    //         'lineId': 'CHPOL200',
    //         'version': 'ver 3.00',
    //         'type': null,
    //         'update': false,
    //         'blockCatory': 'LTM',
    //         'blockType': 'bit',
    //         'blockObjectId': 0,
    //         'equipmentNo': 'L02',
    //         'startAddress': '01000',
    //         'blockName': 'LinkSignalforReceive',
    //         'bitGroupName': null
    //       }, {
    //         'objectId': 62742,
    //         'shopName': null,
    //         'factoryName': 'T2',
    //         'lineId': 'CHPOL200',
    //         'version': 'ver3.00',
    //         'type': null,
    //         'update': false,
    //         'blockCatory': 'LTM',
    //         'blockType': 'bit',
    //         'blockObjectId': 0,
    //         'equipmentNo': 'L03',
    //         'startAddress': '01400',
    //         'blockName': 'LinkSignalforReceive',
    //         'bitGroupName': null
    //       }
    //     ]
    //   }, {
    //     'type': 'LW LTM(H)',
    //     'update': false,
    //     'shopName': null,
    //     'lineId': null,
    //     'list': [
    //       {
    //         'objectId': 62742,
    //         'shopName': null,
    //         'factoryName': 'T2',
    //         'lineId': 'CHPOL200',
    //         'version': 'ver 3.00',
    //         'type': null,
    //         'update': false,
    //         'blockCatory': 'LTM',
    //         'blockType': 'bit',
    //         'blockObjectId': 0,
    //         'equipmentNo': 'L02',
    //         'startAddress': '01000',
    //         'blockName': 'LinkSignalforReceive',
    //         'bitGroupName': null
    //       }, {
    //         'objectId': 62742,
    //         'shopName': null,
    //         'factoryName': 'T2',
    //         'lineId': 'CHPOL200',
    //         'version': 'ver3.00',
    //         'type': null,
    //         'update': false,
    //         'blockCatory': 'LTM',
    //         'blockType': 'bit',
    //         'blockObjectId': 0,
    //         'equipmentNo': 'L03',
    //         'startAddress': '01400',
    //         'blockName': 'LinkSignalforReceive',
    //         'bitGroupName': null
    //       }
    //     ]
    //   }, {
    //     'type': 'LW MTL(H)',
    //     'update': false,
    //     'shopName': null,
    //     'lineId': null,
    //     'list': [
    //       {
    //         'objectId': 62742,
    //         'shopName': null,
    //         'factoryName': 'T2',
    //         'lineId': 'CHPOL200',
    //         'version': 'ver 3.00',
    //         'type': null,
    //         'update': false,
    //         'blockCatory': 'LTM',
    //         'blockType': 'bit',
    //         'blockObjectId': 0,
    //         'equipmentNo': 'L02',
    //         'startAddress': '01000',
    //         'blockName': 'LinkSignalforReceive',
    //         'bitGroupName': null
    //       }, {
    //         'objectId': 62742,
    //         'shopName': null,
    //         'factoryName': 'T2',
    //         'lineId': 'CHPOL200',
    //         'version': 'ver3.00',
    //         'type': null,
    //         'update': false,
    //         'blockCatory': 'LTM',
    //         'blockType': 'bit',
    //         'blockObjectId': 0,
    //         'equipmentNo': 'L03',
    //         'startAddress': '01400',
    //         'blockName': 'LinkSignalforReceive',
    //         'bitGroupName': null
    //       }
    //     ]
    //   }
    // ]
  })
}

Mock.mock(/\/addressMapService\/getAddressMap/, 'post', getAddressMap)
