process.env.VUE_APP_VERSION = require('./package.json').version

const name = '木易跟打器'

module.exports = {
  pwa: {
    name,
    themeColor: '#1c1f24'
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/easy-typer'
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
  },

  productionSourceMap: false
}
