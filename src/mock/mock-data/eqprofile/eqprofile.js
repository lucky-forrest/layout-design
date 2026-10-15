import { requestData } from '@/utils/request'
import Mock from 'mockjs'

const getProfileList = config => {
  return requestData({
    messageName: 'getProfileList',
    body: {
      rows: [{
        fileName: 'EqProfile_Test1'
      }]
    }
  })
}
const getLineTypeListByShop = config => {
  return requestData({
    messageName: 'getLineTypeListByShop',
    body: [
      'TJCVD_TYPE1',
      'TJSEM_TYPE1',
      'TJOVN_TYPE1',
      'TJPHL_TYPE2',
      'TJSCN_TYPE1',
      'PDRS',
      'TJFLC_TYPE1',
      'TJPHL_TYPE3',
      'TJCDO_TYPE2',
      'TJFLR_TYPE2',
      'TJOST_TYPE2',
      'TJFLC_TYPE2',
      'WEF',
      'TJMSP_TYPE1',
      'TJWEI_TYPE1',
      'TJAOH_TYPE1',
      'TJSTR_TYPE2',
      'TJSTR_TYPE1',
      'TJILC_TYPE1',
      'TJCDO_TYPE1',
      'TJWEM_TYPE1',
      'TJWET_TYPE1',
      'TJOST_TYPE1',
      'TJATS_TYPE2',
      'TJITO_TYPE1',
      'TJMUC_TYPE1',
      'TJDRY_TYPE1',
      'TJTEG_TYPE1',
      'TJNAN_TYPE1',
      'TJITO_TYPE2',
      'TJOVI_TYPE1',
      'TJPHL_TYPE1',
      'TJFLR_TYPE1',
      'TJWEI_TYPE2',
      'TJILC_TYPE2',
      'TJATS_TYPE1',
      'TJDRY_TYPE2',
      'TJTPE_TYPE1'
    ]
  })
}
const getEquipmentTypeList = config => {
  return requestData({
    messageName: 'getEquipmentTypeList',
    body: [
      '',
      null
    ]
  })
}
const autoGenerateAddress = config => {
  return requestData({
    messageName: 'autoGenerateAddress',
    body: {
      'blockType': null,
      'reportType': null,
      'reportTo': null,
      'description': null,
      'tpDatas': null
    }
  })
}
Mock.mock(/\/ProfileService\/getProfileList/, 'post', getProfileList)
Mock.mock(/\/ProfileService\/autoGenerateAddress/, 'post', autoGenerateAddress)
Mock.mock(/\/blockcontroller\/getEquipmentTypeList/, 'post', getEquipmentTypeList)
Mock.mock(/\/blockcontroller\/getLineTypeListByShop/, 'post', getLineTypeListByShop)
