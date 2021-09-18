<template>
  <div>
    <el-dialog :visible.sync="$store.state.login.model_status" :before-close="before_close" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <PasswordRecover v-if="type == 'recover'" @change="handle_change"/>
      <article v-else v-loading="loading">
        <div class="login_methods" >
          <img @click="common.look(oAuth, 2000, 'wx')" src="../../assets/img/login/login_wx.png" alt=""/>
          <img @click="common.look(oAuth, 2000, 'qq')" src="../../assets/img/login/login_qq.png" alt=""/>
          <Login v-if="type == 'login'" @change="handle_change" ref="login" />
          <Register v-else-if="type == 'register'" @change="handle_change"/>
        </div>
      </article>
    </el-dialog>

    <!--第三方登录-->
<!--    <el-dialog :visible.sync="auth_login">-->
<!--      <iframe id="auth_login" :src="auth_url" height="450px" width="90%" frameborder="0" sandbox="allow-scripts allow-same-origin"></iframe>-->
<!--    </el-dialog>-->
  </div>
</template>

<script>
  import * as common from '../../utils/common'
  import * as config from '../../api/config'
  import login from "./components/login";
  import register from "./components/register";
  import password_recover from "./components/password_recover";
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        common,
        loading: false, // loaing加载
        type: 'login', // 展示的组件类型 login / register / recover
        timeInt: '', // 定时器
        auth_login: false, // 第三方登录弹窗
        auth_url: '', // 第三方登录URL
      }
    },
    watch: {
      // 监听登录模块，添加键盘事件
      '$store.state.login.model_status': {
        handler(status) {
          if (status) {
            window.addEventListener('keyup', this.login)
          }else {
            window.removeEventListener('keyup', this.login)
          }
        }
      },
      // 监听登录弹窗关闭，清除定时器
      model_status(value) {
        if (value) {
          // 获取登录信息
          this.loading = true
          this.$store.dispatch('get_login_info')
            .then(res => {
              this.loading = false
            })
            .catch(err => {
              this.loading = false
            })
        } else {
          clearInterval(this.timeInt)
          setTimeout(() => {
            // 设置为登录模块
            this.type = 'login'
            // 清除临时账号
            localStorage.removeItem('reset_email')
          }, 1000)
        }
      }
    },
    computed: {
      ...mapState({
        login_info: state => state.login.login_info, // 登录授权信息
        model_status: state => state.login.model_status, // 登录弹窗信息
      })
    },
    created() {
      // 获取登录信息
      // this.$store.dispatch('get_login_info')
    },
    methods: {
      /**
       * @description 关闭前的回调
       * @param {Function} done: 回调
       */
      before_close(done) {
        // this.$confirm('确认关闭？')
        //   .then(() => {
        this.$store.dispatch('update_login_model_status', false)
        done()
        // done();
        // })
        // .catch(() => {
        // });
      },
      /**
       * @description 调用子组件的登录
       * @param {Object} event: event对象
       */
      login(event){
        if (event.keyCode == 13) {
          common.look(this.$refs.login.login, 2000)
        }
      },
      /**
       * @description 切换展示的组件类型
       * @param {String} value: 类型值 login / register / recover
       */
      handle_change(value) {
        this.type = value
      },
      /**
       * @description 第三方授权登录
       * @param {String} type: 登录方式
       */
      oAuth(type) {
        let url = ''; // 授权地址
        switch (type) {
          case 'wx':
            url = this.login_info.data.weixin
            break;
          case 'qq':
            url = this.login_info.data.qq
            break;
          default:
            return
        }
        window.sdk._loginByTab(url)
        this._checkStatus()
        // // this.auth_url = '../../../static/html/auth.html?auth_url=' + encodeURIComponent(url)
        // // this.auth_login = true
        // let url = ''; // 授权地址
        // let width = 700; // 窗口宽度
        // let height = 500; // 窗口高度
        // let top = (window.screen.height - height) / 2; // 距离顶部的高度
        // let left = (window.screen.width - width) / 2; // 距离左边的宽度
        // switch (type) {
        //   case 'wx':
        //     url = this.login_info.data.weixin
        //     break;
        //   case 'qq':
        //     url = this.login_info.data.qq
        //     break;
        //   default:
        //     return
        // }
        // let project = window.open(
        //   url,
        //   "_blank",
        //   `toolbar=no,location=no,resizable=no,top=${top},left=${left},width=${width},height=${height},menubar=no,status=no,scrollbars=no`
        // );
        // // 检测登录结果
        // this._checkStatus(project)
      },
      /**
       * @description 检测登录状态
       */
      _checkStatus() {
        clearInterval(this.timeInt)
        this.timeInt = setInterval(() => {
          this.http.post(config.GET_LOGIN_RESULT, { client_user: this.login_info.client_user })
            .then(res => {
              // 检测登录，为1时成功，为0时失败
              if (res.data.status == 1) {
                // project ? project.close() : ''
                clearInterval(this.timeInt)
                res.data.user_info.user_name = res.data.user_info.user_name || 'User'
                // 登录成功存储用户信息
                this._saveUserInfo(res.data)
                // 登录成功提示
                common.look(this._notify, 2000, res.data.user_info)
                window.sdk._closeLoginTab()
              }
            })

            // // 如果子窗口已经关闭，检测结束
            // if(project && project.closed == true) {
            //   clearInterval(this.timeInt)
            // }
            .catch(err => {
              document.getElementById('aaa').innerText = JSON.stringify(err)
            })
        }, 1000)
      },
      /**
       * @description 存储用户信息
       * @param {Object} data: 用户信息
       */
      _saveUserInfo(data) {
        localStorage.setItem('userInfo', JSON.stringify(data.user_info))
        localStorage.setItem('access_token', data.access_token)
        // common.setCookie('access_token', data.access_token)
        this.$store.dispatch('update_login_model_status', false)
        this.$router.replace( { path: '/' } )
        this.$store.commit('update_user_info', data.user_info)
        // this.$store.dispatch('update_aside_status', false)
      },
      /**
       * @description 登录成功提示
       * @param {Object} user_info: 用户信息
       */
      _notify(user_info) {
        this.$notify({
          title: '登录成功',
          message: `用户名：${user_info.user_name}`,
          type: 'success',
          showClose: true,
        })
      }
    },
    components: {
      Login: login,
      Register: register,
      PasswordRecover: password_recover
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-loading-mask {
    left: -1px;
    background-color: transparent;
    cursor: not-allowed;

    .el-loading-spinner {
      opacity: 0;
    }
  }

  /deep/ .el-dialog {
    width: 700px;
    border-radius: 12px;
  }

  /deep/ .el-dialog__body {
    display: flex;
    justify-content: center;
  }

  /deep/ .el-divider--horizontal {
    width: 64%;
  }

  article {
    width: 330px;

    .login_methods {
      width: 100%;
      cursor: pointer;

      img {
        width: 100%;
        margin-left: -4px;

        &:first-of-type {
          margin-bottom: 5px;
          width: 334px
        }
      }
    }
  }
</style>
