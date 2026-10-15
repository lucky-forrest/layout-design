import { requestData } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(10, 20)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    factory: '@word(6)',
    shop: '@word(6)',
    lineId: '@word(6)',
    scenarioName: 'Local-@word(6)',
    scenarioDesc: '@word(6)',
    'tackTime|30-45': 1,
    'itemList|2-3': [{
      localScenario: 'Local-@word',
      localNo: '@word(6)',
      eventName: '@word(6)',
      itc: '@word(6)',
      unitNo: 1,
      eventGroup: '@pick(["I","AS","Bit"])',
      groupNo: '@word(6)'
    }]
  }))
}
const getLocalScenarioList = config => {
  return requestData({
    messageName: 'getLocalScenarioList',
    body: [{
      'scenarioName': 'T19061101',
      'scenarioDesc': '测试',
      'tackTime': 3000,
      'eventList': [
        {
          'eventName': 'DailyCheck',
          'blockName': null,
          'triggerCondition': null,
          'eventGroup': null,
          'groupNo': 0,
          'timeOut': 0,
          'repeatReportByGlass': false,
          'items': null,
          'localNo': 'L02',
          'itc': 'RecipeID',
          'unitNo': ''
        },
        {
          'eventName': 'DailyCheck',
          'blockName': null,
          'triggerCondition': null,
          'eventGroup': null,
          'groupNo': 0,
          'timeOut': 0,
          'repeatReportByGlass': false,
          'items': null,
          'localNo': 'L03',
          'itc': 'RecipeID',
          'unitNo': ''
        },
        {
          'eventName': 'DailyCheck',
          'blockName': null,
          'triggerCondition': null,
          'eventGroup': null,
          'groupNo': 0,
          'timeOut': 0,
          'repeatReportByGlass': false,
          'items': null,
          'localNo': 'L04',
          'itc': 'RecipeID',
          'unitNo': ''
        }
      ]
    }
    ]
  })
}

Mock.mock(/\/LocalScenarioService\/getLocalScenarioList/, 'post', getLocalScenarioList)
