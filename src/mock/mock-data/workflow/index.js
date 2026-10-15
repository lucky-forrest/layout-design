import { requestData } from '@/utils/request'
import Mock from 'mockjs'
const getalleqpworkflow = config => {
  return requestData({
    messageName: 'getalleqpworkflow',
    body: []
  })
}
Mock.mock(/\/blockcontroller\/getalleqpworkflow/, 'post', getalleqpworkflow)
