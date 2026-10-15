export default {
  state: {
    isConnected: false,
    plcConnect: false,
    data: {
      socket_sendMessageLog: {},
      socket_sendRvMsgLog: {},
      socket_sendRvTraceLog: {},
      socket_linksignal: {},
      socket_publishStressTestLog: {},
      socket_publishWordValueRead: {},
      socket_publishBitValueChanged: {}
    }
  },
  mutations: {
    SOCKET_ONOPEN(state) {
      state.isConnected = true
    },
    SOCKET_ONCLOSE(state) {
      state.isConnected = false
    },
    SOCKET_PLCCONNECT(state, value) {
      state.plcConnect = value
    },
    SOCKET_MESSAGELOG(state, sendMessageLog) {
      state.data.socket_sendMessageLog = sendMessageLog
    },
    SOCKET_RVMSGLOG(state, sendRvMsgLog) {
      state.data.socket_sendRvMsgLog = sendRvMsgLog
    },
    SOCKET_RVTRACELOG(state, sendRvTraceLog) {
      state.data.socket_sendRvTraceLog = sendRvTraceLog
    },
    SOCKET_LINKSIGNALREALTIMEDATA(state, realTimeData) {
      state.data.socket_linksignal = realTimeData
    },
    SOCKET_PIBLISHSTRESSTESTLOG(state, stressTestLog) {
      state.data.socket_publishStressTestLog = stressTestLog
    },
    SOCKET_PUBLISHWORDVALUEREAD(state, wordValueRead) {
      state.data.socket_publishWordValueRead = wordValueRead
    },
    SOCKET_PUBLISHBITVALUECHANGED(state, bitValueChanged) {
      state.data.socket_publishBitValueChanged = bitValueChanged
    }
  },
  actions: {
    onOpen({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_ONOPEN')
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    onClose({ commit }) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_ONCLOSE')
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    plcConnect({ commit }, plcConnect) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_PLCCONNECT', plcConnect)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    sendMessageLog({ commit }, sendMessageLog) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_MESSAGELOG', sendMessageLog)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    sendRvMsgLog({ commit }, sendRvMsgLog) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_RVMSGLOG', sendRvMsgLog)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    sendRvTraceLog({ commit }, sendRvTraceLog) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_RVTRACELOG', sendRvTraceLog)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    linksignalRealTimeData({ commit }, realTimeData) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_LINKSIGNALREALTIMEDATA', realTimeData)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    publishStressTestLog({ commit }, stressTestLog) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_PIBLISHSTRESSTESTLOG', stressTestLog)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    publishWordValueRead({ commit }, wordValueRead) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_PUBLISHWORDVALUEREAD', wordValueRead)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    },
    publishBitValueChanged({ commit }, bitValueChanged) {
      return new Promise((resolve, reject) => {
        try {
          commit('SOCKET_PUBLISHBITVALUECHANGED', bitValueChanged)
          resolve()
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
