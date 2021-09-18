<template>
  <section id="container">
    <aside :class="control ? 'aside_spread' : 'aside_shrink'">
      <div style="height: 100%;min-width: 200px;opacity: 0;"
           :class="control ? '_flex_column_space_between aside_show' : '_flex_column_space_between aside_hide'">
        <div class="aside_content">
          <div class="user_info _flex_item_center" v-if="user_info.uflag && user_info.user_id">
            <el-popover
                placement="bottom-start"
                width="206"
                transition="el-zoom-in-top"
                popper-class="popper"
                v-model="show"
            >
              <div class="popover">
                <div class="popover_item _flex_item_center" @click="turn('setting')">
                  <img src="../../assets/img/convert/user_setting.png" alt="">
                  基本设置
                </div>
                <div class="popover_item _flex_item_center" @click="turn('quit')">
                  <img src="../../assets/img/convert/user_quit.png" alt="">
                  退出登录
                </div>
              </div>
              <div slot="reference" class="user_avatar _flex_center">
                <img v-if="user_info.user_headpic" :src="user_info.user_headpic" alt="">
                <img v-else src="../../assets/img/avatar.png" alt="">
              </div>
            </el-popover>
            <div class="user_name _ellipsis">{{user_info.user_name}}</div>
          </div>
          <div class="user_info _flex_item_center" @click="$store.dispatch('update_login_model_status', true)" v-else>
            <div class="user_avatar _flex_center">
              <img src="../../assets/img/avatar.png" alt="">
            </div>
            <div class="user_name">未登录</div>
          </div>
          <nav>
            <div v-for="(route,i) in routes_filter" class="nav_item" @click="handle_change(route,i)">
              <img v-if="i == 0" src="../../assets/img/aside/index.png" :alt="route.children[0].meta.title" />
              <img v-else-if="i == 1" src="../../assets/img/aside/convert.png" :alt="route.children[0].meta.title" />
              <span
                  :style="route.children[0].name == route_current.name ? {color:route.children[0].meta.active,textShadow:`0.5px 0px 1px ${route.children[0].meta.active}`} : ''">{{route.children[0].meta.title}}</span>
            </div>
          </nav>
        </div>
        <div class="aside_setting" @click="handle_change({path:'/setting',children:[{name:'setting'}]})">
          <img src="../../assets/img/setting.png" alt="">
          <span>设置&nbsp;&&nbsp;隐私</span>
        </div>
      </div>
      <div class="aside_control" @click="handle_control">
        <img src="../../assets/img/aside/aside_control_icon.png" alt="控制" id="control"
             :style="control ? {transform:'rotateZ(0deg)'} : {transform:'rotateZ(180deg)'}">
      </div>
    </aside>
    <article>
      <router-view></router-view>
    </article>
  </section>
</template>

<script>
  import routes from '../../router/routers'
  import * as common from '../../utils/common'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        show: false // 展示气泡信息
      }
    },
    watch: {
      // 监听路由变化，更细当前路由信息
      '$route': {
        handler(route) {
          this._update_route_current(route)
        },
        immediate: true
      },
    },
    computed: {
      ...mapState({
        control: state=> state.app.control,
        route_current: state => state.app.route_current,
        user_info: state => state.login.user_info
      }),
      // 过滤routes
      routes_filter() {
        return routes.filter(route => !route.meta || !route.meta.hideMenu)
      }
    },
    created() {
      // 同源下监听storage变化
      window.addEventListener("storage", event => {
        if (event.key === 'userInfo') {
          this.$store.commit('update_user_info', Boolean(event.newValue) ? JSON.parse(event.newValue) : {})
          this.$router.push({path: '/'})
        }
      });
    },
    methods: {
      /**
       * @description 路由切换
       * @param {Object} route: 路由信息
       */
      handle_change(route) {
        if (this.route_current.name == route.children[0].name) return
        // if (route.children[0].name === 'setting' && !this.user_info.uflag) {
        //   this.$store.dispatch('update_login_model_status', true)
        //   return;
        // }
        this.$router.push({path: route.path})
      },
      /**
       * @description 点击头像信息
       * @param {String} type: 点击设置还是退出登录 'setting' or 'quit'
       */
      turn(type) {
        this.show = false
        if (type == 'setting') {
          this.handle_change({path:'/setting',children:[{name:'setting'}]})
        } else {
          localStorage.removeItem('userInfo')
          localStorage.removeItem('access_token')
          // common.delCookie('access_token')
          this.$store.commit('update_user_info', {})
          this.$router.replace({path: '/index'})
        }
      },
      /**
       * @description 更新当前路由信息
       * @param {Object} route: 路由信息
       */
      _update_route_current(route) {
        this.$store.dispatch('update_route_current', route)
      },
      /**
       * @description 操作侧边栏缩放按钮
       */
      handle_control() {
        localStorage.setItem('aside', !this.control)
        this.$store.dispatch('update_aside_status', !this.control)
      }
    },
    components: {}
  }
</script>

<style lang="less" scoped>
  .popover {
    padding: 0 10px;

    .popover_item {
      font-size: 15px;
      color: #6F7786;
      padding: 12px 0;
      cursor: pointer;

      &:first-of-type {
        border-bottom: 1px #f3f3f3 solid;
      }

      img {
        width: 16px;
        margin-right: 10px;
      }
    }
  }

  #container {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
  }

  aside {
    width: 260px;
    min-width: 260px;
    height: 100%;
    background: #FFFFFF;
    box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.25);
    position: relative;
    transition: all .5s;
    z-index: 1;

    .aside_content {
      width: 100%;
      padding: 51px 0 0 40px;
      transition: all .3s;

      .user_info {
        cursor: pointer;

        .user_avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          margin-right: 15px;
          border: 1px #eee solid;
          overflow: hidden;

          img {
            width: 108%;
          }
        }

        .user_name {
          font-size: 17.5px;
          color: #333333;
          text-shadow: 0.5px 0 0.5px #999;
          width: 120px;
        }
      }

      nav {
        margin-top: 60px;

        .nav_item {
          margin-bottom: 28px;
          font-size: 18px;
          color: #838383;
          display: flex;
          align-items: center;
          cursor: pointer;
          white-space: nowrap;
          letter-spacing: 2px;

          img {
            margin-right: 16px;
            width: 20px;
          }
        }
      }
    }

    .aside_setting {
      font-weight: 400;
      color: #838383;
      font-size: 15px;
      padding: 0 0 36px 44px;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all .3s;

      img {
        margin-right: 10px;
      }
    }

    .aside_control {
      position: absolute;
      right: -28px;
      top: 50%;
      width: 28px;
      height: 60px;
      border-radius: 0 60px 60px 0;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: flex-start;
      cursor: pointer;
      border-left: 0;
      background-color: #fff;
      box-shadow: 2px 0px 3.5px 0px rgba(0, 0, 0, 0.2);
      z-index: 1;

      img {
        width: 10px;
        margin-left: 5px;
        transition: all .5s;
      }
    }
  }

  .aside_shrink {
    width: 0;
    min-width: 0
  }

  .aside_spread {
    width: 260px;
    min-width: 260px
  }

  article {
    width: 100%;
    height: 100%;
  }

  @keyframes aside_show {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 0.1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  .aside_show {
    animation: aside_show .3s .2s forwards;
  }

  @keyframes aside_hide {
    0% {
      opacity: 1;
    }
    10% {
      opacity: 0.5;
    }
    50% {
      opacity: 0.1;
    }
    100% {
      opacity: 0;
      width: 0;
      min-width: 0;
    }
  }

  .aside_hide {
    animation: aside_hide .3s 0s forwards;
  }
</style>
