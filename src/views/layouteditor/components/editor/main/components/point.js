/**
 * @description: 创建一个圆点
 * @param { Number } x x坐标
 * @param { Number } y y坐标
 * @param { String } text 显示内容
 * @param {*} draw
 * @return { Point }
 */
function Point(x, y, text, draw) {
  const circleW = 20
  const circleX = x - circleW / 2
  const circleY = y - circleW / 2
  this.index = text
  this.pointX = x
  this.pointY = y
  // 创建小圆点
  this.point = draw.circle(circleW).fill('deeppink').move(circleX, circleY)
  // 设置小圆点内容
  const textX = x - (this.index.length * 5) / 2
  this.content = draw.text(this.index).move(textX, y).fill({ color: '#fff' }).font({ size: '9px' })
}

/**
 * @description: 删除小圆点及对应的文本内容
 * @param {*}
 * @return {*}
 */
Point.prototype.remove = function() {
  this.point.remove()
  this.content.remove()
}

/**
 * @description: 更新小圆点内容
 * @param {*}
 * @return {*}
 */
Point.prototype.update = function(text) {
  // 设置小圆点内容
  const textX = this.pointX - (text.length * 5) / 2
  this.content.text(text).move(textX, this.pointY - 4)
}

export default Point
