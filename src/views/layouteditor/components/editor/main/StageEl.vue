
<script>
import components from '@/views/layouteditor/components/editor/main/components'
import MrEl from '@/views/layouteditor/components/editor/common/mr-vue/MrEl'
import { _clearSelectedElements, _addSelectedElement, _removeSelectedElement } from '@/store/types'
import { elementLabel } from '@/helpers/nodeInfo'
import notify from '@/views/layouteditor/components/mixins/notify'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'StageEl',
  components: {
    ...components,
    MrEl
  },
  mixins: [notify],
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
        'data-element': elementO.element,
        'data-can-contain': elementO.canContain,
        'data-component-type': elementO.componentType,
        'data-is-wrapper': elementO.isWrapper,
        ...elementO.attrs
      }
    }
    const locked = !!elementO.locked
    const mrElProps = {
        active: this.isActive,
        locked,
        left: elementO.left,
        top: elementO.top,
        right: elementO.right,
        bottom: elementO.bottom,
        zIndex: elementO.zIndex,
        width: elementO.width,
        height: elementO.height,
        minWidth: elementO.minWidth,
        minHeight: elementO.minHeight,
        // 全局元件与锁定元件都不提供缩放手柄
        handles: (elementO.global || locked) ? [] : undefined
      }
    return createElement(
        MrEl,
        {
          props: mrElProps,
          on: { activated: this.activatedHandler }
        },
        [createElement(elementO.name, { props:{ elemObj:elementO }, ...data })]
      )

    return stageElem
  },
  computed: {
    activeIndex() {
      return this.selectedElements.findIndex(el => el.id === this.elem.id)
    },
    isActive() {
      return this.activeIndex !== -1
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

      // 锁定元件默认不可选中；按住 Alt 可临时解锁一次
      if (this.elem.locked && !e.altKey) {
        this.notifyWarning(
          '「' + (elementLabel(this.elem) || '该元件') + '」已锁定，按住 Alt 点击可临时选中'
        )
        return
      }

      const isMultiSelect = e.shiftKey || e.metaKey || e.ctrlKey

      if (isMultiSelect) {
        // Shift 加选 / Ctrl(Cmd) 减选，都在同一次按下里完成
        if (this.isActive) this._removeSelectedElement(this.activeIndex)
        else this._addSelectedElement(this.elem)
        return
      }

      if (!this.isActive) {
        this._clearSelectedElements()
        this._addSelectedElement(this.elem)
      }
    },

    ...mapMutations([
      _clearSelectedElements,
      _addSelectedElement,
      _removeSelectedElement
    ])
  }
}
</script>