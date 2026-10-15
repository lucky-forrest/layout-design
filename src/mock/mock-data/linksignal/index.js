
import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getlinksignalbolcklist = () => {
  return {
    'header': {
      'messageName': 'getLinkSignalList',
      'transactionId': '202001131743252525',
      'inboxName': 'T7',
      'userName': 'Super Admin'
    },
    'body': {
      'linkSignalMap': {
        'L04_2ToL06_1': [
          {
            'equipmentNo': 'L04',
            'blockName': 'Upstream#02LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L04_2ToL06_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '012A0',
            'signalDirection': 'L04_2ToL06_1'
          },
          {
            'equipmentNo': 'L06',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L04_2ToL06_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01720',
            'signalDirection': 'L04_2ToL06_1'
          }
        ],
        'L06_1ToL04_3': [
          {
            'equipmentNo': 'L04',
            'blockName': 'Downstream#03LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L06_1ToL04_3',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01240',
            'signalDirection': 'L06_1ToL04_3'
          },
          {
            'equipmentNo': 'L06',
            'blockName': 'Upstream#01LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L06_1ToL04_3',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01760',
            'signalDirection': 'L06_1ToL04_3'
          }
        ],
        'L04_3ToL07_1': [
          {
            'equipmentNo': 'L04',
            'blockName': 'Upstream#03LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L04_3ToL07_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '012C0',
            'signalDirection': 'L04_3ToL07_1'
          },
          {
            'equipmentNo': 'L07',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L04_3ToL07_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01A20',
            'signalDirection': 'L04_3ToL07_1'
          }
        ],
        'L04_1ToL05_1': [
          {
            'equipmentNo': 'L04',
            'blockName': 'Upstream#01LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L04_1ToL05_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01280',
            'signalDirection': 'L04_1ToL05_1'
          },
          {
            'equipmentNo': 'L05',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L04_1ToL05_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01420',
            'signalDirection': 'L04_1ToL05_1'
          }
        ],
        'L02_1ToL03_1': [
          {
            'equipmentNo': 'L02',
            'blockName': 'Upstream#01LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L02_1ToL03_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '00D70',
            'signalDirection': 'L02_1ToL03_1'
          },
          {
            'equipmentNo': 'L03',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L02_1ToL03_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '00F00',
            'signalDirection': 'L02_1ToL03_1'
          }
        ],
        'L05_1ToL04_2': [
          {
            'equipmentNo': 'L04',
            'blockName': 'Downstream#02LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L05_1ToL04_2',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01220',
            'signalDirection': 'L05_1ToL04_2'
          },
          {
            'equipmentNo': 'L05',
            'blockName': 'Upstream#01LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L05_1ToL04_2',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01460',
            'signalDirection': 'L05_1ToL04_2'
          }
        ],
        'L07_1ToL08_1': [
          {
            'equipmentNo': 'L07',
            'blockName': 'Upstream#01LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L07_1ToL08_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01A60',
            'signalDirection': 'L07_1ToL08_1'
          },
          {
            'equipmentNo': 'L08',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L07_1ToL08_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01BA0',
            'signalDirection': 'L07_1ToL08_1'
          }
        ],
        'L09_1ToL11_1': [
          {
            'equipmentNo': 'L09',
            'blockName': 'Upstream#01LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L09_1ToL11_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01D60',
            'signalDirection': 'L09_1ToL11_1'
          },
          {
            'equipmentNo': 'L11',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L09_1ToL11_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '021C0',
            'signalDirection': 'L09_1ToL11_1'
          }
        ],
        'L03_1ToL04_1': [
          {
            'equipmentNo': 'L03',
            'blockName': 'Upstream#01LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L03_1ToL04_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '00F40',
            'signalDirection': 'L03_1ToL04_1'
          },
          {
            'equipmentNo': 'L04',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L03_1ToL04_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01200',
            'signalDirection': 'L03_1ToL04_1'
          }
        ],
        'L08_1ToL09_1': [
          {
            'equipmentNo': 'L08',
            'blockName': 'Upstream#01LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L08_1ToL09_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01BE0',
            'signalDirection': 'L08_1ToL09_1'
          },
          {
            'equipmentNo': 'L09',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L08_1ToL09_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '01D20',
            'signalDirection': 'L08_1ToL09_1'
          }
        ]
      },
      'linkSignalItemList': [
        {
          'itemGroupName': 'UpstreamLinkSignal',
          'itemBeans': [
            {
              'itemName': 'UpstreamInline',
              'itemValue': 0,
              'offSet': '0',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'UpstreamTrouble',
              'itemValue': 0,
              'offSet': '1',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SendReady',
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
              'itemName': 'JobTransfer',
              'itemValue': 0,
              'offSet': '4',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SendCancel',
              'itemValue': 0,
              'offSet': '5',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ExchangeExecute',
              'itemValue': 0,
              'offSet': '6',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'DoubleGlass',
              'itemValue': 0,
              'offSet': '7',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SendJobReserve',
              'itemValue': 0,
              'offSet': '8',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ReceiveOK',
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
              'itemName': 'SlotNumber#01',
              'itemValue': 0,
              'offSet': '16',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#02',
              'itemValue': 0,
              'offSet': '17',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#03',
              'itemValue': 0,
              'offSet': '18',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#04',
              'itemValue': 0,
              'offSet': '19',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#05',
              'itemValue': 0,
              'offSet': '20',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#06',
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
              'itemName': 'ShortVicinity',
              'itemValue': 0,
              'offSet': '25',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LongVicinity',
              'itemValue': 0,
              'offSet': '26',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'PreparationCompletion',
              'itemValue': 0,
              'offSet': '27',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'InInspecting',
              'itemValue': 0,
              'offSet': '28',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'OKJudge',
              'itemValue': 0,
              'offSet': '29',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'NGJudge',
              'itemValue': 0,
              'offSet': '30',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ReturnMode',
              'itemValue': 0,
              'offSet': '31',
              'points': '1',
              'type': 'BIT'
            }
          ],
          'itemNameList': [
            'UpstreamInline',
            'UpstreamTrouble',
            'SendReady',
            'Send',
            'JobTransfer',
            'SendCancel',
            'ExchangeExecute',
            'DoubleGlass',
            'SendJobReserve',
            'ReceiveOK',
            'Spare',
            'SlotNumber#01',
            'SlotNumber#02',
            'SlotNumber#03',
            'SlotNumber#04',
            'SlotNumber#05',
            'SlotNumber#06',
            'ShortVicinity',
            'LongVicinity',
            'PreparationCompletion',
            'InInspecting',
            'OKJudge',
            'NGJudge',
            'ReturnMode'
          ],
          'itemBean': null
        },
        {
          'itemGroupName': 'DownstreamLinkSignal',
          'itemBeans': [
            {
              'itemName': 'DownstreamInline',
              'itemValue': 0,
              'offSet': '0',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'DownstreamTrouble',
              'itemValue': 0,
              'offSet': '1',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ReceiveAble',
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
              'itemName': 'JobTransfer',
              'itemValue': 0,
              'offSet': '4',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ReceiveCancel',
              'itemValue': 0,
              'offSet': '5',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ExchangePossible',
              'itemValue': 0,
              'offSet': '6',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'DoubleGlass',
              'itemValue': 0,
              'offSet': '7',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ReceiveJobReserve',
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
              'itemName': 'TransferStopRequest',
              'itemValue': 0,
              'offSet': '10',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'DummyGlassRequest',
              'itemValue': 0,
              'offSet': '11',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassExist',
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
              'itemName': 'SlotNumber#01',
              'itemValue': 0,
              'offSet': '16',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#02',
              'itemValue': 0,
              'offSet': '17',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#03',
              'itemValue': 0,
              'offSet': '18',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#04',
              'itemValue': 0,
              'offSet': '19',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#05',
              'itemValue': 0,
              'offSet': '20',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#06',
              'itemValue': 0,
              'offSet': '21',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#01',
              'itemValue': 0,
              'offSet': '22',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#02',
              'itemValue': 0,
              'offSet': '23',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#03',
              'itemValue': 0,
              'offSet': '24',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#04',
              'itemValue': 0,
              'offSet': '25',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#05',
              'itemValue': 0,
              'offSet': '26',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'PreparationPermission',
              'itemValue': 0,
              'offSet': '27',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'InspectionResultUpdate',
              'itemValue': 0,
              'offSet': '28',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ReturnMode',
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
          'itemNameList': [
            'DownstreamInline',
            'DownstreamTrouble',
            'ReceiveAble',
            'Receive',
            'JobTransfer',
            'ReceiveCancel',
            'ExchangePossible',
            'DoubleGlass',
            'ReceiveJobReserve',
            'Spare',
            'TransferStopRequest',
            'DummyGlassRequest',
            'GlassExist',
            'SlotNumber#01',
            'SlotNumber#02',
            'SlotNumber#03',
            'SlotNumber#04',
            'SlotNumber#05',
            'SlotNumber#06',
            'GlassCount#01',
            'GlassCount#02',
            'GlassCount#03',
            'GlassCount#04',
            'GlassCount#05',
            'PreparationPermission',
            'InspectionResultUpdate',
            'ReturnMode'
          ],
          'itemBean': null
        }
      ]
    },
    'result': {
      'returnCode': '0',
      'returnMessageEN': 'Operation succeeded!',
      'returnMessageCH': '操作成功!'
    }
  }
}

const getGraphidJobData = () => {
  return requestData({
    messageName: 'getGraphidJobData',
    body: { 'equipmentAlive': 0, 'eqEventList': [{ 'name': 'JobEvent', 'eventList': [{ 'name': 'SendOut#01JobDataReport', 'bitBlock': 'BCReadEvent', 'bitItem': 'SendOut#01JobDataReport', 'port': 0, 'portList': [], 'eventBlock': { 'name': 'SendOut#01JobDataReportBlock', 'area': 'W', 'action': 'READ', 'points': '96', 'prefix': '', 'eqpName': null, 'bitValue': '0', 'items': [{ 'name': 'CassetteSequenceNo', 'offset': '0', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'JobSequenceNo', 'offset': '1', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'GroupIndex', 'offset': '2', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'ProductNo', 'offset': '3', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'SamplingSlotFlag', 'offset': '4: 0', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Not Sampling Slot', 'description': 'Not Sampling Slot', 'groupId': null }, { 'key': '1', 'value': 'Sampling Slot', 'description': 'Sampling Slot', 'groupId': null }] }, { 'name': 'FirstRunFlag', 'offset': '4: 1', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Not First Run', 'description': 'Not First Run', 'groupId': null }, { 'key': '1', 'value': 'First Run', 'description': 'First Run', 'groupId': null }] }, { 'name': 'LastGlassFlag', 'offset': '4: 2', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'OXRInformationRequestFlag', 'offset': '4: 3', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Disable', 'description': 'Disable', 'groupId': null }, { 'key': '1', 'value': 'Enable', 'description': 'Enable', 'groupId': null }] }, { 'name': 'CIMMode', 'offset': '4: 4', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'NoUsed', 'description': 'NoUsed', 'groupId': null }, { 'key': '1', 'value': 'CIMON', 'description': 'CIMOn', 'groupId': null }, { 'key': '2', 'value': 'CIMOFF', 'description': 'CIMOff', 'groupId': null }] }, { 'name': 'CSTOperationMode', 'offset': '4: 5', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'NoUsed', 'description': 'NoUsed', 'groupId': null }, { 'key': '1', 'value': 'KindToKindMode', 'description': 'KindToKindMode', 'groupId': null }, { 'key': '2', 'value': 'CassetteToCassetteMode', 'description': 'CassetteToCassetteMode', 'groupId': null }] }, { 'name': 'SubstrateType', 'offset': '4: 6', 'points': '1: 2', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Glass', 'description': 'Glass', 'groupId': null }, { 'key': '1', 'value': 'Chip', 'description': 'Chip', 'groupId': null }, { 'key': '2', 'value': 'Cassette', 'description': 'Cassette', 'groupId': null }, { 'key': '3', 'value': 'Cut', 'description': 'Cut', 'groupId': null }] }, { 'name': 'JobType', 'offset': '4: 8', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '1', 'value': 'TFT Glass', 'description': 'TFT Glass', 'groupId': null }, { 'key': '2', 'value': 'CF Glass', 'description': 'CF Glass', 'groupId': null }, { 'key': '3', 'value': 'Dummy Glass', 'description': 'Dummy Glass', 'groupId': null }, { 'key': '4', 'value': 'Through Dummy', 'description': 'Through Dummy', 'groupId': null }, { 'key': '5', 'value': 'Thickness Dummy', 'description': 'Thickness Dummy', 'groupId': null }, { 'key': '6', 'value': 'UV Mask', 'description': 'UV Mask', 'groupId': null }, { 'key': '7', 'value': 'Pre Suppter Dummy', 'description': 'Pre Suppter Dummy', 'groupId': null }] }, { 'name': 'JobJudge', 'offset': '4: 12', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '11', 'value': 'CD–CommonDefect', 'description': 'CD–CommonDefect', 'groupId': null }, { 'key': '12', 'value': 'ID–GlassIDNG', 'description': 'ID–GlassIDNG', 'groupId': null }, { 'key': '13', 'value': 'LR–ToFLRRepair', 'description': 'LR–ToFLRRepair', 'groupId': null }, { 'key': '14', 'value': 'RT–ToATS', 'description': 'RT–ToATS', 'groupId': null }, { 'key': '0', 'value': 'InspectionSkiporNoJudge', 'description': 'InspectionSkiporNoJudge', 'groupId': null }, { 'key': '1', 'value': 'OK', 'description': 'OK', 'groupId': null }, { 'key': '2', 'value': 'NG-Insp.Result', 'description': 'NG-Insp.Result', 'groupId': null }, { 'key': '3', 'value': 'RW-RequiredRework', 'description': 'RW-RequiredRework', 'groupId': null }, { 'key': '4', 'value': 'RJ-Reject(Scrap)', 'description': 'RJ-Reject(Scrap)', 'groupId': null }, { 'key': '5', 'value': 'RP-RequiredRepair', 'description': 'RP-RequiredRepair', 'groupId': null }, { 'key': '6', 'value': 'RD-Re-Judge', 'description': 'RD-Re-Judge', 'groupId': null }, { 'key': '7', 'value': 'RV-PIReview', 'description': 'RV-PIReview', 'groupId': null }, { 'key': '8', 'value': 'DR-InkRepair', 'description': 'DR-InkRepair', 'groupId': null }, { 'key': '9', 'value': 'PC–PoorCoating', 'description': 'PC–PoorCoating', 'groupId': null }, { 'key': '10', 'value': 'MD–MaskDefect', 'description': 'MD–MaskDefect', 'groupId': null }] }, { 'name': 'JobGrade', 'offset': '5', 'points': '1', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'JobId', 'offset': '6', 'points': '10', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'INSP/EQPReservations', 'offset': '16', 'points': '1', 'type': 'B', 'value': '0', 'constantItems': null }, { 'name': 'INSPJudgedData', 'offset': '17', 'points': '2', 'type': 'B', 'value': '0', 'constantItems': null }, { 'name': 'EQPFlag', 'offset': '19', 'points': '3', 'type': 'B', 'value': '0', 'constantItems': null }, { 'name': 'TrackingData', 'offset': '22', 'points': '4', 'type': 'B', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Not Processed [Not In EQ]', 'description': 'Not Processed [Not In EQ]', 'groupId': null }, { 'key': '1', 'value': 'Normal Processed [In EQ]', 'description': 'Normal Processed [In EQ]', 'groupId': null }, { 'key': '2', 'value': 'Abnormal Processed [In EQ]', 'description': 'Abnormal Processed [In EQ]', 'groupId': null }, { 'key': '3', 'value': 'Process Skip [In EQ]', 'description': 'Process Skip [In EQ]', 'groupId': null }] }, { 'name': 'OXRInformation', 'offset': '26', 'points': '14', 'type': 'B', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'XorNoChipexist', 'description': 'XorNoChipexist', 'groupId': null }, { 'key': '1', 'value': 'R', 'description': 'R', 'groupId': null }, { 'key': '2', 'value': 'L', 'description': 'L', 'groupId': null }, { 'key': '3', 'value': 'O', 'description': 'O', 'groupId': null }, { 'key': '4', 'value': 'F', 'description': 'F', 'groupId': null }] }, { 'name': 'BPOOvenSlotNo', 'offset': '40: 0', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'BPOOvenCoolNo', 'offset': '40: 4', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'PPOBakeSlotNo', 'offset': '40: 8', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'ChipCount', 'offset': '41: 0', 'points': '1: 9', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'ControlMode', 'offset': '41: 9', 'points': '1: 2', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'GlassAngle', 'offset': '41: 11', 'points': '1: 2', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'ProductID', 'offset': '42', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'CassetteSettingCode', 'offset': '43', 'points': '2', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'OwnerID', 'offset': '45', 'points': '2', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'Productowner', 'offset': '47', 'points': '1', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'PIPreReworkCount', 'offset': '48: 0', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'PIReworkCount', 'offset': '48: 4', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'OverBakeFlag', 'offset': '48: 8', 'points': '1: 6', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'No Process', 'description': 'No Process', 'groupId': null }, { 'key': '1', 'value': ' BPO Oven Normal Bake Glass', 'description': ' BPO Oven Normal Bake Glass', 'groupId': null }, { 'key': '2', 'value': ' BPO Oven No Bake Glass', 'description': ' BPO Oven No Bake Glass', 'groupId': null }, { 'key': '3', 'value': ' BPO Oven Over Bake Glass', 'description': ' BPO Oven Over Bake Glass', 'groupId': null }] }, { 'name': 'PFCDNo', 'offset': '49', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'BPOOvenprocesstime', 'offset': '50', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'PPOOvenprocesstime', 'offset': '51', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'PMOOvenprocesstime', 'offset': '52', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'PPID', 'offset': '71', 'points': '25', 'type': 'A', 'value': '', 'constantItems': null }] }}] }], 'bcEventList': [{ 'name': 'JobEvent', 'eventList': [{ 'name': 'SendOut#01JobDataReport', 'bitBlock': 'BCReadEvent', 'bitItem': 'SendOut#01JobDataReport', 'port': 0, 'portList': [], 'eventBlock': { 'name': 'SendOut#01JobDataReportBlock', 'area': 'W', 'action': 'READ', 'points': '96', 'prefix': '', 'eqpName': null, 'bitValue': '0', 'items': [{ 'name': 'CassetteSequenceNo', 'offset': '0', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'JobSequenceNo', 'offset': '1', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'GroupIndex', 'offset': '2', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'ProductNo', 'offset': '3', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'SamplingSlotFlag', 'offset': '4: 0', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Not Sampling Slot', 'description': 'Not Sampling Slot', 'groupId': null }, { 'key': '1', 'value': 'Sampling Slot', 'description': 'Sampling Slot', 'groupId': null }] }, { 'name': 'FirstRunFlag', 'offset': '4: 1', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Not First Run', 'description': 'Not First Run', 'groupId': null }, { 'key': '1', 'value': 'First Run', 'description': 'First Run', 'groupId': null }] }, { 'name': 'LastGlassFlag', 'offset': '4: 2', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'OXRInformationRequestFlag', 'offset': '4: 3', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Disable', 'description': 'Disable', 'groupId': null }, { 'key': '1', 'value': 'Enable', 'description': 'Enable', 'groupId': null }] }, { 'name': 'CIMMode', 'offset': '4: 4', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'NoUsed', 'description': 'NoUsed', 'groupId': null }, { 'key': '1', 'value': 'CIMON', 'description': 'CIMOn', 'groupId': null }, { 'key': '2', 'value': 'CIMOFF', 'description': 'CIMOff', 'groupId': null }] }, { 'name': 'CSTOperationMode', 'offset': '4: 5', 'points': '1: 1', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'NoUsed', 'description': 'NoUsed', 'groupId': null }, { 'key': '1', 'value': 'KindToKindMode', 'description': 'KindToKindMode', 'groupId': null }, { 'key': '2', 'value': 'CassetteToCassetteMode', 'description': 'CassetteToCassetteMode', 'groupId': null }] }, { 'name': 'SubstrateType', 'offset': '4: 6', 'points': '1: 2', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Glass', 'description': 'Glass', 'groupId': null }, { 'key': '1', 'value': 'Chip', 'description': 'Chip', 'groupId': null }, { 'key': '2', 'value': 'Cassette', 'description': 'Cassette', 'groupId': null }, { 'key': '3', 'value': 'Cut', 'description': 'Cut', 'groupId': null }] }, { 'name': 'JobType', 'offset': '4: 8', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '1', 'value': 'TFT Glass', 'description': 'TFT Glass', 'groupId': null }, { 'key': '2', 'value': 'CF Glass', 'description': 'CF Glass', 'groupId': null }, { 'key': '3', 'value': 'Dummy Glass', 'description': 'Dummy Glass', 'groupId': null }, { 'key': '4', 'value': 'Through Dummy', 'description': 'Through Dummy', 'groupId': null }, { 'key': '5', 'value': 'Thickness Dummy', 'description': 'Thickness Dummy', 'groupId': null }, { 'key': '6', 'value': 'UV Mask', 'description': 'UV Mask', 'groupId': null }, { 'key': '7', 'value': 'Pre Suppter Dummy', 'description': 'Pre Suppter Dummy', 'groupId': null }] }, { 'name': 'JobJudge', 'offset': '4: 12', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '11', 'value': 'CD–CommonDefect', 'description': 'CD–CommonDefect', 'groupId': null }, { 'key': '12', 'value': 'ID–GlassIDNG', 'description': 'ID–GlassIDNG', 'groupId': null }, { 'key': '13', 'value': 'LR–ToFLRRepair', 'description': 'LR–ToFLRRepair', 'groupId': null }, { 'key': '14', 'value': 'RT–ToATS', 'description': 'RT–ToATS', 'groupId': null }, { 'key': '0', 'value': 'InspectionSkiporNoJudge', 'description': 'InspectionSkiporNoJudge', 'groupId': null }, { 'key': '1', 'value': 'OK', 'description': 'OK', 'groupId': null }, { 'key': '2', 'value': 'NG-Insp.Result', 'description': 'NG-Insp.Result', 'groupId': null }, { 'key': '3', 'value': 'RW-RequiredRework', 'description': 'RW-RequiredRework', 'groupId': null }, { 'key': '4', 'value': 'RJ-Reject(Scrap)', 'description': 'RJ-Reject(Scrap)', 'groupId': null }, { 'key': '5', 'value': 'RP-RequiredRepair', 'description': 'RP-RequiredRepair', 'groupId': null }, { 'key': '6', 'value': 'RD-Re-Judge', 'description': 'RD-Re-Judge', 'groupId': null }, { 'key': '7', 'value': 'RV-PIReview', 'description': 'RV-PIReview', 'groupId': null }, { 'key': '8', 'value': 'DR-InkRepair', 'description': 'DR-InkRepair', 'groupId': null }, { 'key': '9', 'value': 'PC–PoorCoating', 'description': 'PC–PoorCoating', 'groupId': null }, { 'key': '10', 'value': 'MD–MaskDefect', 'description': 'MD–MaskDefect', 'groupId': null }] }, { 'name': 'JobGrade', 'offset': '5', 'points': '1', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'JobId', 'offset': '6', 'points': '10', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'INSP/EQPReservations', 'offset': '16', 'points': '1', 'type': 'B', 'value': '0', 'constantItems': null }, { 'name': 'INSPJudgedData', 'offset': '17', 'points': '2', 'type': 'B', 'value': '0', 'constantItems': null }, { 'name': 'EQPFlag', 'offset': '19', 'points': '3', 'type': 'B', 'value': '0', 'constantItems': null }, { 'name': 'TrackingData', 'offset': '22', 'points': '4', 'type': 'B', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'Not Processed [Not In EQ]', 'description': 'Not Processed [Not In EQ]', 'groupId': null }, { 'key': '1', 'value': 'Normal Processed [In EQ]', 'description': 'Normal Processed [In EQ]', 'groupId': null }, { 'key': '2', 'value': 'Abnormal Processed [In EQ]', 'description': 'Abnormal Processed [In EQ]', 'groupId': null }, { 'key': '3', 'value': 'Process Skip [In EQ]', 'description': 'Process Skip [In EQ]', 'groupId': null }] }, { 'name': 'OXRInformation', 'offset': '26', 'points': '14', 'type': 'B', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'XorNoChipexist', 'description': 'XorNoChipexist', 'groupId': null }, { 'key': '1', 'value': 'R', 'description': 'R', 'groupId': null }, { 'key': '2', 'value': 'L', 'description': 'L', 'groupId': null }, { 'key': '3', 'value': 'O', 'description': 'O', 'groupId': null }, { 'key': '4', 'value': 'F', 'description': 'F', 'groupId': null }] }, { 'name': 'BPOOvenSlotNo', 'offset': '40: 0', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'BPOOvenCoolNo', 'offset': '40: 4', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'PPOBakeSlotNo', 'offset': '40: 8', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'ChipCount', 'offset': '41: 0', 'points': '1: 9', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'ControlMode', 'offset': '41: 9', 'points': '1: 2', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'GlassAngle', 'offset': '41: 11', 'points': '1: 2', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'ProductID', 'offset': '42', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'CassetteSettingCode', 'offset': '43', 'points': '2', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'OwnerID', 'offset': '45', 'points': '2', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'Productowner', 'offset': '47', 'points': '1', 'type': 'A', 'value': '', 'constantItems': null }, { 'name': 'PIPreReworkCount', 'offset': '48: 0', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'PIReworkCount', 'offset': '48: 4', 'points': '1: 4', 'type': 'BIN', 'value': '0', 'constantItems': null }, { 'name': 'OverBakeFlag', 'offset': '48: 8', 'points': '1: 6', 'type': 'BIN', 'value': '0', 'constantItems': [{ 'key': '0', 'value': 'No Process', 'description': 'No Process', 'groupId': null }, { 'key': '1', 'value': ' BPO Oven Normal Bake Glass', 'description': ' BPO Oven Normal Bake Glass', 'groupId': null }, { 'key': '2', 'value': ' BPO Oven No Bake Glass', 'description': ' BPO Oven No Bake Glass', 'groupId': null }, { 'key': '3', 'value': ' BPO Oven Over Bake Glass', 'description': ' BPO Oven Over Bake Glass', 'groupId': null }] }, { 'name': 'PFCDNo', 'offset': '49', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'BPOOvenprocesstime', 'offset': '50', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'PPOOvenprocesstime', 'offset': '51', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'PMOOvenprocesstime', 'offset': '52', 'points': '1', 'type': 'I', 'value': '0', 'constantItems': null }, { 'name': 'PPID', 'offset': '71', 'points': '25', 'type': 'A', 'value': '', 'constantItems': null }] }}] }] }
  })
}

const filterLinkSignalFlowList = () => {
  return {
    'header': {
      'messageName': 'filterLinkSignalFlowList',
      'transactionId': '202008270854515151',
      'inboxName': 'T7',
      'userName': 'glory-dev'
    },
    'body': {
      'linkSignalMap': {
        'L02_1ToL03_1': [
          {
            'equipmentNo': 'TJATS100_L02',
            'blockName': 'Upstream#01LinkSignal',
            'eventId': 'LinkSignalforSendOut',
            'itemName': 'L02_1ToL03_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '00680',
            'signalDirection': 'L02_1ToL03_1'
          },
          {
            'equipmentNo': 'TJATS100_L03',
            'blockName': 'Downstream#01LinkSignal',
            'eventId': 'LinkSignalforReceive',
            'itemName': 'L02_1ToL03_1',
            'itemValue': '00000000000000000000000000000000',
            'streamName': null,
            'startAddress': '00900',
            'signalDirection': 'L02_1ToL03_1'
          }
        ]
      },
      'linkSignalItemList': [
        {
          'itemGroupName': 'DownstreamLinkSignal',
          'itemBeans': [
            {
              'itemName': 'DownstreamInline',
              'itemValue': 0,
              'offSet': '0',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'DownstreamTrouble',
              'itemValue': 0,
              'offSet': '1',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ReceiveAble',
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
              'itemName': 'JobTransfer',
              'itemValue': 0,
              'offSet': '4',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ReceiveCancel',
              'itemValue': 0,
              'offSet': '5',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ExchangePossible',
              'itemValue': 0,
              'offSet': '6',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'DoubleGlass',
              'itemValue': 0,
              'offSet': '7',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ReceiveJobReserve',
              'itemValue': 0,
              'offSet': '8',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'StopReceive',
              'itemValue': 0,
              'offSet': '9',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'TransferStopRequest',
              'itemValue': 0,
              'offSet': '10',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassExist',
              'itemValue': 0,
              'offSet': '11',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Interlock',
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
              'itemName': 'SlotNumber#01',
              'itemValue': 0,
              'offSet': '14',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#02',
              'itemValue': 0,
              'offSet': '15',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#03',
              'itemValue': 0,
              'offSet': '16',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#04',
              'itemValue': 0,
              'offSet': '17',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#05',
              'itemValue': 0,
              'offSet': '18',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#06',
              'itemValue': 0,
              'offSet': '19',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#01',
              'itemValue': 0,
              'offSet': '20',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#02',
              'itemValue': 0,
              'offSet': '21',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#03',
              'itemValue': 0,
              'offSet': '22',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#04',
              'itemValue': 0,
              'offSet': '23',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'GlassCount#05',
              'itemValue': 0,
              'offSet': '24',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ForceCompleteRequest',
              'itemValue': 0,
              'offSet': '25',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ForceCompleteAcknowledge',
              'itemValue': 0,
              'offSet': '26',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '27',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '28',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '29',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '30',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '31',
              'points': '1',
              'type': 'BIT'
            }
          ],
          'itemNameList': [
            'DownstreamInline',
            'DownstreamTrouble',
            'ReceiveAble',
            'Receive',
            'JobTransfer',
            'ReceiveCancel',
            'ExchangePossible',
            'DoubleGlass',
            'ReceiveJobReserve',
            'StopReceive',
            'TransferStopRequest',
            'GlassExist',
            'Interlock',
            'Spare',
            'SlotNumber#01',
            'SlotNumber#02',
            'SlotNumber#03',
            'SlotNumber#04',
            'SlotNumber#05',
            'SlotNumber#06',
            'GlassCount#01',
            'GlassCount#02',
            'GlassCount#03',
            'GlassCount#04',
            'GlassCount#05',
            'ForceCompleteRequest',
            'ForceCompleteAcknowledge',
            'LineSpecialSpare'
          ],
          'itemBean': null
        },
        {
          'itemGroupName': 'UpstreamLinkSignal',
          'itemBeans': [
            {
              'itemName': 'UpstreamInline',
              'itemValue': 0,
              'offSet': '0',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'UpstreamTrouble',
              'itemValue': 0,
              'offSet': '1',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SendReady',
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
              'itemName': 'JobTransfer',
              'itemValue': 0,
              'offSet': '4',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SendCancel',
              'itemValue': 0,
              'offSet': '5',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ExchangeExecute',
              'itemValue': 0,
              'offSet': '6',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'DoubleGlass',
              'itemValue': 0,
              'offSet': '7',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SendJobReserve',
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
              'itemName': 'Interlock',
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
              'itemName': 'SlotNumber#01',
              'itemValue': 0,
              'offSet': '14',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#02',
              'itemValue': 0,
              'offSet': '15',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#03',
              'itemValue': 0,
              'offSet': '16',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#04',
              'itemValue': 0,
              'offSet': '17',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#05',
              'itemValue': 0,
              'offSet': '18',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'SlotNumber#06',
              'itemValue': 0,
              'offSet': '19',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'Spare',
              'itemValue': 0,
              'offSet': '20',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ForceCompleteRequest',
              'itemValue': 0,
              'offSet': '21',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'ForceCompleteAcknowledge',
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
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '25',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '26',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '27',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '28',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '29',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '30',
              'points': '1',
              'type': 'BIT'
            },
            {
              'itemName': 'LineSpecialSpare',
              'itemValue': 0,
              'offSet': '31',
              'points': '1',
              'type': 'BIT'
            }
          ],
          'itemNameList': [
            'UpstreamInline',
            'UpstreamTrouble',
            'SendReady',
            'Send',
            'JobTransfer',
            'SendCancel',
            'ExchangeExecute',
            'DoubleGlass',
            'SendJobReserve',
            'Spare',
            'Interlock',
            'SlotNumber#01',
            'SlotNumber#02',
            'SlotNumber#03',
            'SlotNumber#04',
            'SlotNumber#05',
            'SlotNumber#06',
            'ForceCompleteRequest',
            'ForceCompleteAcknowledge',
            'LineSpecialSpare'
          ],
          'itemBean': null
        }
      ]
    },
    'result': {
      'returnCode': '0',
      'returnMessageEN': 'Operation succeeded!',
      'returnMessageCH': '操作成功!'
    }
  }
}

const getLinkSignalFlowList = () => {
  return {
    'header': {
      'messageName': 'getLinkSignalFlowList',
      'transactionId': '202001131743252525',
      'inboxName': 'T7',
      'userName': 'Super Admin'
    },
    'body': [
      {
        'itemGroupName': 'UpstreamLinkSignal',
        'itemBeans': [
          {
            'itemName': 'UpstreamInline',
            'itemValue': 0,
            'offSet': '0',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'UpstreamTrouble',
            'itemValue': 0,
            'offSet': '1',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SendReady',
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
            'itemName': 'JobTransfer',
            'itemValue': 0,
            'offSet': '4',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SendCancel',
            'itemValue': 0,
            'offSet': '5',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ExchangeExecute',
            'itemValue': 0,
            'offSet': '6',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'DoubleGlass',
            'itemValue': 0,
            'offSet': '7',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SendJobReserve',
            'itemValue': 0,
            'offSet': '8',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ReceiveOK',
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
            'itemName': 'SlotNumber#01',
            'itemValue': 0,
            'offSet': '16',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#02',
            'itemValue': 0,
            'offSet': '17',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#03',
            'itemValue': 0,
            'offSet': '18',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#04',
            'itemValue': 0,
            'offSet': '19',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#05',
            'itemValue': 0,
            'offSet': '20',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#06',
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
            'itemName': 'ShortVicinity',
            'itemValue': 0,
            'offSet': '25',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'LongVicinity',
            'itemValue': 0,
            'offSet': '26',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'PreparationCompletion',
            'itemValue': 0,
            'offSet': '27',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'InInspecting',
            'itemValue': 0,
            'offSet': '28',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'OKJudge',
            'itemValue': 0,
            'offSet': '29',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'NGJudge',
            'itemValue': 0,
            'offSet': '30',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ReturnMode',
            'itemValue': 0,
            'offSet': '31',
            'points': '1',
            'type': 'BIT'
          }
        ],
        'itemNameList': [
          'UpstreamInline',
          'UpstreamTrouble',
          'SendReady',
          'Send',
          'JobTransfer',
          'SendCancel',
          'ExchangeExecute',
          'DoubleGlass',
          'SendJobReserve',
          'ReceiveOK',
          'Spare',
          'SlotNumber#01',
          'SlotNumber#02',
          'SlotNumber#03',
          'SlotNumber#04',
          'SlotNumber#05',
          'SlotNumber#06',
          'ShortVicinity',
          'LongVicinity',
          'PreparationCompletion',
          'InInspecting',
          'OKJudge',
          'NGJudge',
          'ReturnMode'
        ],
        'itemBean': null
      },
      {
        'itemGroupName': 'DownstreamLinkSignal',
        'itemBeans': [
          {
            'itemName': 'DownstreamInline',
            'itemValue': 0,
            'offSet': '0',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'DownstreamTrouble',
            'itemValue': 0,
            'offSet': '1',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ReceiveAble',
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
            'itemName': 'JobTransfer',
            'itemValue': 0,
            'offSet': '4',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ReceiveCancel',
            'itemValue': 0,
            'offSet': '5',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ExchangePossible',
            'itemValue': 0,
            'offSet': '6',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'DoubleGlass',
            'itemValue': 0,
            'offSet': '7',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ReceiveJobReserve',
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
            'itemName': 'TransferStopRequest',
            'itemValue': 0,
            'offSet': '10',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'DummyGlassRequest',
            'itemValue': 0,
            'offSet': '11',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'GlassExist',
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
            'itemName': 'SlotNumber#01',
            'itemValue': 0,
            'offSet': '16',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#02',
            'itemValue': 0,
            'offSet': '17',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#03',
            'itemValue': 0,
            'offSet': '18',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#04',
            'itemValue': 0,
            'offSet': '19',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#05',
            'itemValue': 0,
            'offSet': '20',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'SlotNumber#06',
            'itemValue': 0,
            'offSet': '21',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'GlassCount#01',
            'itemValue': 0,
            'offSet': '22',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'GlassCount#02',
            'itemValue': 0,
            'offSet': '23',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'GlassCount#03',
            'itemValue': 0,
            'offSet': '24',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'GlassCount#04',
            'itemValue': 0,
            'offSet': '25',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'GlassCount#05',
            'itemValue': 0,
            'offSet': '26',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'PreparationPermission',
            'itemValue': 0,
            'offSet': '27',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'InspectionResultUpdate',
            'itemValue': 0,
            'offSet': '28',
            'points': '1',
            'type': 'BIT'
          },
          {
            'itemName': 'ReturnMode',
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
        'itemNameList': [
          'DownstreamInline',
          'DownstreamTrouble',
          'ReceiveAble',
          'Receive',
          'JobTransfer',
          'ReceiveCancel',
          'ExchangePossible',
          'DoubleGlass',
          'ReceiveJobReserve',
          'Spare',
          'TransferStopRequest',
          'DummyGlassRequest',
          'GlassExist',
          'SlotNumber#01',
          'SlotNumber#02',
          'SlotNumber#03',
          'SlotNumber#04',
          'SlotNumber#05',
          'SlotNumber#06',
          'GlassCount#01',
          'GlassCount#02',
          'GlassCount#03',
          'GlassCount#04',
          'GlassCount#05',
          'PreparationPermission',
          'InspectionResultUpdate',
          'ReturnMode'
        ],
        'itemBean': null
      }
    ],
    'result': {
      'returnCode': '0',
      'returnMessageEN': 'Operation succeeded!',
      'returnMessageCH': '操作成功!'
    }
  }
}

const updatelinksignalvalueintoplc = () => {
  return {
    'header': {
      'messageName': 'Response',
      'transactionId': null,
      'inboxName': 'T7',
      'userName': null
    },
    'body': null,
    'result': {
      'returnCode': '0',
      'returnMessageEN': 'Operation succeeded!',
      'returnMessageCH': '操作成功!'
    }
  }
}
Mock.mock(/\/blockcontroller\/getGraphidJobData/, 'post', getGraphidJobData)
Mock.mock(/\/blockcontroller\/getLinkSignalFlowList/, 'post', getLinkSignalFlowList)
Mock.mock(/\/blockcontroller\/getlinksignalbolcklist/, 'post', getlinksignalbolcklist)
Mock.mock(/\/blockcontroller\/filterLinkSignalFlowList/, 'post', filterLinkSignalFlowList)
Mock.mock(/\/blockcontroller\/updatelinksignalvalueintoplc/, 'post', updatelinksignalvalueintoplc)
