/**
 * @description: 路径规划里的一个点（圆点 + 序号），支持拖动与高亮
 * @param { Number } x x坐标（元件局部坐标）
 * @param { Number } y y坐标（元件局部坐标）
 * @param { String } text 显示内容（序号）
 * @param {*} draw svg.js 实例
 * @param {{ onSelect, onDrag, onDragEnd, zoom }} options
 * @return { Point }
 */

const RADIUS = 10
const COLOR = '#ff3b7b'
const ACTIVE_COLOR = '#2b6a73'

function Point(x, y, text, draw, options) {
  const opts = options || {}
  this.index = text
  this.pointX = x
  this.pointY = y
  this.draw = draw

  // 创建小圆点
  this.point = draw
    .circle(RADIUS * 2)
    .fill(COLOR)
    .stroke({ color: '#ffffff', width: 2 })
    .move(x - RADIUS, y - RADIUS)
  this.point.attr('cursor', 'move')

  // 设置小圆点内容
  this.content = draw
    .text(`${text}`)
    .fill({ color: '#fff' })
    .font({ size: '9px' })
    .attr('pointer-events', 'none')
  this.update(`${text}`)

  this.bindDrag(opts)
}

/** 绑定拖动：按住圆点移动，松开时通知上层 */
Point.prototype.bindDrag = function(opts) {
  if (!opts.onDrag) return

  this.point.on('mousedown', e => {
    // 阻止冒泡，避免拖动坐标点时把整个元件一起拖走
    if (e.preventDefault) e.preventDefault()
    if (e.stopPropagation) e.stopPropagation()
    if (opts.onSelect) opts.onSelect(this)

    const zoom = opts.zoom && opts.zoom > 0 ? opts.zoom : 1
    const startX = e.clientX
    const startY = e.clientY
    const originX = this.pointX
    const originY = this.pointY

    const onMove = ev => {
      const nextX = originX + (ev.clientX - startX) / zoom
      const nextY = originY + (ev.clientY - startY) / zoom
      this.moveTo(nextX, nextY)
      opts.onDrag(this, nextX, nextY)
    }
    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      if (opts.onDragEnd) opts.onDragEnd(this)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  })
}

/**
 * @description: 删除小圆点及对应的文本内容
 */
Point.prototype.remove = function() {
  this.point.remove()
  this.content.remove()
}

/**
 * @description: 更新小圆点内容
 */
Point.prototype.update = function(text) {
  this.index = text
  const textX = this.pointX - (String(text).length * 5) / 2
  this.content.text(String(text)).move(textX, this.pointY - 4)
}

/** 移动到新的坐标（元件局部坐标） */
Point.prototype.moveTo = function(x, y) {
  this.pointX = x
  this.pointY = y
  this.point.move(x - RADIUS, y - RADIUS)
  this.update(this.index)
}

/** 选中态高亮 */
Point.prototype.setActive = function(active) {
  this.point.fill(active ? ACTIVE_COLOR : COLOR)
}

export default Point
