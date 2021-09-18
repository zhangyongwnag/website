<template>
  <section class="_flex_column_space_between">
    <header class="_flex_between_center">
      <h1>立即申请获取加盟方案</h1>
      <div>
        <SpeedButton type="cancel" text="取消" style="margin-right: 10px"/>
        <SpeedButton :disabled="!button_disabled"></SpeedButton>
      </div>
    </header>
    <article>
      <!--申请加盟前-->
      <el-form label-position="top" label-width="80px" :model="form" style="width: 45%">
        <el-form-item label="申请类型">
          <el-checkbox-group v-model="form.apply_type" :max="1" class="_flex_item_center">
            <el-checkbox label="1" key="1">公司</el-checkbox>
            <el-checkbox label="2" key="2">个人</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="公司名称" style="margin-top: -10px">
          <el-input v-model.trim="form.company" maxLength="20" placeholder="请输入公司名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input type="phone" v-model.trim="form.phone" maxLength="11" placeholder="请输入联系电话" clearable></el-input>
          <div style="margin-top: 12px" class="_flex_item_center">
            <SpeedButton :type="code_time > 0 ? 'cancel': 'confirm'" style="width: 200px;;padding: 0"
                         :disabled="code_time > 0" @confirm="send">{{code_time > 0 ? `重新发送 ( ${code_time} )`
              : '发送验证码'}}
            </SpeedButton>
            <el-input type="text" v-model.trim="form.verification" maxLength="4" placeholder="验证码"
                      style="margin-left: 10px">
              <i v-if="code_status" slot="suffix" class="code_status_icon"
                 :class="code_status == 1 ? 'el-icon-success' : 'el-icon-error'"
                 :style="code_status ? (code_status == 1 ? {color: 'forestgreen'} : {color:'orangered'}) : ''"></i>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="请联系我们">
          二维码
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
        if (!common.isPhone(this.form.phone)) {
          this.$message.error(`请输入正确的手机号`)
          return
        }
        this.code_status = 0
        this.code_time = 59
        let time_out = setInterval(() => {
          this.code_time--
          if (this.code_time == 0) {
            clearInterval(time_out)
          }
        }, 1000)
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
    height: 100%;
    margin-left: 20px;

    header {
      height: 100px;
      min-height: 100px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 0 45px;

      h1 {
        font-size: 22px;
        font-weight: bold;
        color: #3A3A3A;
      }
    }

    article {
      height: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      margin-top: 20px;
      padding: 12px 45px;
      overflow: auto;

      .code_status_icon {
        margin: 10px 8px 0 0;
        font-size: 20px;
      }
    }
  }
</style>
