<template>
  <div>
    <div :id="`myChart_${elemId}`" :style="{width: '100%', height: '300px'}"/>
  </div>
</template>
<script>
const echarts = require('echarts/lib/echarts')
require('echarts/lib/component/tooltip')
require('echarts/lib/chart/bar')
export default {
  name: 'BarChart',
  props: {
    elemId: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      chartData: []
    }
  },
  watch: {
    data() {
      this.drawLine()
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.drawLine()
      }, 200)
    })
  },
  methods: {
    drawLine() {
      const _chartData = this.$lodash.assign({}, { cpu: this.data.cpu }, { disk: this.data.disk }, { memory: this.data.memory })
      this.chartData = this.$lodash.toArray(_chartData)
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById(`myChart_${this.elemId}`))
      // 绘制图表
      myChart.setOption({
        grid: {
          top: 20,
          left: 40
        },
        tooltip: {},
        xAxis: {
          data: ['cpu', 'disk', 'memory'],
          axisLabel: {
            interval: 0
          },
          nameGap: 50
        },
        yAxis: {
          max: 100
        },
        series: [{
          type: 'bar',
          data: this.chartData,
          itemStyle: {
            normal: {
              color: function(params) {
                var colorList = ['red', 'green', 'blue', 'gray', 'yellow']
                if (params.value > 0 && params.value <= 20) {
                  return colorList[1]
                } else if (params.value > 20 && params.value <= 40) {
                  return colorList[2]
                } else if (params.value > 40 && params.value <= 60) {
                  return colorList[3]
                } else if (params.value > 60 && params.value <= 80) {
                  return colorList[4]
                } else {
                  return colorList[0]
                }
              }
            }
          }
        }]
      }, window.addEventListener('resize', function() { myChart.resize() }))
    }
  }
}
</script>
