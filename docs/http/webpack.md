## webpack 实现原理

webpack 的运行流程是一个串行的过程，从启动到结束会依次执行以下流程：

1. 初始化参数：从配置文件和shell语句中读取与合并参数，得出最终的参数
2. 开始编译：用上一步得到的参数初始化Compiler对象，加载所有配置的插件，执行对象的run方法开始执行编译
3. 确定入口：根据配置中的entry找出所有的入口文件
4. 编译模块：从入口文件出发，调用所有配置的loader对模块进行编译，再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
5. 完成模块编译：在经过loader编译完所有模块后，得到了每一个模块被翻译后的最终内容以及他们之间的依赖关系
6. 输出资源：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表中
7. 输出完成：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

## webpack 作用

- 模块打包：将不同模块的文件打包整合在一起
- 编译兼容：对代码做 `polyfill`，转译其他格式文件 `.less` `.vue` `.tsx`，使用新特性和新语法开发，提高开发效率
- 能力扩展：插件机制，实现按需加载，代码压缩等，提高工程化速度，效率和输出质量

## webpack 打包构建优化

### 量化工具

1. `speed-measure-webpack-plugin` （测量 webpack 构建速度）
2. `webpack-bundle-analyzer`（创建所有捆绑包内容的交互式树形图可视化）

### 速度优化

1. `exclude` / `include`：确保转译尽可能少的文件
2. `thread-loader`
3. `module.noParse`
4. `resolve.alias`
5. `resolve.extensions`
6. 模块懒加载
7. hash

### 大小优化

1. `terser-webpack-plugin`
2. `IgnorePlugin`（忽略第三方包指定目录）
3. `externals` `html-webpack-externals-plugin`
4. `optimization.runtimeChunk`
5. `optimization.splitChunks`
6. `mini-css-extract-plugin`
7. `compression-webpack-plugin`
8. `url-loader`（识别图片大小，转为base64）

### webpack5 的过时优化

1. `hard-source-webpack-plugin`（内置缓存）
2. `happyPack`（推荐使用 `thread-loader`）
3. `webpack-parallel-uglify-plugin` 或者是 `uglifyjs-webpack-plugin` 配置 `parallel`来进行多进程压缩的优化，Webpack 默认使用的是 `TerserWebpackPlugin`，默认就开启了多进程和缓存。
4. `dll 动态链接库`

## 1. 性能优化

1. **加载性能** 
2. **渲染性能**

---------

1. 核心性能指标 和 Performance API
2. 更快的传输 CDN
   1. 将资源分发到 CDN 边缘网络节点，使用户可就近获取所需内容，大幅减小了光纤传输距离，使全球各地用户打开网站都拥有良好的网络体验
3. 更快的传输 http2
   1. 多路复用，在浏览器可并行发送N条请求
   2. 首部压缩，更新的负载体积
   3. 请求优先级，更快的关键请求
4. 更快的传输 充分利用 HTTP 缓存
   1. 缓存策略：强缓存，打包后带有hash的资源(如/build/a3as24.js)；协商缓存，打包后不带有hash的资源（如/index.html）
   2. 分包加载（Bundle Spliting）：避免一行代码修改导致整个 bundle 的缓存失效
    1. [https://www.cnblogs.com/dehenliu/p/12523293.html](https://www.cnblogs.com/dehenliu/p/12523293.html) 
    2. [https://tsejx.github.io/webpack-guidebook/best-practice/optimization/bundle-spliting/](https://tsejx.github.io/webpack-guidebook/best-practice/optimization/bundle-spliting/)
5. 更快的传输 减少 HTTP 请求及负载（网络资源压缩优化）
   1. js/css/image 等常规资源体积优化
   2. 小图片优化，内联为 DataURI，减少请求数量
   3. 图片懒加载：新的API `IntersectionObserver API`；新的属性 `loading=lazy`
6. 更小的体积 `gzip`/`brotli`
7.  更小的体积 压缩混淆工具（Terser）
8. 更小的体积 更小的js
   1. 路由懒加载：无需加载整个应用的资源
   2. `Tree Shaking`：无用导出将在生产环境进行删除
   3. `browserlist`/`babel`：及时更新 `browserlist`，将会产生更小的垫片体积
9. 更小的体积 更小的图片
    1.  使用 `webp` 和 `avif` 格式图片
    2.  更合适的尺寸
    3.  更合适的压缩，可对前端图片进行适当压缩，如通过 `sharp` 等
10. 渲染优化 关键渲染路径
    1.  关键渲染路径：
        1.  HTML -> DOM，将 html 解析为 DOM
        2.  CSS -> CSSOM，将 CSS 解析为CSSOM
        3.  DOM/CSSOM -> Render Tree，将 DOM 与 CSSOM 合并为渲染树
        4.  RenderTree -> Layout，确定渲染树种的每一个节点的位置信息
        5.  Layout -> Paint，将每个节点渲染在浏览器中
    2.  `preload` / `prefetch` 控制HTTP优先级，从而达到关键请求更快响应的目的
11. 渲染优化 防抖与节流
    1.  防抖：防止抖动，单位时间内事件触发会被重置，避免事件被误伤触发多次。代码实现重在清零 clearTimeout。防抖可以比作等电梯，只要有一个人进来，就需要再等一会儿。业务场景有避免登录按钮多次点击的重复提交。
    2.  节流：控制流量，单位时间内事件只能触发一次，与服务器端的限流 (Rate Limit) 类似。代码实现重在开锁关锁 timer=timeout; timer=null。节流可以比作过红绿灯，每等一个红灯时间就可以过一批。
12. 渲染优化 虚拟列表优化
    1.  一般在视口内维护一个虚拟列表(仅渲染十几条条数据左右)，监听视口位置变化，从而对视口内的虚拟列表进行控制
13. 渲染优化 请求及资源缓存
    1.  对每一条 GET API 添加 key
    2.  根据 key 控制该 API 缓存，重复发生请求时将从缓存中取得
14. `Web Worker`
    1.  如果纯碎使用传统的 Javascript 实现，将会耗时过多阻塞主线程，有可能导致页面卡顿。
    2.  如果使用 `Web Worker` 交由额外的线程来做这件事，将会高效很多，基本上所有在浏览器端进行代码编译的功能都由 `Web Worker` 实现
15. `WASM`

## 2. SPA（单页应用）首屏加载速度慢怎么解决？

首屏时间：指浏览器从响应用户输入网址地址，到首屏内容渲染完成的时间

计算首屏时间方案：

```js
// 1
document.addEventListener('DOMContentLoaded', () => {
  console.log('first contentful painting')
})

// 2
performance.getEntriesByName('first-contentful-paint')[0]
```

### 加载慢的原因

1. 网络延时问题
2. 资源文件体积过大
3. 资源是否重复发送请求去加载了
4. 加载脚本的时候，渲染内容堵塞了

### 解决方案

1. 减少入口文件体积（路由懒加载）
2. 静态资源本地缓存（后端使用 `Http 缓存`，设置`Cache-Control`，`Last-Modified`，`Etag`等响应头，采用 `Service Worker` 离线缓存；前端合理使用 `localStorage`）
3. UI框架按需加载
4. 图片资源的压缩（使用在线字体图标，雪碧图等）
5. 组件重复打包（多路由使用同库造成的重复下载，`webpack` 中配置 `CommonsChunkPlugin`）
6. 开启 GZIP 压缩（安装 `compression-webpack-plugin`）
7. 使用 SSR（组件或页面通过服务器生成html字符串，再发送到浏览器）
8. 将第三方包使用 CDN

## 3. 如何使用 webpack 分析优化当前项目的 js 体积

1. 安装使用 `webpack-bundle-analyzer` 分析打包体积
2. 对一些库替换为更小提交的库，如 `moment` -> `dayjs`
3. 对一些库进行按需加载，如 `import lodash` -> `import lodash/get`
4. 对一些库使用支持 Tree Shaking，如 `import lodash` -> `import lodash-es`


