'use strict'

module.exports = {
  proxyList: {
    '/api': {
      target: 'http://rd.pc.api.speedpdf.com',
      changeOrigin: true,
      ws: true, // 如果是http不需要
      pathRewrite: {
        '^/api': ''
      }
    }
  }
}

