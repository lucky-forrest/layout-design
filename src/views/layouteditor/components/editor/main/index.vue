<template>
  <div id="mainegg" class="mainegg" @click.self="selectParent">
    <stage v-if="selectedPage" :page="selectedPage" :zoom="zoom" />
    <zoom-menu :zoom="zoom" class="zoom-menu" @zoomChange="zoomHandler" />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import {
  _changeActivePage,
  _rebaseActivePage,
  _updateEditorZoom,
  getPageIndexById
} from '@/store/types'

import ZoomMenu from '@/views/layouteditor/components/editor/common/ZoomMenu'
import resize from '@/views/layouteditor/components/mixins/resize'
import Stage from './Stage'

export default {
  name: 'Mainegg',
  components: {
    Stage,
    ZoomMenu
  },
  mixins: [resize],
  computed: {
    ...mapState({
      selectedPage: state => {
        return state.layoutEditor.selectedPage
      },
      pages: state => (state ? state.layoutEditor.project.pages : []),
      zoom: state => state.layoutEditor.editorZoom
    }),
    ...mapGetters([getPageIndexById])
  },
  watch: {
    // After a redo/undo action this will apply
    selectedPage: function(val) {
      this.selectFallbackPage(val)
    }
  },
  created: function() {
    this.selectFallbackPage(this.selectedPage)
  },
  methods: {
    selectFallbackPage(page) {
      if (!page && this.pages.length > 0) {
        this._changeActivePage(this.pages[0])
      } else {
        this._rebaseActivePage(this.getPageIndexById(page.id))
      }
    },
    zoomHandler(zoomValue) {
      this._updateEditorZoom(zoomValue)
    },
    ...mapMutations([_changeActivePage, _rebaseActivePage, _updateEditorZoom]),
    selectParent(event) {
      console.log('selectParent', event)
    }
  }
}
</script>

<style scoped>
.mainegg {
  position: relative;
  margin: 10px;
  height: calc(100% - 20px);
  overflow: auto;
}

.zoom-menu {
  position: absolute;
  bottom: 50px;
  right: 24px;
  padding: 0 6px;
}
</style>
