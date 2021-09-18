<template>
  <el-dialog :visible.sync="show" :before-close="before_close" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
    <h1>身份验证</h1>
    <p style="margin: 20px 0 14px 2px">使用{{type === 'phone' ? '手机' + user_info.phone : '邮箱' + user_info.user_email}}验证，验证后进行下一步操作</p>
    <div class="_flex_item_center">
      <div class="common_input">
        <input class="email" v-model.trim="verification" type="text" maxLength="6" placeholder="输入6位验证码">
      </div>
      <SpeedButton class="verify_button" v-if="!code_time" @confirm="common.look(send_code, 3000)">发送验证码</SpeedButton>
      <SpeedButton class="verify_button" v-else>重发 ({{code_time}}秒)</SpeedButton>
    </div>
    <footer class="_flex_center">
      <SpeedButton
          text="确认"
          @confirm="submit"
          :disabled="verification.length !== 6"
      />
    </footer>
  </el-dialog>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import * as common from '../../../utils/common'
  import * as config from '../../../api/config'
  import { mapState } from 'vuex'

  export default {
    model: {
      prop: 'show',
      event: 'cancel'
    },
    props: {
      // 显示窗口
      show: {
        type: Boolean,
        default: false,
      },
      // 修改类型，邮箱 or 手机号
      type: {
        type: String,
      }
    },
    data() {
      return {
        common,
        verification: '', // 验证码
        code_time: 0, // 验证码倒计时
      }
    },
    computed: {
      ...mapState({
        user_info: state => state.login.user_info, // 用户信息
      })
    },
    methods: {
      /**
       * @description 关闭前的回调
       * @param {Function} done: 回调
       */
      before_close(done) {
        // this.$confirm('确认关闭？')
        //   .then(() => {
        this.$emit('cancel')
        // })
        // .catch(() => {
        // });
      },
      // 发送验证码
      send_code() {
        this.verification = ''
        let data = {}
        let url = ''
        if (this.type === 'phone') {
          data = {
            phone: this.user_info.phone,
            checkUser: 4
          }
          url = config.SEND_PHONE_CODE
        }else {
          data = {
            user_email: this.user_info.user_email,
            checkUser: 4
          }
          url = config.SEND_EMAIL_CODE
        }
        this.http.post(url, data)
          .then(res => {
            // 设置60秒延迟发送
            clearInterval(time_int)
            this.code_time = 59
            let time_int = setInterval(() => {
              this.code_time--
              if (this.code_time === 0) {
                clearInterval(time_int)
              }
            }, 1000)
          })
          .catch(err => {

          })
      },
      // 提交密码
      submit() {
        let data = {
          data: this.type === 'phone' ? this.user_info.phone : this.user_info.user_email,
          code: this.verification
        }
        this.http.post(config.CHECK_EMAIL_CODE, data)
          .then(res => {
            if (res.data) {
              this._success()
            }
          })
          .catch(err => {
            this._success()
          })
      },
      /**
       * @description 验证码校验成功
       */
      _success() {
        this.$message.success(`验证码正确`)
        this.$emit('confirm')
        this._reset()
      },
      // 重置
      _reset() {
        this.verification = ''
      }
    },
    components: {
      SpeedButton: speed_button
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-dialog {
    width: 500px !important;
  }

  /deep/ .el-dialog__body{
    padding: 0 45px;
  }

  h1 {
    font-size: 22px;
    color: #353535;
    font-weight: bold;
    text-align: center;
    margin-top: -5px;
  }

  .common_input {
    border-radius: 7px 0 0 7px;
    display: flex;
    border-right: 0;
  }

  .verify_button {
    width: 150px;
    height: 40px;
    line-height: 25px;
    border-radius: 0 7px 7px 0 !important;
    letter-spacing: 0;
    padding: 8px 10px;
  }

  footer {
    width: 100%;
    margin-top: 25px;

    .speed_button {
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      width: 40%;
      margin-bottom: 25px;
      border-radius: 7px !important;
    }
  }
</style>
