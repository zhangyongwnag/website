<template>
  <section id="container">
    <aside :class="control ? 'aside_spread' : 'aside_shrink'">
      <div style="height: 100%;min-width: 200px;opacity: 0;"
           :class="control ? '_flex_column_space_between aside_show' : '_flex_column_space_between aside_hide'">
        <div class="aside_content">
          <div class="user_info _flex_item_center">
            <div class="user_avatar _flex_center">
<!--              <img src="../../assets/img/avatar.png" alt="">-->
              <img :src="user_info.user_headpic" alt="">
            </div>
            <div class="user_name">{{user_info.user_name}}</div>
          </div>
          <nav @click="handle_change({path:'/index',children:[{name:'index'}]})">
            <div class="item">性别：<span style="color: #333">女</span></div>
            <div class="item">年龄：<span style="color: #333">20岁</span></div>
            <div class="item">院校：<a target="_blank" href="http://www.whmc.edu.cn/" style="color: #333; text-decoration: none" class="_link">武汉传媒学院</a></div>
            <div class="item">学历：<span style="color: red">本科</span></div>

            <el-divider content-position="left">其他信息</el-divider>
            <div class="item" style="align-items:flex-start;flex-direction: column;margin-top: 0">
              现居地址：
              <span style="color: #333;margin-top: 0.06667rem; font-size: 0.10667rem">湖北省武汉市江夏区藏龙岛凤凰大道2号</span>
            </div>
            <div class="item" style="align-items:flex-start;flex-direction: column">
              我的邮箱：
              <span style="color: #333; word-break: break-word;margin-top: 0.06667rem; font-size: 0.10667rem;" class="_link">1363944092@qq.com</span>
            </div>
            <div class="item" style="align-items:flex-start;flex-direction: column">
              兴趣爱好：
              <span style="color: #333; word-break: break-word;margin-top: 0.06667rem; font-size: 0.10667rem">古筝</span>
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
  /deep/ .el-divider__text, .el-link {
    font-size: 16px;
    color: #ccc;
  }

  /deep/ .el-divider__text.is-left{
    left: 35px;
  }

  /deep/ .el-divider--horizontal {
    margin: 100px 0 40px 0
  }
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
      /*padding: 51px 0 0 40px;*/
      transition: all .3s;

      .user_info {
        cursor: pointer;
        padding: 51px 0 0 40px;

        .user_avatar {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          margin-right: 15px;
          border: 1px #eee solid;
          overflow: hidden;

          img {
            width: 100%;
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
        margin-top: 40px;

        .item {
          margin-bottom: 28px;
          font-size: 18px;
          color: #838383;
          display: flex;
          align-items: center;
          letter-spacing: 2px;
          width: 240px;
          padding: 0px 0 0 48px;

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
      padding: 0 0 36px 48px;
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
