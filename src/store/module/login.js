import Vue from 'vue'
import * as config from '../../api/config'
import http from '../../api/request'

export default {
  state: {
    login_info: {}, // 登录信息
    model_status: false, // 登录弹窗显示状态
    user_info: JSON.parse(localStorage.getItem('userInfo') || '{}')
  },
  getters: {},
  mutations: {
    // 更新用户信息
    update_user_info(state, data) {
      state.user_info = data
    }
  },
  actions: {
    // 更新登录弹窗显示状态
    update_login_model_status({state}, data) {
      state.model_status = data
    },
    // 获取登录信息
    get_login_info({state}) {
       return new Promise((resolve, reject) => {
         http.get(config.GET_LOGIN_INFO)
           .then(res => {
             state.login_info = res
             resolve(res)
           })
           .catch(err => {
             reject(err)
           })
       })
    }
  }
}
