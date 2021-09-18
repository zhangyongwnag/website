/**
 * @date 2019/12/10 16:37
 * @author Zyw_20160118
 * @description 封装axios,公共参数,统一处理错误码
 * @query config response error
 * @return response or config
 */

import axios from 'axios'
import qs from 'qs'
import * as common from "../utils/common";
import * as config from './config'
import { Message, Notification } from 'element-ui'
import store from "../store/index";
import router from '../router'

let padding_request = new Set(); // 当前正在发送的url请求

/**
 * @description 获取token
 */
const getTokenByUserInfo = () => localStorage.getItem('access_token') || ''

axios.interceptors.request.use(config => {
  // 利用cancelToken 取消当次请求
  // config.cancelToken = new axios.CancelToken(e => {
  //   // 在这里阻止重复请求，上个请求未完成时，相同的请求不会再次执行
  //   padding_request.has(config.url) ? e(`${config.url}---重复请求被中断`) : padding_request.add(config.url)
  // })
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  // 相同请求不得在600毫秒内重复发送，反之继续执行
  // setTimeout(() => {
  //   padding_request.delete(response.config.url)
  // }, 600)
  // 请求成功业务逻辑
  if (response.data.code == 200) {
    return response.data
  } else {
    switch (response.data.code) {
      case 421:
        Message.error('登录信息已失效，请重新登录')
        localStorage.removeItem('userInfo')
        // common.delCookie('access_token')
        localStorage.removeItem('access_token')
        store.dispatch('update_login_model_status', true)
        store.commit('update_user_info', {})
        router.replace({path: '/index'})
        break;
      default:
        Message.error(response.data.msg)
        return Promise.reject(response.data)
    }
  }
}, error => {
  // axios.isCancel true 取消 false 失败
  // 取消请求的url
  if (axios.isCancel(error)) {
    console.warn(error)
    console.table([error.message.split('---')[0]], 'cancel')
  } else {
    // 请求失败
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      Message.warning('请求超时')
    } else if (error.message == 'Network Error') {
      Message.error('网络连接异常，请重试')
    } else {
      Message.error('未知错误', error.message)
    }
  }
  return Promise.reject(error)
})

/**
 * formData未处理
 * @param {string} method 请求方式
 * @param {string} url 请求地址
 * @param {obj} params 请求参数
 * @param {boolean} time 如果不存在一直请求，反之10秒结束
 */
function apiAxios(method, url, params, time) {
  let timestamp = new Date().getTime()
  let headers = {
    accesstoken: getTokenByUserInfo(),
    'Content-Type': 'application/json',
    timestamp,
    sign: common.encryptParam(params, timestamp)
  }
  !headers.accesstoken ? delete headers.accesstoken : ''
  let httpDefault = {
    method: method,
    url: url,
    data: method == 'POST' || method == 'PUT' || method == 'DELETE' ? JSON.stringify(params) : null,
    params: method == 'GET' ? params : null,
    timeout: time || '',
    headers: headers
  }
  return new Promise((resolve, reject) => {
    axios(httpDefault)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default {
  get: function (url, params, time, status) {
    return apiAxios('GET', url, params, time)
  },
  post: function (url, params, time, status) {
    return apiAxios('POST', url, params, time)
  },
  put: function (url, params, time, status) {
    return apiAxios('PUT', url, params, time)
  },
  delete: function (url, params, time, status) {
    return apiAxios('DELETE', url, params, time)
  }
}


