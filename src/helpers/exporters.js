import { getAbsoluteBox, getNodeBoxSize, parseNumericProp } from './positionDimension'
import { pxToMm } from './scale'
import { elementLabel, flattenPage } from './nodeInfo'

/**
 * 设备清单（CSV）与其它交付物共用的取数逻辑。
 * 坐标一律取「页面坐标」的绝对值，容器内元件累加父级偏移。
 */

/** 设备清单表头 */
export const ELEMENT_EXPORT_HEADER = [
  '所属页面',
  '主键',
  '元件类型',
  '别名',
  '所属容器',
  'X(px)',
  'Y(px)',
  '宽(px)',
  '高(px)',
  'X(mm)',
  'Y(mm)',
  '宽(mm)',
  '高(mm)',
  '背景色绑定',
  '边框色绑定',
  '锁定',
  '编辑态隐藏'
]

/** 取得元件在页面坐标系中的盒子；未挂载时按属性换算 */
export function getElementBox(node, page) {
  const box = getAbsoluteBox(node.id)
  if (box && box.width > 0 && box.height > 0) return box

  const size = getNodeBoxSize(page)
  const fallback = {
    left: parseNumericProp(node.left, size.width),
    top: parseNumericProp(node.top, size.height),
    width: parseNumericProp(node.width, size.width),
    height: parseNumericProp(node.height, size.height)
  }

  // 编辑态隐藏的元件在 DOM 上量不到尺寸，用量出来的位置 + 模型尺寸补齐
  if (box) {
    return {
      left: box.left,
      top: box.top,
      width: box.width > 0 ? box.width : fallback.width,
      height: box.height > 0 ? box.height : fallback.height
    }
  }
  return fallback
}

/**
 * 生成一行清单数据。
 *
 * @param {object} node : 元件节点
 * @param {object} page : 元件所属页面（用于 mm 换算与页面名）
 * @param {?object} parent : 直接父级（用于「所属容器」列）
 * @return {Array<string|number>}
 */
export function buildElementRow(node, page, parent) {
  const attrs = node.attrs || {}
  const box = getElementBox(node, page)
  const parentLabel = parent && parent.id !== page.id ? elementLabel(parent) : ''

  return [
    page.name,
    node.primaryKey || '',
    node.name || '',
    attrs.nickName || '',
    parentLabel,
    Math.round(box.left),
    Math.round(box.top),
    Math.round(box.width),
    Math.round(box.height),
    pxToMm(box.left, page),
    pxToMm(box.top, page),
    pxToMm(box.width, page),
    pxToMm(box.height, page),
    attrs.bgColor || '',
    attrs.borderColor || '',
    node.locked ? '是' : '',
    attrs.hidden ? '是' : ''
  ]
}

/**
 * 收集导出所需的表格：表头 + 数据行。
 *
 * @param {Array<object>} pages : 参与导出的页面
 * @param {?Array<string>} onlyIds : 只导出这些元件 id（为空表示整页导出）
 * @return {Array<Array<string|number>>}
 */
export function buildElementTable(pages, onlyIds) {
  const filter = (onlyIds && onlyIds.length) ? onlyIds : null
  const rows = [ELEMENT_EXPORT_HEADER]

  ;(pages || []).forEach(page => {
    flattenPage(page).forEach(entry => {
      if (filter && filter.indexOf(entry.node.id) === -1) return
      rows.push(buildElementRow(entry.node, page, entry.parent))
    })
  })
  return rows
}

/** CSV 字段转义：含逗号、引号、换行时加引号并转义内部引号 */
export function csvCell(value) {
  const text = (value === null || value === undefined) ? '' : String(value)
  if (/[",\n\r]/.test(text)) return '"' + text.replace(/"/g, '""') + '"'
  return text
}

/** 二维数组转 CSV 文本 */
export function toCSV(rows) {
  return (rows || []).map(row => row.map(csvCell).join(',')).join('\r\n')
}

/** 连线关系表表头 */
export const LINK_EXPORT_HEADER = [
  '所属页面',
  '序号',
  '起点主键',
  '起点类型',
  '起点别名',
  '终点主键',
  '终点类型',
  '终点别名',
  '说明'
]

/**
 * 收集连线关系。端点元件已被删除的连线会自动跳过。
 *
 * @param {Array<object>} pages : 参与导出的页面
 * @return {Array<Array<string|number>>}
 */
export function buildLinkTable(pages) {
  const rows = [LINK_EXPORT_HEADER]

  ;(pages || []).forEach(page => {
    const index = {}
    flattenPage(page).forEach(entry => {
      index[entry.node.id] = entry.node
    })

    ;(page.links || []).forEach((link, order) => {
      const from = index[link.from]
      const to = index[link.to]
      if (!from || !to) return

      rows.push([
        page.name,
        order + 1,
        from.primaryKey || '',
        from.name || '',
        (from.attrs && from.attrs.nickName) || '',
        to.primaryKey || '',
        to.name || '',
        (to.attrs && to.attrs.nickName) || '',
        link.label || ''
      ])
    })
  })

  return rows
}
