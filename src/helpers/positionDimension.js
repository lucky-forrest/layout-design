/**
 * Fixes the properties (top, left, height, width) of an element,
 * based on the parent container
 *
 * @param {object} element : The element to which fix its props
 * @param {object} parent : Parent element of the 'element'
 * @return {object} : Object with clean/fixed top, left, height, width properties for the element
 */
export function fixElementToParentBounds(element, parent) {
  const parentH = getComputedProp('height', parent)
  const parentW = getComputedProp('width', parent)
  let height = getComputedProp('height', element, parent)
  let width = getComputedProp('width', element, parent)
  let top = element.top
  let left = element.left

  // Checks if position + size gets out-of-bounds (TOO FAR), if so, reposition...
  if ((top + height) > parentH) {
    top -= (top + height) - parentH
  }
  if ((left + width) > parentW) {
    left -= (left + width) - parentW
  }

  // Checks if position is out-of-bounds (NEGATIVE), if so reposition...
  if (top <= 0) top = 0
  if (left <= 0) left = 0

  // Checks if, with a 0 position, the element is still out-of-bounds (TOO BIG), if so, resize
  if (top === 0 && (height > parentH)) height = parentH
  if (left === 0 && (width > parentW)) width = parentW

  return { left, top, height, width }
}

/**
 * Calculates the computed prop of an element,
 * based on its own props and the parent props.
 *
 * (Specially created to deal with percentage dimensions)
 *
 * @param {object} element : The element to get the dimension for
 * @param {object} parent : The parent element of the 'element'
 * @param {string} prop : Property for which to extract the dimension (height/width)
 * @return {number} : The real dimension for the element (height/width)
 */
export function getComputedProp(prop, element, parent) {
  if (prop === 'left' || prop === 'right' || prop === 'top' || prop === 'bottom') {
    return parseInt(getComputedStyle(document.getElementById(element.id).parentNode)[prop])
  } else {
    return (
      (!parent)
        ? parseInt(getComputedStyle(document.getElementById(element.id))[prop])
        : (typeof element[prop] !== 'string')
          ? element[prop]
          : (typeof parent[prop] !== 'string')
            ? parent[prop] * parseInt(element[prop]) / 100
            : parseInt(getComputedStyle(document.getElementById(parent.id))[prop]) * parseInt(element[prop]) / 100
    )
  }
}

/**
 * 解析节点某个尺寸/坐标属性的数值。
 * 支持数字、'120px'、'100%' 三种写法（'%' 依据父级尺寸换算），'auto' 一律按 0 处理。
 *
 * @param {*} value : 待解析的属性值
 * @param {number} parentSize : 父级对应方向的尺寸，用于换算百分比
 * @return {number}
 */
export function parseNumericProp(value, parentSize) {
  if (typeof value === 'number') return value
  if (typeof value !== 'string') return 0
  if (value.indexOf('%') !== -1) {
    return Math.round((Number(parentSize) || 0) * parseFloat(value) / 100) || 0
  }
  const parsed = parseFloat(value)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * 取得节点在页面坐标系中的实际尺寸。
 * 已渲染的节点优先读取 DOM 布局尺寸（不受画布缩放影响），
 * 未渲染（如刚拖出、尚未挂载）时退回按属性换算。
 *
 * @param {object} node : 页面或元件节点
 * @param {?{width: number, height: number}} parentSize : 父级尺寸，用于换算百分比
 * @return {{width: number, height: number}}
 */
export function getNodeBoxSize(node, parentSize) {
  if (!node) return { width: 0, height: 0 }
  const dom = document.getElementById(node.id)
  if (dom && dom.offsetWidth) {
    return { width: dom.offsetWidth, height: dom.offsetHeight }
  }
  const available = parentSize || { width: 1200, height: 800 }
  return {
    width: parseNumericProp(node.width, available.width),
    height: parseNumericProp(node.height, available.height)
  }
}

/**
 * 取得元件（含任意层级父级偏移）在页面坐标系中的盒子。
 * 元件的 DOM 节点由 MrEl 包装层包裹，逐级向上累加包装层的位置即可还原绝对位置。
 *
 * @param {string} elementId : 元件 id
 * @return {?{left: number, top: number, width: number, height: number}}
 */
export function getAbsoluteBox(elementId) {
  const node = document.getElementById(elementId)
  if (!node) return null

  let left = 0
  let top = 0
  let current = node.parentNode
  let depth = 0

  // 中间层级（容器内容节点等）都落在其父级原点上，只有 MrEl 包装层贡献位移
  while (current && current !== document.body && depth < 40) {
    if (current.dataset && current.dataset.mrEl) {
      const style = window.getComputedStyle(current)
      left += parseFloat(style.left) || 0
      top += parseFloat(style.top) || 0
    }
    current = current.parentNode
    depth++
  }

  return {
    left,
    top,
    width: node.offsetWidth,
    height: node.offsetHeight
  }
}

const SLOT_STEP = 20
const SLOT_GAP = 8

/**
 * 为「点击新增」的元件寻找一个不与已有元件重叠的落点。
 * 以期望中心点为起点，按距离由近到远扫描页面网格，
 * 取第一个空闲格子；页面已排满时退回中心点，由调用方做边界收敛。
 *
 * @param {object} element : 待放置的元件（读其 width/height）
 * @param {object} page : 目标页面（读其尺寸与已有 children）
 * @param {?{left: number, top: number}} anchor : 期望的元件中心点（页面坐标系）
 * @return {{left: number, top: number, free: boolean}} : free 为 false 表示页面已无空位，退回中心点
 */
export function findFreeSlot(element, page, anchor) {
  const pageSize = getNodeBoxSize(page)
  const elementWidth = parseNumericProp(element.width, pageSize.width)
  const elementHeight = parseNumericProp(element.height, pageSize.height)

  const occupied = (page.children || []).map(child => {
    const childSize = getNodeBoxSize(child, pageSize)
    const left = parseNumericProp(child.left, pageSize.width)
    const top = parseNumericProp(child.top, pageSize.height)
    return {
      left,
      top,
      right: left + childSize.width,
      bottom: top + childSize.height
    }
  })

  const isOverlap = (left, top) => occupied.some(item =>
    left < item.right + SLOT_GAP &&
    left + elementWidth + SLOT_GAP > item.left &&
    top < item.bottom + SLOT_GAP &&
    top + elementHeight + SLOT_GAP > item.top
  )

  const maxLeft = Math.max(0, pageSize.width - elementWidth)
  const maxTop = Math.max(0, pageSize.height - elementHeight)
  const startLeft = Math.min(maxLeft, Math.max(0, Math.round(
    (anchor && anchor.left ? anchor.left : elementWidth / 2 + SLOT_GAP) - elementWidth / 2
  )))
  const startTop = Math.min(maxTop, Math.max(0, Math.round(
    (anchor && anchor.top ? anchor.top : elementHeight / 2 + SLOT_GAP) - elementHeight / 2
  )))

  const candidates = []
  for (let top = 0; top <= maxTop; top += SLOT_STEP) {
    for (let left = 0; left <= maxLeft; left += SLOT_STEP) {
      candidates.push({
        left,
        top,
        distance: Math.abs(left - startLeft) + Math.abs(top - startTop)
      })
    }
  }
  candidates.sort((a, b) => a.distance - b.distance)

  const slot = candidates.find(item => !isOverlap(item.left, item.top))
  return slot
    ? { left: slot.left, top: slot.top, free: true }
    : { left: startLeft, top: startTop, free: false }
}
