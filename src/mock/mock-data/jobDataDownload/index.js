import Mock from 'mockjs'
const getJobDataBlock = () => {
  return {
    'header': {
      'messageName': 'Response',
      'transactionId': null,
      'inboxName': 'T7',
      'userName': null
    },
    'body': [
      {
        'name': 'CassetteSequenceNo',
        'offset': '0',
        'points': '1',
        'type': 'I',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'JobSequenceNo',
        'offset': '1',
        'points': '1',
        'type': 'I',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'GroupIndex',
        'offset': '2',
        'points': '1',
        'type': 'I',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'ProductNo',
        'offset': '3',
        'points': '1',
        'type': 'I',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'SamplingSlotFlag',
        'offset': '4:0',
        'points': '1:1',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'FirstRunFlag',
        'offset': '4:1',
        'points': '1:1',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'LastGlassFlag',
        'offset': '4:2',
        'points': '1:1',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'OXRInformationRequestFlag',
        'offset': '4:3',
        'points': '1:1',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'CIMMode',
        'offset': '4:4',
        'points': '1:1',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'CSTOperationMode',
        'offset': '4:5',
        'points': '1:1',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'SubstrateType',
        'offset': '4:6',
        'points': '1:2',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'JobType',
        'offset': '4:8',
        'points': '1:4',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'JobJudge',
        'offset': '4:12',
        'points': '1:4',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'JobGrade',
        'offset': '5',
        'points': '1',
        'type': 'AS',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'JobId',
        'offset': '6',
        'points': '10',
        'type': 'AS',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'LIRUTESTVALUE',
        'offset': '16',
        'points': '0',
        'type': 'B',
        'value': '1',
        'constantItems': null
      },
      {
        'name': 'INSP/EQPReservations',
        'offset': '16',
        'points': '1',
        'type': 'B',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'INSPJudgedData',
        'offset': '17',
        'points': '2',
        'type': 'B',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'EQPFlag',
        'offset': '19',
        'points': '3',
        'type': 'B',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'TrackingData',
        'offset': '22',
        'points': '4',
        'type': 'B',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'OXRInformation',
        'offset': '26',
        'points': '14',
        'type': 'B',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'SamplingValue',
        'offset': '40',
        'points': '1',
        'type': 'I',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'COAVersion',
        'offset': '41',
        'points': '1',
        'type': 'AS',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'PFCDNo',
        'offset': '42',
        'points': '1',
        'type': 'I',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'SlotNumberInformation',
        'offset': '43:0',
        'points': '1:10',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'ITOMixRunFlag',
        'offset': '43:10',
        'points': '1:2',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'VCRReadMismatchFlag',
        'offset': '43:12',
        'points': '1:2',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'RTCFlag',
        'offset': '43:14',
        'points': '1:1',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'LoaderBufferingFlag',
        'offset': '43:15',
        'points': '1:1',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'ArrayPhotoPre-InlineID',
        'offset': '44:0',
        'points': '1:8',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'TargetSlotNo',
        'offset': '44:8',
        'points': '1:8',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'InlineReworkRealCount',
        'offset': '45:0',
        'points': '1:4',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'DummyUsedCount',
        'offset': '45:4',
        'points': '1:4',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'ReworkMaxCount',
        'offset': '45:8',
        'points': '1:4',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'ReworkRealCount',
        'offset': '45:12',
        'points': '1:4',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'MaskCleanerInformation',
        'offset': '46',
        'points': '1',
        'type': 'B',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'TargetCSTID',
        'offset': '47',
        'points': '5',
        'type': 'AS',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'SorterGrade',
        'offset': '52',
        'points': '1',
        'type': 'AS',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'JobDataAbnormalFlag',
        'offset': '53:0',
        'points': '1:2',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'TrackingDataofMCPD',
        'offset': '53:2',
        'points': '1:14',
        'type': 'BIN',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'PPID',
        'offset': '55',
        'points': '25',
        'type': 'AS',
        'value': null,
        'constantItems': null
      },
      {
        'name': 'ODFBoxChamberOpenorUVMaskStartTime',
        'offset': '55',
        'points': '25',
        'type': 'BCD',
        'value': null,
        'constantItems': null
      }
    ],
    'result': {
      'returnCode': '0',
      'returnMessageEN': 'Operation succeeded!',
      'returnMessageCH': '操作成功!'
    }
  }
}
const getPortByLineId = () => {
  return {
    'header': {
      'messageName': 'Response',
      'transactionId': null,
      'inboxName': 'T7',
      'userName': null
    },
    'body': [
      1,
      2,
      3,
      4,
      5
    ],
    'result': {
      'returnCode': '0',
      'returnMessageEN': 'Operation succeeded!',
      'returnMessageCH': '操作成功!'
    }
  }
}
const updateRedisCassetteMap = () => {
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
      'returnMessageEN': 'Operation succeeded!',
      'returnMessageCH': '操作成功!'
    }
  }
}
Mock.mock(/\/blockcontroller\/getJobDataList/, 'post', getJobDataBlock)
Mock.mock(/\/blockcontroller\/getPortByLineId/, 'post', getPortByLineId)
Mock.mock(/\/blockcontroller\/updateRedisCassetteMap/, 'post', updateRedisCassetteMap)
