<template>
  <div
    :style="style"
    :class="['mr-el', { 'is-locked': locked }]"
    data-mr-el="true"
    @mousedown="mouseDownHandler"
  >
    <!-- IMPORTANT! KEEP SLOT AS FIRST CHILD -->
    <slot/>
    <!-- IMPORTANT! KEEP SLOT AS FIRST CHILD -->

    <div v-if="locked" class="lock-badge" title="已锁定：按住 Alt 点击可临时选中">
      <svg viewBox="0 0 24 24" width="12" height="12">
        <path
          d="M17 9V7a5 5 0 0 0-10 0v2H5.6a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h12.8a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H17zM9 7a3 3 0 0 1 6 0v2H9V7zm3 6.4a1.6 1.6 0 0 1 .8 3v1.8h-1.6v-1.8a1.6 1.6 0 0 1 .8-3z"
          fill="currentColor"/>
      </svg>
    </div>

    <template v-if="resizable">
      <div
        v-for="handle in handles"

        :key="handle"
        :class="handle"
        :style="{ display: active ? 'block' : 'none'}"
        data-mr-handle="true"
        class="handle"/>
    </template>
    <div
      v-if="!resizable"
      :style="{ display: active ? 'block' : 'none'}"
      class="selection-box"/>
  </div>
</template>

<script>
export default {
  name: 'MrEl',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    width: {
      type: [String, Number],
      default: 'auto',
      validator: function(val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    height: {
      type: [String, Number],
      default: 'auto',
      validator: function(val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    minWidth: {
      type: Number,
      default: 15,
      validator: function(val) {
        return val > 0
      }
    },
    minHeight: {
      type: Number,
      default: 15,
      validator: function(val) {
        return val > 0
      }
    },
    top: {
      type: [String, Number],
      default: 0,
      validator: function(val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    bottom: {
      type: [String, Number],
      default: 'auto',
      validator: function(val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    left: {
      type: [String, Number],
      default: 0,
      validator: function(val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    right: {
      type: [String, Number],
      default: 'auto',
      validator: function(val) {
        return ((typeof val === 'string') ? (val.indexOf('%') || val === 'auto') : val >= 0)
      }
    },
    zIndex: {
      type: [String, Number],
      default: 'auto',
      validator: function(val) {
        return ((typeof val === 'string') ? val === 'auto' : val >= 0)
      }
    },
    handles: {
      type: Array,
      default: function() {
        return ['mt', 'mr', 'mb', 'ml', 'tl', 'tr', 'br', 'bl']
      }
    },
    /** 锁定：不可选中（Alt 临时解锁）、不可缩放，左上角显示锁标记 */
    locked: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    resizable() {
      return ((this.handles !== null) && (this.handles.length > 0))
    },

    style() {
      return {
        zIndex: this.zIndex,
        minWidth: this.minWidth + 'px',
        minHeight: this.minHeight + 'px',
        top: (typeof this.top === 'number') ? (this.top + 'px') : this.top,
        left: (typeof this.left === 'number') ? (this.left + 'px') : this.left,
        bottom: (typeof this.bottom === 'number') ? (this.bottom + 'px') : this.bottom,
        right: (typeof this.right === 'number') ? (this.right + 'px') : this.right,
        width: (typeof this.width === 'number') ? (this.width + 'px') : this.width,
        height: (typeof this.height === 'number') ? (this.height + 'px') : this.height
      }
    }
  },
  methods: {
    /**
     * 一次按下只触发一次 activated：
     * 单选、Shift 加选、Ctrl/Cmd 减选都由上层依据修饰键决定语义，
     * 同时忽略右键等非左键操作。
     */
    mouseDownHandler(e) {
      if (e.button !== 0) return
      this.$emit('activated', e)
    }
  }
}
</script>

<style scoped>
.mr-el {
  position: absolute;
  box-sizing: border-box;
}
.mr-el:hover {
  cursor: move;
}
.mr-el.is-locked:hover {
  cursor: not-allowed;
}
.mr-el > * {
  margin: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
}

.lock-badge {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  color: #7a7a7a;
  background-color: rgba(255, 255, 255, .82);
  border-bottom-left-radius: 4px;
  pointer-events: none;
}

.selection-box {
  border: 2px solid #03a9f4;
}

.handle {
  box-sizing: border-box;
  display: none;
  position: absolute;
  width: 10px;
  height: 10px;
  font-size: 1px;
  border-radius: 50%;
  border: 1px solid #fff;
}
.tl {
  top: -3px;
  left: -3px;
  cursor: nwse-resize;
  background: #03a9f4;
}
.mt {
  top: 0;
  width: 100%;
  border-radius: 0;
  border-width: 2px;
  border-color: #03a9f4;
  border-style: solid none none none;
  cursor: ns-resize;
}
.tr {
  top: -3px;
  right: -3px;
  cursor: nesw-resize;
  background: #03a9f4;
}
.mr {
  top: 0;
  right: 0;
  height: 100%;
  border-radius: 0;
  border-width: 2px;
  border-color: #03a9f4;
  border-style: none solid none none;
  cursor: ew-resize;
}
.br {
  bottom: -3px;
  right: -3px;
  cursor: nwse-resize;
  background: #03a9f4;
}
.mb {
  bottom: 0;
  width: 100%;
  border-radius: 0;
  border-width: 2px;
  border-color: #03a9f4;
  border-style: none none solid none;
  cursor: ns-resize;
}
.bl {
  bottom: -3px;
  left: -3px;
  cursor: nesw-resize;
  background: #03a9f4;
}
.ml {
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 0;
  border-width: 2px;
  border-color: #03a9f4;
  border-style: none none none solid;
  cursor: ew-resize;
}
</style>
