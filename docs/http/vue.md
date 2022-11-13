## Vue 实现原理

## 使用 Object.defineProperty() 来进行数据劫持有什么缺点

- 无法对新增和删除等属性以及通过下标的方式修改数组数据触发更新
- 因为 `Object.defineProperty()` 需要先知道对象的 `key` 值，才能对属性进行拦截

## Vue3 为什么使用 proxy 代替 Object.defineProperty() 实现响应式

- `defineProperty` 不能监听数组的变化
- 只能劫持对象的属性，给对象添加的属性无法劫持
- 因为 `defineProperty` 必须先知道对象的 `key` 值
- 初始化时需要深度递归遍历待处理的对象才能对它进行完全拦截

proxy

- proxy 的拦截是 懒处理，只有访问到时才会进行响应化
- 可以直接监听数组的变化
- 可以直接监听整个对象，而不是对象的属性
- proxy 被重点关注的性能优化
- proxy 是 ES6 的语法，而且没有 polyfill，存在兼容性问题
- proxy 存在13种拦截方法，这是 `defineProperty` 不具备的，所以 vue2 在实现响应式时需要其他的方法辅助（如重写数组方法，增加额外的 `$set` `$delete` 方法）

## v-if 和 v-show

共同点： **都能控制元素是否显示**

区别：
- **控制手段** ： `v-show` 是通过 `display: none` 控制。DOM元素依旧存在；`v-if` 显示隐藏是将DOM元素整个添加或删除
- **编译过程** ： `v-if` 切换有一个局部编译/卸载的过程，切换过程中合适地销毁和重建内部的事件监听和子组件；`v-show` 只是简单的基于css切换
- **编译条件** ： `v-if` 是真正的条件渲染，它会确保在切换过程中条件块内的事件监听器和子组件适当地被销毁和重建
- **性能消耗** ： `v-if` 有更高的切换消耗；`v-show` 有更高的初始渲染消耗；

- `v-if` 相比 `v-show` 开销更大的（直接操作dom节点增加与删除）
- 如果需要非常频繁地切换，则使用 `v-show` 较好
- 如果在运行时条件很少改变，则使用 `v-if` 较好

## 为什么部署到服务器会有 404 错误的原因 （History 和 Hash）

### 为什么在 History 模式下会有问题？

Vue 是属于单页面应用，打包只会产出一个 `index.html`，地址输入 `www.xx.com` 之后会打开 `index.html`，然后跳转路由到 `www.xx.com/login`，刷新页面从服务器请求这个地址，`nginx location` 是没有配置的，所以会出现找不到资源的情况，也就是 404

### 为什么在 Hash 模式下没有问题？

Hash 是通过 `#` 表示的，他不会被包含在 HTTP 请求中，对服务端没有影响，因此改变 hash 不会重新加载页面。只有 根地址 才被包含在请求中

### 解决

需要配置将任意页面都重定向到 `index.html`，把路由交由前端处理
对 `nginx` 配置文件 `.conf` 修改，添加 `try_files $uri $uri/ /index.html;`

## 权限

- 接口权限（采用 `jwt` 的形式来验证，没有权限返回 `401`，跳转到登录页重新登录。登录完拿到token，通过 axios 请求拦截器进行拦截，每次请求的时候都在头部携带）
- 按钮权限
  - 使用 `v-if` 判断
  - 使用 自定义指令 判断
- 菜单权限
  - 菜单与路由分离，菜单由后端返回
  - 菜单和路由都由后端返回
- 路由权限
  - **静态添加** ：初始化即挂载全部路由，并且在路由上标记相应的权限信息，每次路由跳转前做校验
  - **动态添加** ： 获取用户的权限信息，然后筛选有权限访问的路由，在全局路由守卫里进行调用`addRoutes` 添加路由  

## nextTick

- Vue2 使用了 降级处理：`Promise.then`、`MutationObserver`、`setImmediate`、`setTimeout`
- Vue3 直接使用 `Promise.then`

使用浏览器的 Event Loop 机制

## Vue 异步更新

## Vue 的data为什么是一个函数

目的是为了防止 **多个组件实例** 对象之间公用一个 `data`，产生数据污染。采用函数的形式， `initData` 时会将其作为 **工厂函数** 都会返回 全新 `data` 对象

## Vue 组件通信

- 父子组件（props / $emit / $parent / ref / $attrs）
- 兄弟组件（$parent / $root / eventbus / vuex / pinia）
- 跨层级组件（vuex / pinia / provide + inject）

## v-if 和 v-for 优先级

- 在vue2中，v-for 的优先级更高 （每一次循环都要进行判断，源码中先处理的 v-for）
- 在vue3中，v-if 的优先级更高（会直接报错，先处理 v-if）
- 不要把这两个指令放到一个元素上

## 简述Vue生命周期

创建 =》 更新 =》 销毁

每个Vue组件实例被创建后都会经过一系列初始化步骤，比如，需要数据观测，模版编译，挂载实例到 DOM上，以及数据变化时更新DOM。这个过程中会运行叫做生命周期钩子的函数，以便用户在特定阶段添加自己的代码

Vue生命周期总共可以分为 8 个阶段：创建前后，载入前后，更新前后，销毁前后。以及一些特殊场景的生命周期。Vue3中新增了 三 个用于调试和服务端渲染场景


**composition API 中最早触发的是 `setup`**

| vue2          | vue3            | 描述                             |
| ------------- | --------------- | -------------------------------- |
| beforeCreate  | beforeCreate    | 组件实例被创建之前               |
| created       | created         | 组件实例已经完成创建             |
| beforeMount   | beforeMount     | DOM 挂载之前                     |
| mounted       | mounted         | DOM 挂载完成之后                 |
| beforeUpdate  | beforeUpdate    | 组件 更新之前                    |
| updated       | updated         | 组件 更新完成之后                |
| beforeDestory | beforeUnmount   | 组件 卸载之前                    |
| destoryed     | unmounted       | 组件 卸载完成之后                |
|               |                 |                                  |
| activited     | activited       | KeepAlive 组件 被激活时          |
| deactivited   | deactivited     | KeepAlive 组件 被停用时          |
| errorCaptured | errorCaptured   | 捕获来自子孙组件的错误时         |
|               | renderTracked   | 调试钩子，响应式依赖被手机时调用 |
|               | renderTriggered | 调试钩子，响应式依赖被触发时调用 |
|               | serverPrefetch  | 组件实例在服务器上被渲染前       |

- `beforeCreate` ： 通常用于插件开发中执行一些初始化任务
- `created` ：组件初始化完毕，可以访问各种数据，获取接口数据等
- `mounted` ：dom 已创建，可以获取访问数据和DOM元素；访问子组件等
- `beforeUpdate` ：此时 view 层还未更新，可用于获取更新前的状态
- `updated` ：完成 view 的更新，更新后，所有状态已是最新
- `beforeUnmount` ：实例销毁前调用，可用于一些定时器或订阅的取消
- `unmounted` ： 销毁一个实例，可以清理与其它实例的连接，解绑他的全部指令及事件监听器

### setup 中为什么没有 beforeCreate 和 created？

setup 函数中组件实例已经创建了，已经完成了 beforeCreate 和 created 所做的事情

## 双向绑定的原理和使用

1. 给出双向绑定的定义
2. 双绑带来的好处
3. 在哪使用双绑
4. 使用方式、使用细节、vue3 变化
5. 原理实现描述

回答：
1. 双向绑定是一个指令 `v-model`，可以绑定一个响应式数据到视图，同时视图中变化能改变该值
2. 是一个语法糖，默认情况下相当于 `:value` 和 `@input`。可以减少大量是 绑定和事件处理代码
3. 通常在表单项上使用 `v-model`，还可以在自定义组件上使用，表示某个值的输入和输出控制
4. 还可以使用 `.lazy` `.trim` `.number` 进行修饰符的限制。Vue3中可以绑定多个`v-model`，去除了Vue2中的 `.sync`
5. 编译时，input 默认是 `@input`，使用 `.lazy` 是 `@change` 事件，其它如 `checkbox` `radio` 是 `:checked` 和 `@change`事件， `select` 是 `:value` 和 `@change` 事件

## 扩展一个组件

- 逻辑扩展： `mixins`， `extends`， `composition api`
- 内容扩展： `slots`

## 子组件是否可以直接修改父组件的数据

单向数据流，所有的 props 都遵循着**单向绑定**原则，避免了子组件因意外修改父组件的数据（浏览器控制台会出现警告），是数据流变得混乱而难以理解。大多数情况下应该使用 `自定义事件` 来通知父组件来做出改变

## 数据响应式理解

思路
- 啥是响应式
- 为什么vue需要响应式
- 带来什么好处
- 怎么实现的？有哪些优缺点
- Vue3的响应式新变化

1. 响应式就是能够是数据变化可以被检测并对这种变化做出响应的机制
2. MVVM 框架中要解决的问题是连接数据层和视图层，通过 **数据驱动**应用，数据变化，视图更新。即一旦数据发生变化就立即做出更新处理
3. vue以数据响应加上虚拟DOM和patch算法，开发人员只要操作数据，关心业务，完全不需要接触频繁的DOM操作，从而大大提升开发效率，降低开发难度
4. Vue2中根据不同数据类型来做不同处理，如果是对象采用`Object.defineProperty`方式定义数据拦截，当数据被访问或发生变化时做出响应；如果是数组则通过覆盖数据对象原型的7个变更方法，是这些方法可以额外的做更新通知，从而做出响应。缺点：初始化时递归遍历会造成性能损失；新增或删除属性时需要用户使用 `$set` `$delete`；对ES6中新产生的 `Map` `Set` 这些数据结构不支持
5. Vue3使用ES6的proxy代理要响应化的数据。编程体验一致，不需要额外的api；初始化性能和内存得到提升；并且单独抽离了 `reactivity` 包，使得我们可以更灵活的使用它

## 对虚拟DOM的理解

思路
- vdom 是什么
- 好处
- vdom如何生成，又如何成为 DOM
- 在后续Diff中发作用

回答
1. 虚拟DOM 是一个 虚拟的DOM对象，本质是一个 `js对象`，用来描述一个视图结构
2. 好处：
   1. **将真实元素节点抽象成 VNODE，有效减少直接操作DOM次数，从而提高程序性能**
      1. 使用js来操作DOM，变得简单，比如 Diff（比对） 和 clone（克隆）
      2. 频繁操作DOM会引起页面的回流和重绘，但使用VNode进行中间处理，可以有效减少直接操作dom的次数，减少回流和重绘
   2. **方便实现跨平台**
3. 如何生成？`template` => compiler（AST => generate => code） => `render` => `VNode` => `真实DOM`
4. 挂载过程结束后，Vue程序进入更新流程。如果某些响应式数据发生变化，将会引起组件重新compiler，此时会生成新的 vdom，和上一次渲染结果进行 diff 就能得到变化的地方，从而转换为最小量的 dom操作，高效更新视图

## diff 算法

- diff是干什么的
- 必要性
- 何时执行
- 具体执行方式
- vue3 中的优化

回答：
1. diff 算法称为 patch 算法，虚拟DOM要想转化为真实DOM就需要通过patch
2. patch 过程是一个递归过程。遵循 深度优先，同层比较的策略
   1. 先判断两个节点是否为相同同类节点，不同则删除重新创建
   2. 如果双方都是文本则更新文本内容
   3. 如果双方都是元素节点则递归更新子元素，同时更新元素属性
   4. 更新子节点时分为：
      1. 新子是文本，老子是数组，则清空设置文本
      2. 新子是文本，老子是文本，则更新内容
      3. 新子是数组，老子是文本，则清空文本，创建新子的数组中的子元素
      4. 新子是数组，老子是数组，比较两个数组，找出最小不同点

3. vue3优化：block树，静态提升，优化patchFlags等

## Vue3 的新特性

- Composition API
- SFC 语法糖 `<script setup>`
- Teleport 传送门
- Fragment 片段
- Emits 选项
- 自定义渲染器
- CSS 变量 （v-bind）
- Suspense

## VueRouter 的动态路由有什么用

1. 给定匹配模式的路由映射到同一个组件上，这种情况就需要定义动态路由
2. 如 `{ path: 'user/:id', component: User }`， 其中 `:id` 就是路径参数
3. 路径参数使用 `:` 表示，当路由匹配时，params值将在每个组件中以 `this.$route.params` 的形式暴露出来
4. 参数可以有多个，`$route` 还公开了 `$route.query` `$route.hash`等

## 如何实现一个路由

**用户点击跳转链接内容切换，页面不刷新**

- 定义一个 `createRouter` 函数，返回路由器的实例，内部做：
  - 保存用户传入的配置项
  - 监听 `hash` 或 `popstate` 等事件
  - 回调根据 path 匹配的对应路由

- 将 router 定义成一个 Vue 插件，即使用 install 方法，内部做：
  - 实现两个全局组件： `<RouterLink>` `<RouterView>`
  - 定义两个全局变量： `$router` `$route`，在 `Composition API` 使用 `provide inject` 注入这两个变量，组件内可以访问当前路由和路由器实例

## 说说 key 的作用

- key 的作用主要是 **为了更高效的更新虚拟DOM**
- vue在patch过程中，判断两个节点是否是相同节点 key 是一个必要条件，渲染一组列表时，key 往往是唯一标识，所以如果不定义 key 的话，vue只能认为比较的两个节点是同一个，这导致了频繁更新元素，使patch过程比较低效，影响性能
- 避免使用数组索引作为 key，在新增删除或排序时可能会导致 bug；在相同标签做过渡切换时，也会使用key属性，也是为了可以区分它们，否则只会替换其内部属性而不触发过渡效果
- 在源码中知道，vue判断两个节点是否是相同时主要判断 两者的 key 和元素类型 type。如果不设置key。可能永远认为这是两个相同节点，只能去做更新，会造成大量的dom更新操作，明显是不可取的

## 说说 nextTick 的原理

- nextTick 是等待下一次DOM更新的工具方法
- Vue有个 **异步更新策略**，意思是如果 数据变化，Vue不会立即更新DOM，而是开启一个队列，把组件更新函数保存在队列中，在同一个事件循环中发生的所有数据变更会异步的批量更新。这一策略导致我们对数据的修改不会立即体会在DOM上，此时如果想要获取最新DOM状态，就需要 nextTick
- 场景：在created中想要获取DOM；响应式数据变化后获取DOM更新，比如希望获取列表更新后的高度
- 只需要在传入的回调函数中访问最新状态的DOM即可，或者可以使用 `await nextTick()`
- 在Vue内部，nextTick 之所以能够让我们看到DOM更新后的结果，是因为我们传入 callback 会被添加到队列刷新函数（flushSchedulerQueue）的后面，这样等队列内部的更新函数都执行完毕，所有DOM操作也就结束了，callback 自然也就能够获取到最新的DOM状态

## computed 和 watch 的区别

- computed 是具有响应式的返回值
- watch 侦测变化，执行回调

## 父子组件创建、挂载顺序

## 如何缓存、更新组件

- activated 将 vnode 移动到需要挂载的容器container，然后进行 patch => render 
- deactivated 将 vnode 移动到 创建的一个临时容器 `div` 中

回答：
- 使用 KeepAlive 组件，包裹动态组件 component 时，会缓存不活动的组件实例，而不是销毁它们，这样在组件切换过程中会将状态保留在内存中，防止重复渲染DOM
- 结合属性 include 和 exclud 就可以明确指定缓存哪些组件或排除缓存指定组件。Vue3中是 `router-view` 包裹 `keep-alive`，Vue2中相反
- 缓存后如果想要获取数据，有两种方案：
  - beforeRouterEnter：每次进入路由时，都会执行
  - activited：缓存的组件被激活时，会执行
- keep-alive 是一个通用组件，内部定义了一个 map，缓存创建过组件实例，返回的渲染函数内部会查找内嵌的 component 组件对应组件 `vnode`，如果该组件在map中存在就直接返回它。由于 component 的 `is` 属性是一个响应式数据，因此只要他变化，keep-alive 的 `render` 函数就会重新执行

## 如何架构一个 vue 项目

1. 项目构建、引入必要插件、代码规范、提交规范、常用库和插件
2. Vue3 使用 `vite` 或 `create-vue` 创建项目
3. 插件：路由插件 `vue-router` 、状态管理 `vuex/pinia` 、UI库、HTTP工具 `axios`
4. 其他比较常用的库有 `vueuse` 、`nprogress` 、 图标可以使用 `vite-svg-loader`
5. 代码规范：结合 `prettier` 和 `eslint` 即可
6. 提交规范：`husky` `lint-staged` `commitlint`

目录结构：
1. `.vscode` ： 用来存放项目中的 vscode 配置
2. `plugins` ：用来存放vite插件的plugin配置
3. `public` ：用来存放如页头icon之类的公共文件，会被打包到dist根目录下
4. `src` ：放项目代码文件
5. `api` ：放 http 的一些接口配置
6. `assets` ：放一些css之类的静态资源
7. `components` ：放项目通用组件
8. `layout` ：放项目的布局
9. `router` ：放项目的路由配置
10. `store` ：放状态管理pinia配置
11. `utils` ：放项目中的工具方法类
12. `views` ：放项目的页面文件

## 最佳实践

vue文档：
1. 风格指南
2. 性能
3. 安全
4. 访问性
5. 发布

## 从 template 到 render 发生了什么

1. Vue中有个独特的编译器模块，称为 `compiler`，他的作用是将用户编写的`template` 编译为 js 中可执行的 `render` 函数
2. 手写 render 函数不仅效率低下，而且失去了编译期的优化能力
3. 在Vue中编译器会先对 `template` 进行解析，这一步被称为 `parse`，结束之后会得到一个 js 对象，我们称为 `抽象语法树 AST`，然后对 AST 进行深加工的转换，这一步成为 `transform`，最后将前面得到的 AST 生成 js代码，也就是 `render` 函数

template 先使用 parse 生成 AST，然后使用 transform 进行加工指令，节点转换等，最后通过 generate 生成 render 函数

## Vue 实例挂载过程中发生了什么

1. 初始化：挂载过程指 `app.mount()` 过程，整体上建立两件事：初始化和建立更新机制
2. 初始化会创建组件实例、初始化组件状态、创建各种响应式数据
3. 建立更新机制会立即执行一次组件更新函数，会首次执行组件渲染函数并执行patch将前面的vnode转为dom；同时首次执行渲染函数会创建它内部响应式数据和组件更新函数之间的依赖关系，这使得以后数据变化时会执行对应的更新函数

## Vue 性能优化的方法

1. 路由懒加载：能够有效拆分APP尺寸，访问时才异步加载
2. `KeepAlive` 缓存页面：避免重复创建组件实例，且能保留缓存组件状态
3. 使用 `v-show` 复用DOM：避免重新创建组件
4. `v-for` 遍历避免同时使用 `v-if`：在Vue3中已经是错误写法
5. `v-once` `v-memo` ：不在变化的数据使用 `v-once`；按条件跳过更新时使用 `v-memo`：下面这个列表只会更新选中状态变化项
6. 长列表性能优化：如果是大数据长列表，可采用虚拟滚动，只渲染少部分区域的内容（`vue-virtual-scroller` `vue-virtual-scroll-grid`）
7. 事件销毁：Vue组件销毁时，会自动解绑它的全部指令及事件监听器，但仅限于组件本身的事件
8. 图片懒加载：未出现在可视区域的图片先不做加载，等到滚动到可视区域才去加载（`vue-lazyload`）
9. 第三方插件按需引入（`Element-Plus`）
10. 子组件分割策略：较重的状态组件适合拆分
11. 服务端渲染/静态网站生成：SSR / SSG

## ref 和 reactive 异同

1. `ref` 接收内部值返回响应式 `Ref` 对象，`reactive` 返回响应式代理对象
2. 前者通常用于处理单值的响应式；后者处理对象类型的响应式
3. 都用于构造响应式对象
4. 前者返回的数据需要 `.value` 才可以访问其值，在视图中通过 `proxyRefs` 自动脱 `.value`；ref 可以接收对象或数组等非原始值，但内部会使用 `reactive` 处理；reactive 接收 ref 对象会自动脱 ref；使用展开运算符（`...`）会使其失去响应性，可以结合 `toRefs` 将值转为 Ref 对象
5. reactive 内部使用 Proxy 代理传入的对象并拦截该对象的操作，从而实现响应式；ref内部封装 `RefImpl` 类。并设置 `get value` `set value`，拦截用户对值的访问，从而实现响应式

## watch 和 watchEffect 区别

- `watchEffect` 立即运行一个函数，然后被动地追踪它的依赖，当这些依赖发生改变时重新执行该函数；不关心响应式数据前后变化的值
- `watch` 侦测一个或多个响应式数据源并在数据源发生变化时调用回调函数
- `watchEffect` 会立即执行；`watch` 设置 `immediate: true` 才会立即执行

## SPA 和 SSR 的区别

1. SPA 单页面应用，一般也称客户端渲染，简称CSR；SSR 是服务端渲染，一般也称多页面应用，简称 MPA
2. SPA 只会首次请求 html 文件，后续只需要请求 JSON 数据即可，因此用户体验更好，节约流量，服务端压力也小，但是首屏加载时间会变长，对SEO不友好；SSR方案，html内容在服务器一次性生成出来，首屏加载快，SEO也方便抓取页面信息
3. 如果存在首屏加载优化需求，SEO需求时，可以考虑SSR
4. 但并不是只有一种代替方案，比如对一些不常变化的静态网站，可以考虑 **预渲染（prerender）**。另外 nuxtjs 也提供了 SSG（static site generate）静态网站生成方案也是很好的静态站点解决方案，结合一些CI手段，可以起到很好的优化效果，而且能够节约服务器资源

## vue-loader 是什么

- 用于处理单文件组件的 `webpack loader`，可以使用 SFC 的方式编写代码
- 可以分割 `<template> <script> <style>`
- webpack 打包时，会以 loader 的方式调用 `vue-loader`
- `vue-loader` 会 调用 `@vue/compiler-sfc` 模块解析 SFC 源码为一个描述符（Descriptor），然后为没个语言块生成 `import` 代码
  ```js
  // source.vue 被 vue-loader 处理后返回的代码

  // import the <template> block
  import render from 'source.vue?vue&type=template'
  // import the <script> block
  import script from 'source.vue?vue&type=script'
  import * from 'source.vue?vue&type=script'
  // import the <style> block
  import style from 'source.vue?vue&type=style&index=1'

  script.render = render
  export default script
  ```

## 自定义指令 自定义指令的应用场景

1. Vue 有一些默认指令，如 `v-model` `v-if` `v-for` `v-once` `v-memo` 等
2. 自定义指令主要完成一些可复用低层级 DOM 操作
3. 使用自定义指令分为 定义、注册和使用三步：
   1. 定义指令：对象和函数形式，前者类似组件定义，有各种生命周期；后者只会在 `mounted` `updated` 时执行
   2. 注册：使用 `app.directive()` 全局注册；使用 `directive: {xx}` 局部注册
   3. 使用：在注册的名称前面加上 `v-` 即可，如 `v-focus`
4. 常用自定义指令：
   1. 复制粘贴：`v-copy`
   2. 长按：`v-longpress`
   3. 防抖：`v-debounce`
   4. 图片懒加载：`v-lazy`
   5. 按钮权限：`v-premission`
   6. 页面水印：`v-waterMarker`
   7. 拖拽指令：`v-draggable`

5. Vue3中变化，钩子的名称和组件保持一致；在3.2之后，在setup中以 小写v 开头即可自定义指令
6. 编译后自定义指令会被 `withDirectives` 处理生成 vnode

## $attrs 和 $listeners 做什么的

- 属性透传，非属性特性的传递（没有在props中定义），可以直接使用 `v-bind="$attrs"` 传递给子组件
- vue2中使用 `$listeners` 获取事件；vue3中已移除，合并到 `$attrs` 中

## v-once 的使用场景

- 仅渲染元素和组件一次，并且跳过未来更新
- 在一些元素或者组件初始化渲染之后不在需要变化（如项目名称title，从配置文件导入）

## 什么是 递归组件？使用场景

- 在 `Tree` `Menu` 这类型组件中会被用到
- 组件通过组件名称引用它自己，这种情况就是递归组件

## 什么是异步组件

- 大型应用中，需要分割应用为更小的快，并且在需要组件时再加载他们（比如 多 `Tabs` ）
- 使用异步组件最简单的方式是直接给 `defineAsyncComponent()` 指定一个 loader 函数，结合 ES6 模块动态导入函数 import 可以快速实现。甚至可以指定 `loadingComponent` 和 `errorComponent` 选项从而给用户一个很好的加载反馈；另外Vue3中还可以结合 `Suspense` 组件使用异步组件
- 异步组件容易和路由懒加载混淆，异步组件不能被用于定义懒加载路由上，处理他的是 vue 框架，处理路由组件加载的是 vue-router；但是可以在懒加载的路由组件中使用异步组件

## Vue 中如何处理错误

1. 错误类型：接口异常 代码逻辑异常
2. 接口异常在 拦截器中处理；逻辑错误使用 `app.config.errorHandler` 收集错误
3. 分析异常：区分错误类型：请求错误，上报接口信息，参数，状态码等；前端逻辑异常，获取错误名称和详情；收集应用名称、环境、版本、用户信息，所在页面等。这些信息可以通过vuex存储的全局状态和路由信息获取

## Vue 长列表优化的思路

1. 在大型企业项目中经常需要处理渲染大量数据，此时很容易出现卡顿。比如大数据表格、树
2. 根据情况做不同处理：
   1. 避免大数据量：可以采取分页的方式获取
   2. 避免渲染大量数据：`vue-virtual-scroller` 等虚拟滚动方案，只渲染视口范围内的数据
   3. 避免更新：可以使用 `v-once` 方式只渲染一次
   4. 优化更新：通过 `v-memo` 缓存子树，有条件更新，提高服用，避免不必要更新
   5. 按需加载数据：可以采用 `懒加载` 方式，在用户需要的时候才加载，比如 `tree` 组件子树的懒加载

## 监听 Vuex 中数据变化

- `watch` 选项或者方法
- vuex 提供的 api `store.subcribe()`

## router-link 和 router-view 是如何起作用的？

1. 路由导航 和 组件内容渲染
2. `vue-router` 会监听 `popstate` 事件，点击 `router-link` 之后页面不会刷新，而是拿出当前 path 去和 routes 中 path 匹配，获得匹配组件之后，`router-view` 会将匹配的组件渲染出来
3. `router-link` 默认会渲染成 `a` 标签，点击后 **取消默认跳转行为** 而是执行一个 `navigate` 方法，它会 `pushstate` 以激活事件处理函数，重新匹配一个路由 `injectedRoute`；`router-view` 的渲染函数依赖这个路由，他根据该路由获取要渲染的组件并重新渲染它

## Vue3 性能提升主要通过那几个方面

1. 代码：全新响应式API，基于 Proxy 实现（初始化懒处理，只有访问到才做响应式处理，初始化更快；轻量的依赖关系保存：WeakMap Map Set 保存响应式数据和副作用之间的依赖关系），初始化时间和内存占用幅度改进
2. 编译：静态提升，动态内容标记、事件缓存、block树 等，可以有效跳过大量 diff 过程
3. 打包时更好的支持 tree-shaking，因此整体体积更小，加载更快

## 什么场景使用 嵌套路由

1. 页面有多层级组件组合而来的情况使用嵌套路由
2. 表现形式是在两个路由切换时，有公用的视图内容。此时通常提取一个父组件，内部放上 `<router-view>`，从而形成物理上的嵌套，和逻辑上的嵌套对应起来。定义嵌套路由时使用 `children` 属性组织嵌套关系
3. 原理上是在 `router-view` 组件内部判断其所处嵌套层级的深度，讲这个深度作为匹配组件数组 `matched` 的索引，获取对应组件并渲染

## 页面刷新后 Vuex 的 state 数据丢失

1. Vuex 只是在内存中保存状态，刷新之后就会消失，如果要持久化就要存起来
2. 可以使用 localStorage，提交 mutation 的时候同时存入，store中把值取出作为 state 的初始值
3. 可以使用插件封装：`vuex-persist` `vuex-persistedstate`，内部实现都是通过 订阅 `mutation` 变化做同意处理，通过插件选项控制哪些需要持久化

## Vuex 有什么缺点

- 相较于 redux，vuex已经相当简便了。但模块使用的比较频繁，对TS支持也不够好
- 需要配合 mapXX 使用，还有 `namespaced` 命名空间
- 使用 pinia

## Composition API 和 Options API 有什么不同

- Composition API 是一组 API，包括：`Reactivity API`、生命周期钩子、依赖注入，使用户通过导入函数的方式编写vue组件；而 Options API 则通过声明组件选项的对象形式编写组件
- 前者简洁、高效服用逻辑，解决了 `mixins` 的各种缺点
- 前者具有更加敏捷的代码组织能力，对TS支持更友好 
