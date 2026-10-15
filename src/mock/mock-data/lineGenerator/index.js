import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getLineConfigList = config => {
  return requestData({
    messageName: 'getLineConfigList',
    body: {
      'total': 0,
      'rows': [],
      'from': 0,
      'size': 10,
      'pageNo': 1,
      'pageSize': 10,
      'condition': {
        'lineConfigPath': ''
      },
      'list': null,
      'sourceCodePath': '',
      'lineConfigPath': '',
      'sort': 'seq',
      'order': 'asc'
    }
  })
}
Mock.mock(/\/lineConfService\/getLineConfigList/, 'post', getLineConfigList)
