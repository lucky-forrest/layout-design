<template>
  <div :class="{'not-scrolled': scroll0}" class="header-bar">
    <a class="home-btn" href="javascript:void(0);" title="返回首页" @click="goHome">
      <svgicon :original="true" icon="system/widgets" width="40" height="40"/>
    </a>
    <input
      v-model="tmpProjectTitle"
      class="title-input"
      title="项目名称"
      placeholder="项目名称"
      @blur="onTitleBlur">
    <div :title="saveStatusTitle" class="save-status">
      <span :class="['save-dot', hasChanges ? 'save-dot--dirty' : 'save-dot--saved']"/>
      <span class="save-status__text">{{ saveStatusText }}</span>
    </div>
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
  name: 'HeaderBar',
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
  computed: {
    saveStatusText() {
      if (this.hasChanges) return '有未保存的改动'
      if (this.lastSavedAt) return '已保存 ' + this.formatTime(this.lastSavedAt)
      return '尚未保存'
    },

    saveStatusTitle() {
      const tips = []
      if (this.lastSavedAt) tips.push('上次保存：' + this.formatTime(this.lastSavedAt, true))
      if (this.lastSyncedAt) tips.push('草稿自动保存：' + this.formatTime(this.lastSyncedAt, true))
      if (this.hasChanges) tips.push('改动会自动保存为本地草稿，点保存按钮确认')
      if (!tips.length) tips.push('改动会自动保存为本地草稿')
      return tips.join('；')
    },

    ...mapState({
      project: state => state ? state.layoutEditor.project : {},
      projectTitle: state => state ? state.layoutEditor.project.title : '',
      hasChanges: state => state ? state.layoutEditor.hasChanges : false,
      lastSavedAt: state => state ? state.layoutEditor.lastSavedAt : null,
      lastSyncedAt: state => state ? state.layoutEditor.lastSyncedAt : null
    })
  },
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

    formatTime(timestamp, withSeconds) {
      const date = new Date(timestamp)
      const pad = value => (value < 10 ? '0' + value : '' + value)
      const time = pad(date.getHours()) + ':' + pad(date.getMinutes())
      return withSeconds ? time + ':' + pad(date.getSeconds()) : time
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

.header-bar {
  z-index: 1000;
  height: 64px;
  width: calc(100% - 240px);
  color: rgba(0,0,0,0.66);
  background-color: #eee;
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
  .header-bar {
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

.save-status {
  display: inline-flex;
  align-items: center;
  align-self: center;
  flex-shrink: 0;
  margin-right: 12px;
  padding: 4px 10px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, .04);
  font-size: 12px;
  color: rgba(0, 0, 0, .6);
  user-select: none;
}

.save-dot {
  width: 7px;
  height: 7px;
  margin-right: 6px;
  border-radius: 50%;
}

.save-dot--saved {
  background-color: #4caf50;
}

.save-dot--dirty {
  background-color: #e6a23c;
}

.save-status__text {
  white-space: nowrap;
}
</style>
