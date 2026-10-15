<template>
  <editor/>
</template>
<script>
import redoundo from '@/views/layouteditor/components/mixins/redoundo'
import Editor from '@/views/layouteditor/components/Editor'
import notify from '@/views/layouteditor/components/mixins/notify'
import { loadProject } from '@/store/types'
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'LayoutDesign',
  components: { Editor },
  mixins: [redoundo, notify],
  async mounted() {
    this.initializeState()

    const result = await this.loadProject({ origin: 'local' })
    // 首次打开（没有本地草稿）属于正常情况，只有真正读取失败才提示
    if (result && result.ok === false && !result.empty) {
      this.notifyWarning(result.error || '本地草稿读取失败，已新建空白项目')
    }
  },
  methods: {
    ...mapMutations(['initializeState']),
    ...mapActions([loadProject])
  }
}
</script>

<style lang="scss">
/* 编辑态隐藏：attributes.hidden 落成 DOM 的 hidden 属性，
   这里用作者样式盖住元件自身的 display，保证「隐藏」在画布上真的不显示。
   导出走重画，不再克隆 DOM，所以导出图仍然包含被隐藏的元件。 */
.stage [hidden] {
  display: none !important;
}

/* 锁定角标之外的锁态提示：鼠标指上去明确告知不可拖动 */
.stage .mr-el.is-locked {
  cursor: not-allowed;
}
</style>
