<template>
  <div class="view-element">
    <template v-if="elemObj.attrs.col">
      <div
        v-for="item in (parseInt(elemObj.attrs.row)*parseInt(elemObj.attrs.col))"
        :style="getItemStyle(item,elemObj.attrs)"
        :key="item"
        class="cell" />
    </template>
  </div>
</template>

<script>
import mixins from './view-common'
export default {
  mixins: [mixins],
  methods: {
    getItemStyle(item, { col, row } = {}) {
      return {
        'width': `${100 / col}%`,
        'border-right': item % col === 0 ? 'none' : '1px solid black',
        'border-bottom': item > parseInt(row - 1) * parseInt(col) ? 'none' : '1px solid black'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.view-element {
  display: flex;
  justify-content: center;
  flex-flow: row wrap;
  border: 1px solid #000 !important;
  .cell {
    margin: 0;
    width: 15%;
    padding: 1px;
    box-sizing: border-box;
    background: #fff;
  }
}
</style>
