<template>
  <div class="progress-outer">
    <div :class="{'progress-striped active': animate}" class="progress">
      <div
        :class="type && 'progress-bar-' + type"
        :aria-valuenow="value"
        :aria-valuemin="0"
        :aria-valuemax="max"
        :style="{width: (percent < 100 ? percent : 100) + '%'}"
        class="progress-bar"
        role="progressbar"/>
    </div>
    <span class="progress-text">{{ valueText }}</span>
  </div>
</template>
<script>
// 进度条组件
// 类型，利用type变量控制，例如有warning，danger，success，info
// 是否是动态，利用animate变量控制,默认false
// 当前值，利用value变量控制；
// 最大值，利用max变量控制；
// 百分比，利用percent变量控制，这是通过value与max值计算出来的，为Vue的一个计算属性；
// 显示的百分比值，利用valueText值控制，为Vue的一个计算属性
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      default: 100
    },
    type: {
      type: String,
      default: ''
    },
    animate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    percent() {
      return parseInt(this.value * 100 / this.max, 10)
    },
    valueText() {
      return this.percent + '%'
    }
  }
}
</script>
<style>
  .progress-outer {
    padding-bottom: 0px;
  }
  .progress {
    height: 10px;
    width: 90%;
    margin-bottom: 10px;
    float: left;
    overflow: hidden;
    background-color: #f5f5f5;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
    box-shadow: inset 0 1px 2px rgba(0,0,0,.1);
  }

  .progress-bar {
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #337ab7;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 -1px 0px rgba(0,0,0,.15);
    box-shadow: inset 0 -1px 0px rgba(0,0,0,.15);
    -webkit-transition: width .6s ease;
    -o-transition: width .6s ease;
    transition: width .6s ease;
  }

  .progress-bar-info {
    background-color: #5bc0de;
  }
  .progress-bar-success {
    background-color: #5cb85c;
  }
  .progress-bar-danger {
    background-color: #d9534f;
  }
  .progress-bar-warning {
    background-color: #f0ad4e;
  }

  .progress.active .progress-bar {
    -webkit-animation: progress-bar-stripse 2s linear infinite;
    -o-animation: progress-bar-stripse 2s linear infinite;
    animation: progress-bar-stripse 2s linear infinite;
  }
  @keyframes progress-bar-stripse {
    0% {
      background-position: 40px 0;
    }
    100% {
      background-position: 0 0;
    }
  }

  .progress-striped .progress-bar {
    background-image: -webkit-linear-gradient(45deg, rgba(255,255,255,.15) 25%,
                      transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%,
                      rgba(255,255,255,.15) 75%,transparent 75%, transparent);
    background-image: -o-linear-gradient(45deg, rgba(255,255,255,.15) 25%,
                      transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%,
                      rgba(255,255,255,.15) 75%,transparent 75%, transparent);
    background-image: linear-gradient(45deg, rgba(255,255,255,.15) 25%,
                      transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%,
                      rgba(255,255,255,.15) 75%,transparent 75%, transparent);
    -webkit-background-size: 40px 40px;
    background-size: 40px 40px;
  }

  .progress-text {
    display:inline-block;
    font-size: 18px;
    font-weight:bold;
    margin-left: 10px;
  }
</style>
