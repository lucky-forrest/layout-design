import { getChildNode } from './recursiveMethods'

/**
 * 元件节点的通用读取逻辑：展示名、扁平化、按 id 查找。
 * 图层树、导出清单、面包屑都从这里取口径，避免多处各写一套。
 */

/** 一行里显示的名字：优先别名，其次主键（去掉类型前缀），最后退回组件名 */
export function elementLabel(node) {
  if (!node) return ''
  const attrs = node.attrs || {}
  const primaryKey = node.primaryKey
    ? String(node.primaryKey).replace(/^\w+_/, '')
    : ''
  return attrs.nickName || primaryKey || node.name || ''
}

/** 节点的一行摘要，图层树与搜索都用它做匹配 */
export function elementKeywords(node) {
  if (!node) return ''
  const attrs = node.attrs || {}
  return [
    node.name,
    node.primaryKey,
    attrs.nickName,
    node.id
  ].filter(Boolean).join(' ')
}

/**
 * 扁平化一页里的所有元件（含容器内的子孙元件），按层级顺序返回。
 *
 * @param {object} page
 * @return {Array<{node: object, parent: ?object, depth: number}>}
 */
export function flattenPage(page) {
  const list = []
  const walk = (parent, depth) => {
    (parent.children || []).forEach(child => {
      list.push({ node: child, parent, depth })
      walk(child, depth + 1)
    })
  }
  if (page) walk(page, 0)
  return list
}

/** 按 id 查找元件；找不到返回 null */
export function findNodeById(page, id) {
  if (!page || !id) return null
  return getChildNode(page, id) || null
}

/** 统计一页（含子孙）的元件数量 */
export function countElements(page) {
  return flattenPage(page).length
}
