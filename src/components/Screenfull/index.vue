<template>
  <div>
    <svg
      t="1516955519582"
      class="screenfull-svg"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="22895"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="32"
      height="32"
      @click="click">
      <path d="M396.8 228.22912v-25.6H204.8v192h25.6V246.32832l182.18496 182.19008 18.10432-18.0992-182.19008-182.19008zM627.2 202.62912v25.6h148.3008L593.31072 410.4192l18.0992 18.0992L793.6 246.32832v148.3008h25.6v-192zM412.58496 591.13984L230.4 773.32992v-148.3008h-25.6v192h192v-25.6H248.4992l182.19008-182.19008zM793.6 773.32992l-182.19008-182.19008-18.0992 18.0992 182.19008 182.19008H627.2v25.6H819.2v-192h-25.6z" fill="#1C2021" p-id="22896"/>
    </svg>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  props: {
    width: {
      type: Number,
      default: 22
    },
    height: {
      type: Number,
      default: 22
    },
    fill: {
      type: String,
      default: '#48576a'
    }
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>

<style scoped>
.screenfull-svg {
	display: inline-block;
	cursor: pointer;
	fill: #5a5e66;
	width: 28px;
	height: 28px;
  vertical-align: -8px;
}
</style>
