<template>
  <el-dialog :visible.sync="show" :before-close="before_close" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
    <h1>抱歉～您的文件大于15MB！</h1>
    <span>成为“极速办公VIP”可上传达到5GB的文件</span>
    <footer class="_flex_center">
      <SpeedButton
          radius="8px"
          :text="convert_user_info.uflag ? '成为VIP' : '登录'"
          @confirm="turn_to_page"
      />
    </footer>
  </el-dialog>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import { mapState, mapGetters, mapActions } from 'vuex'

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
    },
    computed: {
      ...mapState({
        convert_user_info: state => state.convert.convert_user_info, // 用户转换信息
      })
    },
    methods: {
      ...mapActions(['turn_to_vip']),
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
      // 成为VIP
      turn_to_page() {
        if (this.convert_user_info.uflag) {
          // 将当前选择的Tab保存，动态引入组件
          this.$store.dispatch('update_convert_header_active', {
            tab: {
              id: 1,
              name: '我的转换',
              component_name: 'myConvert'
            },
            index: 0
          })
          setTimeout(() => {
            this.turn_to_vip()
          })
        } else {
          this.$emit('cancel')
          this.$store.dispatch('update_login_model_status', true)
        }
      },
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
    margin-top: 10px;
  }

  span {
    display: block;
    text-align: center;
    margin-top: 13px;
    color: #636363;
  }


  footer {
    width: 100%;
    margin-top: 40px;

    .speed_button {
      font-size:16px;
      width: 50%;
      background: linear-gradient(124deg, #F3BD50 0%, #FFB038 100%);
      margin-bottom: 40px;
    }
  }
</style>
