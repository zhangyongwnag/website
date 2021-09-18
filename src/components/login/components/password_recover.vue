<template>
  <article>
    <div class="login_from" v-if="check_email_status == 'success'">
      <h2>修改密码</h2>
      <div class="common_input" style="margin-top: 4px">
        <input v-model="from.verification" type="text" maxLength="6" placeholder="输入邮箱验证码"
               @input="handle_change('code')">
        <i class="el-icon-success" v-if="from.check_verification == 1"></i>
        <i class="el-icon-error" v-else-if="from.check_verification == 2"></i>
      </div>
      <span>由于网络原因，可能会有延迟。如果你10分钟没收到，<span class="_link" style="margin: 0" @click="send_code">请在此发送验证码到电子邮件</span></span>
      <div class="common_input" style="margin-top: 18px">
        <input v-model="from.password" type="password" maxLength="32" placeholder="输入新密码">
        <i class="el-icon-success" v-if="from.password"></i>
      </div>
      <div class="common_input" style="margin-top: 38px">
        <input v-model="from.confirm_password" type="password" maxLength="32" placeholder="再次输入密码">
        <i class="el-icon-success" v-if="from.password && from.password === from.confirm_password"></i>
        <i class="el-icon-error" v-else-if="from.confirm_password && from.password !== from.confirm_password"></i>
      </div>
      <div class="login_button _flex_center" @click="submit" v-waves :disabled="from.check_verification != 1 || (from.password && from.password != from.confirm_password)">确认</div>
    </div>
    <div class="login_from" v-else>
      <h2>身份验证</h2>
      <p>请输入您的电子邮件地址。我们将向您发送一封电子邮件以重置您的密码。</p>
      <div class="common_input" style="margin-top: 4px">
        <i class="el-icon-message"></i>
        <input class="email" v-model.trim="email" type="email" maxLength="32" placeholder="请输入邮箱"
               @input="handle_change('email')">
        <i class="el-icon-success" v-if="check_email_status == 'true'"></i>
        <i class="el-icon-error" v-else-if="check_email_status && check_email_status != 'true'"></i>
      </div>
      <span class="check_result" v-if="check_email_status && check_email_status != 'true'">&nbsp;{{check_email_status}}</span>
      <div class="login_button _flex_center" @click="send_code" v-waves :disabled="check_email_status != 'true'">确认</div>
    </div>
  </article>
</template>

<script>
  import * as common from '../../../utils/common'
  import * as config from '../../../api/config'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        email: '', // 验证的邮箱
        check_email_status: '', // 检测邮箱有效结果
        from: {
          verification: '', // 验证码
          check_verification: '', // 验证码是否有效 1有效 2无效
          password: '', // 密码
          confirm_password: '' // 确认密码
        }
      }
    },
    computed: {
      ...mapState({
        login_info: state => state.login.login_info
      }),
    },
    methods: {
      /**
       * @description 输入框触发验证
       * @param {String} type: 触发的类型
       */
      handle_change(type) {
        switch (type) {
          case 'email':
            common.throttle(this._verify_email, 1000);
            break;
          case 'code':
            common.throttle(this._verify_code, 1000)
        }
      },
      // 验证邮箱是否可用
      _verify_email() {
        if (!this.email) {
          this.check_email_status = ''
          return;
        }
        if (!common.isEmail(this.email)) {
          this.$message.error(`请输入正确的邮箱`)
          this.check_email_status = '请输入正确的邮箱'
          return
        }
        this.http.post(config.CHECK_EMAIL, {user_email: this.email})
          .then(res => {
            if (res.data) {
              this.check_email_status = 'true'
            }
          })
          .catch(err => {
            this.check_email_status = err.msg
          })
      },
      // 发送验证码
      send_code() {
        this.check_email_status = 'success'
        this.from.verification = ''
        this.from.check_verification = ''
        let data = {
          user_email: this.email,
          checkUser: this.login_info.client_user
        };
        this.http.post(config.RESET_PASS_WORD_EMAIL_CODE, data)
          .then(res => {
            if (res.data) {
              this.$message.success(`发送验证码成功，请注意接收`)
            }
          })
          .catch(err => {
            this.$message.success(`发送验证码成功，请重新发送`)
          })
      },
      // 验证邮箱验证码是否有效
      _verify_code() {
        let { verification } = this.from
        if (!verification) {
          this.from.check_verification = ''
          return
        }
        let data = {
          data: this.email,
          code: verification
        }
        this.http.post(config.CHECK_EMAIL_CODE, data)
          .then(res => {
            if (res.data) {
              this.from.check_verification = 1
            }
          })
          .catch(err => {
            console.log(err)
            this.from.check_verification = 2
          })
      },
      // 提交重置密码
      submit() {
        let { verification, password, confirm_password  } = this.from
        let data = {
          user_email: this.email,
          code: verification,
          user_pwd: password,
          confirm_password,
        }
        this.http.post(config.RESET_PASS_WORD, data)
          .then(res => {
            this.$notify({
              title:'提示',
              message:'密码重置成功',
              type:'success',
              showClose:true,
            })
            this.$emit('change', 'login')
            localStorage.setItem('reset_email', this.email)
          })
          .catch(err => {

          })
      }
    },
  }
</script>

<style lang="less" scoped>
  .login_from {
    width: 98%;
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
      font-size: 19px;
      margin-top: -20px;
      font-weight: normal;
    }

    p {
      font-size: 14px;
      color: #878787;
      text-align: center;
      line-height: 20px;
    }

    span {
      margin: 8px 5px -4px;
      color: #A2A2A2;
      font-size: 13px;
      line-height: 20px;
    }

    .common_input {
      .el-icon-message {
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
        color: #CBCBCB;
      }

      .email {
        padding: 0 40px;
      }

      .el-icon-success,
      .el-icon-error {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 20px;
        color: #CBCBCB;
      }

      .el-icon-success {
        color: limegreen;
      }

      .el-icon-error {
        color: orangered;
      }
    }

    .login_button {
      margin-top: 28px;
      width: 50%;
      height: 36px !important;
      line-height: 36px !important;
    }

    .check_result {
      font-size: 13px;
      display: block;
      width: 100%;
      color: #F5222D;
      margin: 5px 0 -20px;
    }
  }
</style>

