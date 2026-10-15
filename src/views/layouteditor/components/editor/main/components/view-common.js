import { mapState } from 'vuex'
import { elementStateColors } from '@/helpers/stateColor'

/**
 * 元件视图的公共 mixin。
 *
 * stateColors 把「绑定键 + 当前模拟状态」解成实际配色，
 * 元件各自的默认配色写在自己的 stateColorDefaults 选项里。
 */
export default{
  props: {
    primaryKey: {
      type: String,
      default: ''
    },
    parentKey: {
      type: String,
      default: ''
    },
    viewType: {
      type: String,
      default: 'container'
    },
    elemObj: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    stateColors() {
      const defaults = typeof this.stateColorDefaults === 'object'
        ? this.stateColorDefaults
        : {}
      return elementStateColors(this.elemObj.attrs, this.previewState, defaults)
    },
    ...mapState({
      previewState: state => state.layoutEditor.previewState
    })
  }
}
