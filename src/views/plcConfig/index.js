export default {
  addressEdit: () => import('@/views/plcConfig/addressEdit/index'),
  bitEdit: () => import('@/views/plcConfig/editBit/index'),
  block: () => import('@/views/plcConfig/block/index'),
  constants: () => import('@/views/plcConfig/constants/index'),
  function: () => import('@/views/plcConfig/function/index'),
  wordEdit: () => import('@/views/plcConfig/editWord/index'),
  fileEdit: () => import('@/views/plcConfig/file/plcEdit'),
  eqpInterface: () => import('@/views/plcConfig/eqpinterface/index'),
  cassetteMap: () => import('@/views/plcConfig/cassetteMap/index'),
  linkSignal: () => import('@/views/plcConfig/linkSignal/index'),
  editAddress: () => import('@/views/plcConfig/addressEdit/editAddress')
}
