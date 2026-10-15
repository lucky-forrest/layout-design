<template>
  <div class="handles">
    <div
      v-for="(coord, i) in coords"
      :key="i"
      :data-handle="i"
      :style="placeHandle(coord)"
      class="handle"
      @mousedown="mousedown"
      @mouseup="mouseup" >
      <div class="delete-point" />
    </div>
  </div>
</template>
<script>
import Draggabilly from 'draggabilly'
import Event from './lib/event'

export default {
  /* eslint-disable-next-line */
  props: ['coords', 'options', 'shape'],
  data() {
    return {
      draggies: []
    }
  },
  watch: {
    shape() {
      this.$nextTick(() => {
        this.clearDraggies()
        this.resetHandles()
        document.querySelectorAll('.handle').forEach(handle => handle.classList.remove('show-delete'))
      })
    },
    'options.width'() {
      this.resetHandles()
    },
    'options.height'() {
      this.resetHandles()
    }
  },
  mounted() {
    setTimeout(() => {
      this.resetHandles()
    }, 200)
    Event.$on('handleAdded', this.handleAdded)
    Event.$on('customizingFinished', () => {
      const handles = document.querySelectorAll('.handle')

      handles.forEach(handle => this.makeDraggable(handle))
    })
    Event.$on('handleRemoved', () => {
      this.$nextTick(() => {
        this.resetHandles()
      })
    })
  },
  methods: {
    placeHandle(coord) {
      return {
        left: Math.round((coord[0] / 100) * this.options.width) + 'px',
        top: Math.round((coord[1] / 100) * this.options.height) + 'px'
      }
    },
    handleAdded(payload) {
      this.$nextTick(() => {
        const handle = document.querySelectorAll('[data-handle="' + payload.index + '"]')[0]
        this.styleHandle(handle, payload.coord)
      })
    },
    resetHandles() {
      const handles = document.querySelectorAll('.handle')
      this.clearDraggies()
      Array.from(handles)
        .filter(handle => handle.dataset.handle)
        .forEach(handle => {
          this.styleHandle(handle, this.coords[handle.dataset.handle])
          this.makeDraggable(handle)
        })
    },
    clearDraggies() {
      this.draggies.forEach(draggie => draggie.destroy())
      this.draggies = []
    },
    styleHandle(handle, coord) {
      Object.assign(handle.style, this.placeHandle(coord))
    },
    makeDraggable(handle) {
      const self = this
      const i = handle.dataset.handle

      handle.classList.add('draggable')

      const draggie = new Draggabilly(handle, {
        containment: true,
        grid: [0, 0]
      }).on('pointerDown', function() {
        document.querySelectorAll('[data-handle="' + i + '"]')[0].classList.add('changing')
        if (self.shape.name === 'Circle') {
          self.$emit('setStartRadius')
        }
      }).on('dragMove', function() {
        const x = this.position.x
        const y = this.position.y
        self.$emit('updateHandle', { x, y, i })
      }).on('pointerUp', function() {
        document.querySelectorAll('.point').forEach(point => point.classList.remove('changing'))
      })

      this.draggies.push(draggie)
    },
    mousedown(e) {
      document.querySelectorAll('.handle').forEach(handle => handle.classList.remove('show-delete'))

      if (e.srcElement.classList.contains('delete-point')) {
        this.$emit('removeHandle', parseInt(e.srcElement.parentElement.dataset.handle))
      }

      if (this.coords.length > 3) {
        e.target.classList.add('show-delete')
      }
    },
    mouseup(e) {
      setTimeout(() => {
        e.target.classList.remove('show-delete')
      }, 2500)
    }
  }
}
</script>

<style lang="scss">
.handles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .delete-point,
  .handle {
    position: absolute;
    width: 20px;
    height: 20px;
  }

  .handle {
    border-radius: 50%;
    box-shadow: inset 0 0 0 10px;
    opacity: 0.8;
    transition: opacity 0.25s;

    &.is-dragging,
    &.is-pointer-down {
      // better than using :hover/:active for touch
      z-index: 100;
      box-shadow: inset 0 0 0 3px;
      cursor: none;
      transition: box-shadow 0s;
    }

    &.draggable {
      cursor: grab;
    }

    &.show-delete {
      .delete-point {
        transform: scale3d(0.9, 0.9, 0.9);
        transition: transform 0.25s cubic-bezier(0.15, 1, 0.3, 1.1), opacity 0.25s;
        opacity: 1;
      }
    }

    &:after {
      display: block;
      content: '';
      position: absolute;
      top: -8px;
      left: -8px;
      right: -8px;
      bottom: -8px;
    }

    .delete-point {
      position: absolute;
      left: 22px;
      top: 0;
      width: 25px;
      padding-left: 5px;
      border-radius: 3px;
      background: #d3d0c9;
      transform: scale3d(0, 0, 0);
      transform-origin: left center;
      cursor: pointer;
      opacity: 0.75;
      clip-path: polygon(25% 0, 100% 1%, 100% 100%, 25% 100%, 0 50%);
      transition: transform 0.25s, opacity 0.25s;

      &:after {
        display: block;
        content: '';
        position: absolute;
        top: 4px;
        left: 9px;
        right: 4px;
        bottom: 4px;
        background: #100a09;
        clip-path: polygon(20% 10%, 10% 20%, 40% 50%, 10% 80%, 20% 90%, 50% 60%, 80% 90%, 90% 80%, 60% 50%, 90% 20%, 80% 10%, 50% 40%);
      }
    }
  }
}

.playground:hover {
  .handle {
    opacity: 1;
  }
}

.playground.customizing .handle {
  pointer-events: none;
}
</style>
