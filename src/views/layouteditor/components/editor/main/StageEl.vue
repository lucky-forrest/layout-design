
<script>
import components from '@/views/layouteditor/components/editor/main/components'
import MrEl from '@/views/layouteditor/components/editor/common/mr-vue/MrEl'
import { _clearSelectedElements, _addSelectedElement } from '@/store/types'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'StageEl',
  components: {
    ...components,
    MrEl
  },
  /* eslint-disable */
  props: ['elem', 'isPlain'],
  render: function(createElement) {
    const elementO = this.elem.global
      ? {
          ...this.elem,
          ...this.componentRef,
          id: this.elem.id
        }
      : this.elem
    let styles = elementO.styles
    if (elementO.attrs && elementO.attrs.backgroundImage) {
      styles = Object.assign(styles, {
        backgroundImage: `url(.${elementO.attrs.backgroundImage})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom'
      })
    }
    // if(elementO.name==='equipment'){
    //    Object.assign(styles,{'border-width':'3px'})
    // }
    const data = {
      class: elementO.classes,
      style: styles,
      attrs: {
        id: elementO.id,
        'data-global': elementO.global,
        'data-egglement': elementO.egglement,
        'data-containegg': elementO.containegg,
        'data-componegg': elementO.componegg,
        'data-wrappegg': elementO.wrappegg,
        ...elementO.attrs
      }
    }
    const mrElProps = {
        active: this.isActive,
        left: elementO.left,
        top: elementO.top,
        right: elementO.right,
        bottom: elementO.bottom,
        zIndex: elementO.zIndex,
        width: elementO.width,
        height: elementO.height,
        minWidth: elementO.minWidth,
        minHeight: elementO.minHeight,
      }
    return createElement(
        MrEl,
        {
          props: elementO.global ? { ...mrElProps, handles: null } : mrElProps, 
          on: { activated: this.activatedHandler }
        },
        [createElement(elementO.name, { props:{ elemObj:elementO }, ...data })]
      )

    return stageElem
  },
  computed: {
    isActive() {
      return this.selectedElements.findIndex(el => el.id === this.elem.id) !== -1
    },
    componentRef() {
      return this.projectComponents[this.projectComponents.findIndex(comp => comp.name === this.elem.name)]
    },
    ...mapState({
      selectedElements: state => state.layoutEditor.selectedElements,
      projectComponents: state => state.layoutEditor.project.components
    })
  },
  methods: {
    activatedHandler(e) {
      e.stopPropagation()
      e.preventDefault()

      if (e.shiftKey && !this.isActive) {
        this._addSelectedElement(this.elem)
      } else if (!e.shiftKey && !this.isActive) {
        this._clearSelectedElements()
        this._addSelectedElement(this.elem)
      }
    },

    ...mapMutations([_clearSelectedElements, _addSelectedElement])
  }
}
</script>