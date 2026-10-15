export default {
  'common': () => import('@/views/profile/components/common.vue'),
  'iOSensor': () => import('@/views/profile/components/index.vue'),
  'efu': () => import('@/views/profile/components/index.vue'),
  'ionizerFan': () => import('@/views/profile/components/index.vue'),
  'apcDataDownloadBlock': () => import('@/views/profile/components/index.vue'),
  'dailyCheckProcessDataBlock': () => import('@/views/profile/components/index.vue'),
  'energyVisualizationBlock': () => import('@/views/profile/components/index.vue'),
  'processDataReportBlock': () => import('@/views/profile/components/index.vue'),
  'recipeParameterRequestBlock': () => import('@/views/profile/components/index.vue'),
  'apcDataBlock': () => import('@/views/profile/components/index.vue'),
  'alarm': () => import('@/views/profile/components/alarm.vue'),
  'position': () => import('@/views/profile/components/position.vue')
}
