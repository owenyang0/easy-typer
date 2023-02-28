const sitemapPlugin = require('sitemap-webpack-plugin').default

const routes = [
  '/',
  '/practice',
  '/kata',
  '/reading',
  '/setting',
  '/summary',
  '/changelog',
  '/help',
  '/about',
  '/history',
  '/download'
]

const version = '(29)'
process.env.VUE_APP_VERSION = require('./package.json').version
process.env.VUE_APP_WEB_VERSION = version

const name = '木易跟打器'

module.exports = {
  pwa: {
    name,
    iconPaths: {
      faviconSVG: 'img/icons/favicon.svg',
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-180x180.png',
      maskIcon: null,
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    },
    appleMobileWebAppCapable: 'yes',
    assetsVersion: '26.1',
    display: 'standalone',
    themeColor: '#1c1f24',
    msTileColor: '#1c1f24',
    // // configure the workbox plugin
    // workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      // swSrc: 'dev/sw.js'
      // ...other Workbox options...
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'easy-typer-custom-cache',
            expiration: {
              maxAgeSeconds: 86400 * 30
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    }
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
          changefreq: 'daily',
          priority: 0.7
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
