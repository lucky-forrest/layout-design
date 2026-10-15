import { requestData, parseJson } from '@/utils/request'
import Mock from 'mockjs'
import _ from 'lodash'

const DataList = []
const TotalCount = _.random(2, 6)
for (let i = 0; i < TotalCount; i++) {
  DataList.push(Mock.mock({
    'objectId|+1': 1,
    lineId: '@pick(["CBLOI100","CBPOL100","TBATS100","TBCAC100","TBPRO100","FBMQC800","CHPOL300"])',
    serverName: '@word(5)',
    equipmentNo: '@pick(["L2","L3","L4","L5","L6","L7","L8","L9","L02","L03","L04","L05","L06","L07","L08","L09"])',
    equipmentId: '@word(5)',
    reportMode: '@pick(["PLC","SECS"])',
    attribute: '@pick(["LU","Normal","LD","UD","IN"])',
    recipeIndex: '@ip',
    'recipeLength|2-10': 0,
    recipeSequence: '',
    'unitCount|1-2': 0,
    name: '@word(5)',
    recipe_register_validation_enabled: '@pick(["Y","N"])',
    use_run_mode: '@pick(["Y","N"])',
    use_index_run_mode: '@pick(["Y","N"])',
    use_edc_report: '@pick(["Y","N"])',
    vcr_count: 0,
    mplc_interlock_count: 0,
    postition_plc_trx_no: '',
    recipe_parameter_validation_enabled: '@pick(["Y","N"])',
    apc_report: '@pick(["Y","N"])',
    'apc_report_time|0-100': 0,
    energy_report: '@pick(["Y","N"])',
    'energy_report_time|0-100': 0,
    vcr_type: '@pick(["A","B","N"])',
    is_ionizer: '@boolean',
    touch_panel: '',
    processdate_source: '@pick(["PLC","SECS","SHF"])',
    'suspectofflinetimer|0-5000': 0,
    cur_recipe_validation_enabled: '@pick(["Y","N"])'
  }))
}
const getEquipmentList = config => {
  const { currPage = 1, pageSize = 10, lineId } = parseJson(config.body)
  let total = 0
  let tempList = Array.from(DataList)
  if (lineId) {
    tempList = tempList.filter(item => { return item.lineId === lineId })
  }
  tempList = _.sortBy(tempList, 'equipmentNo')
  total = tempList.length
  tempList = tempList.slice((currPage - 1) * pageSize, currPage * pageSize)
  return requestData({
    messageName: 'getEquipmentList',
    body: {
      total: total,
      rows: tempList
    }
  })
}

Mock.mock(/\/blockcontroller\/getEquipmentList/, 'post', getEquipmentList)
