import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Interview',
  description: 'Just playing around.',
  lang: 'zh-CN',
  lastUpdated: true,
  head: [['link', { rel: 'icon', type: 'image/svg+xml', href: '/home.jpg' }]],

  markdown: {},

  themeConfig: {
    siteTitle: 'Interview Note',
    logo: '/home.jpg',

    socialLinks: [{ icon: 'github', link: 'https://github.com/WalkAlone0325' }],

    nav: [{ text: 'HTTP', link: '/http/index', activeMatch: '/http/' }],

    sidebar: {
      '/http/': [
        {
          items: [
            { text: 'http 面试题', link: '/http/index' },
            { text: 'vite 面试题', link: '/http/vite' },
            { text: 'webpack 面试题', link: '/http/webpack' },
            { text: 'css 面试题', link: '/http/css' },
            { text: 'html 面试题', link: '/http/html' }
          ]
        }
      ]
    }
  }
})
