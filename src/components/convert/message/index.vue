<template>
  <section class="_flex_column_space_between">
    <article>
      <!--申请加盟前-->
      <el-form label-position="top" label-width="80px" :model="form" style="width: 45%">
        <el-form-item label="留言内容">
          <el-input
              style="margin-top: 10px"
              type="textarea"
              :rows="10"
              placeholder="请输入留言内容"
              v-model="form.company">
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <SpeedButton type="confirm" style="width: 120px;;padding: 0;border-radius: 4px" @confirm="send">提交申请</SpeedButton>
        </el-form-item>
      </el-form>
    </article>
  </section>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import * as common from '@/utils/common'

  export default {
    props: {
      info: {},
    },
    data() {
      return {
        // 申请加盟
        form: {
          apply_type: ["1"], // 申请类型
          company: '', // 公司名称
          phone: '', // 联系电话
          verification: '', // 短信验证码
        },
        code_time: 0, // 短信验证码倒计时
        code_status: 1, // 短信验证码验证结果
      }
    },
    computed: {
      // 申请按钮是否可以点击
      button_disabled() {
        let {apply_type, company, phone, verification} = this.form
        return apply_type.length && company && phone && verification && this.code_status == 1
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      // 发送验证码
      send() {
        if (!this.form.company) {
          this.$notify({
            title:'提示',
            message:'请输入留言内容',
            type:'error',
            showClose:true,
          })
          return
        }
        this.$notify({
          title:'提示',
          message:'留言提交成功',
          type:'success',
          showClose:true,
        })
        this.form.company = ''
      },
      // 验证码是否正确
      verify() {

      },
      // 提交
      submit() {

      },
    },
    components: {
      SpeedButton: speed_button,
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-form--label-top .el-form-item__label {
    padding: 0;
    font-weight: bold;
  }

  /deep/ .el-input__inner {
    border-radius: 28px;
  }

  /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background: #1165D6;
  }

  /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #333;
  }

  section {
    padding: 25px 19px 0px 40px;
    height: calc(100vh - 103px);
    animation: fade-bottom .5s 0s forwards;

    article {
      height: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 12px 45px;
      overflow: auto;

      .code_status_icon {
        margin: 10px 8px 0 0;
        font-size: 20px;
      }
    }
  }

  .qr_code {
    width: 100px;
  }
</style>
