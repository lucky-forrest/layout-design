import _ from 'lodash'
const getters = {
  isConnected: state => state.socket.isConnected,
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  plcConnect: state => state.socket.plcConnect,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  userId: state => state.user.userId,
  factory: state => state.user.userInfo.factory,
  userName: state => state.user.userName,
  token: state => state.user.token,
  menuList: state => state.user.menuList,
  authorityList: state => state.user.authorityList,
  actionList: state => {
    const actionLst = _.map((state.user.authorityList.filter(({ pageName }) => pageName === state.user.currPageName)), 'action') || []
    return actionLst
  },
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  elementList: state => state.createLine.elementList
}
export default getters
