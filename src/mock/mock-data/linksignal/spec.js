import { requestData } from '@/utils/request'
import Mock from 'mockjs'

const LinkSignalTemplateNameList = ['Common', 'Special', 'Usual']
// const getLinkSignalTemplateByLineId = config => {
//   return requestData({
//     messageName: 'getLinkSignalTemplateByLineId',
//     body: [{
//       itemGroupName: 'UpstreamLinkSignal',
//       itemBeans: [{
//         itemName: 'Upstream Line',
//         itemValue: '0'
//       }, {
//         itemName: 'Bit1',
//         itemValue: '1'
//       }, {
//         itemName: 'Bit2',
//         itemValue: '0'
//       }, {
//         itemName: 'Bit3',
//         itemValue: '0'
//       }, {
//         itemName: 'Bit4',
//         itemValue: '0'
//       }]
//     },
//     {
//       itemGroupName: 'DownstreamLinkSignal',
//       itemBeans: [{
//         itemName: 'Downstream Line',
//         itemValue: '0'
//       }, {
//         itemName: 'Bit1',
//         itemValue: '1'
//       }, {
//         itemName: 'Bit2',
//         itemValue: '0'
//       }, {
//         itemName: 'Bit3',
//         itemValue: '0'
//       }, {
//         itemName: 'Bit4',
//         itemValue: '0'
//       }]
//     }]
//   })
// }
const getLinkSignalTemplateName = config => {
  return requestData({
    messageName: 'getLinkSignalTemplateName',
    body: LinkSignalTemplateNameList
  })
}
const getLiksignalSpec = config => {
  return requestData({
    messageName: 'getLiksignalSpec',
    body: {
      'linkSignalSpecList': [{
        'templateName': 'downStream',
        'list': [{
          'itemName': 'DownstreamInline',
          'offSet': '0',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'DownstreamTrouble',
          'offSet': '1',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ReceiveAble',
          'offSet': '2',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Receive',
          'offSet': '3',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'JobTransfer',
          'offSet': '4',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ReceiveCancel',
          'offSet': '5',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ExchangePossible',
          'offSet': '6',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'DoubleGlass',
          'offSet': '7',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ReceiveJobReserve',
          'offSet': '8',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '9',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'TransferStopRequest',
          'offSet': '10',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'DummyGlassRequest',
          'offSet': '11',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassExist',
          'offSet': '12',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '13',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '14',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '15',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#01',
          'offSet': '16',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#02',
          'offSet': '17',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#03',
          'offSet': '18',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#04',
          'offSet': '19',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#05',
          'offSet': '20',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#06',
          'offSet': '21',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#01',
          'offSet': '22',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#02',
          'offSet': '23',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#03',
          'offSet': '24',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#04',
          'offSet': '25',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#05',
          'offSet': '26',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'PreparationPermission',
          'offSet': '27',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'InspectionResultUpdate',
          'offSet': '28',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ReturnMode',
          'offSet': '29',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '30',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '31',
          'points': '1',
          'type': 'BIT'
        }]
      },
      {
        'templateName': 'upStream',
        'list': [
          {
            'itemName': 'Upstream Inline',
            'offSet': '0',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Upstream Trouble',
            'offSet': '1',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SendReady',
            'offSet': '2',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Send',
            'offSet': '3',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'JobTransfer',
            'offSet': '4',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SendCancel',
            'offSet': '5',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ExchangePossible',
            'offSet': '6',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'DoubleGlass',
            'offSet': '7',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SendJobReserve',
            'offSet': '8',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ReceiveOK',
            'offSet': '9',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Spare',
            'offSet': '10',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Spare',
            'offSet': '11',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Spare',
            'offSet': '12',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Spare',
            'offSet': '13',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Spare',
            'offSet': '14',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Spare',
            'offSet': '15',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#01',
            'offSet': '16',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#02',
            'offSet': '17',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#03',
            'offSet': '18',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#04',
            'offSet': '19',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#05',
            'offSet': '20',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#06',
            'offSet': '21',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Spare',
            'offSet': '22',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Spare',
            'offSet': '23',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'Spare',
            'offSet': '24',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ShortVicinity',
            'offSet': '25',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'LongVicinity',
            'offSet': '26',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'PreparationCompletion',
            'offSet': '27',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'InInspecting',
            'offSet': '28',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'OKJudge',
            'offSet': '29',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'NGJudge',
            'offSet': '30',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ReturnMode',
            'offSet': '31',
            'points': '1',
            'type': 'BIT'
          }
        ]
      }],
      'itemBeans': [
        {
          'itemName': 'DownstreamInline',
          'offSet': '0',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'DownstreamTrouble',
          'offSet': '1',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ReceiveAble',
          'offSet': '2',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Receive',
          'offSet': '3',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'JobTransfer',
          'offSet': '4',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ReceiveCancel',
          'offSet': '5',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ExchangePossible',
          'offSet': '6',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'DoubleGlass',
          'offSet': '7',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ReceiveJobReserve',
          'offSet': '8',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '9',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'TransferStopRequest',
          'offSet': '10',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'DummyGlassRequest',
          'offSet': '11',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassExist',
          'offSet': '12',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '13',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '14',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '15',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#01',
          'offSet': '16',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#02',
          'offSet': '17',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#03',
          'offSet': '18',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#04',
          'offSet': '19',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#05',
          'offSet': '20',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'SlotNumber#06',
          'offSet': '21',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#01',
          'offSet': '22',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#02',
          'offSet': '23',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#03',
          'offSet': '24',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#04',
          'offSet': '25',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'GlassCount#05',
          'offSet': '26',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'PreparationPermission',
          'offSet': '27',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'InspectionResultUpdate',
          'offSet': '28',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'ReturnMode',
          'offSet': '29',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '30',
          'points': '1',
          'type': 'BIT'
        },
        {
          'itemName': 'Spare',
          'offSet': '31',
          'points': '1',
          'type': 'BIT'
        }
      ]
    }
  })
}
const getLinkSignalTempName = config => {
  return requestData({
    messageName: 'getLinkSignalTempName',
    body: {
      'Downstream': [
        {
          'objectId': null,
          'templateName': 'Downstream_CF',
          'itemName': null,
          'itemValue': 0,
          'sort': 0,
          'createUser': null,
          'createTime': null,
          'updateUser': null,
          'updateTime': null,
          'upStreamList': null,
          'downStreamList': null,
          'list': [
            {
              'objectId': '322',
              'templateName': 'Downstream_CF',
              'itemName': 'Downstream Inline',
              'itemValue': 1,
              'sort': 1,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '323',
              'templateName': 'Downstream_CF',
              'itemName': 'Downstream Trouble',
              'itemValue': 1,
              'sort': 2,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '324',
              'templateName': 'Downstream_CF',
              'itemName': 'Receive Able',
              'itemValue': 1,
              'sort': 3,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '325',
              'templateName': 'Downstream_CF',
              'itemName': 'Receive',
              'itemValue': 1,
              'sort': 4,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '326',
              'templateName': 'Downstream_CF',
              'itemName': 'Job Transfer',
              'itemValue': 1,
              'sort': 5,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '327',
              'templateName': 'Downstream_CF',
              'itemName': 'Receive Cancel',
              'itemValue': 1,
              'sort': 6,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '328',
              'templateName': 'Downstream_CF',
              'itemName': 'Exchange Possible',
              'itemValue': 1,
              'sort': 7,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '329',
              'templateName': 'Downstream_CF',
              'itemName': 'Double Glass',
              'itemValue': 1,
              'sort': 8,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '330',
              'templateName': 'Downstream_CF',
              'itemName': 'Receive Job Reserve',
              'itemValue': 1,
              'sort': 9,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '331',
              'templateName': 'Downstream_CF',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 10,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '332',
              'templateName': 'Downstream_CF',
              'itemName': 'Transfer Stop Request',
              'itemValue': 1,
              'sort': 11,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '333',
              'templateName': 'Downstream_CF',
              'itemName': 'Dummy Glass Request',
              'itemValue': 1,
              'sort': 12,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '334',
              'templateName': 'Downstream_CF',
              'itemName': 'Glass Exist',
              'itemValue': 1,
              'sort': 13,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '335',
              'templateName': 'Downstream_CF',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 14,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '336',
              'templateName': 'Downstream_CF',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 15,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '337',
              'templateName': 'Downstream_CF',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 16,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '338',
              'templateName': 'Downstream_CF',
              'itemName': 'Slot Number#01',
              'itemValue': 1,
              'sort': 17,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '339',
              'templateName': 'Downstream_CF',
              'itemName': 'Slot Number#02',
              'itemValue': 1,
              'sort': 18,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '340',
              'templateName': 'Downstream_CF',
              'itemName': 'Slot Number#03',
              'itemValue': 1,
              'sort': 19,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '341',
              'templateName': 'Downstream_CF',
              'itemName': 'Slot Number#04',
              'itemValue': 1,
              'sort': 20,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '342',
              'templateName': 'Downstream_CF',
              'itemName': 'Slot Number#05',
              'itemValue': 1,
              'sort': 21,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '343',
              'templateName': 'Downstream_CF',
              'itemName': 'Slot Number#06',
              'itemValue': 1,
              'sort': 22,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '344',
              'templateName': 'Downstream_CF',
              'itemName': 'Glass Count#01',
              'itemValue': 1,
              'sort': 23,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '345',
              'templateName': 'Downstream_CF',
              'itemName': 'Glass Count#02',
              'itemValue': 1,
              'sort': 24,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '346',
              'templateName': 'Downstream_CF',
              'itemName': 'Glass Count#03',
              'itemValue': 1,
              'sort': 25,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '347',
              'templateName': 'Downstream_CF',
              'itemName': 'Glass Count#04',
              'itemValue': 1,
              'sort': 26,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '348',
              'templateName': 'Downstream_CF',
              'itemName': 'Glass Count#05',
              'itemValue': 1,
              'sort': 27,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '349',
              'templateName': 'Downstream_CF',
              'itemName': 'Preparation Permission',
              'itemValue': 1,
              'sort': 28,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '350',
              'templateName': 'Downstream_CF',
              'itemName': 'Inspection Result Update',
              'itemValue': 1,
              'sort': 29,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '351',
              'templateName': 'Downstream_CF',
              'itemName': 'Return Mode',
              'itemValue': 1,
              'sort': 30,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '352',
              'templateName': 'Downstream_CF',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 31,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '353',
              'templateName': 'Downstream_CF',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 32,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            }
          ]
        },
        {
          'objectId': null,
          'templateName': 'Downstream_ARRAY',
          'itemName': null,
          'itemValue': 0,
          'sort': 0,
          'createUser': null,
          'createTime': null,
          'updateUser': null,
          'updateTime': null,
          'upStreamList': null,
          'downStreamList': null,
          'list': [
            {
              'objectId': '258',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Downstream Inline',
              'itemValue': 1,
              'sort': 1,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '259',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Downstream Trouble',
              'itemValue': 1,
              'sort': 2,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '260',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Receive Able',
              'itemValue': 1,
              'sort': 3,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '261',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Receive',
              'itemValue': 1,
              'sort': 4,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '262',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Job Transfer',
              'itemValue': 1,
              'sort': 5,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '263',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Receive Cancel',
              'itemValue': 1,
              'sort': 6,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '264',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Exchange Possible',
              'itemValue': 1,
              'sort': 7,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '265',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Double Glass',
              'itemValue': 1,
              'sort': 8,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '266',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Receive Job Reserve',
              'itemValue': 1,
              'sort': 9,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '267',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 10,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '268',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Transfer Stop Request',
              'itemValue': 1,
              'sort': 11,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '269',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Dummy Glass Request',
              'itemValue': 1,
              'sort': 12,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '270',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Glass Exist',
              'itemValue': 1,
              'sort': 13,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '271',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 14,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '272',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 15,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '273',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 16,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '274',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Slot Number#01',
              'itemValue': 1,
              'sort': 17,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '275',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Slot Number#02',
              'itemValue': 1,
              'sort': 18,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '276',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Slot Number#03',
              'itemValue': 1,
              'sort': 19,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '277',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Slot Number#04',
              'itemValue': 1,
              'sort': 20,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '278',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Slot Number#05',
              'itemValue': 1,
              'sort': 21,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '279',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Slot Number#06',
              'itemValue': 1,
              'sort': 22,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '280',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Glass Count#01',
              'itemValue': 1,
              'sort': 23,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '281',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Glass Count#02',
              'itemValue': 1,
              'sort': 24,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '282',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Glass Count#03',
              'itemValue': 1,
              'sort': 25,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '283',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Glass Count#04',
              'itemValue': 1,
              'sort': 26,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '284',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Glass Count#05',
              'itemValue': 1,
              'sort': 27,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '285',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Preparation Permission',
              'itemValue': 1,
              'sort': 28,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '286',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Inspection Result Update',
              'itemValue': 1,
              'sort': 29,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '287',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Return Mode',
              'itemValue': 1,
              'sort': 30,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '288',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 31,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            },
            {
              'objectId': '289',
              'templateName': 'Downstream_ARRAY',
              'itemName': 'Spare',
              'itemValue': 1,
              'sort': 32,
              'createUser': 'admin',
              'createTime': null,
              'updateUser': 'admin',
              'updateTime': null,
              'upStreamList': null,
              'downStreamList': null,
              'list': null
            }
          ]
        }
      ]
    }
  })
}
const getLinkSignalTempByFlowName = config => {
  return requestData({
    messageName: 'getLinkSignalTempByFlowName',
    body: []
  })
}
Mock.mock(/\/linkSignalSpec\/getLinkSignalTemplateName/, 'post', getLinkSignalTemplateName)
Mock.mock(/\/LinkSignalService\/getLinkSignalTempName/, 'post', getLinkSignalTempName)
Mock.mock(/\/linkSignalSpec\/getLinkSignalTempByFlowName/, 'post', getLinkSignalTempByFlowName)
Mock.mock(/\/linkSignalSpec\/getLiksignalSpec/, 'post', getLiksignalSpec)
