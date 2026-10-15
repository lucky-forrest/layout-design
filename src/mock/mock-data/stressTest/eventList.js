import { requestData } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(10, 20)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(
    Mock.mock({
      eventName: '@word(6)',
      blockName: '@word(6)',
      repeatReportByGlass: '@boolean',
      triggerCondition: '@word(6)',
      eventGroup: '@word(6)',
      groupNo: 1,
      'timeout|30-45': 1,
      'itemList|2-3': [{
        itemName: '@word(6)',
        'offset|1-9': 1,
        point: 1,
        type: '@pick(["I","AS","Bit"])',
        value: '@word(6)'
      }]
    })
  )
}
const getEventList = config => {
  return requestData({
    messageName: 'getEventList',
    body: [
      {

        'localNo': null,
        'itc': null,
        'unitNo': null,
        'eventName': 'DailyCheck',
        'blockName': 'PortTypeChangeBlock',
        'prefix': '1',
        'triggerCondition': 'RecipeID',
        'eventGroup': '1',
        'groupNo': 1,
        'timeOut': 100,
        'repeatReportByGlass': false,
        'items': [
          {
            'name': 'RecipeID',
            'offset': '0',
            'points': '8',
            'type': 'AS',
            'value': '10001001'
          },
          {
            'name': 'RecipeVersion',
            'offset': '8',
            'points': '3',
            'type': 'BCD',
            'value': '1.0'
          },
          {
            'name': 'CDA_Source',
            'offset': '1560',
            'points': '1',
            'type': 'I',
            'value': '1'
          },
          {
            'name': 'Power_Source',
            'offset': '1561',
            'points': '1',
            'type': 'I',
            'value': '2'
          }
        ]
      }
    ]
  })
}
const getBlockList = config => {
  return requestData({
    messageName: 'getBlockList',
    body: [
      {
        'privateAction': null,
        'deviceCode': null,
        'eventid': 'PortTypeChangeBlock',
        'blockName': 'PortTypeChangeBlock',
        'fullName': null,
        'prefix': '1',
        'privateDeviceNo': null,
        'items': [
          {
            'name': 'RecipeID',
            'offset': '0',
            'points': '8',
            'type': 'AS',
            'value': '11111',
            'constantItems': [
              {
                'key': '0',
                'value': '',
                'description': 'Unknow',
                'groupId': null
              },
              {
                'key': '1',
                'value': 'CIM On',
                'description': 'CIM On',
                'groupId': null
              },
              {
                'key': '2',
                'value': 'CIM Off',
                'description': 'CIM Off',
                'groupId': null
              }
            ]
          },
          {
            'name': 'CDA_Source',
            'offset': '0',
            'points': '8',
            'type': 'AS',
            'value': '11111',
            'constantItems': null
          },
          {
            'name': 'Power_Source',
            'offset': '0',
            'points': '8',
            'type': 'AS',
            'value': '11111',
            'constantItems': [
              {
                'key': '0',
                'value': '',
                'description': 'Unknow',
                'groupId': null
              },
              {
                'key': '1',
                'value': 'CIM On',
                'description': 'CIM On',
                'groupId': null
              },
              {
                'key': '2',
                'value': 'CIM Off',
                'description': 'CIM Off',
                'groupId': null
              }
            ]
          }
        ],
        'wMonitor': null,
        'privateStartAddress': null,
        'privateName': 'PortTypeChangeBlock',
        'privateEQPName': null,
        'privatePoints': 0
      },
      {
        'privateAction': null,
        'deviceCode': null,
        'eventid': 'PortTypeChangeBlock',
        'fullName': null,
        'prefix': '2',
        'privateDeviceNo': null,
        'items': [
          {
            'name': 'PortType',
            'offset': '0',
            'points': '8',
            'type': 'AS',
            'value': '222222',
            'constantItems': [
              {
                'key': '0',
                'value': 'test',
                'description': 'test',
                'groupId': null
              },
              {
                'key': '1',
                'value': 'comeon',
                'description': 'comeon',
                'groupId': null
              },
              {
                'key': '2',
                'value': 'other',
                'description': 'other',
                'groupId': null
              }
            ]
          }
        ],
        'wMonitor': null,
        'privateStartAddress': null,
        'privateName': 'PortTypeChangeBlock',
        'privateEQPName': null,
        'privatePoints': 0
      },
      {
        'privateAction': null,
        'deviceCode': null,
        'eventid': 'PortModeChangeBlock',
        'fullName': null,
        'prefix': '1',
        'privateDeviceNo': null,
        'items': [
          {
            'name': 'PortMode',
            'offset': '0',
            'points': '8',
            'type': 'AS',
            'value': '333333',
            'constantItems': null
          }
        ],
        'wMonitor': null,
        'privateStartAddress': null,
        'privateName': 'PortModeChangeBlock',
        'privateEQPName': null,
        'privatePoints': 0
      }
    ]
  })
}

Mock.mock(/\/EventService\/getEventList/, 'post', getEventList)
Mock.mock(/\/EventService\/getBlockList/, 'post', getBlockList)
