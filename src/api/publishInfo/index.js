
import { service as request, requestData } from '@/utils/request'
export function linkSignalMonitor(condition) {
  return request({
    url: '/blockcontroller/linkSignalMonitor',
    method: 'post',
    data: requestData({
      messageName: 'linkSignalMonitor',
      body: condition
    })
  })
}
