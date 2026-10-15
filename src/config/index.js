// 配置portStatusList
export const plcSimulatorConfig = {
  AlarmStatus: [
    { value: '0', label: 'Alarm Clear' },
    { value: '1', label: 'Alarm Set' }
  ],
  AlarmLevel: [
    { value: '0', label: 'Warning' },
    { value: '1', label: 'Error' }
  ],
  AlarmTextUsingFlag: [
    { value: '0', label: 'Using EQ Report Alarm Text' },
    { value: '1', label: 'Using BC Alarm Text' }
  ],
  AlarmCode: [
    { value: '00', label: 'Danger for human' },
    { value: '01', label: 'Equipment error' },
    { value: '001', label: 'Parameter overflow cause process error' },
    { value: '0001', label: 'Parameter overflow cause equipment can’t work' },
    { value: '00001', label: 'Can not recover trouble' },
    { value: '000001', label: 'Equipment status warning' },
    { value: '0000001', label: 'Process reached to predefined status' },
    { value: '00000001', label: 'BC caused' }
  ],
  PortDown: [{ value: '1', label: 'Normal' }, { value: '2', label: 'Down' }],
  RemovedFlag: [
    { value: '1', label: 'Normal Remove' },
    { value: '2', label: 'Recovery' },
    { value: '3', label: 'Delete Dirty Data' }
  ],
  EquipmentStatus: [
    { value: '1', label: 'Setup' },
    { value: '2', label: 'Stop' },
    { value: '3', label: 'Pause' },
    { value: '4', label: 'Idle' },
    { value: '5', label: 'Run' }
  ],
  'UnitStatus#01': [
    { value: '0', label: 'No Unit' },
    { value: '1', label: 'Setup' },
    { value: '2', label: 'Stop' },
    { value: '3', label: 'Pause' },
    { value: '4', label: 'Idle' },
    { value: '5', label: 'Run' }
  ],
  'UnitStatus#02': [
    { value: '0', label: 'No Unit' },
    { value: '1', label: 'Setup' },
    { value: '2', label: 'Stop' },
    { value: '3', label: 'Pause' },
    { value: '4', label: 'Idle' },
    { value: '5', label: 'Run' }
  ],
  EquipmentOperationMode: [
    { value: '1', label: 'Manual' },
    { value: '2', label: 'Auto' },
    { value: '3', label: 'Semi-Auto' }
  ],
  CSTOperationMode: [
    { value: '0', label: 'No Used' },
    { value: '1', label: 'Kind To Kind mode' },
    { value: '2', label: 'Cassette To Cassette mode' }
  ],
  CSTOperationMode1: [
    { value: '0', label: 'Kind To Kind mode' },
    { value: '1', label: 'Cassette To Cassette mode' }
  ],
  ModifyFlag: [
    { value: '1', label: 'Create' },
    { value: '2', label: 'Modify' },
    { value: '3', label: 'Delete' }
  ],
  VCRResult: [
    { value: '1', label: 'VCR Reading OK & Match With Job Data Glass ID' },
    { value: '2', label: 'VCR Reading OK & Miss Match With Job Data Glass ID' },
    {
      value: '3',
      label: 'VCR Reading Fail & Key In & Match With Job Data Glass ID'
    },
    {
      value: '4',
      label: 'VCR Reading Fail & Key In & Miss Match With Job Data Glass ID'
    },
    { value: '5', label: 'VCR Reading Fail & Pass' }
  ],
  CassetteMapFlag: [
    { value: '0', label: 'No Require (Cassette Map Empty)' },
    { value: '1', label: 'Require (Cassette Map Exist)' }
  ],
  IndexerOperationMode: [
    { value: '1', label: 'Sampling Mode' },
    { value: '2', label: 'Sorter Mode' },
    { value: '3', label: 'Changer Mode' },
    { value: '4', label: 'Cool Run Mode' },
    { value: '5', label: 'Force Clean Out Mode' },
    { value: '6', label: 'Mix-Run Mode' },
    { value: '7', label: 'MQC Mode' },
    { value: '8', label: 'Through Mode' },
    { value: '9', label: 'Fix Mode' },
    { value: '10', label: 'Random Mode' }
  ],
  CIMModeChangeCommandReturnCode: [
    { value: '1', label: 'Accept' },
    { value: '2', label: 'Already In Desired Status' },
    { value: '3', label: 'NG' }
  ],
  EquipmentStatusStopCommandReturnCode: [
    { value: '1', label: 'Accept' },
    { value: '2', label: 'Not Accept' }
  ],
  RecipeRegisterValidationCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  IndexerOperationModeChangeCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  CoolRunCountSetCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  JobRemoveRecoveryCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  ProcessPauseCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  TransferStopCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  ProcessStopCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  EquipmentRunModeSetCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  APCDataDownloadReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  CassetteonPortQTimeChangeCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  SetLastGlassCommandReturnCode: [
    { value: '1', label: 'OK, Accepted' },
    { value: '2', label: 'NG, No matching Glass' }
  ],
  VCREnableModeChangeReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  InspectionIdleTimeSettingCommandReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  PortStatus: [
    { value: '1', label: 'Load Request' },
    { value: '2', label: 'Load Complete' },
    { value: '3', label: 'Unload Request' },
    { value: '4', label: 'Unload Complete' }
  ],
  CassetteStatus: [
    { value: '1', label: 'No Cassette Exist' },
    { value: '2', label: 'Waiting for Cassette Data' },
    { value: '3', label: 'Waiting for Start Command' },
    { value: '4', label: 'Waiting for Processing' },
    { value: '5', label: 'In Processing' },
    { value: '6', label: 'Process Paused' },
    { value: '7', label: 'Process Completed' },
    { value: '8', label: 'Cassette Re-Map' }
  ],
  CompletedCassetteData: [
    { value: '1', label: 'Normal Complete' },
    { value: '2', label: 'Operator Forced to Cancel' },
    { value: '3', label: 'Operator Forced to Abort' },
    { value: '4', label: 'BC Forced to Cancel' },
    { value: '5', label: 'BC Forced to Abort' },
    { value: '6', label: 'EQ Auto Cancel' },
    { value: '7', label: 'EQ Auto Abort' }
  ],
  LoadingCassetteType: [
    { value: '1', label: 'Actual Cassette' },
    { value: '2', label: 'Empty Cassette' }
  ],
  QTimeFlag: [
    { value: '1', label: 'Normal Un-loading' },
    { value: '2', label: 'Q-Time Over & Un-loading' }
  ],
  PartialFullFlag: [
    { value: '1', label: 'Partial Full ' },
    { value: '2', label: 'No Partial Full' }
  ],
  CassetteControlCommandReturnCode: [
    { value: '1', label: 'Command OK' },
    { value: '2', label: 'Command Error' },
    { value: '3', label: 'CSTID is Invalid (Include Dense Box ID)' },
    { value: '4', label: 'Recipe Mismatch' },
    { value: '5', label: 'Slot Information Mismatch ' },
    { value: '6', label: 'Job Type Mismatch' },
    { value: '7', label: 'Cassette Setting Code Mismatch (BEOL)' },
    { value: '8', label: 'Already Received' },
    { value: '9', label: 'Other Error' },
    { value: '10', label: 'Product Type Mismatch' },
    { value: '11', label: 'Group Index Mismatch' },
    { value: '12', label: 'Product ID Mismatch ' }
  ],
  PortType: [
    { value: '1', label: 'Loading Port' },
    { value: '2', label: 'Unloading Port' },
    { value: '3', label: 'Both Port' },
    { value: '4', label: 'Buffer Port - Buffer Type' },
    { value: '5', label: 'Buffer Port - Loader in Buffer Type' },
    { value: '6', label: 'Buffer Port - Un-loader in Buffer Type' }
  ],
  PortMode: [
    { value: '1', label: 'TFT Mode' },
    { value: '2', label: 'CF Mode' },
    { value: '3', label: 'Dummy Mode' },
    { value: '4', label: 'MQC Mode' },
    { value: '5', label: 'HT Mode' },
    { value: '6', label: 'LT Mode' },
    { value: '7', label: 'ENG Mode' },
    { value: '8', label: 'IGZO Mode' },
    { value: '9', label: 'ILC Mode' },
    { value: '10', label: 'FLC Mode' },
    { value: '11', label: 'Through Dummy Mode' },
    { value: '12', label: 'Thickness Dummy Mode' },
    { value: '13', label: 'UV Mask Mode' },
    { value: '14', label: 'By Grade Mode' },
    { value: '15', label: 'OK Mode' },
    { value: '16', label: 'NG Mode' },
    { value: '17', label: 'MIX Mode' },
    { value: '18', label: 'EMP Mode (Empty Cassette)' },
    { value: '19', label: 'Rework Mode' },
    { value: '20', label: 'Mismatch Mode' }
  ],
  PortTransferMode: [
    { value: '1', label: 'MGV Mode' },
    { value: '2', label: 'AGV Mode' },
    { value: '3', label: 'Stocker Inline Mode' }
  ],
  PortEnableMode: [
    { value: '1', label: 'Port Enabled' },
    { value: '2', label: 'Port Disabled' }
  ],
  PortTypeChangeReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  PortModeChangeReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  PortTransferModeChangeReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  PortEnableModeChangeReturnCode: [
    { value: '1', label: 'OK' },
    { value: '2', label: 'NG' }
  ],
  VirtualPortOperationMode: [
    { value: '0', label: 'Not Use' },
    { value: '1', label: 'Normal Mode' },
    { value: '2', label: 'LD Virtual Port Mode' },
    { value: '3', label: 'ULD Virtual Port Mode' }
  ],
  Status: [
    { value: '0', label: 'No Used' },
    { value: '1', label: 'Mount' },
    { value: '2', label: 'Dismount' },
    { value: '3', label: 'In-Use' },
    { value: '4', label: 'Prepare' },
    { value: '5', label: 'Empty' },
    { value: '6', label: 'Pre-Mount' }
  ],
  POLType: [
    { value: '0', label: 'No Used' },
    { value: '1', label: 'TFT' },
    { value: '2', label: 'CF' }
  ],
  ReportType: [
    { value: '0', label: 'No Used' },
    { value: '1', label: 'By Glassl' },
    { value: '2', label: 'Abnormal' },
    { value: '3', label: 'Recipe Change' },
    { value: '4', label: 'Time Setting' },
    { value: '5', label: 'BC Request' }
  ],
  MaterialType: [
    { value: '0', label: 'No Used' },
    { value: '1', label: 'PR (PHL)' },
    { value: '2', label: 'Mask (PHL)' },
    { value: '3', label: 'Acid (WET)' },
    { value: '4', label: 'Stripping Liquid (STR)' },
    { value: '5', label: 'Gas (CVD & DRY)' },
    { value: '6', label: 'Target (MSP & ITO)' },
    { value: '7', label: 'Developer Solution TMAH (PHL)' },
    { value: '8', label: 'Diluent Thinner (ARRAY PHL) ' },
    { value: '9', label: 'HMDS (PHL)' },
    { value: '10', label: 'Diluent Solvent (CF PHL)' },
    { value: '11', label: 'Cleaning (UPK)' },
    { value: '12', label: 'AU (ODF SDP)' },
    { value: '13', label: 'GF (ODF SDP)' },
    { value: '14', label: 'Tank( ODF LCD)' },
    { value: '15', label: 'Head (ODF LCD)' },
    { value: '16', label: 'PCS (POL)' },
    { value: '17', label: 'ROL (POL)' },
    { value: '18', label: 'PI Liquid (PIP)' },
    { value: '19', label: 'Wheel (CUT)' }
  ],
  PAMSamplingMode: [
    { value: '0', label: 'No Used' },
    { value: '1', label: 'By Count' },
    { value: '2', label: 'By Table' }
  ]
}

export const excelDataList = [
  {
    name: 'ALARM',
    fieldList: [
      { label: 'lineId', value: 'lineId' },
      { label: 'equipmentNo', value: 'equipmentNo' },
      { label: 'unitNo', value: 'unitNo' },
      { label: 'alarmLevel', value: 'alarmLevel' },
      { label: 'alarmId', value: 'alarmId' },
      { label: 'alarmCode', value: 'alarmCode' },
      { label: 'alarmText', value: 'alarmText' },
      { label: 'serverName', value: 'serverName' }
    ]
  }
]

export const expressionList = [
  { label: 'BIT', value: 'BIT' },
  { label: 'BIN', value: 'BIN' },
  { label: 'BCD', value: 'BCD' },
  { label: 'B', value: 'B' },
  { label: 'ASCII', value: 'ASCII' },
  { label: 'ASCII2', value: 'ASCII2' },
  { label: 'INT', value: 'INT' },
  { label: 'SINT', value: 'SINT' },
  { label: 'LONG', value: 'LONG' },
  { label: 'SLONG', value: 'SLONG' },
  { label: 'H1', value: 'H1' },
  { label: 'FLOAT', value: 'FLOAT' },
  { label: 'DOUBLE', value: 'DOUBLE' }
]

export const dotratioList = [
  { label: '0.001', value: '0.001' },
  { label: '0.01', value: '0.01' },
  { label: '0.1', value: '0.1' },
  { label: '1', value: '1' },
  { label: '10', value: '10' },
  { label: '100', value: '100' },
  { label: '1000', value: '1000' }
]

export const reportToList = [
  { label: 'EDA', value: 'EDA' },
  { label: 'MES', value: 'MES' }
]

export const shopList = [
  { value: 'ARRAY', label: 'ARRAY' },
  { value: 'CELL', label: 'CELL' },
  { value: 'CF', label: 'CF' },
  { value: 'MODULE', label: 'MODULE' }
]

export const pickerOptions = {
  disabledDate(time) {
    return time.getTime() > Date.now()
  },
  shortcuts: [
    {
      text: '当前时间',
      onClick(picker) {
        picker.$emit('pick', new Date())
      }
    },
    {
      text: '3小时前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 3)
        picker.$emit('pick', date)
      }
    },
    {
      text: '6小时前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 6)
        picker.$emit('pick', date)
      }
    },
    {
      text: '12小时前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 12)
        picker.$emit('pick', date)
      }
    },
    {
      text: '1天前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24)
        picker.$emit('pick', date)
      }
    },
    {
      text: '一周前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
        picker.$emit('pick', date)
      }
    },
    {
      text: '半个月前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 15)
        picker.$emit('pick', date)
      }
    },
    {
      text: '一个月前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
        picker.$emit('pick', date)
      }
    },
    {
      text: '三个月前',
      onClick(picker) {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 90)
        picker.$emit('pick', date)
      }
    }
  ]
}

export const nodeTypeList = [
  { value: 'L', label: 'LIST' },
  { value: 'B', label: 'BINARY' },
  { value: 'BOOLEAN', label: 'BOOLEAN' },
  { value: 'A', label: 'ASCII' },
  { value: 'JIS8', label: 'JIS8' },
  { value: 'CHAR2', label: 'CHAR2' },
  { value: 'I8', label: 'I8' },
  { value: 'I1', label: 'I1' },
  { value: 'I2', label: 'I2' },
  { value: 'I4', label: 'I4' },
  { value: 'F8', label: 'F8' },
  { value: 'F4', label: 'F4' },
  { value: 'U8', label: 'U8' },
  { value: 'U1', label: 'U1' },
  { value: 'U2', label: 'U2' },
  { value: 'U4', label: 'U4' }
]

export const connectionModeList = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'PASSIVE', label: 'PASSIVE' }
]
