<template>
  <el-dialog :visible.sync="show" :before-close="before_close" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
    <p style="margin: 10px 0 10px 2px">请设置文件的密码</p>
    <div class="common_input">
      <img src="../../../../assets/img/convert/password_icon.png" alt="">
      <input class="email" v-model.trim="password" type="password" maxLength="32" placeholder="请输入文件密码">
      <i class="el-icon-success" v-if="password.length"></i>
      <i class="el-icon-error" v-else-if="password"></i>
    </div>
    <p style="margin: 22px 0 10px 2px">请再次输入密码</p>
    <div class="common_input">
      <img src="../../../../assets/img/convert/password_icon.png" alt="">
      <input class="email" v-model.trim="confirm_password" type="password" maxLength="32" placeholder="请再次输入文件密码">
      <i class="el-icon-success" v-if="password && password === confirm_password"></i>
      <i class="el-icon-error" v-else-if="confirm_password && password !== confirm_password"></i>
    </div>
    <footer class="_flex_center">
      <SpeedButton
          radius="8px"
          text="确认"
          @confirm="submit"
          :disabled="password && password !== confirm_password"
      >
        <div class="_flex_center">
          加密PDF
          <img src="../../../../assets/img/convert/upluck.png" alt="">
        </div>
      </SpeedButton>
    </footer>
  </el-dialog>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import * as common from '../../../../utils/common'
  import * as convertUtils from '../../../../utils/convert_utils'
  import { mapState, mapGetters } from 'vuex'

  export default {
    model: {
      prop: 'show',
      event: 'cancel'
    },
    props: {
      // 显示窗口
      show: {
        type: Boolean,
        default: false
      },
      // 文件信息
      file: {}
    },
    data() {
      return {
        password: '', // 密码
        confirm_password: '', // 二次密码
      }
    },
    computed: {
      ...mapGetters(['fileList']),
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
      // 提交密码
      submit() {
        let item = this.fileList.filter(row => row.name == this.file.name)[0]
          item.target_password = this.password
          item.status = 2
          // 验证成功
          this._success(item)
      },
      /**
       * @description 验证密码成功
       * @param {Object} item: 点击的任务信息
       */
      _success(item) {
        this.$store.dispatch('set_file_list')
        this.$emit('confirm', item)
        this._reset()
      },
      // 重置
      _reset() {
        this.password = ''
        this.confirm_password = ''
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
    padding: 0px 45px 30px;
  }

  h1 {
    font-size: 22px;
    color: #353535;
    font-weight: bold;
    text-align: center;
  }

  .common_input {
    border-radius: 7px;

    img {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
    }

    input {
      padding: 0 34px;
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

  footer {
    width: 100%;
    margin-top: 30px;

    .speed_button {
      font-size: 16px;
      width: 50%;
    }
  }
</style>
