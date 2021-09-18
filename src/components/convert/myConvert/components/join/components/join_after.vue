<template>
  <section class="_flex_column_space_between">
    <header class="_flex_between_center">
      <h1>你的推广链接：<span>https://speedpdf.com/Bingo</span></h1>
      <div>
        <SpeedClipboard text="https://speedpdf.com/Bingo">
          <SpeedButton text="复制"></SpeedButton>
        </SpeedClipboard>
      </div>
    </header>
    <article>
      <!--收益情况-->
      <div class="yield">
        <div>
          <div>
            <span>总收入 : </span>
            <span style="color: rgba(17, 101, 214, 1)">2290元</span>
          </div>
        </div>
        <div>
          <div>
            <span>在途 : </span>
            <span style="color: rgba(60, 147, 11, 1)">2200元</span>
          </div>
        </div>
        <div>
          <div style="border: 0">
            <span>可提现 : </span>
            <span style="color: rgba(227, 25, 25, 1)">90元</span>
            <SpeedButton class="withdraw" @confirm="withdraw_model_status = true">提现</SpeedButton>
          </div>
        </div>
        <div class="_flex_center" style="margin-left: -30px">
           <span class="info">
            <span>每次提现最小数额为100元</span>
            <span>提现会在3-5工作日内到账</span>
            <span>提现会扣除手续费10%</span>
            <span class="_link">收入结算与提现常见问题</span>
          </span>
        </div>
      </div>
      <!--收益数据-->
      <el-table :data="tableData" height="calc(100% - 240px)" style="width: 95%;margin: 0 2.5%;">
        <el-table-column
            prop="date"
            label="账户名称"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="IP"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="加入时间">
        </el-table-column>
        <el-table-column
            prop="address"
            label="购买IP">
        </el-table-column>
        <el-table-column
            prop="address"
            label="VIP状态">
        </el-table-column>
        <el-table-column
            prop="address"
            label="获得收益">
        </el-table-column>
      </el-table>
      <!--分页加载-->
      <SpeedPagination :total="100" :size="10" @handle-current="handle_current"/>
    </article>

    <!--提现弹窗-->
    <el-dialog :visible.sync="withdraw_model_status">
      <el-form label-position="right" label-width="120px" :model="withdraw_form">
        <el-form-item label="可提现总金额 : ">
          <span style="color: rgba(1, 91, 212, 1);font-weight: bold">190</span>
          <span style="color:#333;font-weight: bold"> 元</span>
          <span style="color: #707070;font-size: 13px"> ( 在途金额 : 2100元 )</span>
        </el-form-item>
        <el-form-item label="选择转出方式 : " style="margin-top: -10px;">
          <div style="display: flex">
            <div
                :class="item.id == withdraw_form.way ? 'pay_way_active' : ''"
                class="pay_way"
                v-for="(item,index) in withdraw_form.way_list"
                @click="choice_pay(item,index)">{{item.name}}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="选择银行卡 : " v-if="withdraw_form.way == 3">
          <div>
            <div class="bank_card">
              <div class="bank_card_radio _flex_center">
                <span class="circle circle_active"></span>
              </div>
              <div class="bank_card_item">
                <div class="_flex_between_center bank_card_item_info">
                  <span style="font-weight: bold;font-size: 15px">招商银行&emsp; <span
                      style="font-weight: normal;font-size: 13px;color: #5C5C5C">尾号: 9820</span></span>
                  <div class="_flex_item_center">
                    <span class="marking">储蓄卡</span>
                    <span class="marking">快捷</span>
                  </div>
                </div>
                <div style="font-size: 12px;color: #5C5C5C;margin-top: -2px">本次最多转出至次卡：190元</div>
              </div>
            </div>
            <div class="add_bank_card" @click="add_bank_card = true">
              <i class="el-icon-plus"></i>
              添加银行卡
            </div>
          </div>
        </el-form-item>
        <el-form-item label="提现金额 : ">
          <el-input type="phone" v-model.trim="withdraw_form.amount" maxLength="11" placeholder="" clearable
                    style="width: 158px"></el-input>
          <span style="font-weight: bold">&nbsp;&nbsp;元</span>
        </el-form-item>
        <el-form-item label="到账时间 : ">{{withdraw_form.time}}</el-form-item>
        <el-form-item label="支付密码 : ">
          <el-input show-password type="text" v-model.trim="withdraw_form.password" placeholder="" maxLength="6"
                    clearable style="width: 158px"></el-input>
          <span class="_link">&nbsp;&nbsp;忘记密码 ? </span>
          <div class="el-form-item__error" style="font-size: 11px;color: #B9B9B9">&nbsp;&nbsp;请输入6位数字支付密码</div>
        </el-form-item>
      </el-form>
      <footer class="_flex_center" style="padding: 30px 0 10px">
        <SpeedButton
            :disabled="!disabled_withdraw_button"
            text="确认提现"
            style="width: 226px;line-height: 24px"
            radius="6px">
        </SpeedButton>
      </footer>
    </el-dialog>

    <!--添加银行卡-->
    <AddBankCard :show="add_bank_card" @cancel="add_bank_card = false"/>
  </section>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import speed_pagination from "@/components/common/speed_pagination";
  import speed_clipboard from "../../../../../common/speed_clipboard";
  import add_bank_card from "./add_bank_card";

  export default {
    props: {
      info: {},
    },
    data() {
      return {
        radio: 1,
        tableData: [
          {
          date: '2016-05-02',
          name: '王小虎',
          address: '123'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '123'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '123'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '123'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '123'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '123'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '123'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '123'
        }],
        // 提现弹窗
        withdraw_model_status: false,
        // 提现表单
        withdraw_form: {
          way_list: [{name: '微信钱包', id: 1}, {name: '支付宝', id: 2}, {name: '银行卡', id: 3}], // 转出方式
          way: 1, // 默认chat
          amount: '', // 提现金额
          time: '- -', // 到账时间
          password: '', // 支付密码
        },
        add_bank_card: false, // 添加银行卡窗口
      }
    },
    computed: {
      // 是否禁用提现
      disabled_withdraw_button() {
        let {amount, password} = this.withdraw_form
        return amount > 0 && password
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {
      // 页码变化
      handle_current(value) {
        console.log(value)
      },
      /**
       * @description 选择支付方式
       * @param {Object} item: 选中项
       * @param {Number} index: 选中项下标
       */
      choice_pay(item, index) {
        this.withdraw_form.way = item.id
      },
    },
    components: {
      SpeedButton: speed_button,
      SpeedPagination: speed_pagination,
      SpeedClipboard: speed_clipboard,
      AddBankCard:add_bank_card
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-dialog {
    width: 613px;
  }

  /deep/ .el-form-item__label {
    font-weight: bold;
    margin-right: 6px;
  }

  /deep/ .el-input__inner {
    border-radius: 3px;
    height: 33px;
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

        span {
          color: rgba(17, 101, 214, 1);
          cursor: text;
        }
      }
    }

    article {
      width: 100%;
      height: calc(100vh - 248px);
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      margin-top: 20px;
      overflow: auto;

      .yield {
        height: 160px;
        display: flex;
        border-bottom: 7px #f7f7f7 solid;

        div {
          width: 25%;
          display: flex;
          align-items: center;

          div {
            width: 100%;
            border-right: 1px rgba(151, 151, 151, 0.3) solid;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            position: relative;

            span {
              font-size: 20px;
              font-weight: bold;
            }

            span:first-of-type {
              margin-bottom: 22px;
            }

            .withdraw {
              position: absolute;
              bottom: -5px;
              right: calc(50% - 112px);
              border: 1px rgba(17, 101, 214, 1) solid;
              color: rgba(17, 101, 214, 1);
              background-color: #fff;
              width: 74px;
              font-weight: bold;
            }
          }

          .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            font-size: 12px;
            color: #666;
            padding-left: 10%;

            span {
              margin-top: 8px;
            }

            span:last-of-type {
              font-weight: bold;
            }
          }
        }
      }
    }
  }

  .pay_way {
    width: 130px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #494949;
    font-size: 13px;
    background-color: rgba(1, 91, 212, 0.1);
    border-radius: 6px;
    border: 1px solid #E8E8E8;
    margin-right: 10px;
    cursor: pointer;
    overflow: hidden;
  }

  .pay_way_active {
    box-shadow: 0 0 0 1px #015BD4 inset;
    position: relative;
    transition: all .2s;
  }

  .pay_way_active:before {
    content: '';
    position: absolute;
    bottom: -16px;
    right: -14px;
    width: 30px;
    height: 30px;
    color: #fff;
    background-color: rgba(1, 91, 212, 1);
    transform: rotateZ(45deg);
    text-align: left;
    line-height: 30px;
    font-size: 12px;
  }

  .pay_way_active:after {
    content: '√';
    position: absolute;
    bottom: -13px;
    right: 4px;
    color: #fff;
    font-size: 10px;
    transform: rotateZ(6deg);
  }

  .bank_card {
    width: 90.5%;
    height: 80px;
    background: rgba(1, 91, 212, 0.05);
    border-radius: 6px;
    border: 1px solid #E8E8E8;
    cursor: pointer;
    display: flex;

    .bank_card_radio {
      width: 40px;
      min-width: 40px;

      .circle {
        width: 12px;
        height: 12px;
        border: 1px solid #B0B0B0;
        border-radius: 50%;
        margin-top: -34px;
        position: relative;
      }

      .circle_active {

      }

      .circle_active:before {
        content: '';
        width: 8px;
        height: 8px;
        background-color: #B0B0B0;
        border-radius: 50%;
        position: absolute;
        left: 1px;
        top: 1px;
      }
    }

    .bank_card_item {
      width: 82%;
      height: 54%;
      border-bottom: 1px #ccc dashed;

      .bank_card_item_info {
        padding-top: 2px;

        .marking {
          height: 20px;
          line-height: 18px;
          background: rgba(1, 91, 212, 0.5s);
          border: 1px solid #E8E8E8;
          margin-left: 10px;
          padding: 0 4px;
          font-size: 11px;
          color: #fff;
          border-radius: 2px;
        }

      }
    }
  }

  .add_bank_card{
    font-size: 12px;
    color: #00AAEE;
    margin:-3px 0 0 5px;
    cursor: pointer;

    i {
      font-size: 10px;
      color: #aaa;
      font-weight: bold;
    }
  }
</style>
