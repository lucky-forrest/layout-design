<template>
  <div class="layout-container">
    <div class="edit-view">
      <mdc-linear-progress v-show="loading" class="linear-loader" accent indeterminate/>
      <headegg :scroll0="notScrolled"/>
      <drawegg/>
      <main id="main" role="main" @scroll="scrollFunction">
        <mainegg/>
      </main>
      <page-dialog/>
      <load-dialog/>
      <confirm-dialog/>
      <block-loader/>
      <mdc-snackbar :dismisses-on-action="false"/>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { checkLastSaved, rebaseSelectedElements } from '@/store/types'

import Headegg from '@/views/layouteditor/components/editor/header'
import Drawegg from '@/views/layouteditor/components/editor/drawer'
import Mainegg from '@/views/layouteditor/components/editor/main'
import BlockLoader from '@/views/layouteditor/components/editor/common/loader/BlockLoader'
import PageDialog from '@/views/layouteditor/components/editor/dialogs/PageDialog'
import LoadDialog from '@/views/layouteditor/components/editor/dialogs/LoadDialog'
import ConfirmDialog from '@/views/layouteditor/components/editor/dialogs/ConfirmDialog'

export default {
  name: 'Editor',
  components: { Headegg, Drawegg, Mainegg, BlockLoader, PageDialog, LoadDialog, ConfirmDialog },
  data: function() {
    return {
      notScrolled: true
    }
  },
  computed: {
    ...mapState({
      loading: state => state.layoutEditor.isLoading
    })
  },
  created: function() {
    this.$root.$on('rebaseState', this.rebaseState)
  },
  beforeDestroy: function() {
    this.$root.$off('rebaseState', this.rebaseState)
  },
  methods: {
    scrollFunction(e) {
      this.notScrolled = (e.target.scrollTop === 0)
    },
    rebaseState() {
      this.checkLastSaved()
      this.rebaseSelectedElements()
    },
    ...mapActions([rebaseSelectedElements, checkLastSaved])
  }
}
</script>

<style>
.layout-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.edit-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

#main {
  height: 100%;
  position: relative;
  flex-grow: 1;
  margin-right: 240px;
}

/* IN DEVICES SMALLER THAN 1024px -> NO DRAWER (so remove margins) */
@media screen and (max-width: 1024px) {
  #main {
    margin: 0px;
  }
}

dialog {
  width: 320px !important;
  border: none !important;
  box-shadow:
    0 9px 46px 8px rgba(0,0,0,.14),
    0 11px 15px -7px rgba(0,0,0,.12),
    0 24px 38px 3px rgba(0,0,0,.2);
}

dialog, dialog::backdrop {
  animation-name: anim-open;
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
}

@keyframes anim-open {
	0% { opacity: 0; transform: scale3d(1.1, 1.1, 1); }
	100% { opacity: 1; transform: scale3d(1, 1, 1); }
}
.vue-tooltip.tooltip-vuegg {
  padding:2px 10px;
  font-family: 'Roboto', Helvetica, Arial, sans-serif;
  font-size: 12px;
  z-index: 1010;
  color:#fff;
  border-radius: 3px;
  background-color: #616161;
  box-shadow:
    0 1px 3px rgba(0,0,0,0.12),
    0 1px 2px rgba(0,0,0,0.24);
}
.vue-tooltip.tooltip-vuegg .tooltip-arrow {
  border-color: #616161 !important;
}

/* recommended css code for vue-svgicon */
.svg-icon {
    display: inline-block;
    width: 16px;
    height: 16px;
    color: inherit;
    vertical-align: middle;
    fill: none;
    stroke: currentColor;
}
</style>

<style scoped>
.linear-loader {
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1001;
  height: 2px !important;
  position: absolute !important;
}
</style>
