import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getLineByLineType = config => {
  return requestData({
    messageName: 'getLineByLineType',
    body: []
  })
}
const getAPCDataDownLoadCommandList = config => {
  return requestData({
    messageName: 'getAPCDataDownLoadCommandList',
    body: []
  })
}
Mock.mock(/\/blockcontroller\/getLineByLineType/, 'post', getLineByLineType)
Mock.mock(/\/blockcontroller\/getAPCDataDownLoadCommandList/, 'post', getAPCDataDownLoadCommandList)
