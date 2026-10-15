<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar v-if="!isChromeHidden" class="sidebar-container"/>
    <div class="main-container" :class="{'full-screen': isChromeHidden}">
      <navbar v-if="!isChromeHidden"/>
      <tags-view v-if="!isChromeHidden"/>
      <app-main/>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Navbar, Sidebar, AppMain, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import dayjs from 'dayjs'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      $socket: null
    }
  },
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    isChromeHidden() {
      return !!(this.$route.meta && this.$route.meta.hideChrome)
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getSocketInstance()
    })
  },
  methods: {
    ...mapActions([
      'linksignalRealTimeData'
    ]),
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },
    getSocketInstance() {
      this.$socket = new WebSocket(`ws://${window.config.serverIp}:${window.config.socketPort}/`)
      if (this.$socket) {
        this.$socket.onopen = () => {
          this.$store.dispatch('onOpen').then(() => {
            console.log('websocket开始连接')
            setInterval(() => {
              this.$socket.send(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'))
            }, 60000)
          })
        }
        this.$socket.onmessage = data => {
          this.$store.dispatch('onOpen').then(() => {
            try {
              const res = JSON.parse(data.data)
              // console.log(res.header.messageName, res.body)
              // console.log(JSON.stringify(res, null, 2))
              switch (res.header.messageName) {
                case 'PublishMessageToClientReport':
                  this.$store.dispatch('sendMessageLog', res.body)
                  break
                case 'publishConnect':
                  this.$store.dispatch('plcConnect', res.body.isConnect)
                  break
                case 'sendRvMsgLog':
                  this.$store.dispatch('sendRvMsgLog', res.body)
                  break
                case 'sendRvTraceLog':
                  this.$store.dispatch('sendRvTraceLog', res.body)
                  break
                case 'linkSignalMonitor':
                  this.linksignalRealTimeData(res.body)
                  break
                case 'publishStressTestLog':
                  this.$store.dispatch('publishStressTestLog', res.body)
                  break
                case 'publishBitValueChanged':
                  this.$store.dispatch('publishBitValueChanged', res.body)
                  break
                case 'publishWordValueRead':
                  this.$store.dispatch('publishWordValueRead', res.body)
                  break
              }
            } catch (error) {
              // console.log(data.data)
            }
          })
        }
        // this.$socket.onclose = () => {
        //   this.$store.dispatch('LogOut').then(() => {
        //     location.reload() // In order to re-instantiate the vue-router object to avoid bugs
        //   })
        // }
        // this.$socket.onerror = () => {
        //   this.$store.dispatch('LogOut').then(() => {
        //     location.reload() // In order to re-instantiate the vue-router object to avoid bugs
        //   })
        // }
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
