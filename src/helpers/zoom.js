/**
 * 画布缩放口径的唯一来源。
 * 缩放上下限、步进与收敛函数集中在此，
 * 供缩放控件、resize mixin 与 store 复用，避免多处硬编码产生漂移。
 */
export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 4
export const ZOOM_STEP = 1.25

/**
 * 把任意输入收敛为合法的缩放值
 * @param {number|string} zoom
 * @return {number} 收敛后的缩放值（保留 3 位小数）
 */
export function clampZoom(zoom) {
  const value = Number(zoom)
  if (!value || isNaN(value)) return 1
  const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
  return Math.round(clamped * 1000) / 1000
}
