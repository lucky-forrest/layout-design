import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getLineScenarioList = config => {
  return requestData({
    messageName: 'getLineScenarioList',
    body: [
      {
        'scenarioName': 'LT19061101',
        'scenarioDesc': '测试',
        'setting': {
          'scenTackTime': 100,
          'unitTackTime': 100,
          'glassIntervalTime': 100,
          'stressCount': 1000,
          'curCount': 0,
          'mode': 'Auto',
          'infinte': true
        },
        'dataSetList': [
          {
            'portNo': '1',
            'cstId': 'CST0001',
            'cstSeqStart': 1,
            'cstSeqEnd': 99
          }
        ],
        'localScenarioList': [
          {
            'scenarioName': 'T19061101',
            'scenarioDesc': '测试',
            'tackTime': 1000,
            'eventList': null
          }
        ]
      }
    ]
  })
}

Mock.mock(/\/LineScenarioService\/getLineScenarioList/, 'post', getLineScenarioList)
