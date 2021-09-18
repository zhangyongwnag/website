<template>
  <div class="container">
    <nav>
      <div class="nav_item _flex_item_center" :class="nav.id == tab_active_info.id ? 'nav_item_active' : ''" v-for="(nav,index) in nav"
           @click="handle_change(nav,index)">
        <img :src="nav.id === tab_active_info.id ? nav.url_select : nav.url" alt="">
        {{nav.label}}
      </div>
    </nav>

    <!--动态组件-->
    <component :is="component_name" style="animation: fade-bottom .5s 0s;"></component>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import join from '../../../assets/img/convert/join.png'
  import vip from '../../../assets/img/convert/vip.png'
  import record from '../../../assets/img/convert/record.png'
  import group from '../../../assets/img/convert/group.png'
  import convertion from '../../../assets/img/convert/convertion.png'
  import join_select from '../../../assets/img/convert/join_select.png'
  import vip_select from '../../../assets/img/convert/vip_select.png'
  import record_select from '../../../assets/img/convert/record_select.png'
  import group_select from '../../../assets/img/convert/group_select.png'
  import convertion_select from '../../../assets/img/convert/convertion_select.png'

  export default {
    data() {
      return {
        nav: [
          // {
          //   label: '分销加盟',
          //   id: 1,
          //   component_name: 'join',
          //   url: join,
          //   url_select: join_select
          // },
          {
            label: '我的VIP',
            id: 2,
            component_name: 'vip',
            url: vip,
            url_select: vip_select
          },
          {
            label: '购买记录',
            id: 3,
            component_name: 'record',
            url: record,
            url_select: record_select
          },
          // {
          //   label: '多人共享',
          //   id: 4,
          //   component_name: 'group',
          //   url: group,
          //   url_select: group_select
          // },
          {
            label: '转换记录',
            id: 5,
            component_name: 'convertion',
            url: convertion,
            url_select: convertion_select
          }
        ],
        component_name: '', // 动态组件
      }
    },
    watch: {
      // 监听选中的tab信息，根据tab信息动态引入组件
      tab_active_info: {
        handler(v) {
          this.component_name = () => import(`./components/${v.component_name}/index`)
        },
        immediate: false
      }
    },
    computed: {
      ...mapState({
        tab_active_info: state => state.myConvert.tab_active_info
      })
    },
    created() {
      this.$store.dispatch('update_active_tab_info', this.nav[0])
    },
    methods: {
      /**
       * @description 切换菜单
       * @param {Object} nav: 菜单信息
       * @param {Number} index: 下标
       */
      handle_change(nav, index) {
        this.$store.dispatch('update_active_tab_info', nav)
      }
    },
    components: {}
  }
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 25px 40px 29px;

    nav {
      width: 326px;
      min-width: 326px;
      height: 100%;
      padding: 20px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;

      .nav_item {
        width: 100%;
        height: 42px;
        line-height: 42px;
        border-radius: 24px;
        color: #333;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all .3s;
        padding-left: 30px;
        letter-spacing: 1px;
        text-shadow: 0.5px 0 0.5px #999;

        img {
          width: 17px;
          margin-right: 14px;
        }
      }

      .nav_item:hover {
        background-color: rgba(17, 101, 214, 0.1);
      }

      .nav_item_active {
        background-color: rgba(17, 101, 214, 0.1);
        color: #1165D6;
        text-shadow: 0.5px 0 0px #1165D6;
      }
    }
  }
</style>
