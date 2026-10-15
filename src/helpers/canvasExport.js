/**
 * 画布导出为图片（PNG / SVG）。
 *
 * 不克隆 DOM 到 <foreignObject>：Chrome 会把含 foreignObject 的 SVG 图片当成
 * 「污染画布」的来源，canvas.toDataURL() 直接抛 SecurityError，PNG 永远出不来。
 * 这里改成把舞台重画一遍——盒子、圆角、边框、文本、内联图标、底图、网格、路径点——
 * 生成一张纯 SVG，再栅格化成 PNG。产物干净（不夹带手柄/参考线/锁定角标），
 * 栅格化也不再被拒绝。
 */

/** 导出时要跳过的编辑态辅助元素 */
const SKIP_SELECTOR = [
  '.guide-layer',
  '.guide--v',
  '.guide--h',
  '.selection-area',
  '.selection-box',
  '.handle',
  '.lock-badge',
  '.drag-hud',
  '.link-layer__tips'
].join(',')

/** 复位单色：把 empty 视作透明 */
function solid(color) {
  if (!color || color === 'transparent') return ''
  if (color.indexOf('rgba(0, 0, 0, 0)') === 0) return ''
  return color
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function num(value) {
  return Math.round(Number(value) * 100) / 100
}

/**
 * 把舞台节点打成一张自包含 SVG。
 *
 * @param {HTMLElement} node : 舞台节点（.stage）
 * @param {{withGrid: boolean, withBackground: boolean, background: string}} options
 * @return {{svg: string, width: number, height: number}}
 */
export function buildExportSvg(node, options) {
  const opts = options || {}
  const width = Math.max(1, Math.round(node.offsetWidth))
  const height = Math.max(1, Math.round(node.offsetHeight))
  const nodeRect = node.getBoundingClientRect()
  const scale = nodeRect.width > 0 ? nodeRect.width / width : 1

  const body = []

  // 底图（dataURL，不污染画布），按导出设置决定去留
  if (opts.withBackground !== false) {
    const bgImage = node.querySelector('[data-stage-bg]')
    if (bgImage) body.push(imageMarkup(bgImage, nodeRect, scale))
  }

  if (opts.withGrid) body.push(gridMarkup(node, opts))

  const all = node.querySelectorAll('*')
  Array.prototype.forEach.call(all, el => {
    if (el.matches(SKIP_SELECTOR)) return
    if (el.closest(SKIP_SELECTOR)) return

    const tag = el.tagName.toLowerCase()
    if (tag === 'svg') {
      // 内联图标（有 viewBox）原样搬过来；棋盘格之类的辅助 svg 跳过
      const icon = iconMarkup(el, nodeRect, scale)
      if (icon) body.push(icon)
      return
    }

    const box = boxOf(el, nodeRect, scale)
    if (!box) return

    const shape = shapeMarkup(el, box)
    if (shape) body.push(shape)

    const text = textMarkup(el, nodeRect, scale)
    if (text) body.push(text)
  })

  // 空白容器（区域）补一条虚线，否则导出的图上找不到它在哪
  Array.prototype.forEach.call(node.querySelectorAll('.mr-el'), el => {
    if (el.closest(SKIP_SELECTOR)) return
    const box = boxOf(el, nodeRect, scale)
    if (!box || box.width < 40 || box.height < 40) return
    if (!isBlank(el)) return
    body.push(
      '<rect x="' + box.x + '" y="' + box.y + '" width="' + box.width +
      '" height="' + box.height +
      '" fill="none" stroke="#c8d2d4" stroke-width="1" stroke-dasharray="6 4"/>'
    )
  })

  const svg =
    '<?xml version="1.0" standalone="no"?>' +
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '">' +
    '<rect x="0" y="0" width="' + width + '" height="' + height + '" fill="' +
    escapeXml(opts.background || '#ffffff') + '"/>' +
    body.join('') +
    '</svg>'

  return { svg, width, height }
}

/**
 * 导出节点为图片。
 *
 * @param {HTMLElement} node : 舞台节点
 * @param {{scale: number, format: string, withGrid: boolean, withBackground: boolean,
 *   background: string, fileName: string}} options : format 传 'svg' 时只出矢量图
 * @return {Promise<{ok: boolean, format?: string, width?: number, height?: number, error?: string}>}
 */
export function exportNodeToPng(node, options) {
  return new Promise(resolve => {
    if (!node) {
      resolve({ ok: false, error: '画布还没准备好' })
      return
    }

    const opts = options || {}
    const fileName = opts.fileName || 'layout'

    let built
    try {
      built = buildExportSvg(node, opts)
    } catch (error) {
      resolve({ ok: false, error: '生成画布快照失败' })
      return
    }

    // 显式要矢量图时不走栅格化
    if (opts.format === 'svg') {
      downloadText(built.svg, fileName + '.svg', 'image/svg+xml;charset=utf-8')
      resolve({ ok: true, format: 'svg', width: built.width, height: built.height })
      return
    }

    const scale = opts.scale > 0 ? opts.scale : 1
    const svgUrl = URL.createObjectURL(
      new Blob([built.svg], { type: 'image/svg+xml;charset=utf-8' })
    )
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(svgUrl)
      try {
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(built.width * scale)
        canvas.height = Math.round(built.height * scale)

        const context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, canvas.width, canvas.height)

        downloadDataUrl(canvas.toDataURL('image/png'), fileName + '.png')
        resolve({
          ok: true,
          format: 'png',
          width: canvas.width,
          height: canvas.height
        })
      } catch (error) {
        // 极端情况下拿不到位图，至少把矢量图交出去
        downloadText(built.svg, fileName + '.svg', 'image/svg+xml;charset=utf-8')
        resolve({ ok: true, format: 'svg', width: built.width, height: built.height })
      }
    }
    image.onerror = () => {
      URL.revokeObjectURL(svgUrl)
      downloadText(built.svg, fileName + '.svg', 'image/svg+xml;charset=utf-8')
      resolve({ ok: true, format: 'svg', width: built.width, height: built.height })
    }
    image.src = svgUrl
  })
}

/** 元素在页面坐标系里的盒子（屏幕坐标 ÷ 缩放） */
function boxOf(el, nodeRect, scale) {
  const rect = el.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return null
  return {
    x: num((rect.left - nodeRect.left) / scale),
    y: num((rect.top - nodeRect.top) / scale),
    width: num(rect.width / scale),
    height: num(rect.height / scale)
  }
}

/** 盒子 / 圆角 / 边框：有底色或有边框才画 */
function shapeMarkup(el, box) {
  const style = window.getComputedStyle(el)
  const fill = solid(style.backgroundColor)
  const borderWidth = parseFloat(style.borderTopWidth) || 0
  const borderColor = solid(style.borderTopColor)
  const radius = parseFloat(style.borderTopLeftRadius) || 0
  const half = Math.min(box.width, box.height) / 2

  // 圆点（路径规划的控制点）：按圆形画
  if (radius >= half - 1 && half >= 2) {
    return (
      '<circle cx="' + num(box.x + box.width / 2) + '" cy="' + num(box.y + box.height / 2) +
      '" r="' + num(half) + '" fill="' + escapeXml(fill || borderColor || '#ffffff') +
      '" stroke="' + escapeXml(borderWidth > 0 ? borderColor : 'none') +
      '" stroke-width="' + num(borderWidth) + '"/>'
    )
  }

  if (!fill && borderWidth <= 0) return ''

  const opacity = parseFloat(style.opacity)
  return (
    '<rect x="' + box.x + '" y="' + box.y + '" width="' + box.width + '" height="' + box.height +
    '" fill="' + escapeXml(fill || 'none') +
    '" stroke="' + escapeXml(borderWidth > 0 ? borderColor : 'none') +
    '" stroke-width="' + num(borderWidth) +
    '" rx="' + num(radius) + '"' +
    (opacity >= 0 && opacity < 1 ? ' opacity="' + opacity + '"' : '') +
    '/>'
  )
}

/** 直接挂在元素上的文本节点，按行输出 */
function textMarkup(el, nodeRect, scale) {
  const raw = Array.prototype.filter
    .call(el.childNodes, n => n.nodeType === 3)
    .map(n => n.textContent)
    .join('')
    .trim()
  if (!raw) return ''

  const style = window.getComputedStyle(el)
  if (style.visibility === 'hidden' || style.display === 'none') return ''

  const size = parseFloat(style.fontSize) || 12
  const weight = style.fontWeight || 'normal'
  const fill = solid(style.color) || '#000000'
  const anchor = style.textAlign === 'center' ? 'middle' : 'start'

  const range = document.createRange()
  const node = Array.prototype.filter.call(el.childNodes, n => n.nodeType === 3 && n.textContent.trim())[0]
  if (!node) return ''

  const start = node.textContent.indexOf(raw.charAt(0))
  try {
    range.setStart(node, Math.max(0, start))
    range.setEnd(node, Math.max(0, start) + raw.length)
  } catch (error) {
    return ''
  }

  const rects = range.getClientRects()
  if (!rects.length) return ''
  const rect = rects[0]
  const x = (rect.left - nodeRect.left) / scale
  const y = (rect.bottom - nodeRect.top) / scale
  const centerX = anchor === 'middle' ? x + (rect.width / scale) / 2 : x

  return (
    '<text x="' + num(centerX) + '" y="' + num(y - size * 0.22) +
    '" font-size="' + num(size) +
    '" font-family="' + escapeXml(style.fontFamily || 'sans-serif') +
    '" font-weight="' + escapeXml(weight) +
    '" text-anchor="' + anchor +
    '" fill="' + escapeXml(fill) + '">' + escapeXml(raw) + '</text>'
  )
}

/** 内联图标：有 viewBox 的 svg 直接搬，按盒子缩放 */
function iconMarkup(el, nodeRect, scale) {
  const viewBox = el.getAttribute('viewBox')
  if (!viewBox) return ''
  const box = boxOf(el, nodeRect, scale)
  if (!box) return ''

  const vb = viewBox.split(/[\s,]+/).map(Number)
  if (vb.length !== 4 || !vb[2] || !vb[3]) return ''

  return (
    '<g transform="translate(' + box.x + ',' + box.y + ') scale(' +
    num(box.width / vb[2]) + ',' + num(box.height / vb[3]) + ')">' +
    el.innerHTML +
    '</g>'
  )
}

/** 底图：<img src="data:..."> 转成 <image> */
function imageMarkup(el, nodeRect, scale) {
  const src = el.getAttribute('src')
  const box = boxOf(el, nodeRect, scale)
  if (!src || !box) return ''
  const style = window.getComputedStyle(el)
  const opacity = parseFloat(style.opacity)

  return (
    '<image x="' + box.x + '" y="' + box.y + '" width="' + box.width + '" height="' + box.height +
    '" preserveAspectRatio="none" xlink:href="' + escapeXml(src) + '"' +
    (opacity >= 0 && opacity < 1 ? ' opacity="' + opacity + '"' : '') +
    '/>'
  )
}

/** 网格：小格 = 步长，大格 = 5 × 步长 */
function gridMarkup(node, opts) {
  const size = (opts.gridSize > 0 ? opts.gridSize : 20)
  const width = Math.round(node.offsetWidth)
  const height = Math.round(node.offsetHeight)
  const lines = []

  for (let x = size; x < width; x += size) {
    const major = x % (size * 5) === 0
    lines.push(
      '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + height +
      '" stroke="rgba(43,106,115,' + (major ? 0.2 : 0.08) + ')" stroke-width="1"/>'
    )
  }
  for (let y = size; y < height; y += size) {
    const major = y % (size * 5) === 0
    lines.push(
      '<line x1="0" y1="' + y + '" x2="' + width + '" y2="' + y +
      '" stroke="rgba(43,106,115,' + (major ? 0.2 : 0.08) + ')" stroke-width="1"/>'
    )
  }
  return lines.join('')
}

/** 这个元件是不是「什么都没有」的空盒子 */
function isBlank(el) {
  if (!el.offsetWidth || !el.offsetHeight) return false
  const nodes = el.querySelectorAll('.view-element, .view-element *')
  let painted = false

  Array.prototype.forEach.call(nodes, node => {
    if (painted) return
    const style = window.getComputedStyle(node)
    if (solid(style.backgroundColor)) painted = true
    if (parseFloat(style.borderTopWidth) > 0) painted = true
    if (node.textContent.trim()) painted = true
  })
  return !painted
}

function downloadDataUrl(dataUrl, fileName) {
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function downloadText(text, fileName, mime) {
  const blob = new Blob([text], { type: mime })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}
