export const lineTable = {
  name: '',
  columnList: [
    { label: 'lineId', value: 'lineId' },
    { label: 'lineName', value: 'lineName' },
    { label: 'lineType', value: 'lineType' },
    { label: 'shopName', value: 'shopName' },
    { label: 'factoryName', value: 'factoryName' },
    { label: 'serverName', value: 'serverName' },
    { label: 'ip', value: 'ip' },
    { label: 'port', value: 'port' },
    { label: 'info', value: 'info' },
    { label: 'port2', value: 'port2' }
  ]
}

export const portTable = {
  name: '',
  columnList: [
    { label: 'lineId', value: 'lineId' },
    { label: 'serverName', value: 'serverName' },
    { label: 'equipmentNo', value: 'equipmentNo' },
    { label: 'equipmentId', value: 'equipmentId' },
    { label: 'portNo', value: 'portNo' },
    { label: 'portId', value: 'portId' },
    { label: 'maxCount', value: 'maxCount' },
    { label: 'attribute', value: 'attribute' },
    { label: 'processStartType', value: 'processStartType' },
    { label: 'mappingEnabled', value: 'mappingEnabled' },
    { label: 'cassetteType', value: 'cassetteType' }
  ]
}

export const unitTable = {
  name: '',
  columnList: [
    { label: 'lineId', value: 'lineId' },
    { label: 'serverName', value: 'serverName' },
    { label: 'equipmentNo', value: 'equipmentNo' },
    { label: 'equipmentId', value: 'equipmentId' },
    { label: 'unitNo', value: 'unitNo' },
    { label: 'unitId', value: 'unitId' },
    { label: 'unitType', value: 'unittype' },
    { label: 'attribute', value: 'attribute' },
    { label: 'name', value: 'name' },
    { label: 'postitionPlcTrxNo', value: 'postitionPlcTrxNo' }
  ]
}

export const alarmTable = {
  name: '',
  columnList: [
    { label: 'lineId', value: 'lineId' },
    { label: 'serverName', value: 'serverName' },
    { label: 'equipmentNo', value: 'equipmentNo' },
    { label: 'unitNo', value: 'unitNo' },
    { label: 'alarmLevel', value: 'alarmLevel' },
    { label: 'alarmId', value: 'alarmId' },
    { label: 'alarmCode', value: 'alarmCode' },
    { label: 'alarmText', value: 'alarmText' }
  ]
}

export const dropDownTable = {
  name: '',
  columnList: [
    { label: 'dataType', value: 'lineId' },
    { label: 'dataName', value: 'dataName' },
    { label: 'dataDesc', value: 'dataDesc' }
  ]
}

export const equipmentTable = {
  name: '',
  columnList: [
    { label: 'lineId', value: 'lineId' },
    { label: 'equipmentNo', value: 'equipmentNo' },
    { label: 'equipmentId', value: 'equipmentId' },
    { label: 'serverName', value: 'serverName' },
    { label: 'reportMode', value: 'reportMode' },
    { label: 'attribute', value: 'attribute' },
    { label: 'recipeIndex', value: 'recipeIndex' },
    { label: 'recipeLength', value: 'recipeLength' },
    { label: 'recipeSequence', value: 'recipeSequence' },
    { label: 'unitCount', value: 'unitCount' },
    { label: 'name', value: 'name' },
    { label: 'recipeRegisterValidationEnabled', value: 'recipeRegisterValidationEnabled' },
    { label: 'useRunMode', value: 'useRunMode' },
    { label: 'useIndexRunMode', value: 'useIndexRunMode' },
    { label: 'useEdcReport', value: 'useEdcReport' },
    { label: 'vcrCount', value: 'vcrCount' },
    { label: 'mplcInterlockCount', value: 'mplcInterlockCount' },
    { label: 'postitionPlcTrxNo', value: 'postitionPlcTrxNo' },
    { label: 'recipeParameterValidationEnabled', value: 'recipeParameterValidationEnabled' },
    { label: 'apcReport', value: 'apcReport' },
    { label: 'apcReportTime', value: 'apcReportTime' },
    { label: 'energyReport', value: 'energyReport' },
    { label: 'energyReportTime', value: 'energyReportTime' },
    { label: 'vcrType', value: 'vcrType' },
    { label: 'isIonizer', value: 'isIonizer' },
    { label: 'touchPanel', value: 'touchPanel' },
    { label: 'processdateSource', value: 'processdateSource' },
    { label: 'suspectOfflineTimer', value: 'suspectOfflineTimer' },
    { label: 'curRecipeValidationEnabled', value: 'curRecipeValidationEnabled' }
  ]
}

export const modelingFields = {
  reportMode: [{ label: 'PLC', value: 'PLC' }, { label: 'SECS', value: 'SECS' }],
  dataSources: [{ label: 'PLC', value: 'PLC' }, { label: 'SECS', value: 'SECS' }],
  vcrType: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'N', value: 'N' }]
}
