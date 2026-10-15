import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getMessageFileList = () => {
  return requestData({
    messageName: 'getConnectionList',
    body: [
      'Simulator_CHODF100.xml'
    ]
  })
}
const getMessageList = config => {
  return requestData({
    messageName: 'getMessageList',
    body: {
      'fileName': 'Simulator_CHODF100.xml',
      'label': null,
      'type': 'file',
      'id': 0,
      'name': null,
      'format': null,
      'messageName': null,
      'stream': 0,
      'function': 0,
      'connectName': null,
      'description': null,
      'direction': null,
      'wait': false,
      'autoReply': false,
      'noLogging': false,
      'dataItem': null,
      'xmlPath': null,
      'itemCount': 0,
      'fixed': false,
      'checkList': null,
      'messageBean': null,
      'children': [
        {
          'name': null,
          'id': 0,
          'messageName': 'S1F0',
          'stream': 1,
          'function': 0,
          'description': 'Abort Transation',
          'direction': 'H->E',
          'wait': true,
          'autoReply': true,
          'noLogging': false,
          'dataItem': '<DataItem><L Count="1" Fixed="False" ItemName=""><A Count="0" Fixed="False" ItemName="SOFTREV"></A></L></DataItem>',
          'type': 'message',
          'label': 'S1F0:Abort Transation',
          'children': []
        },
        {
          'name': null,
          'id': 1,
          'messageName': 'S1F2',
          'stream': 1,
          'function': 2,
          'description': 'Online Data',
          'direction': 'H->E',
          'wait': true,
          'autoReply': false,
          'noLogging': false,
          'dataItem': '<DataItem><L Count="1" Fixed="False" ItemName=""><A Count="0" Fixed="False" ItemName="SOFTREV"></A></L></DataItem>',
          'type': 'message',
          'label': 'S1F2:Online Data',
          'children': [
            {
              'itemName': '',
              'count': 1,
              'fixed': false,
              'type': 'LIST',
              'label': 'LIST ',
              'children': [
                {
                  'itemName': 'SOFTREV',
                  'count': 0,
                  'fixed': false,
                  'type': 'ASCII',
                  'label': 'ASCII SOFTREV',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': null,
          'id': 2,
          'messageName': 'S1F1',
          'stream': 1,
          'function': 1,
          'description': 'Equipment Information Inquire',
          'direction': 'H->E',
          'wait': true,
          'autoReply': false,
          'noLogging': false,
          'dataItem': '<DataItem><L Count="1" Fixed="False" ItemName=""><A Count="0" Fixed="False" ItemName="SOFTREV"></A></L></DataItem>',
          'type': 'message',
          'label': 'S1F1:Equipment Information Inquire',
          'children': [
            {
              'itemName': '',
              'count': 1,
              'fixed': false,
              'type': 'LIST',
              'label': 'LIST ',
              'children': [
                {
                  'itemName': 'SOFTREV',
                  'count': 0,
                  'fixed': false,
                  'type': 'ASCII',
                  'label': 'ASCII SOFTREV',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'name': null,
          'id': 3,
          'messageName': 'S1F5',
          'stream': 1,
          'function': 5,
          'description': 'Formatted Status Request R',
          'direction': 'H->E',
          'wait': true,
          'autoReply': false,
          'noLogging': false,
          'dataItem': '<DataItem><L Count="1" Fixed="False" ItemName=""><A Count="0" Fixed="False" ItemName="SOFTREV"></A></L></DataItem>',
          'type': 'message',
          'label': 'S1F5:Formatted Status Request R',
          'children': [
            {
              'itemName': '',
              'count': 1,
              'fixed': false,
              'type': 'LIST',
              'label': 'LIST ',
              'children': [
                {
                  'itemName': 'SOFTREV',
                  'count': 0,
                  'fixed': false,
                  'type': 'ASCII',
                  'label': 'ASCII SOFTREV',
                  'children': []
                },
                {
                  'itemName': 'aaaa',
                  'count': 0,
                  'fixed': false,
                  'type': 'LIST',
                  'label': 'LIST aaaa',
                  'children': []
                }
              ]
            }
          ]
        }
      ]
    }
  })
}
const saveMessage = config => {
  return requestData({
    messageName: 'saveMessage',
    body: true
  })
}

Mock.mock(/\/RvMessageService\/getMessageFileList/, 'post', getMessageFileList)
Mock.mock(/\/SecsMessageService\/getMessageFileList/, 'post', getMessageFileList)
Mock.mock(/\/SecsMessageService\/getMessageList/, 'post', getMessageList)
Mock.mock(/\/SecsMessageService\/saveMessage/, 'post', saveMessage)
