export default{
  props: {
    primaryKey: {
      type: String,
      default: ''
    },
    parentKey: {
      type: String,
      default: ''
    },
    viewType: {
      type: String,
      default: 'container'
    },
    elemObj: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
