<template>
  <section class="_flex_column_space_between">
    <header class="_flex_between_center">
      <div class="_flex_column_align_start">
        <h1>编辑个人资料</h1>
        <span>确保你的信息完整</span>
      </div>
<!--      <SpeedButton v-if="!editor" @confirm="editor = true">编辑</SpeedButton>-->
<!--      <div class="_flex_center" v-else>-->
<!--        <SpeedButton type="cancel" style="margin-right: 20px" @confirm="editor = false">取消</SpeedButton>-->
<!--        <SpeedButton @confirm="editor = false">完成</SpeedButton>-->
<!--      </div>-->
    </header>
    <article class="_common_scroll_wrap" :disabled="false">
      <!--头像-->
      <div class="setting_item">
        <div class="setting_toolbar _flex_between_center">
          <div class="_flex_column_align_start">
            <h1>我的头像</h1>
            <span>点击头像进行更换</span>
          </div>
          <div>
            <Upload
                v-model="user_info.user_headpic || url"
                @change="handle_change_avatar"
            />
          </div>
        </div>
      </div>
      <!--用户名-->
      <div class="setting_item" :class="{'setting_item_active': editor_user_name}" style="margin-top: 0">
        <div class="setting_toolbar _flex_between_center">
          <div class="_flex_column_align_start">
            <h1>个人姓名</h1>
            <span>{{userInfo.user_name}}</span>
          </div>
          <div class="collapse _flex_center" @click="editor_user_name = !editor_user_name">编辑</div>
        </div>
        <div class="collapse_content" :style="editor_user_name ? { height: '87px' } : { height: 0 }">
          <div class="common_input">
            <input v-model.trim="userInfo.user_name" type="text" maxLength="10" placeholder="请输入用户名称">
          </div>
          <SpeedButton
              radius="8px"
              text="提交"
              @confirm="update_user_name"
              :disabled="!userInfo.user_name || userInfo.user_name === user_info.user_name"
          />
        </div>
      </div>
      <!--登录密码-->
      <!--<div class="setting_item" :class="{'setting_item_active': editor_password}">
        <div class="setting_toolbar _flex_between_center">
          <div class="_flex_column_align_start">
            <h1>登录密码</h1>
            <span>已设置</span>
          </div>
          <div class="collapse _flex_center" @click="editor_password = !editor_password">编辑</div>
        </div>
        <div class="collapse_content" :style="editor_password ? { height: '133px' } : { height: 0 }">
          <div class="common_input">
            <input v-model.trim="form.password" type="password" maxLength="32" placeholder="请输入登录密码">
            <i class="el-icon-success" v-if="form.password.length"></i>
            <i class="el-icon-error" v-else-if="form.password"></i>
          </div>
          <div class="common_input" style="margin-top: 10px">
            <input v-model.trim="form.confirm_password" type="password" maxLength="32" placeholder="请再次输入登录密码">
            <i class="el-icon-success" v-if="form.password && form.password === form.confirm_password"></i>
            <i class="el-icon-error" v-else-if="form.confirm_password && form.password !== form.confirm_password"></i>
          </div>
          <SpeedButton
              radius="8px"
              text="提交"
              @confirm="update_password"
              :disabled="form.password && form.password !== form.confirm_password"
          />
        </div>
      </div>-->
      <!--绑定手机-->
      <div class="setting_item" :class="{'setting_item_active': editor_phone}">
        <div class="setting_toolbar _flex_between_center">
          <div class="_flex_column_align_start">
            <h1>绑定手机</h1>
            <span>{{user_info.phone || '未绑定'}}</span>
          </div>
          <div class="collapse _flex_center" @click="verify_phone">编辑</div>
        </div>
        <div class="collapse_content" :style="editor_phone ? { height: '132px' } : { height: 0 }">
          <div class="common_input">
            <input v-model.trim="form.phone" type="text" maxLength="11" placeholder="请输入新的手机号码">
          </div>
          <div class="_flex_item_center" style="margin-top: 10px">
            <div class="common_input">
              <input class="email" v-model.trim="form.verification" type="text" maxLength="6" placeholder="输入6位短信验证码">
            </div>
            <SpeedButton class="verify_button" v-if="!code_time" @confirm="common.look(send_code, 3000)" :disabled="form.phone && form.phone.length !== 11">发送验证码</SpeedButton>
            <SpeedButton class="verify_button" v-else>重发 ({{code_time}}秒)</SpeedButton>
          </div>
          <SpeedButton
              radius="8px"
              text="提交"
              @confirm="update_phone"
              :disabled="form.verification && form.verification.length !== 6"
          />
        </div>
      </div>
      <!--绑定邮箱-->
      <div class="setting_item" :class="{'setting_item_active': editor_email}">
        <div class="setting_toolbar _flex_between_center">
          <div class="_flex_column_align_start">
            <h1>绑定邮箱</h1>
            <span>{{user_info.user_email || '未绑定'}}</span>
          </div>
          <div class="collapse _flex_center" @click="verify_email">编辑</div>
        </div>
        <div class="collapse_content" :style="editor_email ? { height: '132px' } : { height: 0 }">
          <div class="common_input">
            <input v-model.trim="form.email" type="text" maxLength="32" placeholder="请输入新的邮箱">
          </div>
          <div class="_flex_item_center" style="margin-top: 10px">
            <div class="common_input">
              <input class="email" v-model.trim="form.code" type="text" maxLength="6" placeholder="输入6位邮箱验证码">
            </div>
            <SpeedButton class="verify_button" v-if="!email_code_time" @confirm="common.look(send_code, 3000)" :disabled="!form.email">发送验证码</SpeedButton>
            <SpeedButton class="verify_button" v-else>重发 ({{email_code_time}}秒)</SpeedButton>
          </div>
          <SpeedButton
              radius="8px"
              text="提交"
              @confirm="update_email"
              :disabled="form.code && form.code.length !== 6"
          />
        </div>
      </div>
    </article>

    <!--修改手机号身份验证弹窗-->
    <Verify v-model="verify_model" :type="verify_type" @confirm="verify_phone_success" />
  </section>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import speed_upload_avatar from "../common/speed_upload_avatar";
  import verify from "./components/verify";
  import avatar from '../../assets/img/avatar.png'
  import * as common from '../../utils/common';
  import * as config from '../../api/config';
  import OSS from '../../utils/oss'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        common,
        userInfo: JSON.parse(localStorage.getItem('userInfo') || '{}'), // 用户信息
        editor: false, // 整体编辑状态
        url: avatar, // 用户默认头像
        editor_user_name: false, // 用户名称编辑
        // 信息
        form: {
          password: '',
          confirm_password: '',
          phone: '',
          verification: '',
          email: '',
          code: '',
        },
        editor_password: false, // 登录密码编辑
        verify_model: false, // 修改手机号、邮箱身份验证弹窗
        verify_type: '', // email or phone123
        verify_phone_status: false, // 修改手机号身份验证结果
        code_time: 0, // 手机验证码倒计时
        editor_phone: false, // 绑定手机编辑
        verify_email_status: false, // 修改邮箱身份验证结果
        email_code_time: 0, // 邮箱验证码倒计时
        editor_email: false, // 绑定邮箱编辑
      }
    },
    created() {
      // 获取用户信息
      this._getUserInfo()
    },
    computed: {
      ...mapState({
        user_info: state => state.login.user_info, // 用户信息
      })
    },
    methods: {
      /**
       * @description 用户头像上传oss
       * @param {String} file: 图片
       */
      handle_change_avatar(file) {
        this.userInfo.user_headpic = file
        // 更新用户信息
        this._updateUserInfo(true)
      },
      /**
       * @description 修改用户名称
       */
      update_user_name() {
        if (!this.userInfo.user_name) {
          this.$message.error(`请输入个人姓名`)
          return
        }
        if (this.userInfo.user_name === this.user_info.user_name) {
          this.$message.info(`修改重复，请输入新的名称`)
          return
        }
        // 更新用户信息
        this._updateUserInfo(true)
        this.$message.success(`个人姓名已更换成功`)
        this.editor_user_name = false
      },
      /**
       * @description 校验手机号
       */
      verify_phone() {
        this.verify_type = 'phone'
        if (this.user_info.phone && !this.verify_phone_status) {
          this.verify_model = true
        }else {
          this.editor_phone = !this.editor_phone
        }
      },
      /**
       * @description 校验手机号成功
       */
      verify_phone_success() {
        if (this.verify_type === 'phone') {
          this.verify_phone_status = true
          this.editor_phone = true
        } else {
          this.verify_email_status = true
          this.editor_email = true
        }
        this.verify_model = false
      },
      // 发送验证码
      send_code() {
        let { phone, email } = this.form
        let data = {}
        let url = ''
        if (this.verify_type === 'phone') {
          if (!common.isPhone(phone)) {
            this.$message.error(`请输入正确的手机号`)
            return
          }
          this.form.verification = ''
          data = {
            phone,
            checkUser: 5
          }
          url = config.SEND_PHONE_CODE
        }else {
          if (!common.isEmail(email)) {
            this.$message.error(`请输入正确的邮箱`)
            return
          }
          this.form.code = ''
          data = {
            user_email: email,
            checkUser: 5
          }
          url = config.SEND_EMAIL_CODE
        }
        this.http.post(url, data)
          .then(res => {
            // 设置60秒延迟发送
            if (this.verify_type === 'phone') {
              clearInterval(time_int)
              this.code_time = 59
              let time_int = setInterval(() => {
                this.code_time--
                if (this.code_time === 0) {
                  clearInterval(time_int)
                }
              }, 1000)
            } else {
              clearInterval(time_int)
              this.email_code_time = 59
              let time_int = setInterval(() => {
                this.email_code_time--
                if (this.email_code_time === 0) {
                  clearInterval(time_int)
                }
              }, 1000)
            }
          })
          .catch(err => {

          })
      },
      /**
       * @description 修改用户绑定手机号
       */
      update_phone() {
        let { phone, verification } = this.form
        if (!common.isPhone(phone)) {
          this.$message.error(`请输入正确的手机号`)
          return
        }
        if (!verification) {
          this.$message.error(`请输入正确的短信验证码`)
          return
        }
        let data = {
          phone,
          code: verification
        }
        this.http.post(config.BIND_PHONE, data)
          .then(res => {
            this.userInfo.phone = phone
            // 更新用户信息
            this._updateUserInfo(false)
            this.$message.success(`用户绑定的手机号已更换成功`)
            this.editor_phone = false
            this.verify_phone_status = false
            this.form.phone = ''
            this.form.verification = ''
          })
          .catch(err => {

          })
      },
      /**
       * @description 校验邮箱
       */
      verify_email() {
        this.verify_type = 'email'
        if (this.user_info.user_email && !this.verify_email_status) {
          this.verify_model = true
        }else {
          this.editor_email = !this.editor_email
        }
      },
      /**
       * @description 修改用户绑定邮箱
       */
      update_email() {
        let { email, code } = this.form
        if (!common.isEmail(email)) {
          this.$message.error(`请输入正确的邮箱`)
          return
        }
        if (!code) {
          this.$message.error(`请输入正确的邮箱验证码`)
          return
        }
        let data = {
          email,
          code,
        }
        this.http.post(config.BIND_EMAIL, data)
          .then(res => {
            this.userInfo.user_email = email
            // 更新用户信息
            this._updateUserInfo(false)
            this.$message.success(`用户绑定的邮箱号已更换成功`)
            this.editor_email = false
            this.verify_email_status = false
            this.form.email = ''
            this.form.code = ''
          })
          .catch(err => {

          })
      },
      /**
       * @description 获取用户信息
       */
      _getUserInfo() {

      },
      /**
       * @description 更新用户信息
       * @param {Boolean} status: 为true正常发送，为fasle不发送修改接口，默认为true
       */
      _updateUserInfo(status) {
        let { user_name, user_headpic } = this.userInfo
        let obj = Object.assign(this.user_info, this.userInfo)
        localStorage.setItem('userInfo', JSON.stringify(obj))
        this.$store.commit('update_user_info', obj)
        // if (!status) return
        // let data = {
        //   user_name,
        //   user_headpic,
        // }
        // this.http.post(config.UPDATE_USER_INFO, data)
        //   .then(res => {
        //
        //   })
        //   .catch(err => {
        //
        //   })
      }
    },
    components: {
      SpeedButton: speed_button,
      Upload: speed_upload_avatar,
      Verify: verify
    }
  }
</script>

<style lang="less" scoped>
  section {
    width: 100%;
    height: 100%;
    margin-left: 20px;
    animation: fade-bottom .5s 0s;

    header {
      width: 100%;
      height: 100px;
      min-height: 100px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 0 45px;

      h1 {
        font-size: 20px !important;
        font-weight: bold;
        color: #3A3A3A;
      }

      span {
        margin-top: 8px;
        color: rgba(28, 28, 28, 0.5);
      }
    }

    article {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      margin-top: 20px;
      overflow: auto;

      h1 {
        font-size: 16px;
        font-weight: bold;
        color: #3A3A3A;
      }

      span {
        margin-top: 8px;
        color: rgba(28, 28, 28, 0.5);
        font-size: 13px;
      }

      .setting_item {
        padding: 10px 55px 0 45px;
        transition: all 0.3s;
        margin-top: 10px;

        &:first-of-type {
          margin-top: 0px;
        }

        .setting_toolbar {
          height: 90px;
          border-bottom: 1px rgba(151, 151, 151, 0.15) solid;
        }

        .collapse {
          width: 60px;
          height: 60px;
          /*text-decoration: underline;*/
          color: rgba(1, 91, 212, 1);
          cursor: pointer;
        }

        .collapse_content {
          transition: all 0.3s;
          overflow: hidden;
          margin-top: -10px;
          width: 260px;

          .common_input {
            height: 35px;
            border-radius: 3px;

            input {
              height: 35px;
              line-height: 35px;
            }

            .el-icon-success,
            .el-icon-error {
              position: absolute;
              right: 12px;
              top: 50%;
              transform: translateY(-50%);
              font-size: 16px;
              color: #CBCBCB;
            }

            .el-icon-success {
              color: limegreen;
            }

            .el-icon-error {
              color: orangered;
            }
          }

          .verify_button {
            margin: 0 0 0 10px !important;
            width: 130px !important;
            border-radius: 2px !important;
            background-color: #d5daff;
            color: #1165D6;
            font-size: 12px !important;
            padding: 9px 10px;
            letter-spacing: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            line-height: 34px !important;
          }

          .speed_button {
            height: 35px;
            line-height: 35px;
            margin-top: 10px;
            width: 100%;
            border-radius: 3px !important;
          }
        }
      }

      .setting_item_active {
        background-color: rgba(17, 101, 214, 0.1);
        padding-bottom: 30px;

        .setting_toolbar {
          border-bottom-color: transparent;
        }
      }

    }

    article[disabled] {
      opacity: 0.6;
      pointer-events: none;
    }
  }
</style>
