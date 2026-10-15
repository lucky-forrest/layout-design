
export default {
  props: {
    data: {
      type: Object
    }
  },
  computed: {
    label() {
      return this.data.name
    },
    type() {
      return this.data.type
    },
    points() {
      return Number.parseInt(this.data.points, 10)
    }
  },
  watch: {
    'data': {
      deep: true,
      handler: function(newVal) {
        if (!newVal) return
      }
    }
  }
}
