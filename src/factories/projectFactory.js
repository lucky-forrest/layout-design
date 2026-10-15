import shortid from 'shortid'
import newPage from './pageFactory'

/** 当前工程档案结构版本（与 store/modules/layoutEditor 保持一致） */
const PROJECT_VERSION = 2

function newProject(title) {
  return {
    id: shortid.generate(),
    title: title,
    version: PROJECT_VERSION,
    components: [],
    pages: [newPage({
      name: 'Home',
      path: '/',
      width: '1200px',
      height: '400px'
    })]
  }
}

export default newProject
