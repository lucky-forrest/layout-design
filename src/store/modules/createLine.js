const state = {
  state: {
    elementList: []
  },
  mutations: {
    SET_ELEMENTLIST: (state, elementList) => {
      state.elementList = elementList
    }
  },
  actions: {
    saveElementList({ commit }, elementList) {
      return new Promise((resolve, reject) => {
        try {
          commit('SET_ELEMENTLIST', elementList)
          return resolve()
        } catch (error) {
          return reject(error)
        }
      })
    }
  }
}

export default state
