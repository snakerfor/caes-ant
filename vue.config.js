const path = require('path')
const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./config/plugin.config')

function resolve (dir) {
  return path.join(__dirname, dir)
}

// vue.config.js
const vueConfig = {
  configureWebpack: {
    externals: {
      // key表示包名(import foo from 'xx' 里的xx)
      // value表示window下的全局变量名(库暴露出来的namespace,可查lib对应的webpack配置里的library字段)
      'vue': 'Vue',
      'axios': 'axios',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'moment': 'moment',
      '@antv/g2': 'G2',
      '@antv/data-set': 'DataSet',
      'ant-design-vue': 'antd'
    },
    plugins: [
      // Ignore all locale files of moment.js
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.IgnorePlugin(/moment\//)
    ]
  },

  chainWebpack: config => {
    config.resolve.alias.set('@$', resolve('src'))

    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    /* svgRule.oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-loader')
      .loader('vue-svg-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
    */
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          // 'primary-color': '#F5222D',
          // 'link-color': '#00FF00',
          // 'border-radius-base': '4px',
          // 'body-background': '#E6FFFB',RUOYI
          // 'layout-body-background':'',// 页面背景色
          'layout-header-background': '#002329', // 导航栏背景色
          'menu-dark-submenu-bg': '#00474f', // 导航栏子菜单背景色
          'layout-trigger-background': '#1890ff', // 导航栏标题背景色
          'primary-color': '#13c2c2', // 全局主色
          'link-color': '#13c2c2', // 链接色
          'success-color': '#52c41a', // 成功色
          'warning-color': '#faad14', // 警告色
          'error-color': '#f5222d', // 错误色
          'font-size-base': '14px', // 主字号
          'heading-color': 'rgba(0, 0, 0, .85)', // 标题色
          'text-color': 'rgba(0, 0, 0, .65)', // 主文本色
          'text-color-secondary': 'rgba(0, 0, 0, .45)', // 次文本色
          'disabled-color': 'rgba(0, 0, 0, .25)', // 失效色
          'border-radius-base': '0', // 组件/浮层圆角
          // 'border-color-base': '#00474f', // 边框色
          'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)' // 浮层阴影
        },
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // development server port 8000
    port: 8000,
    proxy: {
      '/api': {
        // target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
        // target: 'https://www.easy-mock.com/mock/5ce2743c2dda2d3b1365fb1b/ruoyi-cloud',
        target: 'http://gateway.com:9527',
        pathRewrite: { '^/api': '' },
        ws: false,
        changeOrigin: true
      }
    }
  },

  // disable source map in production
  productionSourceMap: false,
  lintOnSave: undefined,
  // babel-loader no-ignore node_modules/*
  transpileDependencies: []
}

// 如果你不想在生产环境开启换肤功能，请打开下面注释
// if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
// add `ThemeColorReplacer` plugin to webpack plugins
vueConfig.configureWebpack.plugins.push(createThemeColorReplacerPlugin())
// }

module.exports = vueConfig
