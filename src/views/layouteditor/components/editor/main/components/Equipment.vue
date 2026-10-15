<template>
  <div
    :style="{'background-color': stateColors.backgroundColor, 'border-color': stateColors.borderColor}"
    class="view-element heartbeat">
    <div class="header">
      <span class="view-element-title off">{{ elemObj.primaryKey.replace(/\w+_/,'') }}</span>
      <span v-show="true" class="cimInfo eqpRedAlive">
        <svg-icon :icon-class="'warning'" style="cursor:pointer;" />
      </span>
      <span class="view-element-title cimInfo off">
        <svg-icon :icon-class="'cclink'" />
      </span>
      <span class="cimInfo jobCount">0</span>
    </div>
    <stage-el
      v-for="item in (elemObj.children||[])"
      :key="item.id"
      :elem="item"
      @layoutEleClickEvent="layoutEleClickEventHandler"
    />
  </div>
</template>
<script>
import StageEl from '@/views/layouteditor/components/editor/main/StageEl'
import mixins from './view-common'
export default {
  filters: {
    formatType() {
      return 'eqpRedAlive'
    }
  },
  components: { StageEl },
  mixins: [mixins],
  /* 未绑定状态键时使用的默认配色 */
  stateColorDefaults: {
    backgroundColor: '#6D6D6D'
  },
  methods: {
    layoutEleClickEventHandler($event) {
      this.$emit('layoutEleClickEvent', $event)
    }
  }
}
</script>
<style lang="scss" scoped>
.view-element {
  width: 100%;
  height: 100%;
  padding: 3px;
  cursor: pointer;
  .on,
  .off,
  .cimInfo {
    display: inline-block;
    text-align: center;
    border: 1px solid #fff;
    border-radius: 5px;
    font: normal 14px/16px arial, sans-serif;
    color: #fff;
  }
  .jobCount {
    padding:0 5px;
    background: rgb(181, 240, 88);
  }
  .on {
    background: green;
  }
  .off {
    background: red;
  }
  .view-element-title {
    padding: 0 2px;
    border-left: 1px double#fff;
    border-bottom: 1px double#fff;
  }

  @keyframes bgRedToBlue {
    0% {
      background-color: red;
    }
    100% {
      background-color: #fff;
      opacity: 0.1;
    }
  }

  @keyframes bgYellowToBlue {
    0% {
      background-color: yellow;
    }
    100% {
      background-color: #fff;
      opacity: 0.1;
    }
  }
  .eqpRedAlive {
    animation: bgRedToBlue 1s linear 1s infinite alternate;
  }
}

.heartbeat {
  animation: brRedToYellow 1s linear 1s infinite alternate;
}

@keyframes brRedToYellow {
  0% {
    box-shadow: 0 0 5px 3px red inset;
  }
  100% {
    box-shadow: 0 0 5px 3px yellow inset;
  }
}
</style>
