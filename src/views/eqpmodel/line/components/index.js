
export default {
  shop: () => import('@/views/eqpmodel/line/components/shopDetail.vue'),
  lineType: () => import('@/views/eqpmodel/line/components/shopDetail.vue'),
  linePanel: () => import('@/views/eqpmodel/line/components/lineDetail.vue'),
  equipment: () => import('@/views/eqpmodel/line/components/equipmentDetail.vue'),
  port: () => import('@/views/eqpmodel/line/components/equipmentDetail.vue'),
  unit: () => import('@/views/eqpmodel/line/components/equipmentDetail.vue'),
  portInfo: () => import('@/views/eqpmodel/line/components/portDetail.vue'),
  unitInfo: () => import('@/views/eqpmodel/line/components/unitDetail.vue')
}
