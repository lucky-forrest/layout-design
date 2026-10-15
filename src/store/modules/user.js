const user = {
  state: {
    userInited: false
  },

  mutations: {
    SET_USERINITED: (state, userInited) => {
      state.userInited = userInited
    }
  },

  actions: {
    // 获取用户信息（免登录模式：默认以管理员身份进入）
    GetUserInfo({ commit }) {
      return new Promise(resolve => {
        commit('SET_USERINITED', true)
        resolve()
      })
    }
  }
}

export default user
