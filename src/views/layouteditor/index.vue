<template>
  <editor/>
</template>
<script>
import redoundo from '@/views/layouteditor/components/mixins/redoundo'
import Editor from '@/views/layouteditor/components/Editor'
import { loadVueggProject } from '@/store/types'
import { mapActions, mapMutations } from 'vuex'
export default {
  name: 'LayoutDesign',
  components: { Editor },
  mixins: [redoundo],
  mounted: function() {
    this.initializeState()
    this.loadVueggProject({ origin: 'local' })
  },
  methods: {
    ...mapMutations(['initializeState']),
    ...mapActions([loadVueggProject])
  }
}
</script>
