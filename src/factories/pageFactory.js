import shortid from 'shortid'

function newPage({ name, path, width = '100%', height = '100' }) {
  return {
    id: shortid.generate(),
    name,
    path,
    width,
    height,
    styles: {
      '--theme-primary': '#673ab7',
      '--theme-secondary': '#f44336',
      '--theme-background': '#ffffff',
      'position': 'relative',
      'margin': 'auto',
      'background-color': '#ffffff',
      'overflow': 'hidden'
    },
    attrs: {
      Equipment: window.config.equipment || [],
      Port: window.config.port || [],
      Unit: window.config.unit || []
    },
    /** 页面实际尺寸（毫米）：填了才给比例尺与毫米坐标 */
    mm: {
      width: null,
      height: null
    },
    /** 元件之间的连线关系 */
    links: [],
    classes: [],
    children: []
  }
}

export default newPage
