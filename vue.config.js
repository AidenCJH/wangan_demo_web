const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 7000,
    client: {
      //将overlay设置为false即可
      overlay: false,
    },
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = '知识库助手'
        return args
      })
  },
  lintOnSave: false,
})
