import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const resetSimulatorType = config => {
  return requestData({
    messageName: 'resetSimulatorType',
    body: {}
  })
}
const getPlcSimulatorConstants = config => {
  return requestData({
    messageName: 'getPlcSimulatorConstants',
    body: {
      name: null,
      value: null,
      label: null,
      plcSimulatorConfig: [
        {
          'name': 'Action',
          'value': null,
          'label': null,
          'plcSimulatorConfig': [
            {
              'name': null,
              'value': '0',
              'label': 'NoUsed',
              'plcSimulatorConfig': []
            },
            {
              'name': null,
              'value': '1',
              'label': 'Received',
              'plcSimulatorConfig': []
            },
            {
              'name': null,
              'value': '2',
              'label': 'Sent',
              'plcSimulatorConfig': []
            },
            {
              'name': null,
              'value': '3',
              'label': 'Both',
              'plcSimulatorConfig': []
            }
          ]
        },
        {
          'name': 'AlarmLevel',
          'value': null,
          'label': null,
          'plcSimulatorConfig': [
            {
              'name': null,
              'value': '0',
              'label': 'Warning',
              'plcSimulatorConfig': []
            },
            {
              'name': null,
              'value': '1',
              'label': 'Error',
              'plcSimulatorConfig': []
            }
          ]
        },
        {
          'name': 'AlarmStatus',
          'value': null,
          'label': null,
          'plcSimulatorConfig': [
            {
              'name': null,
              'value': '0',
              'label': 'AlarmClear',
              'plcSimulatorConfig': []
            },
            {
              'name': null,
              'value': '1',
              'label': 'AlarmSet',
              'plcSimulatorConfig': []
            }
          ]
        }
      ]
    }
  })
}
const getplcblocklist = config => {
  return requestData({
    messageName: 'getplcblocklist',
    body: [
      {
        'eqpNo': 'L02',
        'blocks': [
          {
            'privateAction': 'WRITE',
            'deviceCode': 'W',
            'eventid': 'PortEnableModeChangeCommandBlock',
            'fullName': '',
            'prefix': '1',
            'privateDeviceNo': '01',
            'itemCollection': [
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'PortEnableMode',
                'privateName': 'PortEnableMode',
                'offset': '0',
                'points': '1'
              }
            ],
            'wMonitor': false,
            'privateStartAddress': '0x0004F2',
            'privateName': 'PortEnableModeChangeCommandBlock',
            'privateEQPName': 'L02',
            'privatePoints': 2
          },
          {
            'privateAction': 'WRITE',
            'deviceCode': 'W',
            'eventid': 'PortEnableModeChangeCommandBlock',
            'fullName': '',
            'prefix': '2',
            'privateDeviceNo': '01',
            'itemCollection': [
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'PortEnableMode',
                'privateName': 'PortEnableMode',
                'offset': '0',
                'points': '1'
              }
            ],
            'wMonitor': false,
            'privateStartAddress': '0x0004F4',
            'privateName': 'PortEnableModeChangeCommandBlock',
            'privateEQPName': 'L02',
            'privatePoints': 2
          },
          {
            'privateAction': 'WRITE',
            'deviceCode': 'W',
            'eventid': 'PortEnableModeChangeCommandBlock',
            'fullName': '',
            'prefix': '3',
            'privateDeviceNo': '01',
            'itemCollection': [
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'PortEnableMode',
                'privateName': 'PortEnableMode',
                'offset': '0',
                'points': '1'
              }
            ],
            'wMonitor': false,
            'privateStartAddress': '0x0004F6',
            'privateName': 'PortEnableModeChangeCommandBlock',
            'privateEQPName': 'L02',
            'privatePoints': 2
          },
          {
            'privateAction': 'WRITE',
            'deviceCode': 'W',
            'eventid': 'CassetteControlCommandBlock',
            'fullName': '',
            'prefix': '1',
            'privateDeviceNo': '01',
            'itemCollection': [
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'CassetteControlCommand',
                'privateName': 'CassetteControlCommand',
                'offset': '0',
                'points': '1'
              },
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'B',
                'eventID': 'JobExistence',
                'privateName': 'JobExistence',
                'offset': '1',
                'points': '2'
              },
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'CompletedCassetteReason',
                'privateName': 'CompletedCassetteReason',
                'offset': '3',
                'points': '1'
              },
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'JobCount',
                'privateName': 'JobCount',
                'offset': '8',
                'points': '1'
              }
            ],
            'wMonitor': false,
            'privateStartAddress': '0x0004FA',
            'privateName': 'CassetteControlCommandBlock',
            'privateEQPName': 'L02',
            'privatePoints': 16
          },
          {
            'privateAction': 'WRITE',
            'deviceCode': 'W',
            'eventid': 'CassetteControlCommandBlock',
            'fullName': '',
            'prefix': '2',
            'privateDeviceNo': '01',
            'itemCollection': [
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'CassetteControlCommand',
                'privateName': 'CassetteControlCommand',
                'offset': '0',
                'points': '1'
              },
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'B',
                'eventID': 'JobExistence',
                'privateName': 'JobExistence',
                'offset': '1',
                'points': '2'
              },
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'CompletedCassetteReason',
                'privateName': 'CompletedCassetteReason',
                'offset': '3',
                'points': '1'
              },
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'JobCount',
                'privateName': 'JobCount',
                'offset': '8',
                'points': '1'
              }
            ],
            'wMonitor': false,
            'privateStartAddress': '0x00050A',
            'privateName': 'CassetteControlCommandBlock',
            'privateEQPName': 'L02',
            'privatePoints': 16
          },
          {
            'privateAction': 'WRITE',
            'deviceCode': 'W',
            'eventid': 'CassetteControlCommandBlock',
            'fullName': '',
            'prefix': '3',
            'privateDeviceNo': '01',
            'itemCollection': [
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'CassetteControlCommand',
                'privateName': 'CassetteControlCommand',
                'offset': '0',
                'points': '1'
              },
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'B',
                'eventID': 'JobExistence',
                'privateName': 'JobExistence',
                'offset': '1',
                'points': '2'
              },
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'CompletedCassetteReason',
                'privateName': 'CompletedCassetteReason',
                'offset': '3',
                'points': '1'
              },
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'I',
                'eventID': 'JobCount',
                'privateName': 'JobCount',
                'offset': '8',
                'points': '1'
              }
            ],
            'wMonitor': false,
            'privateStartAddress': '0x00051A',
            'privateName': 'CassetteControlCommandBlock',
            'privateEQPName': 'L02',
            'privatePoints': 16
          },
          {
            'privateAction': 'WRITE',
            'deviceCode': 'W',
            'eventid': 'DateTimeSetCommandBlock',
            'fullName': '',
            'prefix': '',
            'privateDeviceNo': '01',
            'itemCollection': [
              {
                'strValue': '0',
                'privateEventON': false,
                'itemType': 'BCD',
                'eventID': 'DateTime',
                'privateName': 'DateTime',
                'offset': '0',
                'points': '3'
              }
            ],
            'wMonitor': false,
            'privateStartAddress': '0x000000',
            'privateName': 'DateTimeSetCommandBlock',
            'privateEQPName': 'L02',
            'privatePoints': 8
          }
        ]
      }
    ]
  })
}
const getConnectByName = () => {
  return {
    'header': {
      'messageName': 'getConnectByName',
      'transactionId': '202001131743252525',
      'inboxName': 'T7',
      'userName': 'Super Admin'
    },
    'body': true,
    'result': {
      'returnCode': '0',
      'returnMessageEN': 'Operation succeeded!',
      'returnMessageCH': '操作成功!'
    }
  }
}
Mock.mock(/\/blockcontroller\/getplcblocklist/, 'post', getplcblocklist)
Mock.mock(/\/blockcontroller\/getConnectByName/, 'post', getConnectByName)
Mock.mock(/\/blockcontroller\/resetsimulatortype/, 'post', resetSimulatorType)
Mock.mock(/\/blockcontroller\/getPlcSimulatorConstants/, 'post', getPlcSimulatorConstants)
