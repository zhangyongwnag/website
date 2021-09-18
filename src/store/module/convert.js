import Vue from 'vue'
import convert_list from "../../utils/convert_list";
import http from "../../api/request";
import * as config from "../../api/config";
import * as utils from '../../utils/convert_utils'
import store from "../../store";

export default {
  state: {
    convert_list, // 转换列表
    convert_info: {}, // 转换信息
    convert_config: [], // 转换配置信息
    file_list: new Map([]), // 选择的文件列表
    convert_time: 3, // 剩余转换次数
    convert_user_info: {}, // 用户的转换信息
  },
  getters: {
    // 过滤file_list map 类型为 arr 类型
    fileList(state) {
      let arr = []
      state.file_list.forEach(item => {
        arr.push(state.file_list.get(item.name))
      })
      return arr
    }
  },
  mutations: {},
  actions: {
    // 更新当前选择的转换类型信息
    update_convert_info({state}, data) {
      state.convert_info = state.convert_list.filter(item => item.file_type == data)[0]
    },
    // 获取转换配置信息
    get_convert_config({state}) {
      return new Promise((resolve, reject) => {
        http.get(config.GET_CONVERT_CONFIG)
          .then(res => {
            if (res.data) {
              // 更新转换类型配置信息
              state.convert_config = res.data
              // 更新选择的列表
              state.file_list = new Map([])
              resolve(res.data)
            } else {
              reject(res)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 获取用户转换信息
    get_convert_info({state}) {
      return new Promise((resolve, reject) => {
        http.get(config.GET_CONVERT_INFO, { file_type: state.convert_info.file_type + 1000 || 1001})
          .then(res => {
            if (res.data) {
              resolve(res.data)
              state.convert_user_info = res.data
            } else {
              reject(res)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    // 更新选择的文件列表
    update_file_list({state}, data) {
      data.status = data.status || 1 // 1 未开始 2 正在进行中 3 成功 4 失败 8 重新创建任务 10 输入密码 11 合并准备就绪 12 转换次数不足，升级VIP 13 游客需要登录
      // 过滤size单位字节为KB
      data.size_filter = utils.getFileSize(data.size)
      // 获取消耗次数
      data.time = utils.getExpendTime(data.size)
      // 如果转换次数不足，则强制更新状态
      if (state.convert_time >= data.time) {
        // 设置转换次数
        state.convert_time = state.convert_time - data.time
      }else {
        if (JSON.parse(localStorage.getItem('userInfo')).uflag) {
          // 设置升级VIP
          data.status = 12
        }else {
          // 登录转换
          data.status = 13
        }
      }
      // 设置进度
      data.percent = 0
      // 过滤名称
      data.filename = data.name.split(".").splice(0, data.name.split(".").length - 1).join(".");
      state.file_list.set(data.name, data)
      state.file_list = new Map(state.file_list)
    },
    // 强制更新file_list
    set_file_list({state}, data) {
      state.file_list = new Map(data ? [] : state.file_list)
    },
    // 覆盖file_list
    cover_file_list({state}, data) {
      state.file_list = data
    },
    // 更新剩余转换次数
    update_convert_time({state}, data) {
      if (data) {
        state.convert_time = data
      }else {
        store.dispatch('get_convert_info')
          .then(res => {
            state.convert_time = res.count
          })
      }
    }
  }
}
