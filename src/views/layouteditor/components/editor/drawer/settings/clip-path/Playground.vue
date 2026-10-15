<template>
  <div id="playground_container" class="playground-container flex">
    <section :class="{ customizing: customizing, start: !coords.length }" class="playground" @click="addHandle">
      <div
        :style="{
          width: options.width + 20 + 'px',
          height: options.height + 20 + 'px'
        }"
        class="sandbox"
      >
        <slot />
        <div :class="{ on: options.shadowBoard }" class="shadowboard" />
        <div
          :style="[
            { 'clip-path':clipPath || clipCSS({ shape, coords, position, radius }) },
            {
              '-webkit-clip-path': clipCSS({
                shape,
                coords: shape.coords,
                position,
                radius
              })
            }
          ]"
          class="clipboard"
        />
        <handles
          :shape="shape"
          :coords="coords"
          :options="options"
          @updateHandle="updateHandle"
          @removeHandle="removeHandle"
          @setStartRadius="setStartRadius"
        />
      </div>

      <div class="custom-notice">
        <div>
          <span class="touchy" /> to add points
          <br >to custom polygon.
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { clipCSS } from './lib/utilities'
import Handles from './Handles'
export default {
  components: {
    Handles: Handles
  },
  props: {
    clipPath: {
      type: String,
      default: null
    },
    coords: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      options: {
        width: 200,
        height: 280,
        shadowBoard: false
      },
      selectedIndex: 0,
      customizing: false,
      radius: 50,
      startRadius: undefined,
      radHandle: undefined,
      position: [50, 50],
      shape: {
        name: 'Rabbet',
        coords: [[0, 15], [0, 0], [15, 0], [85, 0], [100, 0], [100, 15], [100, 85], [100, 100], [85, 100], [15, 100], [0, 100], [0, 85]]
      }
    }
  },
  methods: {
    clipCSS,
    updateHandle(payload) {
      const x = Math.round((payload.x / this.options.width) * 100)
      const y = Math.round((payload.y / this.options.height) * 100)
      this.$set(this.coords, payload.i, [x, y])
      if (this.shape.name === 'Circle') {
        if (parseInt(payload.i) === 0) {
          const radius = this.getRadius(x, this.position[0], y, this.position[1])
          this.$set(this, 'radius', parseFloat(radius))
        }
        if (parseInt(payload.i) === 1) {
          this.$set(this, 'position', [x, y])
        }
      }
      this.$emit('change', clipCSS({ shape: this.shape, coords: this.coords, position: this.position, radius: this.radius }))
    },
    addHandle(e) {
      if (this.customizing) {
        this.$emit('addHandle', e)
      }
    },
    removeHandle(i) {
      this.$emit('removeHandle', i)
    },
    setStartRadius() {
      this.$emit('setStartRadius')
    }
  }
}
</script>

<style lang="scss">
.playground-container {
  justify-content: center;
  flex: 1;
  background: #fbfcf7;
  box-shadow: 0 1px 2px rgba(16, 10, 9, 0.15);
  position: relative;
  z-index: 100;
  padding: 0.5rem;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;

  @media (min-width: 800px) {
    border-radius: 0 0 2px 2px;
  }

  .playground {
    position: relative;
    padding: 0 0 1rem;

    &.customizing {
      cursor: crosshair;
    }

    &.start {
      .custom-notice {
        opacity: 1;
      }
    }

    .custom-notice {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 1rem;
      pointer-events: none;
      opacity: 0;
      transition: background 0.25s;
      background: rgba(255, 255, 255, 0);
      div {
        width: 100%;
        text-align: center;
        background: rgba(255, 255, 255, 0.9);
        padding: 1rem;
        margin: 0 2rem;
        transition: opacity 0.25s;
        border-radius: 2px;
        box-shadow: 0 1px 2px rgba(16, 10, 9, 0.15);
        opacity: 1;

        .touchy {
          &:after {
            content: 'Click';
          }
        }
      }
    }

    .sandbox {
      position: relative;
      padding: 10px;
      box-shadow: inset 0 0 0 10px #fbfcf7, inset 0 0 0 11px #d3d0c9;
      touch-action: none;

      .clipboard,
      .shadowboard {
        position: absolute;
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        background: #d3d0c9 center center;
        background-size: cover;
      }

      .shadowboard {
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.375s;

        &.on {
          opacity: 0.25;
        }
      }
    }
  }
}
</style>
