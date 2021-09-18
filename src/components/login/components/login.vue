<template>
  <div class="login_from">
    <el-divider style="width: 63%">{{method_info.name}}</el-divider>
    <div class="common_input" style="margin-top: 4px">
      <input v-model.trim="from.username" :type="method_info.input_type" :maxLength="method_info.id_max_length"
             :placeholder="method_info.id_placeholder">
    </div>
    <div class="common_input" style="margin-top: 18px">
      <input v-model.trim="from.password" :type="method_info.ps_input_type" :maxLength="method_info.ps_max_length"
             :placeholder="method_info.ps_placeholder">
      <div class="verify_button _flex_center" v-if="method_info.type != 3 && !code_time" :disabled="!from.username"
           @click="common.look(send_code, 3000)">发送
      </div>
      <div class="verify_button _flex_center" v-else-if="method_info.type != 3 && code_time" disabled-gray>重发 ({{code_time}}秒)</div>
    </div>
    <div class="login_other_methods _flex_between_center">
      <span @click="handle_change(3)" v-if="method_info.type != 3">&nbsp;密码登录&nbsp;</span>
      <span @click="handle_change(1)" v-if="method_info.type != 1 && method_info.type != 3">&nbsp;手机登录&nbsp;</span>
      <span @click="handle_change(2)" v-if="method_info.type != 2">&nbsp;验证码登录&nbsp;</span>
      <span @click="handle_click('recover')" v-if="method_info.type == 3">&nbsp;忘记密码？&nbsp;</span>
    </div>
    <div class="login_button _flex_center" v-waves :disabled="!from.username || !from.password" @click="common.look(login, 2000)">登录</div>
    <div class="register">
      还没有注册？<span class="_link" @click="handle_click('register')">去注册</span>
    </div>
  </div>
</template>

<script>
  import * as common from '../../../utils/common'
  import * as config from '../../../api/config'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        common,
        // 登录方式
        methods_list: [
          {
            type: 1,
            name: '手机号登录',
            id_placeholder: '输入手机号',
            ps_placeholder: '输入验证码',
            input_type: 'tel',
            ps_input_type: 'text',
            id_max_length: 11,
            ps_max_length: 4
          },
          {
            type: 2,
            name: '验证码登录',
            id_placeholder: '输入邮箱',
            ps_placeholder: '输入验证码',
            input_type: 'email',
            ps_input_type: 'text',
            id_max_length: 32,
            ps_max_length: 6
          },
          {
            type: 3,
            name: '密码登录',
            id_placeholder: '输入邮箱',
            ps_placeholder: '输入密码',
            input_type: 'email',
            ps_input_type: 'password',
            id_max_length: 32,
            ps_max_length: 32
          },
        ],
        // 登录信息
        from: {
          type: 3, // 登录方式
          username: localStorage.getItem('reset_email') || '', // 用户名
          password: '', // 密码
        },
        code_time: 0 // 验证码倒计时
      }
    },
    watch: {
      // 切换登录方式清空密码、验证码输入值
      'from.type': {
        handler(value) {
          this.from.password = ''
        }
      }
    },
    computed: {
      ...mapState({
        login_info: state => state.login.login_info
      }),
      // 登录方式的信息
      method_info() {
        return this.methods_list.filter(item => item.type == this.from.type)[0]
      }
    },
    methods: {
      /**
       * @description 切换登录方式
       * @param {Number} value: 1, 2, 3
       */
      handle_change(value) {
        this.from.type = value
      },
      /**
       * @description 点击去注册 or 找回密码
       * @param {String} value: 类型值 login / register / recover
       */
      handle_click(value) {
        this.$emit('change', value)
      },
      // 发送验证码
      send_code() {
        let {type, username, password, verification} = this.from;
        let data = {}; // 参数
        let url = {}; // 地址
        this.verify(type, username, password, false)
          .then(_ => {
            // 1-手机号登录 2-邮箱验证码登录
            switch (type) {
              case 1:
                data = {
                  phone: username,
                  checkUser: 1
                };
                url = config.SEND_PHONE_CODE;
                break;
              case 2:
                data = {
                  user_email: username,
                  checkUser: 1
                };
                url = config.SEND_EMAIL_CODE;
                break;
            }
            this.http.post(url, data)
              .then(res => {
                // 设置60秒延迟发送
                clearInterval(time_int)
                this.code_time = 59
                let time_int = setInterval(() => {
                  this.code_time--
                  if (this.code_time == 0) {
                    clearInterval(time_int)
                  }
                }, 1000)
              })
              .catch(err => {

              })
          })
          .catch(_ => {

          })
      },
      /**
       * @description 登录
       */
      async login() {
        let {type, username, password} = this.from;
        let data = {}; // 参数
        let url = {}; // 地址
        // 验证输入信息合法
        await this.verify(type, username, password, true)
          .then(_ => {
            // 1-手机号登录 2-邮箱验证码登录 3-邮箱密码登录
            switch (type) {
              case 1:
                data = {
                  phone: username,
                  code: password
                };
                url = config.LOGIN_BY_PHONE;
                break;
              case 2:
                data = {
                  user_email: username,
                  code: password
                };
                url = config.LOGIN_BY_EMAIL_CODE;
                break;
              case 3:
                data = {
                  user_email: username,
                  user_pwd: password
                };
                url = config.LOGIN_BY_EMAIL;
                break;
            }
            this.http.post(url, data)
              .then(res => {
                if (res.data) {
                  // 登录成功提示
                  this._notify(res.data)
                  // 存储用户信息
                  this._saveUserInfo(res.data)
                }
              })
              .catch(err => {

              })
          })
          .catch(_ => {

          })
      },
      /**
       * @description 验证登录信息
       * @param {Number} type: 登录方式
       * @param {String} username: 登录账号
       * @param {String} password: 登录密码
       * @param {Boolean} status: 是否验证密码、验证码
       */
      verify(type, username, password, status) {
        if (!username) {
          this.$message.error(type != 1 ? `请输入登录邮箱` : `请输入登录手机号`)
          return Promise.reject()
        }
        if (type == 1 && !common.isPhone(username)) {
          this.$message.error(`请输入正确的手机号`)
          return Promise.reject()
        }
        if (type != 1 && !common.isEmail(username)) {
          this.$message.error(`请输入正确的邮箱`)
          return Promise.reject()
        }
        if (status && !password) {
          this.$message.error(type != 3 ? `请输入登录验证码` : `请输入登录密码`)
          return Promise.reject()
        }
        return Promise.resolve()
      },
      /**
       * @description 存储用户信息
       * @param {Object} data: 用户信息
       */
      _saveUserInfo(data) {
        localStorage.setItem('userInfo', JSON.stringify(data))
        localStorage.setItem('access_token', data.access_token)
        // common.setCookie('access_token', data.access_token)
        this.$store.dispatch('update_login_model_status', false)
        this.$router.replace( { path: '/' } )
        this.$store.commit('update_user_info', data)
        // this.$store.dispatch('update_aside_status', false)
      },
      _notify(user_info) {
        this.$notify({
          title: '登录成功',
          message: `用户名：${user_info.user_name}`,
          type: 'success',
          showClose: true,
        })
      }
    },
    components: {}
  }
</script>

<style lang="less">
  .login_from {
    width: 98%;
    display: flex;
    flex-direction: column;
    align-items: center;

    .login_other_methods {
      width: 100%;
      margin: 14px 0;
      color: #A2A2A2;
      font-size: 13px;

      span {
        cursor: pointer;
      }
    }

    .common_input {
      border: 0;
      box-shadow: 0 0 0 1px #c3c2c2;
    }

    .login_button,
    .verify_button {
      width: 100%;
      background-color: #195AF6;
      height: 45px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      border-radius: 31px;
      cursor: pointer;
    }

    .verify_button {
      position: absolute;
      right: -2px;
      top: 0;
      width: 90px;
      border-radius: 25px;
      height: 40px;
      line-height: 40px;
    }

    .register {
      text-align: center;
      margin: 25px 0;
      color: #707070;
      user-select: none;
    }
  }
</style>
