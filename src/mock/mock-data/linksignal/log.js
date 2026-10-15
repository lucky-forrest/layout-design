import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getLinkSignalFlowNameList = config => {
  return requestData({
    messageName: 'getLinkSignalFlowNameList',
    body: [
      {
        'objectId': '16',
        'shopName': 'ARRAY',
        'lineId': 'CHPOL200',
        'factoryName': 'T2',
        'createUser': 'Super Admin',
        'createTime': null,
        'flowName': '111111'
      },
      {
        'objectId': '17',
        'shopName': 'ARRAY',
        'lineId': 'CHPOL200',
        'factoryName': 'T2',
        'createUser': 'Super Admin',
        'createTime': null,
        'flowName': 'qwer'
      },
      {
        'objectId': '18',
        'shopName': 'ARRAY',
        'lineId': 'CHPOL200',
        'factoryName': 'T2',
        'createUser': 'Super Admin',
        'createTime': null,
        'flowName': 'bnm'
      }
    ]
  })
}
const getLinkSignalLogByTime = config => {
  return requestData({
    messageName: 'getLinkSignalLogByTime',
    body: {
      'objectId': 0,
      'shopName': 'ARRAY',
      'lineId': 'CHPOL200',
      'flowName': 'ddddd',
      'itemName': null,
      'itemValue': 0,
      'sort': 0,
      'flowId': 0,
      'time': null,
      'toEqpNo': null,
      'eqpName': null,
      'fromEqpNo': null,
      'eqpNo': null,
      'createTime': null,
      'updateTime': null,
      'createUser': null,
      'updateUser': null,
      'factoryName': 'T2',
      'upStreamSignal': '',
      'downStreamSignal': '',
      'itemGroupName': null,
      'flag': false,
      'logValue': 0,
      'startTime': '2019071608060000',
      'endTime': '2019071619060000',
      'upStream': [],
      'downStream': [],
      'itemBeans': [
        {
          'objectId': 0,
          'itemValue': 0,
          'sort': 0,
          'flowId': 0,
          'eqpName': 'L02_1ToL04_1',
          'upStreamSignal': '',
          'logValue': 0,
          'itemBeans': [
            {
              'objectId': 22,
              'shopName': null,
              'lineId': null,
              'flowName': 'ddddd',
              'itemName': null,
              'itemValue': 0,
              'sort': 4,
              'flowId': 12,
              'time': null,
              'toEqpNo': null,
              'eqpName': null,
              'fromEqpNo': null,
              'eqpNo': null,
              'createTime': '2019-07-17 19:52:49',
              'updateTime': null,
              'createUser': 'Super Admin',
              'updateUser': null,
              'factoryName': null,
              'upStreamSignal': '10000000000000000000000000000000',
              'downStreamSignal': '00000000000000000000000000000000',
              'itemGroupName': '',
              'startTime': null,
              'endTime': null,
              'flag': false,
              'logValue': 0,
              'upStream': [],
              'downStream': [],
              'itemBeans': [
                {
                  'objectId': 0,
                  'shopName': null,
                  'lineId': null,
                  'flowName': null,
                  'itemName': null,
                  'itemValue': 0,
                  'sort': 0,
                  'flowId': 0,
                  'time': null,
                  'toEqpNo': null,
                  'eqpName': null,
                  'fromEqpNo': null,
                  'eqpNo': null,
                  'createTime': null,
                  'updateTime': null,
                  'createUser': null,
                  'updateUser': null,
                  'factoryName': null,
                  'upStreamSignal': '',
                  'downStreamSignal': '',
                  'itemGroupName': '',
                  'startTime': null,
                  'endTime': null,
                  'flag': true,
                  'logValue': 0,
                  'upStream': [],
                  'downStream': [],
                  'itemBeans': []
                }
              ]
            }
          ]
        },
        {
          'objectId': 0,
          'shopName': null,
          'lineId': null,
          'flowName': null,
          'itemName': null,
          'itemValue': 0,
          'sort': 0,
          'flowId': 0,
          'time': null,
          'toEqpNo': null,
          'eqpName': 'L02ToL03',
          'fromEqpNo': null,
          'eqpNo': null,
          'createTime': null,
          'updateTime': null,
          'createUser': null,
          'updateUser': null,
          'factoryName': null,
          'upStreamSignal': '',
          'downStreamSignal': '',
          'itemGroupName': '',
          'startTime': null,
          'endTime': null,
          'flag': false,
          'logValue': 0,
          'upStream': [],
          'downStream': [],
          'itemBeans': [
            {
              'objectId': 22,
              'shopName': null,
              'lineId': null,
              'flowName': 'ddddd',
              'itemName': null,
              'itemValue': 0,
              'sort': 4,
              'flowId': 12,
              'time': null,
              'toEqpNo': null,
              'eqpName': null,
              'fromEqpNo': null,
              'eqpNo': null,
              'createTime': '2019-07-17 19:52:49',
              'updateTime': null,
              'createUser': 'Super Admin',
              'updateUser': null,
              'factoryName': null,
              'upStreamSignal': '10000000000000000000000000000000',
              'downStreamSignal': '00000000000000000000000000000000',
              'itemGroupName': '',
              'startTime': null,
              'endTime': null,
              'flag': false,
              'logValue': 0,
              'upStream': [],
              'downStream': [],
              'itemBeans': [
                {
                  'objectId': 0,
                  'shopName': null,
                  'lineId': null,
                  'flowName': null,
                  'itemName': null,
                  'itemValue': 0,
                  'sort': 0,
                  'flowId': 0,
                  'time': null,
                  'toEqpNo': null,
                  'eqpName': null,
                  'fromEqpNo': null,
                  'eqpNo': null,
                  'createTime': null,
                  'updateTime': null,
                  'createUser': null,
                  'updateUser': null,
                  'factoryName': null,
                  'upStreamSignal': '',
                  'downStreamSignal': '',
                  'itemGroupName': '',
                  'startTime': null,
                  'endTime': null,
                  'flag': true,
                  'logValue': 0,
                  'upStream': [],
                  'downStream': [],
                  'itemBeans': []
                },
                {
                  'objectId': 0,
                  'shopName': null,
                  'lineId': null,
                  'flowName': null,
                  'itemName': null,
                  'itemValue': 0,
                  'sort': 0,
                  'flowId': 0,
                  'time': null,
                  'toEqpNo': null,
                  'eqpName': null,
                  'fromEqpNo': null,
                  'eqpNo': null,
                  'createTime': null,
                  'updateTime': null,
                  'createUser': null,
                  'updateUser': null,
                  'factoryName': null,
                  'upStreamSignal': '',
                  'downStreamSignal': '',
                  'itemGroupName': '',
                  'startTime': null,
                  'endTime': null,
                  'flag': true,
                  'logValue': 0,
                  'upStream': [],
                  'downStream': [],
                  'itemBeans': []
                }
              ]
            },
            {
              'objectId': 22,
              'shopName': null,
              'lineId': null,
              'flowName': 'ddddd',
              'itemName': null,
              'itemValue': 0,
              'sort': 4,
              'flowId': 12,
              'time': null,
              'toEqpNo': null,
              'eqpName': null,
              'fromEqpNo': null,
              'eqpNo': null,
              'createTime': '2019-07-17 19:52:49',
              'updateTime': null,
              'createUser': 'Super Admin',
              'updateUser': null,
              'factoryName': null,
              'upStreamSignal': '10000000000000000000000000000000',
              'downStreamSignal': '00000000000000000000000000000000',
              'itemGroupName': '',
              'startTime': null,
              'endTime': null,
              'flag': false,
              'logValue': 0,
              'upStream': [],
              'downStream': [],
              'itemBeans': [
                {
                  'objectId': 0,
                  'shopName': null,
                  'lineId': null,
                  'flowName': null,
                  'itemName': null,
                  'itemValue': 0,
                  'sort': 0,
                  'flowId': 0,
                  'time': null,
                  'toEqpNo': null,
                  'eqpName': null,
                  'fromEqpNo': null,
                  'eqpNo': null,
                  'createTime': null,
                  'updateTime': null,
                  'createUser': null,
                  'updateUser': null,
                  'factoryName': null,
                  'upStreamSignal': '',
                  'downStreamSignal': '',
                  'itemGroupName': '',
                  'startTime': null,
                  'endTime': null,
                  'flag': true,
                  'logValue': 0,
                  'upStream': [],
                  'downStream': [],
                  'itemBeans': []
                },
                {
                  'objectId': 0,
                  'shopName': null,
                  'lineId': null,
                  'flowName': null,
                  'itemName': null,
                  'itemValue': 0,
                  'sort': 0,
                  'flowId': 0,
                  'time': null,
                  'toEqpNo': null,
                  'eqpName': null,
                  'fromEqpNo': null,
                  'eqpNo': null,
                  'createTime': null,
                  'updateTime': null,
                  'createUser': null,
                  'updateUser': null,
                  'factoryName': null,
                  'upStreamSignal': '',
                  'downStreamSignal': '',
                  'itemGroupName': '',
                  'startTime': null,
                  'endTime': null,
                  'flag': true,
                  'logValue': 0,
                  'upStream': [],
                  'downStream': [],
                  'itemBeans': []
                }
              ]
            }
          ]
        },
        {
          'objectId': 0,
          'shopName': null,
          'lineId': null,
          'flowName': null,
          'itemName': null,
          'itemValue': 0,
          'sort': 0,
          'flowId': 0,
          'time': null,
          'toEqpNo': null,
          'eqpName': 'L03ToL02',
          'fromEqpNo': null,
          'eqpNo': null,
          'createTime': null,
          'updateTime': null,
          'createUser': null,
          'updateUser': null,
          'factoryName': null,
          'upStreamSignal': '',
          'downStreamSignal': '',
          'itemGroupName': '',
          'startTime': null,
          'endTime': null,
          'flag': false,
          'logValue': 0,
          'upStream': [],
          'downStream': [],
          'itemBeans': [
            {
              'objectId': 22,
              'shopName': null,
              'lineId': null,
              'flowName': 'ddddd',
              'itemName': null,
              'itemValue': 0,
              'sort': 4,
              'flowId': 12,
              'time': null,
              'toEqpNo': null,
              'eqpName': null,
              'fromEqpNo': null,
              'eqpNo': null,
              'createTime': '2019-07-17 19:52:49',
              'updateTime': null,
              'createUser': 'Super Admin',
              'updateUser': null,
              'factoryName': null,
              'upStreamSignal': '10000000000000000000000000000000',
              'downStreamSignal': '00000000000000000000000000000000',
              'itemGroupName': '',
              'startTime': null,
              'endTime': null,
              'flag': false,
              'logValue': 0,
              'upStream': [],
              'downStream': [],
              'itemBeans': [
                {
                  'objectId': 0,
                  'shopName': null,
                  'lineId': null,
                  'flowName': null,
                  'itemName': null,
                  'itemValue': 0,
                  'sort': 0,
                  'flowId': 0,
                  'time': null,
                  'toEqpNo': null,
                  'eqpName': null,
                  'fromEqpNo': null,
                  'eqpNo': null,
                  'createTime': null,
                  'updateTime': null,
                  'createUser': null,
                  'updateUser': null,
                  'factoryName': null,
                  'upStreamSignal': '',
                  'downStreamSignal': '',
                  'itemGroupName': '',
                  'startTime': null,
                  'endTime': null,
                  'flag': true,
                  'logValue': 0,
                  'upStream': [],
                  'downStream': [],
                  'itemBeans': []
                },
                {
                  'objectId': 0,
                  'shopName': null,
                  'lineId': null,
                  'flowName': null,
                  'itemName': null,
                  'itemValue': 0,
                  'sort': 0,
                  'flowId': 0,
                  'time': null,
                  'toEqpNo': null,
                  'eqpName': null,
                  'fromEqpNo': null,
                  'eqpNo': null,
                  'createTime': null,
                  'updateTime': null,
                  'createUser': null,
                  'updateUser': null,
                  'factoryName': null,
                  'upStreamSignal': '',
                  'downStreamSignal': '',
                  'itemGroupName': '',
                  'startTime': null,
                  'endTime': null,
                  'flag': true,
                  'logValue': 0,
                  'upStream': [],
                  'downStream': [],
                  'itemBeans': []
                }
              ]
            },
            {
              'objectId': 22,
              'shopName': null,
              'lineId': null,
              'flowName': 'ddddd',
              'itemName': null,
              'itemValue': 0,
              'sort': 4,
              'flowId': 12,
              'time': null,
              'toEqpNo': null,
              'eqpName': null,
              'fromEqpNo': null,
              'eqpNo': null,
              'createTime': '2019-07-17 19:52:49',
              'updateTime': null,
              'createUser': 'Super Admin',
              'updateUser': null,
              'factoryName': null,
              'upStreamSignal': '10000000000000000000000000000000',
              'downStreamSignal': '00000000000000000000000000000000',
              'itemGroupName': '',
              'startTime': null,
              'endTime': null,
              'flag': false,
              'logValue': 0,
              'upStream': [],
              'downStream': [],
              'itemBeans': [
                {
                  'objectId': 0,
                  'shopName': null,
                  'lineId': null,
                  'flowName': null,
                  'itemName': null,
                  'itemValue': 0,
                  'sort': 0,
                  'flowId': 0,
                  'time': null,
                  'toEqpNo': null,
                  'eqpName': null,
                  'fromEqpNo': null,
                  'eqpNo': null,
                  'createTime': null,
                  'updateTime': null,
                  'createUser': null,
                  'updateUser': null,
                  'factoryName': null,
                  'upStreamSignal': '',
                  'downStreamSignal': '',
                  'itemGroupName': '',
                  'startTime': null,
                  'endTime': null,
                  'flag': true,
                  'logValue': 0,
                  'upStream': [],
                  'downStream': [],
                  'itemBeans': []
                },
                {
                  'objectId': 0,
                  'shopName': null,
                  'lineId': null,
                  'flowName': null,
                  'itemName': null,
                  'itemValue': 0,
                  'sort': 0,
                  'flowId': 0,
                  'time': null,
                  'toEqpNo': null,
                  'eqpName': null,
                  'fromEqpNo': null,
                  'eqpNo': null,
                  'createTime': null,
                  'updateTime': null,
                  'createUser': null,
                  'updateUser': null,
                  'factoryName': null,
                  'upStreamSignal': '',
                  'downStreamSignal': '',
                  'itemGroupName': '',
                  'startTime': null,
                  'endTime': null,
                  'flag': true,
                  'logValue': 0,
                  'upStream': [],
                  'downStream': [],
                  'itemBeans': []
                }
              ]
            }
          ]
        }
      ],
      'linkSignalSpecList': [
        {
          'itemGroupName': 'DownstreamLinkSignal',
          'itemBeans': [
            {
              'itemName': 'Downstream Inline',
              'itemValue': 0,
              'offSet': '0',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Downstream Trouble',
              'itemValue': 0,
              'offSet': '1',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Receive Able',
              'itemValue': 0,
              'offSet': '2',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Receive',
              'itemValue': 0,
              'offSet': '3',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Job Transfer',
              'itemValue': 0,
              'offSet': '4',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Receive Cancel',
              'itemValue': 0,
              'offSet': '5',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Exchange Possible',
              'itemValue': 0,
              'offSet': '6',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Double Glass',
              'itemValue': 0,
              'offSet': '7',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Receive Job Reserve',
              'itemValue': 0,
              'offSet': '8',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '9',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Transfer Stop Request',
              'itemValue': 0,
              'offSet': '10',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Dummy Glass Request',
              'itemValue': 0,
              'offSet': '11',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Glass Exist',
              'itemValue': 0,
              'offSet': '12',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '13',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '14',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '15',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#01',
              'itemValue': 0,
              'offSet': '16',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#02',
              'itemValue': 0,
              'offSet': '17',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#03',
              'itemValue': 0,
              'offSet': '18',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#04',
              'itemValue': 0,
              'offSet': '19',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#05',
              'itemValue': 0,
              'offSet': '20',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#06',
              'itemValue': 0,
              'offSet': '21',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Glass Count#01',
              'itemValue': 0,
              'offSet': '22',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Glass Count#02',
              'itemValue': 0,
              'offSet': '23',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Glass Count#03',
              'itemValue': 0,
              'offSet': '24',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Glass Count#04',
              'itemValue': 0,
              'offSet': '25',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Glass Count#05',
              'itemValue': 0,
              'offSet': '26',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Preparation Permission',
              'itemValue': 0,
              'offSet': '27',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Inspection Result Update',
              'itemValue': 0,
              'offSet': '28',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Return Mode',
              'itemValue': 0,
              'offSet': '29',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '30',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '31',
              'points': '1',
              'type': 'BIT'
            }
          ],
          'itemBean': null
        },
        {
          'itemGroupName': 'UpstreamLinkSignal',
          'itemBeans': [
            {
              'itemName': 'Upstream Inline',
              'itemValue': 0,
              'offSet': '0',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Upstream Trouble',
              'itemValue': 0,
              'offSet': '1',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Send Ready',
              'itemValue': 0,
              'offSet': '2',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Send',
              'itemValue': 0,
              'offSet': '3',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Job Transfer',
              'itemValue': 0,
              'offSet': '4',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Send Cancel',
              'itemValue': 0,
              'offSet': '5',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Exchange Execute',
              'itemValue': 0,
              'offSet': '6',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Double Glass',
              'itemValue': 0,
              'offSet': '7',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Send Job Reserve',
              'itemValue': 0,
              'offSet': '8',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Receive OK',
              'itemValue': 0,
              'offSet': '9',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '10',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '11',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '12',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '13',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '14',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '15',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#01',
              'itemValue': 0,
              'offSet': '16',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#02',
              'itemValue': 0,
              'offSet': '17',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#03',
              'itemValue': 0,
              'offSet': '18',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#04',
              'itemValue': 0,
              'offSet': '19',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#05',
              'itemValue': 0,
              'offSet': '20',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Slot Number#06',
              'itemValue': 0,
              'offSet': '21',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '22',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '23',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '24',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Short Vicinity',
              'itemValue': 0,
              'offSet': '25',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Long Vicinity',
              'itemValue': 0,
              'offSet': '26',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Preparation Completion',
              'itemValue': 0,
              'offSet': '27',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'In Inspecting',
              'itemValue': 0,
              'offSet': '28',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'OK Judge',
              'itemValue': 0,
              'offSet': '29',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'NG Judge',
              'itemValue': 0,
              'offSet': '30',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Return Mode',
              'itemValue': 0,
              'offSet': '31',
              'points': '1',
              'type': 'BIT'
            }
          ],
          'itemBean': null
        }
      ]
    }
  })
}
Mock.mock(/\/linkSignalSpec\/getLinkSignalLogByTime/, 'post', getLinkSignalLogByTime)
Mock.mock(/\/linkSignalSpec\/getLinkSignalFlowNameList/, 'post', getLinkSignalFlowNameList)
