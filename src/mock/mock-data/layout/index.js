import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getPLCAllConnections = () => {
  return requestData({
    messageName: 'getPLCAllConnections',
    body: [
      {
        'connectionName': 'TJCVD100EQ',
        'isEqSimulator': '0',
        'factory': null,
        'isConnect': true,
        'ip': '127.0.0.1',
        'port': '6379',
        'deviceType': 'SIMULATOR'
      },
      {
        'connectionName': 'L02BC',
        'isEqSimulator': '1',
        'factory': null,
        'isConnect': true,
        'ip': '127.0.0.1',
        'port': '6379',
        'deviceType': 'SIMULATOR'
      },
      {
        'connectionName': 'TJCVD100BC',
        'isEqSimulator': '1',
        'factory': null,
        'isConnect': true,
        'ip': '127.0.0.1',
        'port': '6379',
        'deviceType': 'SIMULATOR'
      }
    ]
  })
}

const stopPLCConnectionByName = () => {
  return requestData({
    messageName: 'stopPLCConnectionByName',
    body: [
      {
        'connectionName': 'TJCVD100EQ',
        'isEqSimulator': '0',
        'factory': null,
        'isConnect': true,
        'ip': '127.0.0.1',
        'port': '6379',
        'deviceType': 'SIMULATOR'
      },
      {
        'connectionName': 'L02BC',
        'isEqSimulator': '1',
        'factory': null,
        'isConnect': true,
        'ip': '127.0.0.1',
        'port': '6379',
        'deviceType': 'SIMULATOR'
      }
    ]
  })
}
Mock.mock(/\/blockcontroller\/getPLCAllConnections/, 'post', getPLCAllConnections)
Mock.mock(/\/blockcontroller\/stopPLCConnectionByName/, 'post', stopPLCConnectionByName)
