import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getConnectionList = config => {
  return requestData({
    messageName: 'getConnectionList',
    body: {
      'total': 3,
      'rows': [
        {
          'name': 'APSTest',
          'desc': '1',
          'deviceID': 1,
          'connectionMode': 'ACTIVE',
          'localIP': '127.0.0.1',
          'localPort': '7000',
          'remoteIP': '127.0.0.1',
          'remote': '127.0.0.1:7000',
          'local': '127.0.0.1:7000',
          'remotePort': '7000',
          'linkTest': 60,
          't3': 45,
          't4': 4,
          't5': 10,
          't6': 60,
          't7': 10,
          't8': 5
        },
        {
          'name': 'Test01',
          'desc': 'test',
          'deviceID': 2,
          'connectionMode': 'ACTIVE',
          'localIP': '192.168.2.102',
          'localPort': '9001',
          'remoteIP': '192.168.2.102',
          'remote': '192.168.2.102:8081',
          'local': '192.168.2.102:9001',
          'remotePort': '8081',
          'linkTest': 0,
          't3': 0,
          't4': 0,
          't5': 0,
          't6': 0,
          't7': 0,
          't8': 0
        },
        {
          'name': 'Test02',
          'desc': 'test',
          'deviceID': 3,
          'connectionMode': 'ACTIVE',
          'localIP': '192.168.64.149',
          'localPort': '9000',
          'remoteIP': '127.0.0.1',
          'remote': '127.0.0.1:8001',
          'local': '192.168.64.149:9000',
          'remotePort': '8001',
          'linkTest': 0,
          't3': 0,
          't4': 0,
          't5': 0,
          't6': 0,
          't7': 0,
          't8': 0
        }
      ],
      'from': 0,
      'size': 10,
      'pageNo': 1,
      'pageSize': 10,
      'condition': {
        'name': ''
      },
      'list': null,
      'sort': 'seq',
      'order': 'asc'
    }
  })
}

Mock.mock(/\/SecsService\/getConnectionList/, 'post', getConnectionList)
Mock.mock(/\/RvConnectionService\/getConnectionList/, 'post', getConnectionList)
