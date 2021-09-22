'use strict'
require('./check-versions')

const fs = require('fs'); // 文件系统
const path = require('path'); // 路径系统
const chalk = require('chalk'); // 控制台提示样式
const webpack = require('webpack'); // webpack核心文件
const development = process.env.NODE_TYPE == 'development'; // 是否为生产模式
const proxyConfig = require('./proxyConfig'); // 代理中间件
const {VueLoaderPlugin} = require('vue-loader'); // 编译vue文件核心插件
const CopyWebpackPlugin = require('copy-webpack-plugin') // 复制目录插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 输入html模板插件
const {CleanWebpackPlugin} = require('clean-webpack-plugin'); // 清除编译结果插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 压缩css插件和
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer'); // 打包结果可视化页面
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'); // 提取css单独文件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 压缩插件
const NotifierWebpackPlugin = require('friendly-errors-webpack-plugin') // 控制台输入友好信息插件
const notify = require('node-notifier') // 项目编译失败，系统桌面提示插件

let plugins = []; // 插件

if (development) {
  plugins = [
    new HtmlWebpackPlugin({
      title: '个人网站',
      inject: true,
      filename: 'index.html',
      template: path.resolve(__dirname, '../index.html'),
    }),
    // 显示热加载具体的文件，webpack 4.x版本development环境下默认存在，选择性配置
    new webpack.NamedModulesPlugin(),
    // 热模块替换
    new webpack.HotModuleReplacementPlugin(),
    // 终端友好提示
    new NotifierWebpackPlugin({
      // 编译正确提示
      compilationSuccessInfo: {
        messages: ['Compiler result at http://localhost:8080']
      },
      // 编译错误提示
      onErrors: (result, errors) => {
        if (result == 'error') {
          notify.notify({
            title: 'Webpack error',
            message: `${result}: ${errors[0].name}`,
            subtitle: errors[0].file || '',
            icon: path.resolve(__dirname, 'logo.png')
          })
        }
      },
      clearConsole: true, // 每次编译之前清除控制台
    }),
    // 绑定全局变量
    new webpack.DefinePlugin({
      'process.env.NODE_TYPE': JSON.stringify(process.env.NODE_TYPE)
    })
  ]
} else {
  plugins = [
    // 清除上次构建记录
    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, '../dist')]
    }),
    new HtmlWebpackPlugin({
      title: '个人网站',
      inject: true,
      filename: 'speedwork.html',
      template: path.resolve(__dirname, '../index.html'),
      minify: {
        removeComments: true, // 删除空格换行
        collapseWhitespace: true,
        removeRedundantAttributes: true, // 删除注释
        useShortDoctype: true,
        removeEmptyAttributes: true, // 删除空属性
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true, // 压缩js
        minifyCSS: true, // 压缩css
        minifyURLs: true
      }
    }),
    // 合并css
    new MiniCssExtractPlugin({
      // filename: 'css/[name].[hash:7].css',
      filename: 'css/[name].css',
    }),
    // 压缩css
    new OptimizeCSSPlugin(),
    // 压缩js
    new UglifyJsPlugin({
      sourceMap: false, // 使用sourceMap捕获错误
      parallel: true, // 多线程构建
      cache: true, // 开启缓存
      // uglifyOptions: {
      //   compress: {
      //     drop_console: true, // 放弃对 console 函数的调用
      //     drop_debugger: true, // 删除 debugger语句
      //   }
      // },
    }),
    // 复制static文件件
    new CopyWebpackPlugin({
      patterns: [{
        from: path.resolve(__dirname, '../static'),
        to: path.resolve(__dirname, '../dist/static'),
      }]
    }),
    // 打包分析
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: '3000',
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
    }),
  ]
}

module.exports = {
  entry: path.resolve(__dirname, '../src/index.js'),
  output: {
    // filename: 'js/[name].[hash:7].js',
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist'),
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      // 处理ES6语法
      {
        test: /\.(js)$/,
        use: {
          loader: 'babel-loader',
          options: {
            include: [path.resolve(__dirname, '../src')],
            exclude: /node_modules/
          }
        }
      },
      // 处理vue文件
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            include: [path.resolve(__dirname, '../src')]
          }
        }
      },
      // 处理css文件
      {
        test: /\.(css|less)$/,
        use: [
          development ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          'postcss-loader'
        ]
      },
      // 处理图片文件
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false, // 设为false，否则图片编译为 [object Module]
            limit: 10240, // 超过10k
            // name: 'image/[name].[hash:7].[ext]',
            name: 'image/[name].[ext]',
            // outputPath: 'image'
          }
        }
      },
      // 处理音视频文件
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            // name: 'media/[name].[hash:7].[ext]',
            name: 'media/[name].[ext]',
            // outputPath: 'media'
          }
        }
      },
      // 处理字体图表
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10240,
            // name: 'fonts/[name].[hash:7].[ext]',
            name: 'fonts/[name].[ext]',
            // outputPath: path.resolve(__dirname, ''),
            publicPath: '../'
          }
        }
      },
      // 处理cur文件
      {
        test: /\.(cur)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false, // 设为false，否则图片编译为 [object Module]
            limit: 10240, // 超过10k
            // name: 'image/[name].[hash:7].[ext]',
            name: 'cur/[name].[ext]',
            // outputPath: 'image'
          }
        }
      },
    ]
  },
  plugins: [
    // 处理vue代码
    new VueLoaderPlugin(),
    // 引入plugins插件
    ...plugins
  ],
  devServer: {
    clientLogLevel: 'warning', // 隐藏客户端编译过程/结果
    quiet: true, // 隐藏控制台编译结果
    host: '0.0.0.0', // host地址
    port: '8080', // 端口
    open: false, // 唤醒默认浏览器
    hot: true, // 热加载
    hotOnly: false, // 热加载不刷新
    proxy: proxyConfig.proxyList, // 代理
    overlay: {warnings: true, errors: true}, // 客户端显示报错信息
  },
  devtool: !development ? 'eval-source-mao' : false // 开发环境定位源文件
}
