<template>
  <div :class="{'not-scrolled': scroll0}" class="headegg mdc-theme--background">
    <a class="home-btn" href="javascript:void(0);" title="返回首页" @click="goHome">
      <svgicon :original="true" icon="system/widgets" width="40" height="40"/>
    </a>
    <input
      v-model="tmpProjectTitle"
      class="title-input"
      title="Project title"
      placeholder="Project title"
      @blur="onTitleBlur">
    <div class="spacer"/>
    <action-bar/>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { updateProject } from '@/store/types'

import ActionBar from './ActionBar'

import '@/assets/design/icons/system/widgets'

export default {
  name: 'Headegg',
  components: {
    ActionBar
  },
  /* eslint-disable */
  props: ['scroll0'],
  data: function() {
    return {
      tmpProjectTitle: ''
    }
  },
  computed: mapState({
    project: state => state ? state.layoutEditor.project : {},
    projectTitle: state => state ? state.layoutEditor.project.title : ''
  }),
  watch: {
    'projectTitle': function(val) {
      this.tmpProjectTitle = val
    }
  },
  created: function() {
    this.tmpProjectTitle = this.projectTitle
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    onTitleBlur() {
      if (this.tmpProjectTitle && (this.tmpProjectTitle !== this.projectTitle)) {
        this.updateProject({ title: this.tmpProjectTitle })
      } else {
        this.tmpProjectTitle = this.projectTitle
      }
    },
    ...mapMutations([updateProject])
  }
}
</script>

<style scoped>

.headegg {
  z-index: 1000;
  height: 64px;
  width: calc(100% - 240px);
  color: rgba(0,0,0,0.66);
  padding: 0 25px 0 25px;
  margin-right: 240px;
  border: none;
  display: flex;
  flex-shrink: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-self: stretch;
  align-items: center;
  box-sizing: border-box;
  box-shadow:
    0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12),
    0 3px 1px -2px rgba(0, 0, 0, 0.2);

  transition-duration: .2s;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-property: max-height,box-shadow;
}
.not-scrolled {
  box-shadow: none;
}

/* IN DEVICES SMALLER THAN 1024px -> NO DRAWER (so remove margins) */
@media screen and (max-width: 1024px) {
  .headegg {
    margin: 0px;
    width: 100%;
  }
}

.home-btn {
  margin-right: 25px;
  border: none;
  border-radius: 50%;
  padding: 0;
  background-color: transparent;
  outline: none;
}

.spacer {
  width: 12px;
}

.title-input {
  flex-grow: 1;
  border: 0;
  height: 56px;
  background: transparent;
  outline: none;
}
</style>
