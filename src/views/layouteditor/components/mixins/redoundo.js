import cloneDeep from 'clone-deep'
import { checkLastSaved, _toggleCanUndo, _toggleCanRedo } from '@/store/types'

const MAX_HISTORY = 250

/** 同一目标上的连续修改在该时间窗内合并为一步撤销（毫秒） */
const MERGE_WINDOW = 500

/**
 * 计算一次改动的影响目标，用于判断能否与上一步合并。
 * 只有「同一个元件/页面的同一组字段」的连续修改才合并，
 * 避免把两次无关操作压成一步撤销。
 *
 * @param {object} mutation : Vuex mutation
 * @return {?string}
 */
function mutationTarget(mutation) {
  const payload = mutation.payload
  if (!payload || typeof payload !== 'object') return null

  const target = payload.element || payload.page
  if (!target || !target.id) return null

  const fields = Object.keys(payload)
    .filter(key => key !== 'element' && key !== 'page')
    .sort()
    .join('|')

  return mutation.type + ':' + target.id + ':' + fields
}

/**
 * Vue Mixin to control the State history and undo/redo functionality
 *
 * @type {Vue.mixin}
 * @see {@link https://vuejs.org/v2/guide/mixins.html|Vue Mixins}
 */
const redoundo = {
  data: function() {
    return {
      done: [],
      undone: []
    }
  },

  created: function() {
    // 非响应式的合并状态，只服务于「连续输入合并为一步撤销」
    this.lastMergeTarget = null
    this.lastMergeTime = 0

    this.$store.subscribe((mutation, state) => {
      // It won't save the state of mutations leaded by '_'
      if (mutation.type.charAt(0) === '_') return

      const target = mutationTarget(mutation)
      const now = Date.now()
      const canMerge =
        !!target &&
        target === this.lastMergeTarget &&
        (now - this.lastMergeTime) < MERGE_WINDOW &&
        this.done.length > 0

      if (canMerge) {
        // 同一次连续编辑：覆盖最后一条历史，而不是新增一步
        this.done.splice(this.done.length - 1, 1, cloneDeep(state))
      } else {
        // If the history size is reached, the eldest state will be removed
        if (this.done.length === MAX_HISTORY) this.done.shift()
        this.done.push(cloneDeep(state))
      }

      this.lastMergeTarget = target
      this.lastMergeTime = now
      this.undone = []

      // To display if changes had happened to the project
      this.updateCanRedoUndo()
      this.$store.dispatch(checkLastSaved)
    })

    this.$root.$on('undo', this.undo)
    this.$root.$on('redo', this.redo)
  },

  beforeDestroy: function() {
    this.$root.$off('undo', this.undo)
    this.$root.$off('redo', this.redo)
  },

  computed: {
    canUndo() {
    // There should always be at least one state (initializeState)
      return this.done.length > 1
    },
    canRedo() {
      return this.undone.length > 0
    }
  },

  methods: {
    undo() {
      if (this.canUndo) {
        this.undone.push(this.done.pop())
        const undoState = this.done[this.done.length - 1]
        this.$store.replaceState(cloneDeep(undoState))
        this.$root.$emit('rebaseState')
        this.updateCanRedoUndo()
        this.resetMergeState()
      }
    },

    redo() {
      if (this.canRedo) {
        const redoState = this.undone.pop()
        this.done.push(redoState)
        this.$store.replaceState(cloneDeep(redoState))
        this.$root.$emit('rebaseState')
        this.updateCanRedoUndo()
        this.resetMergeState()
      }
    },

    updateCanRedoUndo() {
      this.$store.commit(_toggleCanUndo, this.canUndo)
      this.$store.commit(_toggleCanRedo, this.canRedo)
    },

    resetMergeState() {
      this.lastMergeTarget = null
      this.lastMergeTime = 0
    }
  }
}

export default redoundo
