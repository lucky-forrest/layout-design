/**
 * 对齐 / 分布 / 统一尺寸的纯计算逻辑。
 * 只处理盒子（{left, top, width, height}），不依赖 Vue 与 DOM，便于单独验证。
 */

/** 支持的六种对齐方式 */
export const ALIGN_MODES = ['left', 'hcenter', 'right', 'top', 'vcenter', 'bottom']

/** 对齐方式中文名，供界面提示使用 */
export const ALIGN_LABELS = {
  left: '左对齐',
  hcenter: '水平居中',
  right: '右对齐',
  top: '顶对齐',
  vcenter: '垂直居中',
  bottom: '底对齐'
}

/** 取盒子的四条边与两条中心线 */
export function boxEdges(box) {
  return {
    left: box.left,
    right: box.left + box.width,
    hcenter: box.left + box.width / 2,
    top: box.top,
    bottom: box.top + box.height,
    vcenter: box.top + box.height / 2
  }
}

/** 一组盒子的外接矩形，空集合返回 null */
export function unionBox(boxes) {
  const list = (boxes || []).filter(box => !!box)
  if (!list.length) return null

  const left = Math.min.apply(null, list.map(box => box.left))
  const top = Math.min.apply(null, list.map(box => box.top))
  const right = Math.max.apply(null, list.map(box => box.left + box.width))
  const bottom = Math.max.apply(null, list.map(box => box.top + box.height))
  return { left, top, width: right - left, height: bottom - top }
}

/**
 * 对齐：返回每个盒子对齐后的新绝对坐标，顺序与入参一致
 *
 * @param {Array<{left, top, width, height}>} boxes
 * @param {string} mode : ALIGN_MODES 之一
 * @param {{left, top, width, height}} refBox : 对齐基准（选区外接矩形或画布）
 * @return {Array<{left: number, top: number}>}
 */
export function alignBoxes(boxes, mode, refBox) {
  const list = boxes || []
  if (!list.length || !refBox) return []

  const ref = boxEdges(refBox)
  return list.map(box => {
    switch (mode) {
      case 'left':
        return { left: Math.round(ref.left), top: box.top }
      case 'hcenter':
        return { left: Math.round(ref.hcenter - box.width / 2), top: box.top }
      case 'right':
        return { left: Math.round(ref.right - box.width), top: box.top }
      case 'top':
        return { left: box.left, top: Math.round(ref.top) }
      case 'vcenter':
        return { left: box.left, top: Math.round(ref.vcenter - box.height / 2) }
      case 'bottom':
        return { left: box.left, top: Math.round(ref.bottom - box.height) }
      default:
        return { left: box.left, top: box.top }
    }
  })
}

/**
 * 等距分布：首尾保持不动，中间盒子按「等间隙」铺开。
 * 用等间隙而不是等中心距，元件尺寸不一致时才不会看起来挤在一起。
 *
 * @param {Array<{left, top, width, height}>} boxes
 * @param {string} axis : 'x' | 'y'
 * @return {?Array<{left: number, top: number}>} : 数量不足 3 或空间不足时返回 null
 */
export function distributeBoxes(boxes, axis) {
  const list = boxes || []
  if (list.length < 3) return null

  const horizontal = axis !== 'y'
  const ordered = list
    .map((box, index) => ({ box, index }))
    .sort((a, b) => (horizontal ? a.box.left - b.box.left : a.box.top - b.box.top))

  const first = ordered[0].box
  const last = ordered[ordered.length - 1].box
  const start = horizontal ? first.left : first.top
  const end = horizontal ? last.left + last.width : last.top + last.height
  const occupied = ordered.reduce(
    (sum, item) => sum + (horizontal ? item.box.width : item.box.height),
    0
  )
  const gap = (end - start - occupied) / (list.length - 1)
  if (gap < 0) return null

  const result = list.map(box => ({ left: box.left, top: box.top }))
  let cursor = start
  ordered.forEach(item => {
    result[item.index] = horizontal
      ? { left: Math.round(cursor), top: item.box.top }
      : { left: item.box.left, top: Math.round(cursor) }
    cursor += (horizontal ? item.box.width : item.box.height) + gap
  })
  return result
}

/**
 * 统一尺寸：以第一个盒子为基准，返回目标尺寸（px）
 *
 * @param {Array<{width, height}>} boxes
 * @param {string} prop : 'width' | 'height'
 * @return {?number}
 */
export function equalizeSize(boxes, prop) {
  const list = boxes || []
  if (list.length < 2) return null

  const size = prop === 'height' ? list[0].height : list[0].width
  return size > 0 ? Math.round(size) : null
}
