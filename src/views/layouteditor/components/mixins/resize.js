
import { mapState, mapMutations } from 'vuex'
import { clampZoom } from '@/helpers/zoom'
import { getNodeBoxSize } from '@/helpers/positionDimension'

/** 适应画布时四周保留的留白（px） */
const FIT_PADDING = 24

export default{
  data() {
    return {
      settimer: null,
      /**
       * 是否处于「自动适应画布」状态。
       * 用户手动缩放（放大/缩小/100%/缩放到选中）后置为 false，
       * 之后窗口尺寸变化不再覆盖用户设定的缩放。
       */
      isZoomAuto: true
    }
  },
  computed: {
    ...mapState({
      selectedPage: state => state.layoutEditor.selectedPage,
      siderbarOpened: state => state.app.sidebar.opened
    })
  },
  watch: {
    selectedPage: function(val) {
      this.fitToViewport()
    },
    siderbarOpened() {
      this.settimer = setTimeout(() => {
        this.fitToViewport()
      }, 200)
    }
  },
  beforeMount() {
    if (this.settimer) {
      clearTimeout(this.settimer)
    }
    window.addEventListener('resize', this.resizeHandler)
  },
  methods: {
    /** 仅在用户未手动控制过缩放时，才按视口重新适配 */
    fitToViewport() {
      if (!this.isZoomAuto) return
      this.resizeHandler()
    },

    resizeHandler() {
      const container = document.getElementById('canvas-main')
      const page = this.selectedPage
      if (!container || !page) return

      const pageSize = getNodeBoxSize(page)
      const availWidth = container.clientWidth - FIT_PADDING
      const availHeight = container.clientHeight - FIT_PADDING
      if (!pageSize.width || !pageSize.height || availWidth <= 0 || availHeight <= 0) return

      this._updateEditorZoom(clampZoom(Math.min(
        availWidth / pageSize.width,
        availHeight / pageSize.height
      )))
    },
    ...mapMutations(['_updateEditorZoom'])
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }
}
