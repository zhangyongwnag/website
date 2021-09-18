import Vue from 'vue'
import Vuex from 'vuex'
// 修改state时在console打印，便于调试
import createLogger from 'vuex/dist/logger'
import app from './module/app' // 根目录
import myConvert from "./module/my_convert" // 我的转换页
import login from './module/login' // 登录相关
import convert from "./module/convert" // 转换相关
import common from './module/common' // 公共资源

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

const state = {}
const getters = {}
const mutations = {}
const actions = {}

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    app,
    myConvert,
    convert,
    login,
    common
  },
  // strict: debug,
  plugins: debug ? [createLogger()] : []
})
