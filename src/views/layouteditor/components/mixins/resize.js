
import { mapState, mapMutations } from 'vuex'
export default{
  data() {
    return {
      settimer: null
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
      this.resizeHandler()
    },
    siderbarOpened() {
      this.settimer = setTimeout(() => {
        this.resizeHandler()
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
    resizeHandler() {
      try {
        const pageWidth = Number.parseFloat(`${this.selectedPage.width}`.replace(/(px|%),''/))
        const layoutWidth = document.querySelector('#mainegg').getBoundingClientRect().width - 20
        this._updateEditorZoom(layoutWidth / pageWidth)
      } catch (error) {
        // console.log(error)
      }
    },
    ...mapMutations(['_updateEditorZoom'])
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  }
}
