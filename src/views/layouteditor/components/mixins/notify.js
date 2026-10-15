/**
 * 统一操作反馈入口。
 *
 * 业务组件只需调用 notifySuccess / notifyError / notifyWarning / notifyInfo，
 * 由 Editor 统一渲染为 Element UI 提示，
 * 避免每个组件各写一套提示，也避免操作后毫无反馈。
 */
export const TOAST_EVENT = 'toast'

export default {
  methods: {
    notifySuccess(message) {
      this.$root.$emit(TOAST_EVENT, { type: 'success', message })
    },
    notifyWarning(message) {
      this.$root.$emit(TOAST_EVENT, { type: 'warning', message })
    },
    notifyInfo(message) {
      this.$root.$emit(TOAST_EVENT, { type: 'info', message })
    },
    notifyError(message) {
      this.$root.$emit(TOAST_EVENT, { type: 'error', message, duration: 4500 })
    }
  }
}
