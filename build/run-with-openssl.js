'use strict'
/**
 * webpack 4 内部多处硬编码使用 md4 哈希，而 OpenSSL 3（Node.js >= 17）
 * 默认不再提供 md4，直接运行会报 ERR_OSSL_EVP_UNSUPPORTED。
 * 本脚本在 Node >= 17 时自动附加 --openssl-legacy-provider 后拉起目标命令；
 * 同时定向抑制 http-deceiver（webpack-dev-server 代理链的旧依赖）触发的
 * DEP0111 process.binding('http_parser') 弃用提示（Node >= 21 支持）。
 * Node < 17 时原样透传，不影响旧版本环境。
 *
 * 用法：node build/run-with-openssl.js <目标脚本> [参数...]
 */
const { spawn } = require('child_process')
const path = require('path')

const nodeMajor = parseInt(process.versions.node.split('.')[0], 10)
const target = path.resolve(__dirname, '..', process.argv[2])
const args = process.argv.slice(3)

const nodeArgs = []
if (nodeMajor >= 17) {
  nodeArgs.push('--openssl-legacy-provider')
}
if (nodeMajor >= 21) {
  nodeArgs.push('--disable-warning=DEP0111')
}
nodeArgs.push(target, ...args)

const child = spawn(process.execPath, nodeArgs, { stdio: 'inherit' })

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code == null ? 1 : code)
})

child.on('error', err => {
  console.error('[run-with-openssl] 启动子进程失败:', err.message)
  process.exit(1)
})
