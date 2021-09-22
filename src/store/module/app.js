import Vue from 'vue'
import store from "../../store";

export default {
  state: {
    control: true, // 侧边栏展开状态
    route_current: {}, // 当前的路由信息
    convert_header_active_index: 0, // 转换页当前Tab选择项index，默认第一项
    convert_header_active_name: 'myConvert', // 转换页当前Tab选择项名称，默认第一项
  },
  getters: {},
  mutations: {},
  actions: {
    // 更新侧边栏状态
    update_aside_status({state}, data) {
      state.control = data
    },
    // 更新当前路由信息，侧边栏菜单路由
    update_route_current({state}, data) {
      state.route_current = data
    },
    // 更新转换页面当前选中的Tab信息
    update_convert_header_active({state}, data) {
      // // 如果未登录，不允许进入我的转换
      // if (data.tab.id === 1 && !store.state.convert.convert_user_info.uflag){
      //   store.dispatch('update_login_model_status', true)
      //   return
      // }
      state.convert_header_active_index = data.index
      state.convert_header_active_name = data.tab.component_name
    },
  }
}
