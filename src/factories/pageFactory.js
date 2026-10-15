import shortid from 'shortid'

function newPage({ name, path, width = '100%', height = '100' }) {
  return {
    id: shortid.generate(),
    name,
    path,
    width,
    height,
    styles: {
      '--mdc-theme-primary': '#673ab7',
      '--mdc-theme-secondary': '#f44336',
      '--mdc-theme-background': '#ffffff',
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
    classes: [],
    children: []
  }
}

export default newPage
