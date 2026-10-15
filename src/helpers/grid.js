/**
 * 网格吸附与对齐参考线的纯计算逻辑。
 * 所有坐标都是「页面坐标」（未缩放的 CSS px），与画布缩放无关。
 */

/** 拖动时的对齐吸附阈值（页面坐标 px） */
export const GUIDE_THRESHOLD = 6

/** 可选的网格步长 */
export const GRID_SIZES = [10, 20, 50]

/** 参考线颜色，画布与浮层共用 */
export const GUIDE_COLOR = '#ff3b7b'

/** 把数值吸附到最近的网格线 */
export function snapToGrid(value, size) {
  const step = Number(size)
  if (!step || step <= 0 || isNaN(step)) return Math.round(value)
  return Math.round(value / step) * step
}

/**
 * 由参考盒子生成对齐线：左右/上下两端与中线，共三类。
 *
 * @param {Array<{left, top, width, height}>} boxes
 * @return {{vertical: number[], horizontal: number[]}}
 */
export function guideLines(boxes) {
  const vertical = []
  const horizontal = []
  const list = boxes || []

  list.forEach(box => {
    vertical.push(box.left, box.left + box.width / 2, box.left + box.width)
    horizontal.push(box.top, box.top + box.height / 2, box.top + box.height)
  })
  return { vertical, horizontal }
}

/**
 * 计算拖动时的吸附偏移与命中的参考线。
 *
 * 规则：优先吸到相邻元件的边缘/中心线上（阈值内取最近的一条）；
 * 没有命中参考线时才退化为网格吸附。按住 Alt（disabled）时两者都关闭。
 *
 * @param {{left, top, width, height}} movingBox : 未吸附的候选位置
 * @param {{vertical: number[], horizontal: number[]}} targets : 候选对齐线
 * @param {{snap: boolean, size: number, disabled: boolean}} options
 * @return {{dx: number, dy: number, vertical: number[], horizontal: number[]}}
 */
export function resolveSnap(movingBox, targets, options) {
  const result = { dx: 0, dy: 0, vertical: [], horizontal: [] }
  if (!movingBox) return result

  const opts = options || {}
  if (!opts.snap || opts.disabled) return result

  const lines = targets || { vertical: [], horizontal: [] }
  const movingVertical = movingEdges(movingBox, 'vertical')
  const movingHorizontal = movingEdges(movingBox, 'horizontal')

  const bestV = nearestDiff(movingVertical, lines.vertical)
  const bestH = nearestDiff(movingHorizontal, lines.horizontal)

  if (bestV) {
    result.dx = bestV.diff
    result.vertical = matchedLines(lines.vertical, movingVertical, bestV.diff)
  } else {
    result.dx = snapToGrid(movingBox.left, opts.size) - movingBox.left
  }

  if (bestH) {
    result.dy = bestH.diff
    result.horizontal = matchedLines(lines.horizontal, movingHorizontal, bestH.diff)
  } else {
    result.dy = snapToGrid(movingBox.top, opts.size) - movingBox.top
  }

  return result
}

/** 盒子在某个方向上的三条边：起点、中线、终点 */
function movingEdges(box, direction) {
  return direction === 'vertical'
    ? [box.left, box.left + box.width / 2, box.left + box.width]
    : [box.top, box.top + box.height / 2, box.top + box.height]
}

function nearestDiff(edges, lines) {
  let best = null
  const list = lines || []

  list.forEach(line => {
    edges.forEach(edge => {
      const diff = line - edge
      if (
        Math.abs(diff) <= GUIDE_THRESHOLD &&
        (!best || Math.abs(diff) < Math.abs(best.diff))
      ) {
        best = { diff, line }
      }
    })
  })
  return best
}

/** 吸附后仍然重合的目标线都要画出来，用户才知道贴的是哪几条 */
function matchedLines(lines, edges, appliedDiff) {
  const list = lines || []
  return list.filter(line =>
    edges.some(edge => Math.abs(line - (edge + appliedDiff)) < 0.5)
  )
}
