<template>
  <el-dialog :visible.sync="show" :before-close="before_close" :close-on-click-modal="true" :close-on-press-escape="true">
    <header>
      <img src="../../assets/img/order/pay_success.png" alt="">
      <span>{{title_filter}}</span>
    </header>
    <slot></slot>
    <footer class="_flex_center">
      <SpeedButton v-if="confirm_button" style="width:160px;line-height: 22px" radius="8px" @confirm="confirm">
        {{confirm_text}}
      </SpeedButton>
      <SpeedButton v-if="cancel_button" style="width:160px;margin-left: 35px;line-height: 22px" type="cancel"
                   radius="8px"
                   @confirm="$emit('cancel')">{{cancel_text}}
      </SpeedButton>
    </footer>
  </el-dialog>
</template>

<script>
  import speed_button from "@/components/common/speed_button";

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
      // 名称
      title: {
        type: String,
        default: ''
      },
      // 类型
      type: {
        type: String,
        default: ''
      },
      // 确认按钮
      confirm_button: {
        type: Boolean,
        default: true
      },
      // 确认按钮文字
      confirm_text: {
        type: String,
        default: '确认'
      },
      // 取消按钮
      cancel_button: {
        type: Boolean,
        default: true
      },
      // 取消按钮文字
      cancel_text: {
        type: String,
        default: '取消'
      },
    },
    data() {
      return {}
    },
    computed: {
      // 过滤Title
      title_filter() {
        switch (this.type) {
          case 'success':
            return '支付成功';
          case 'error':
            return '支付失败，请重新支付';
          default :
            return this.title
        }
      }
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
        // done();
        // })
        // .catch(() => {
        // });
      },
      // 确认
      confirm() {
        this.$emit('confirm')
      },
      // 取消
      cancel() {
        this.$emit('cancel')
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
    padding: 30px 45px;
  }

  header {
    font-size: 18px;
    color: #333;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 80px;
    }

    span {
      font-size: 22px;
      color: #333333;
      margin: 30px 0;
    }
  }

  footer {
    width: 100%;
    margin-top: 40px;
  }
</style>
