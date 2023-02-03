const sitemapPlugin = require('sitemap-webpack-plugin').default

const routes = [
  '/',
  '/practice',
  '/kata',
  '/setting',
  '/summary',
  '/changelog',
  '/help',
  '/about',
  '/history',
  '/download'
]

process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_WEB_VERSION = '(12)'

const name = '木易跟打器'

module.exports = {
  pwa: {
    name,
    themeColor: '#1c1f24'
  },

  publicPath: process.env.NODE_ENV === 'production'
    ? '/'
    : '/',

  outputDir: 'docs',

  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = name
      return args
    })
    config.module.rule('md')
      .test(/\.md/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
    config.plugin('sitemap').use(sitemapPlugin, [
      {
        base: 'https://typer.owenyang.top',
        paths: routes,
        options: {
          filename: 'sitemap.xml',
          lastMod: true,
          changefreq: 'weekly'
        }
      }
    ])
  },
  productionSourceMap: false,

  pluginOptions: {
    prerenderSpa: {
      registry: undefined,
      renderRoutes: routes,
      useRenderEvent: true,
      headless: true,
      onlyProduction: true
    }
  }
}
