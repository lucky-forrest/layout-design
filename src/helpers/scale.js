import { getNodeBoxSize } from './positionDimension'

/**
 * 页面「实际尺寸（毫米）」与像素之间的换算。
 * 页面数据里存 page.mm = { width, height }，任一方向填了就能算出比例。
 */

/** 读取页面填写的实际尺寸（毫米），未填写返回 null */
export function getPageMm(page) {
  const mm = (page && page.mm) || {}
  const width = Number(mm.width) > 0 ? Number(mm.width) : null
  const height = Number(mm.height) > 0 ? Number(mm.height) : null
  return { width, height }
}

/** 每像素代表多少毫米；未设置实际尺寸时返回 null */
export function getMmPerPx(page) {
  if (!page) return null

  const { width, height } = getPageMm(page)
  const size = getNodeBoxSize(page)

  if (width && size.width > 0) return width / size.width
  if (height && size.height > 0) return height / size.height
  return null
}

/** 像素换算成毫米（保留一位小数）；未设比例时返回 null */
export function pxToMm(px, page) {
  const ratio = getMmPerPx(page)
  if (!ratio) return null
  return Math.round(px * ratio * 10) / 10
}

/** 比例文案，例如「1 px ≈ 10 mm（1200 px = 12000 mm）」 */
export function scaleLabel(page) {
  const ratio = getMmPerPx(page)
  if (!ratio) return '未设置实际尺寸，导出清单时只给像素'

  const size = getNodeBoxSize(page)
  const rounded = Math.round(ratio * 100) / 100
  return (
    '1 px ≈ ' + rounded + ' mm（' + Math.round(size.width) + ' px = ' +
    Math.round(size.width * ratio) + ' mm）'
  )
}

/**
 * 为比例尺图例挑一个「整数毫米」长度及其像素宽度。
 *
 * @param {object} page
 * @param {number} targetPx : 期望的图例长度（px），按其换算结果向上取整毫米档位
 * @return {?{mm: number, px: number}}
 */
export function scaleBar(page, targetPx) {
  const ratio = getMmPerPx(page)
  if (!ratio) return null

  const wanted = (targetPx || 120) * ratio
  const steps = [
    1, 2, 5, 10, 20, 50, 100, 200, 500,
    1000, 2000, 5000, 10000, 20000, 50000, 100000
  ]

  let picked = steps[0]
  steps.forEach(step => {
    if (step <= wanted) picked = step
  })
  return { mm: picked, px: Math.max(20, Math.round(picked / ratio)) }
}
