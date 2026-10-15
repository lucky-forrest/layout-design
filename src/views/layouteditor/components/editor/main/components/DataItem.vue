<template>
  <div class="view-element">
    <template v-if="elemObj.attrs.col">
      <div class="custom-header">
        {{ elemObj.primaryKey }}
      </div>
      <div class="custom-body">
        <div
          v-for="item in parseInt(elemObj.attrs.row) *
          parseInt(elemObj.attrs.col)"
          :style="{ width: `${100 / parseInt(elemObj.attrs.col)}%` }"
          :key="item"
          class="cell"
        >
          col1 col1 col1 col1 col1 col1 col1
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import mixins from './view-common'
export default {
  mixins: [mixins]
}
</script>
<style lang="scss" scoped>
.view-element {
  height:100%;
  .custom-header {
    width:100%;
    height:25px;
    line-height:25px;
    padding-left:5px;
    color:#666;
    border-bottom: 1px solid #e3e3e3;
    background-color: #e3e3e3;
  }
  .custom-body {
    padding:5px;
    height: calc(100% - 30px);
    display: flex;
    justify-content: center;
    flex-flow: row wrap;
    .cell {
      padding:0 5px;
      border: 1px solid #e3e3e3;
      &:hover{
        background: #f8f8f8;
      }
    }
  }
}
</style>
