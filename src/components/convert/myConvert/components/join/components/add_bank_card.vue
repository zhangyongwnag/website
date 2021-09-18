<template>
  <el-dialog :visible.sync="show" :before-close="handle_close" :close-on-click-modal="true"
             :close-on-press-escape="true">
    <el-form label-position="right" label-width="120px" :model="form">
      <el-form-item label="真实姓名 : ">
        <el-input type="text" v-model.trim="form.name" placeholder="" maxLength="6"
                  clearable style="width: 270px"></el-input>
      </el-form-item>
      <el-form-item label="身份证号 : ">
        <el-input type="text" v-model.trim="form.id" placeholder="" maxLength="6"
                  clearable style="width: 270px"></el-input>
      </el-form-item>
      <el-form-item label="银行卡号 : ">
        <el-input type="text" v-model.trim="form.card" placeholder="" maxLength="6"
                  clearable style="width: 270px"></el-input>
        <div class="el-form-item__error" style="font-size: 11px;color: #B9B9B9">&nbsp;&nbsp;输入卡号后只能识别银行和卡种</div>
      </el-form-item>
      <el-form-item label="手机号码 : ">
        <el-input type="text" v-model.trim="form.phone" placeholder="" maxLength="6"
                  clearable style="width: 270px"></el-input>
        <div class="el-form-item__error" style="font-size: 11px;color: #B9B9B9">&nbsp;&nbsp;请填写您在银行预留的手机号码，验证是否为本人</div>
      </el-form-item>
      <el-form-item label="短信验证码 : ">
        <el-input type="text" v-model.trim="form.verification" placeholder="" maxLength="6"
                  clearable style="width: 270px"></el-input>
      </el-form-item>

      <footer class="_flex_center">
        <SpeedButton style="width:170px;line-height: 22px;margin: 10px 0 5px" radius="8px" @confirm="confirm">同意协议并确认
        </SpeedButton>
      </footer>
    </el-form>
  </el-dialog>
</template>

<script>
  import speed_button from "../../../../../common/speed_button";

  export default {
    model: {
      prop: 'show',
      event: 'cancel'
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        form: {
          name: '', // 姓名
          id: '', // 身份证号
          card: '', // 银行卡号
          phone: '', // 电话
          verification: '', // 验证码
        }
      }
    },
    watch: {},
    computed: {},
    created() {

    },
    mounted() {

    },
    methods: {
      // 提交
      confirm() {
        this.$emit('confirm')
      },
      // 关闭弹窗
      handle_close(done) {
        this.$emit('cancel')
        done()
      }
    },
    components: {
      SpeedButton: speed_button
    }
  }
</script>

<style scoped>
  /deep/ .el-dialog {
    width: 520px !important;
  }

</style>
