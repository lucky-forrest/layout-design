import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const linkSignalMonitor = () => {
  return requestData({
    messageName: 'linkSignalMonitor',
    body: {
      'linkSignalMap': {
        'L04_1ToL05_1': [
          {
            'equipmentNo': 'L04',
            'blockName': 'Upstream#02LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L04_1ToL05_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '012A0',
            'signalDirection': 'L04_1ToL05_1'
          },
          {
            'equipmentNo': 'L06',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L04_1ToL05_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01720',
            'signalDirection': 'L04_1ToL05_1'
          }
        ],
        'L05_1ToL04_2': [
          {
            'equipmentNo': 'L04',
            'blockName': 'Upstream#02LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L05_1ToL04_2',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '012A0',
            'signalDirection': 'L05_1ToL04_2'
          },
          {
            'equipmentNo': 'L06',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L05_1ToL04_2',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01720',
            'signalDirection': 'L05_1ToL04_2'
          }
        ]
      }
    }
  })
}
Mock.mock(/\/blockcontroller\/linkSignalMonitor/, 'post', linkSignalMonitor)
