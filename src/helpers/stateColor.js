/**
 * 状态色绑定与「模拟状态预览」。
 *
 * 元件属性里的 bgColor / borderColor 存的是**绑定键**（如 currentStatus），
 * 现场数据接入后由数据决定颜色。编辑期没有实时数据，这里给出一套模拟状态配色，
 * 让设计者能直接在画布上看到正常 / 报警 / 离线三种状态下的样子。
 */

/** 可在画布上模拟的状态 */
export const PREVIEW_STATES = [
  { value: 'normal', label: '正常' },
  { value: 'alarm', label: '报警' },
  { value: 'offline', label: '离线' }
]

/**
 * 绑定键 × 状态 → 颜色。
 * 未登记的绑定键（例如编号类 unitNo / portNo）不参与变色，回落到元件自身配色。
 */
const BINDING_COLORS = {
  alive: { normal: '#3e9a54', alarm: '#c24648', offline: '#9aa3a3' },
  currentStatus: { normal: '#6d6d6d', alarm: '#c24648', offline: '#9aa3a3' },
  // 历史拼写（Unit 用的是 currentStauts），一并兼容
  currentStauts: { normal: '#6d6d6d', alarm: '#c24648', offline: '#9aa3a3' },
  portStatus: { normal: '#c24648', alarm: '#f0a020', offline: '#9aa3a3' }
}

/**
 * 取某个绑定键在某个状态下的颜色。
 *
 * @param {string} bindKey : 绑定键，空值表示没绑定
 * @param {string} state : normal / alarm / offline
 * @param {string} fallback : 没绑定时使用的元件默认色
 */
export function stateColor(bindKey, state, fallback) {
  if (!bindKey) return fallback
  const map = BINDING_COLORS[bindKey]
  if (!map) return fallback
  return map[state || 'normal'] || fallback
}

/**
 * 元件最终生效的底色与边框色。
 *
 * @param {object} attrs : 元件属性（含 bgColor / borderColor 绑定键）
 * @param {string} state : 当前预览状态
 * @param {{backgroundColor: string, borderColor: string}} defaults : 元件默认配色
 */
export function elementStateColors(attrs, state, defaults) {
  const base = defaults || {}
  const source = attrs || {}

  return {
    backgroundColor: stateColor(source.bgColor, state, base.backgroundColor),
    borderColor: stateColor(source.borderColor, state, base.borderColor)
  }
}
