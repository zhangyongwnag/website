<template>
  <div class="container">
    <nav>
      <div class="nav_item _flex_item_center" :class="nav.id == tab_active_id ? 'nav_item_active' : ''" v-for="(nav,index) in nav"
           @click="handle_change(nav,index)">
        <img :class="{'size': nav.size}" :src="tab_active_id === nav.id ? nav.url_select : nav.url" alt="" :style="nav.label === '语言' ? {marginTop: '-2.5px'} : {}">
        {{nav.label}}
      </div>
    </nav>

    <!--动态组件-->
    <Basic v-if="tab_active_id == 1" />
    <Language v-else-if="tab_active_id == 3" />
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import basic from "../components/setting/basic";
  import language from "../components/setting/language";
  import basic_image from '../assets/img/convert/basice.png'
  import basic_image_select from '../assets/img/convert/basic_select.png'
  import language_image from '../assets/img/convert/language.png'
  import language_image_select from '../assets/img/convert/language_select.png'

  export default {
    data() {
      return {
        // 菜单列表
        nav: [
          {
            label: '基本设置',
            id: 1,
            url: basic_image,
            url_select: basic_image_select
          },
          {
            label: '语言',
            id: 3,
            url: language_image,
            url_select: language_image_select
          },
        ],
        tab_active_id: 1 // 选中的菜单ID
      }
    },
    computed: {
      ...mapState({
        user_info: state => state.login.user_info, // 用户信息
      }),
    },
    created() {
      // 如果param存在，直接跳转
      if ('id' in this.$route.params) {
        this.$nextTick(() => {
          this.handle_change({ id: this.$route.params.id })
        })
      }
    },
    mounted() {
      // // 未登录不显示个人设置
      // if (!this.user_info.uflag) {
      //   this.tab_active_id = 2
      //   this.nav = this.nav.filter(item => item.id != 1)
      // }
    },
    methods: {
      /**
       * @description 切换菜单
       * @param {Object} nav: 菜单信息
       * @param {Number} index: 下标
       */
      handle_change(nav, index) {
        this.tab_active_id = nav.id
      }
    },
    components: {
      Basic: basic,
      Language: language,
    }
  }
</script>

<style lang="less" scoped>
  .size {
    width: 16px !important;
  }

  .container {
    display: flex;
    width: 100%;
    height: 100%;
    padding: 25px 40px 25px;
    background-color: #F7F7F7;

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
      }

      img {
        width: 17px;
        margin: -1px 14px 0 0;
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
