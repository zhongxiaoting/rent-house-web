const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    open: true,
    port: 3000,
    proxy: {
      // 百度地图定位接口api
      '/baiduMap': {
        target: 'http://api.map.baidu.com/location/ip',
        pathRewrite: { '^/baiduMap': '' },
        changeOrigin: true,
        secure: false
      },
      '/jobRent': {
        target: 'http://127.0.0.1:8000/',
        pathRewrite: { '^/jobRent': '' },
        changeOrigin: true,
        secure: false
      }
    }
  }
})
