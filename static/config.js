(function() {
  Object.defineProperties(window, {
    config: {
      value: {
        serverIp: '192.168.67.186',
        serverPort: '8181',
        socketPort: '8185',
        // 用于Layout-Design基础数据配置功能
        equipment: [
          { nickName: 'Alive', bindKey: 'alive' },
          { nickName: 'CurrentStatus', bindKey: 'currentStatus' }
        ],
        unit: [
          { nickName: 'UnitNo', bindKey: 'unitNo' },
          { nickName: 'CurrentStauts', bindKey: 'currentStauts' }
        ],
        port: [
          { nickName: 'PortNo', bindKey: 'portNo' },
          { nickName: 'PortStatus', bindKey: 'portStatus' }
        ],
        expires: 1440 // 配置session过期时间 单位：分钟
      },
      writable: false,
      enumerable: true,
      configurable: false
    }
  })
  console.log(window)
})()
