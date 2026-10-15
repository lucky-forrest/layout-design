# Layout-Design 产线布局设计器

面向半导体产线的布局设计与仿真工具。项目由两个页面构成：

- **首页 `/`**：介绍页，展示产品信息与案例视频
- **设计页 `/design`**：产线布局设计器，拖拽设备/容器/路径等元件绘制产线 Layout，支持多页面、项目保存/加载（localforage 本地存储 + JSON 下载）

> 本项目由 vue-element-admin 模板深度精简而来，仅保留上述两页功能链。

## 技术栈

| 类别 | 选型 |
|---|---|
| 框架 | Vue 2.5.17 + Vue Router 3 + Vuex 3 |
| UI 组件库 | element-ui 2.x（编辑器 UI 统一使用） |
| 画布元件 | vue-mdc-adapter（mdc 元件体系）+ 自研设备元件（svg 图标） |
| 构建 | webpack 4 + node-sass（sass-loader）+ babel 7 |
| 图标 | vue-svgicon（设计器元件）+ svg-sprite-loader（站点图标） |
| 存储 | localforage（项目本地持久化） |
| 其他 | js-cookie、shortid、svg.js、draggabilly、vue-color、nprogress、dialog-polyfill |

## 环境要求

> ⚠️ **Node 版本约束**：`node-sass@4.14.1` 仅编译了 Node 14 的二进制（ABI 83）。**构建必须使用 Node 14**；Node 17+（含默认 Node 22）会报 `Unsupported runtime`。

推荐通过 nvm 使用：

```bash
nvm use 14
```

## 快速开始

```bash
# 安装依赖（Node 14 环境）
npm install

# 开发模式（热更新，端口见 config/index.js）
npm run dev

# 生产构建（输出到 dist/）
npm run build:prod

# 生产构建 + 打包分析
npm run build:analyze
```

### 项目说明（免登录）

系统为免登录模式：`src/permission.js` 在路由跳转前直接 dispatch `GetUserInfo`（初始化 user 状态），不依赖任何后端接口。如需接入真实登录，请扩展 `src/store/modules/user.js` 并恢复 `api/` 与 `utils/request.js` 调用链。

> `static/config.js`（`window.config`）是**运行时配置**，设计页读取其中的设备/端口/单元绑定键（`equipment`/`port`/`unit`）与 session 过期时间。该文件不参与 webpack 打包、原样拷贝至 `dist/static/`，部署时**不要删除**；修改配置无需重新构建。

## 目录结构

```
src/
├── main.js                 # 入口：element-ui、图标、插件注册
├── App.vue / permission.js # 根组件 / 路由守卫（免登录初始化）
├── views/
│   ├── dashboard/          # 首页（介绍页）
│   ├── layouteditor/       # 布局设计器（Editor / dialogs / drawer / settings / main 元件）
│   └── errorPage/404.vue
├── store/
│   ├── modules/layoutEditor.js   # 设计器核心状态（页面/元件/撤销重做/保存加载）
│   ├── modules/user.js           # 免登录用户状态（仅 userInited）
│   ├── modules/app.js            # 全局状态（sidebar）
│   └── types.js                  # layoutEditor actions 封装（设计页组件统一调用）
├── assets/
│   ├── design/            # 设计器资产：元件 svg 源与 svgicon 编译产物、元件基础定义
│   ├── icons/             # 站点 svg 图标（svg-sprite-loader 编译，dashboard/公共使用）
│   ├── images/equipment/  # 设备位图（运行时加载）
│   └── 404_images/        # 404 页图片
├── factories/              # 元件实例/引用工厂
├── helpers/                # 递归遍历等工具
├── components/SvgIcon/     # 站点 svg 图标组件
├── styles/                 # 全局样式（index/transition/element-ui 覆盖/design-mdc）
├── router/  polyfills/
└── static/  （根级）        # config.js（运行时配置）+ videos/（首页轮播）
```

## 构建与部署

- 产物输出到 `dist/`，需通过 HTTP 服务器访问（`file://` 直接打开不生效）。
- `static/config.js` 为运行时配置（`window.config`），设计页读取其中的过期时间等参数，**部署时不要删除**。
- `static/videos/` 为首页轮播视频（约 65 MB），如体积敏感可转码压缩或改为 CDN 引用。
- `npm-shrinkwrap.json` 为锁定依赖文件，新增/删除依赖后请保持同步（npm 6 下勿直接重生成，会保留已装包，需精确编辑）。

## 版权

© Layout-Design 产线布局设计器。内部工具，仅供授权人员使用。
