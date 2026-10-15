<template>
  <div v-show="!hidden" class="menu-toggle">
    <div class="menu-toggle__header" @click="toggleMenu()">
      <span>{{ menuHeader }}</span>
      <svgicon v-if="isClosed" icon="system/expand" width="14" height="14" color="#737373"/>
      <svgicon v-else icon="system/collapse" width="14" height="14" color="#737373"/>
    </div>
    <div ref="content" :class="{'is-closed': isClosed}" :style="elStyle" class="menu-toggle__content">
      <slot/>
    </div>
  </div>
</template>

<script>
import '@/assets/design/icons/system/collapse'
import '@/assets/design/icons/system/expand'

export default {
  name: 'MenuToggle',
  props: {
    menuHeader: { type: String, default: '' },
    /* eslint-disable */
    startClosed: { type: Boolean, dafault: false },
    hidden: { type: Boolean, dafault: false }
  },
  data: function() {
    return {
      initialized: false,
      isClosed: false,
      maxHeight: 'auto'
    }
  },
  computed: {
    elStyle() {
      return this.isClosed ? { 'max-height': 0 } : { 'max-height': this.maxHeight }
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.maxHeight = window.getComputedStyle(this.$refs.content)['height']
      this.isClosed = this.startClosed
    })
  },
  methods: {
    toggleMenu() {
      if (!this.isClosed) {
        this.maxHeight = window.getComputedStyle(this.$refs.content)['height']
      }

      this.isClosed = !this.isClosed
      this.isClosed ? this.$emit('closed') : this.$emit('opened')
    }
  }
}
</script>

<style scoped>
.menu-toggle {
  border-bottom: 1px solid rgba(0,0,0,0.12);
}

.menu-toggle__header {
  padding: 10px 16px;
  font-size: small;
  font-weight: bold;
  cursor: pointer;
  color: rgba(0,0,0,.54)
}

.menu-toggle__header:hover {
  color: rgba(0,0,0,.87)
}

.menu-toggle__header span {
  display: inline-block;
  width: calc(100% - 20px);
  user-select: none;
}

.menu-toggle__header .svg-icon {
  display: inline-block;
}

.menu-toggle__content {
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.menu-toggle__content.is-closed {
  max-height: 0;
}
</style>
