<template>
  <div class="content-wrapper">
    <div v-if="hasDim" class="element-set">
      <span class="element-set__label">高度</span>
      <el-input v-model="h" :disabled="(h === 'auto')"/>
      <input v-if="hasPos" :checked="!isNaN(parseInt(h))" type="checkbox" @change="onCheckChanges('height')">
    </div>

    <div v-if="hasDim" class="element-set">
      <span class="element-set__label">宽度</span>
      <el-input v-model="w" :disabled="(w === 'auto')"/>
      <input v-if="hasPos" :checked="!isNaN(parseInt(w))" type="checkbox" @change="onCheckChanges('width')">
    </div>

    <div v-if="hasPos" class="element-set">
      <span class="element-set__label">上</span>
      <el-input v-model="t" :disabled="(t === 'auto')"/>
      <input :checked="!isNaN(parseInt(t))" type="checkbox" @change="onCheckChanges('top')">
    </div>

    <div v-if="hasPos" class="element-set">
      <span class="element-set__label">左</span>
      <el-input v-model="l" :disabled="(l === 'auto')"/>
      <input :checked="!isNaN(parseInt(l))" type="checkbox" @change="onCheckChanges('left')">
    </div>

    <div v-if="hasPos" class="element-set">
      <span class="element-set__label">下</span>
      <el-input v-model="b" :disabled="(b === 'auto')"/>
      <input :checked="!isNaN(parseInt(b))" type="checkbox" @change="onCheckChanges('bottom')">
    </div>

    <div v-if="hasPos" class="element-set">
      <span class="element-set__label">右</span>
      <el-input v-model="r" :disabled="(r === 'auto')"/>
      <input :checked="!isNaN(parseInt(r))" type="checkbox" @change="onCheckChanges('right')">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getComputedProp } from '@/helpers/positionDimension'

export default {
  name: 'DimPos',
  props: {
    height: { type: [String, Number], default: 'auto' },
    width: { type: [String, Number], default: 'auto' },
    top: { type: [String, Number], default: 'auto' },
    bottom: { type: [String, Number], default: 'auto' },
    left: { type: [String, Number], default: 'auto' },
    right: { type: [String, Number], default: 'auto' },
    hasDim: { type: Boolean, default: true },
    hasPos: { type: Boolean, default: true }
  },
  computed: {
    h: {
      get() { return this.height },
      set(val) { this.emitChanges('height', val) }
    },
    w: {
      get() { return this.width },
      set(val) { this.emitChanges('width', val) }
    },
    t: {
      get() { return this.top },
      set(val) { this.emitChanges('top', val) }
    },
    l: {
      get() { return this.left },
      set(val) { this.emitChanges('left', val) }
    },
    b: {
      get() { return this.bottom },
      set(val) { this.emitChanges('bottom', val) }
    },
    r: {
      get() { return this.right },
      set(val) { this.emitChanges('right', val) }
    },

    ...mapState({
      elementO: state => state.layoutEditor.selectedElements[0]
    })
  },
  methods: {
    onCheckChanges(prop) {
      this.$emit('change', {
        type: prop,
        value: (this[prop] === 'auto')
          ? getComputedProp(prop, this.elementO)
          : 'auto',
        instant: true
      })

      // If the element has no dimension properties,
      // oposite props (top/bottom and left/right)
      // can not be active at the same time
      if (!this.hasDim) {
        let opositeProp

        switch (prop) {
          case 'top': opositeProp = 'bottom'; break
          case 'bottom': opositeProp = 'top'; break
          case 'left': opositeProp = 'right'; break
          case 'right': opositeProp = 'left'; break
        }

        this.$emit('change', {
          type: opositeProp,
          value: (this[prop] === 'auto')
            ? 'auto'
            : getComputedProp(opositeProp, this.elementO),
          instant: true
        })
      }
    },

    emitChanges(type, value) {
      this.$emit('change', { type, value })
    }
  }
}
</script>

<style scoped>
.content-wrapper {
  width: 100%;
  padding-top: 2px;
}

.element-set {
  display: flex;
  align-items: center;
  padding: 0 20px;
  margin-bottom: 8px;
}

.element-set:last-child {
  margin-bottom: 14px;
}

.element-set__label {
  flex: 0 0 56px;
  min-width: 0;
  box-sizing: border-box;
  padding-right: 8px;
  font-size: 12px;
  color: #606266;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.element-set .el-input {
  flex: 1;
  min-width: 0;
}

.element-set > input[type="checkbox"] {
  flex-shrink: 0;
  margin: 0 0 0 8px;
}
</style>
