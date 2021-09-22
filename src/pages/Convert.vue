<template>
  <div id="container">
    <Tab/>
    <div class="content">
      <component :is="component"></component>
    </div>
  </div>
</template>

<script>
  import Tab from '../components/convert/tab'
  import * as config from '../api/config'
  import {mapState} from 'vuex'
  import http from '../api/request'

  export default {
    data() {
      return {
        component: '' // 动态引入的组件
      }
    },
    watch: {
      // 监听Tab变化，动态引入组件
      convert_header_active_name: {
        handler(value) {
          this.component = () => import("../components/convert/" + value + "/index")
        },
        immediate: true
      }
    },
    computed: {
      ...mapState({
        convert_header_active_name: state => state.app.convert_header_active_name
      })
    },
    beforeRouteEnter(to, from, next) {
      if (!localStorage.getItem('userInfo')) {
        http.post(config.GET_GUEST_INFO, {guest_mark: window.uuid_ || (Math.random() * 10000)})
          .then(res => {
            localStorage.setItem('userInfo', JSON.stringify(res.data))
            localStorage.setItem('access_token', res.data.access_token)
            // common.setCookie('access_token', data.access_token)
            next(vm => {
              vm.$store.commit('update_user_info', res.data)
            });
          })
      }else {
        next(vm => {

        });
      }
    },
    created() {
      // // 设置Tab，默认常用转换
      // this.$store.dispatch('update_convert_header_active', {
      //   tab: {
      //     id: this.$route.params.tab && this.$route.params.tab.id || 2,
      //     component_name: this.$route.params.tab && this.$route.params.tab.component_name || 'basicConvert'
      //   },
      //   index: this.$route.params.index || 1
      // })
      // 获取用户转换信息
      this.$store.dispatch('get_convert_info')
    },
    components: {Tab,}
  }
</script>

<style lang="less" scoped>
  #container {
    width: 100%;
    background-color: #F7F7F7;
    display: flex;
    flex-direction: column;

    .content {
      width: 100%;
      height: 100%;
    }
  }
</style>
