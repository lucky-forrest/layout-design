import FileSaver from 'file-saver'

export const JsonFile = (data, fileName = 'data-template.json') => {
  FileSaver.saveAs(new Blob([JSON.stringify(data, null, 4)], { type: '' }), fileName)
}

export const download = (url) => {
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none' // 防止影响页面
  iframe.style.height = 0 // 防止影响页面
  iframe.src = `http://${window.config.serverIp}/${url}`
  document.body.appendChild(iframe) // 这一行必须，iframe挂在到dom树上才会发请求
  // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
  setTimeout(() => {
    iframe.remove()
  }, 5 * 60 * 1000)
}
