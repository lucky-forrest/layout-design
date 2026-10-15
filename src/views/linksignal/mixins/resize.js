import { debounce } from '@/utils'

export default {
  data() {
    return {
      sidebarElm: null
    }
  },
  mounted() {
    this.__resizeHandler = debounce(() => {
      if (this.linksignalforSendOutChart) {
        this.linksignalforSendOutChart.resize()
      }
      if (this.linksignalforReceiveChart) {
        this.linksignalforReceiveChart.resize()
      }
    }, 100)
    window.addEventListener('resize', this.__resizeHandler)
    this.sidebarElm = document.getElementsByClassName('sidebar-container')[0]
    this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
    this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler)
  },
  methods: {
    sidebarResizeHandler(e) {
      if (e.propertyName === 'width') {
        this.__resizeHandler()
      }
    }
  }
}
