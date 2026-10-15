import shortid from 'shortid'
import newPage from './pageFactory'

function newProject(title) {
  return {
    id: shortid.generate(),
    title: title,
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
