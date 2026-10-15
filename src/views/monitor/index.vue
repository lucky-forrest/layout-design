<template>
  <div class="app-container">
    <el-tabs v-model="currTab" class="monitorPage">
      <template v-for="([shopName,lineList],pIndex) in services" >
        <el-tab-pane :label="shopName" :name="shopName" :key="pIndex">
          <el-row v-if="currTab===shopName" :gutter="20">
            <el-col v-for="(line,index) in lineList" :sm="8" :md="6" :lg="4" :key="index" class="card">
              <el-card
                :body-style="{padding:0}"
                shadow="hover">
                <div slot="header">
                  <span>{{ line.lineId }}</span>
                  <el-tooltip :content="t('tagsView.refresh')" placement="top" style="float:right">
                    <a @click="getAllLineList">
                      <i class="el-icon-refresh-right" />
                    </a>
                  </el-tooltip>
                </div>
                <h4 style="padding:10px 23px">jvmName:{{ line.jvmName }}</h4>
                <h4 style="padding:0px 23px">jvmVersion:{{ line.jvmVersion }}</h4>
                <barChart :elem-id="`${pIndex}-${index}`" :data="line"/>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import { getAllLineList } from '@/api/dashboard'
import VueGridLayout from 'vue-grid-layout'
import barChart from '@/views/monitor/barChart.vue'
import { t } from '@/utils'
export default {
  name: 'Dashboard',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    barChart
  },
  filters: {
    formatIcon([cpu, memory]) {
      return (cpu >= 60 || memory >= 70) ? 'warning' : 'normal'
    }
  },
  data() {
    return {
      loading: false,
      currTab: '',
      lineList: [],
      services: [],
      fileNameList: [],
      isReConnection: true,
      reConnectionDelay: 12000
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getAllLineList()
      // setTimeout(() => {
      //   setInterval(() => {
      //     this.getAllLineList()
      //   }, 3000)
      // }, 3000)
    })
  },
  methods: {
    t,
    getAllLineList() {
      return getAllLineList({ condition: {}, pageNo: 1, pageSize: Number.MAX_VALUE }).then(res => {
        this.currTab = 'ARRAY'
        this.lineList = this.$lodash.sortBy(res.body.rows.map(item => {
          return Object.assign(item, {
            jvmName: this.$lodash.random(0, 100),
            jvmVersion: this.$lodash.random(0, 100),
            jvmStartTime: '',
            disk: this.$lodash.random(0, 100),
            cpu: this.$lodash.random(0, 100),
            memory: this.$lodash.random(0, 100)
          })
        }), 'shopName')
        this.services = Object.entries(this.$lodash.groupBy(this.lineList, 'shopName'))
        this.initWebSocket()
      })
    },
    selectedService: function(line) {
      const serviceAddress = `http://${line.ip}:${line.port}/`
      this.$router.push({ name: 'MonitorList', params: {
        fabType: line.shopName,
        lineType: line.lineType,
        lineId: line.lineId,
        serviceAddress: serviceAddress
      }, query: { t: new Date().getSeconds() }})
    },
    initWebSocket() {
      this.services.forEach(([shopName, lineList]) => {
        lineList.forEach(service => {
          const ws = new WebSocket(`ws://${service.ip}:${service.port2}`)
          this.webSocketAddEventListener(ws)
        })
      })
    },
    reConnection(wsTarget) {
      if (wsTarget && this.isReConnection) {
        setTimeout(() => {
          this.reConnectionDelay += 6000
          try {
            console.log(`${wsTarget.url}正在尝试重连...`)
            wsTarget = new WebSocket(wsTarget.url)
            this.webSocketAddEventListener(wsTarget)
          } catch (error) {
            console.log(error)
          }
        }, this.reConnectionDelay)
      }
    },
    webSocketAddEventListener(ws) {
      ws.onopen = evt => {
        console.log(`${evt.target.url} Connected Successful !`)
      }
      ws.onmessage = response => {
        const res = JSON.parse(response.data)
        if (res.header.messageName === 'HardWareReport') {
          let index = -1
          for (const item of this.services) {
            index = item[1].findIndex(line => { return line.lineId === res.body.lineId })
            if (index >= 0) {
              const deleteLine = item[1][index]
              item[1].splice(index, 1, Object.assign(deleteLine,
                {
                  jvmName: res.body.bcJvmBean.jvmName,
                  jvmVersion: res.body.bcJvmBean.jvmVersion,
                  jvmStartTime: res.body.bcJvmBean.jvmStartTime,
                  processId: res.body.bcJvmBean.processId,
                  cpu: res.body.bcCpuBean.currentUsedRatio,
                  memory: res.body.bcMemoryBean.merryCompare,
                  disk: res.body.bcComputerDisk.diskUsed
                }))
              break
            }
          }
        }
      }
      ws.onerror = error => {
        this.reConnection(error.target)
      }
    },
    tabChangeHandler(event) {
      console.log(event)
    }
  }
}
</script>
<style lang="scss">
  .monitorPage {
    .el-tabs__header {
      margin-bottom: 0
    }

    .card {
      margin-top: 10px;

      .el-card {
        &:hover {
          background-color: rgba(235, 238, 245, 0.3);
        }
      }

      .systemInfo {
        list-style: none;

        li {
          flex: row nowrap;
          line-height: 30px;

          .propName {
            display: inline-block;
            flex: 0 1 auto;
            text-align: right;
            width: 90px;
          }

          .propValue {
            display: inline-block;
            width: calc(100% - 100px);
            flex: 1 1 auto;
          }
        }
      }
    }
  }
</style>
