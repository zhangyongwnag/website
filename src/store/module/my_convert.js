import http from '../../api/request'
import * as config from '../../api/config'
import * as common from '../../utils/common'

export default {
  state: {
    loading: false, // 加载ing
    tab_active_info: {}, // 我的转换下面选中的tab信息
    vip_info: {}, // VIP信息
    recharge_record: [], // 购买记录列表
    convert_list: [], // 转换列表
    package_info: {}, // 套餐信息
    package_id: '', // 选择的套餐ID
  },
  getters: {},
  mutations: {
    // 清空vip_info
    clear_vip_info(state) {
      state.vip_info = {}
    }
  },
  actions: {
    // 更新Loading状态
    update_lading({state}, data) {
      state.loading = data
    },
    // 更新当前选中的tab
    update_active_tab_info({state}, data) {
      state.tab_active_info = data
    },
    // 获取VIP信息
    get_vip_info({state}) {
      return new Promise((resolve, reject) => {
        http.get(config.GET_VIP_INFO)
          .then(res => {
            if (res.data) {
              state.vip_info = res.data
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
    // 获取购买记录
    get_recharge_record({state}) {
      return new Promise((resolve, reject) => {
        http.get(config.GET_RECHARGE_RECORD)
          .then(res => {
            state.loading = false
            if (res.data) {
              res.data.list.map(item => {
                item.createdTime = common.dateResult(item.createdTime * 1000, 'yyyy-MM-dd hh:mm:ss')
                item.expire_time = common.dateResult(item.expire_time * 1000, 'yyyy-MM-dd hh:mm:ss')
              })
              state.recharge_record = res.data.list
              resolve(res.data.list)
            } else {
              reject(res)
            }
          })
          .catch(err => {
            state.loading = false
            reject(err)
          })
      })
    },
    // 获取转换列表
    get_convert_list({state}, { current_page, page_size }) {
      return new Promise((resolve, reject) => {
        let data = {
          pageNum: current_page,
          pageSize: page_size
        }
        http.get(config.GET_CONVERT_LIST, data)
          .then(res => {
            state.loading = false
            if (res.data) {
              res.data.list.map(item => {
                item.expire_time = common.dateResult(item.expire_time * 1000, 'yyyy-MM-dd hh:mm:ss')
              })
              state.convert_list = res.data.list
              resolve(res.data)
            } else {
              reject(res)
            }
          })
          .catch(err => {
            state.loading = false
            reject(err)
          })
      })
    },
    // 获取套餐列表
    get_package_info({state}) {
      return new Promise((resolve, reject) => {
        http.get(config.GET_PACKAGE, { vip_type: 1 })
          .then(res => {
            state.loading = false
            if (res.list) {
              state.package_info = res
              state.package_id = res.list[1].id
              resolve(res)
            } else {
              reject(res)
            }
          })
          .catch(err => {
            state.loading = false
            reject(err)
          })
      })
    },
    // 更新套餐ID
    update_package_id({state}, data) {
      state.package_id = data
    }
  }
}
