<template>
  <div class="login_from">
    <el-divider style="width: 63%">{{method_info.name}}</el-divider>
    <div class="common_input" style="margin-top: 4px">
      <input v-model.trim="from.username" :type="method_info.input_type" :maxLength="method_info.id_max_length"
             :placeholder="method_info.id_placeholder">
    </div>
    <div class="common_input" style="margin-top: 18px" v-if="method_info.type == 2">
      <input v-model.trim="from.password" type="password" maxLength="32" placeholder="输入密码">
    </div>
    <div class="common_input" style="margin-top: 18px">
      <input v-model.trim="from.verification" type="text" :maxLength="method_info.ps_max_length" placeholder="输入验证码">
      <div class="verify_button _flex_center" v-if="!code_time" :disabled="!from.username" @click="common.look(send_code, 3000)">发送</div>
      <div class="verify_button _flex_center" v-else disabled disabled-gray>重发 ({{code_time}}秒)</div>
    </div>
    <div class="login_other_methods _flex_between_center">
      <span @click="handle_change(2)" v-if="method_info.type == 1">&nbsp;邮箱注册&nbsp;</span>
      <span @click="handle_change(1)" v-else-if="method_info.type == 2">&nbsp;手机号注册&nbsp;</span>
    </div>
    <div class="login_button _flex_center" v-waves :disabled="disabled_register_button" @click="common.look(login, 2000)">注册</div>
    <div class="register">
      已有账号，<span class="_link" @click="handle_click('login')">去登录</span>
    </div>
    <div style="font-size: 13px;opacity: 0.8">
      <el-checkbox v-model="from.agreement" style="margin-right: 4px"></el-checkbox>
      我已阅读并同意
      <span class="_link" @click="turn_to_setting">《隐私政策》</span>
    </div>
  </div>
</template>

<script>
  import * as common from '../../../utils/common'
  import * as config from '../../../api/config'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        common,
        // 注册方式
        methods_list: [
          {
            type: 1,
            name: '手机号注册',
            id_placeholder: '输入手机号',
            ps_placeholder: '输入验证码',
            input_type: 'tel',
            id_max_length: 11,
            ps_max_length: 4
          },
          {
            type: 2,
            name: '邮箱注册',
            id_placeholder: '输入邮箱',
            ps_placeholder: '输入验证码',
            input_type: 'email',
            id_max_length: 32,
            ps_max_length: 6
          },
        ],
        // 注册信息
        from: {
          type: 1, // 注册方式
          username: '', // 用户名
          password: '', // 密码
          verification: '', // 验证码
          agreement: true // 隐私协议
        },
        code_time: 0 // 验证码倒计时
      }
    },
    watch: {
      // 切换注册方式清空密码、验证码输入值
      'from.type': {
        handler(value) {
          this.from.password = ''
          this.from.verification = ''
        }
      }
    },
    computed: {
      ...mapState({
        login_info: state => state.login.login_info
      }),
      // 注册方式的信息
      method_info() {
        return this.methods_list.filter(item => item.type == this.from.type)[0]
      },
      // 禁用注册按钮
      disabled_register_button() {
        let {type, username, password, verification, agreement} = this.from
        if (type == 1) {
          return !username || !verification || !agreement
        } else {
          return !username || !password || !verification || !agreement
        }
      }
    },
    created() {

    },
    methods: {
      /**
       * @description 切换注册方式
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
        this.verify(type, username, password, verification, false)
          .then(_ => {
            // 1-手机号注册 2-邮箱验证码注册
            switch (type) {
              case 1:
                data = {
                  phone: username,
                  checkUser: 2
                };
                url = config.SEND_PHONE_CODE;
                break;
              case 2:
                data = {
                  user_email: username,
                  checkUser: 2
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
       * @description 注册
       */
      async login() {
        let {type, username, password, verification} = this.from;
        let data = {}; // 参数
        let url = {}; // 地址
        // 验证输入信息合法
        await this.verify(type, username, password, verification, true)
          .then(_ => {
            // 1-手机号注册 2-邮箱验证码注册
            switch (type) {
              case 1:
                data = {
                  phone: username,
                  code: verification
                };
                url = config.LOGIN_BY_PHONE;
                break;
              case 2:
                data = {
                  user_email: username,
                  user_pwd: password,
                  code: verification
                };
                url = config.REGISTER_BY_EMAIL;
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
       * @description 验证注册信息
       * @param {Number} type: 注册方式
       * @param {String} username: 注册账号
       * @param {String} password: 注册密码
       * @param {String} verification: 注册验证码
       * @param {Boolean} status: 是否验证密码、验证码
       */
      verify(type, username, password, verification, status) {
        if (!username) {
          this.$message.error(type == 1 ? `请输入注册手机号` : `请输入注册邮箱`)
          return Promise.reject()
        }
        if (type == 1 && !common.isPhone(username)) {
          this.$message.error(`请输入正确的注册手机号`)
          return Promise.reject()
        }
        if (type == 2 && !common.isEmail(username)) {
          this.$message.error(`请输入正确的注册邮箱`)
          return Promise.reject()
        }
        // 是否验证密码、验证码
        if (status) {
          if (type == 2 && !password) {
            this.$message.error(`请输入注册密码`)
            return Promise.reject()
          }
          if (!verification) {
            this.$message.error(`请输入注册验证码`)
            return Promise.reject()
          }
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
      },
      // 跳转到设置页面 - 隐私协议
      turn_to_setting() {
        this.$store.dispatch('update_login_model_status', false)

        this.$router.push({ name: 'setting', params: { id: 4} })
      }
    },
    components: {}
  }
</script>
