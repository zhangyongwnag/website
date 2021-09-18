<template>
  <el-dialog :visible.sync="show" :before-close="before_close" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
    <h1>此文件需要密码</h1>
    <p style="margin: 20px 0 14px 2px">{{file.name}}</p>
    <div class="common_input">
      <img src="../../../../assets/img/convert/password_icon.png" alt="">
      <input class="email" v-model.trim="password" type="password" maxLength="32" placeholder="请输入文件密码">
      <i class="el-icon-success" v-if="check_status === true"></i>
      <i class="el-icon-error" v-else-if="check_status === false"></i>
    </div>
    <footer class="_flex_center">
      <SpeedButton
          radius="8px"
          text="确认"
          @confirm="submit"
          class="_flex_center"
      />
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
        check_status: '', // 检测密码结果
      }
    },
    watch: {
      // 密码为空不检测
      password(value) {
        !value ? this.check_status = '' : ''
      },
    },
    computed: {
      ...mapState({
        convert_info: state => state.convert.convert_info, // 选择的转换类型信息
      }),
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
        let { file_type } = this.convert_info
        let item = this.fileList.filter(row => row.name == this.file.name)[0]
        if (file_type === 1 || file_type === 2 || file_type === 3 || file_type === 4 || file_type === 11 || file_type === 12 || file_type === 13 || file_type === 14 || file_type === 16) {
          // 验证PDF密码
          this._verify_password(item, file_type)
        }else {
          item.password = this.password
          item.status = 2
          // 验证成功
          this._success(item)
        }
      },
      /**
       * @description 验证PDF密码
       * @param {Object} item: 点击的任务信息
       * @param {Number} file_type: 转换类型
       */
      _verify_password(item, file_type) {
        convertUtils.pdfData(this.file, this.password)
          .then(res => {
            if (res.code) {
              this.check_status = false
            }else {
              this.check_status = true
              item.password = this.password
              // 当转换类型为 合并时，准备就绪，为分割、保护时，不立即执行
              if (file_type === 11) {
                item.status = 11
              } else if (file_type === 12 || file_type === 13) {
                item.status = 1
                item.pages = res.numPages
              } else {
                item.status = 2
              }
              // 验证成功
              this._success(item)
            }
          })
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
        this.check_status = ''
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
    margin-top: 40px;

    .speed_button {
      font-size:16px;
      width: 50%;
      background-color: #DE1535;
      margin-bottom: 40px;
    }
  }
</style>
