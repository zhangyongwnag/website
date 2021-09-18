<template>
  <div>
    <el-dialog :visible.sync="show" :before-close="before_close" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <header class="_flex_between_center" style="margin-top: -5px">
        <span>您选择的方案：<span style="font-weight: bold">{{package.use_time}}&nbsp;{{package.time_types}}</span> 套餐</span>
        <span style="font-weight: bold">{{pay_result == 'paypal' ? '$ ' + package.pay_price : '￥' + package.cny_price}}</span>
      </header>

      <div class="variety">
        <div
            :class="package_info.list[1].id == package_id ? 'package_active' : ''"
            class="package"
            @click="handle_package_click(package_info.list[1], 1)">
          {{package_info.list[1].use_time}}&nbsp;{{package_info.list[1].time_types}}
          <img src="../../../../../../assets/img/order/hot.png" alt="">
        </div>
        <div
            :class="package_info.list[2].id == package_id ? 'package_active' : ''"
            class="package"
            @click="handle_package_click(package_info.list[2], 2)">
          {{package_info.list[2].use_time}}&nbsp;{{package_info.list[2].time_types}}
        </div>
        <div
            :class="package_info.list[0].id == package_id ? 'package_active' : ''"
            class="package"
            @click="handle_package_click(package_info.list[0], 0)">
          {{package_info.list[0].use_time}}&nbsp;{{package_info.list[0].time_types}}
        </div>
      </div>
      <article>
        <nav>
          <div
              :class="item == pay_result ? 'pay_way_active' : ''"
              v-for="(item,index) in package_info.payment_method"
              v-if="item != 'paypal'"
              @click="choice_pay(item,index)"
          >
            <span class="_flex_item_center">
                <!--            <img src="../../../../../../assets/img/order/paypal.png" alt="" v-if="item == 'paypal'">-->
              <img src="../../../../../../assets/img/order/wechat.png" alt="" v-if="item == 'wechat'">
              <img src="../../../../../../assets/img/order/alipay.png" alt="" v-else-if="item == 'alipay'">
              {{item == 'wechat' ? '微信支付' : '支付宝'}}
            </span>
          </div>
          <div class="item">
            <span class="_flex_item_center">银联支付</span>
          </div>
        </nav>
<!--        <div class="content" v-loading="loading">-->
<!--          <img :src="result.qr_code" alt="" v-if="pay_result != 'paypal'">-->
<!--          <div class="pay_info" :style="pay_result == 'paypal' ? {alignItems: 'center'} : ''">-->
<!--            <span style="color: #333;">付款金额：<span-->
<!--                style="color: rgba(57, 110, 235, 1);font-weight: bold;font-size: 18px">{{pay_result == 'paypal' ? '$ ' + package.pay_price : '￥' + package.cny_price}}</span></span>-->
<!--            <span-->
<!--                style="font-size: 12px;color: #919191;margin-top: 6px">极速办公账号：speedoffice@163.com</span>-->
<!--            <SpeedButton-->
<!--                v-if="pay_result == 'paypal'"-->
<!--                style="width: 150px;margin-top: 10px; font-size: 13px"-->
<!--                radius="5px"-->
<!--                text="立即支付"-->
<!--                @confirm="paypal"-->
<!--            />-->
<!--          </div>-->
<!--        </div>-->
        <div class="_flex_column_center">
          <el-scrollbar class="back_list_wrap" :native="false" wrapStyle="overflow-x: hidden;" wrapClass="" viewClass="" viewStyle="" :noresize="false" tag="section">
            <div class="back_list" >
              <div class="package package_active">
                工商银行
              </div>
              <div class="package">
                建设银行
              </div>
              <div class="package">
                工商银行
              </div>
              <div class="package">
                建设银行
              </div>
              <div class="package">
                工商银行
              </div>
              <div class="package">
                建设银行
              </div>
              <div class="package">
                工商银行
              </div>
              <div class="package">
                建设银行
              </div>
              <div class="package">
                工商银行
              </div>
              <div class="package">
                建设银行
              </div>
              <div class="package">
                工商银行
              </div>
              <div class="package">
                建设银行
              </div>
              <div class="package">
                工商银行
              </div>
              <div class="package">
                建设银行
              </div>
              <div class="package">
                工商银行
              </div>
              <div class="package">
                建设银行
              </div>
            </div>
          </el-scrollbar>
          <div class="_flex_center" style="height: 0.4rem">
            <SpeedButton
                radius="5px"
                text="立即支付"
            />
          </div>
        </div>
      </article>
    </el-dialog>

    <!--支付结果-->
    <!--支付結果-->
    <PayResult v-model="show_result" title="支付成功" :confirm_button="false" :cancel_button="false">
      <div class="pay_success">
        <span>账户：</span>
        <span>{{user_info.user_email}}</span>
      </div>
      <div class="pay_success">
        <span>有效期至：</span>
        <span>{{package.pay_time}}</span>
      </div>
      <div class="pay_success">
        <span>付款方式：</span>
        <span>{{pay_result}}</span>
      </div>
      <div class="pay_success">
        <span>支付金额：</span>
        <span>{{pay_result == 'paypal' ? '$ ' + package.pay_price : '￥' + package.cny_price}}</span>
      </div>

      <SpeedButton
          style="font-size:16px;width: 80%;background-color: #306AF6;margin: 40px 10% -30px;"
          radius="8px"
          text="返回"
          @confirm="pay_success"
      />
    </PayResult>
  </div>
</template>

<script>
  import speed_pay_result from "../../../../../common/speed_pay_result";
  import speed_button from "../../../../../common/speed_button";
  import * as config from '../../../../../../api/config'
  import { mapState } from 'vuex'

  export default {
    model: {
      prop: 'show',
      event: 'cancel'
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      order: {
        type: Object,
        default: () => {
        }
      }
    },
    data() {
      return {
        package: {}, // 选择的套餐信息
        pay_result: '', // 选择的支付方式
        loading: false, // 加载
        result_list: new Map(), // 生成订单结果
        result: {}, // 当前选中订单信息
        show_result: false // 支付结果弹窗
      }
    },
    watch: {
      // 监听套餐切换
      package_id: {
        handler(value) {
          // 过滤套餐信息
          this.package = this.package_info.list.filter(item => item.id == value)[0]
          // 选择默认支付方式
          !this.pay_result ? this.pay_result = this.package_info.payment_method[0] : ''
        },
        immediate: true
      },
    },
    computed: {
      ...mapState({
        user_info: state => state.login.user_info, // 用户信息
        vip_info: state => state.myConvert.vip_info, // VIP信息
        package_info: state => state.myConvert.package_info, // 套餐信息
        package_id: state => state.myConvert.package_id, // 套餐ID
      })
    },
    created() {
      // 获取订单信息
      this._getOrderInfo()
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
        this._stopCheckPayStatus()
        // done();
        // })
        // .catch(() => {
        // });
      },
      /**
       * @description 点击套餐
       * @param {Object} item: 当前选中项
       * @param {Number} index: 选中项下标index
       */
      handle_package_click(item, index) {
        this.$store.dispatch('update_package_id', item.id)
        // 获取订单信息
        if (this.show) {
          this._getOrderInfo()
        }
      },
      /**
       * @description 选择支付方式
       * @param {Object} item: 当前选中项
       * @param {Number} index: 选中项下标index
       */
      choice_pay(item, index) {
        this.pay_result = item
        this._setOrderResult()
      },
      /**
       * @description Paypal支付
       */
      paypal() {
        this._checkPayStatus()
        let a = document.createElement('a')
        a.href = this.result.url
        a.target = '_blank'
        a.click()
      },
      /**
       * @description 支付成功
       */
      pay_success() {
        this.before_close()
        this.$emit('cancel')
      },
      /**
       * @description 排序
       */
      _sort() {
        this.package_info.list = this.package_info.list.sort((a, b) => parseInt(a.use_number) < parseInt(b.use_number))
      },
      /**
       * @description 生成三种订单
       */
      _getOrderInfo() {
        this.loading = true
        // let methods = ['paypal', 'alipay', 'wechat']
        let methods = ['alipay', 'wechat']
        let promise = []
        methods.map((item, index) => promise.push(this.http.post(config.GET_PAY_QR_CODE, {
          id: this.package_id,
          type: 'vip',
          // pay_type: index + 1
          pay_type: index + 2
        })))
        Promise.all(promise)
          .then(res => {
            this.loading = false
            this.package_info.payment_method.map(item => {
              // this.result_list.set(item, item == 'paypal' ? res[0] : (item == 'wechat' ? res[2] : res[1]))
              this.result_list.set(item, item == 'wechat' ? res[1] : res[0])
            })
            this._setOrderResult()
          })
          .catch(res => {
            this.loading = false
            this.$message.error(res)
          })
      },
      /**
       * @description 设置当前选中订单信息
       */
      _setOrderResult() {
        this.result = this.result_list.get(this.pay_result)
        this.pay_result != 'paypal' ? this._checkPayStatus() : this._stopCheckPayStatus()
      },
      /**
       * @description 检测支付状态
       */
      async _checkPayStatus() {
        await this._stopCheckPayStatus()
        let data = {
          out_trade_no: this.result.order_id
        };
        this.time_out = setInterval(() => {
          this.http.post(config.CHECK_PAY_STATUS, data)
            .then(res => {
              if (res.data.status) {
                this.show_result = true
                this.package.pay_time = res.data.expire_time
                // 更新用户转换信息
                this.$store.dispatch('update_convert_time')
                // 获取VIP信息
                this.$store.dispatch('get_vip_info')
              }
            })
        }, 2000)
      },
      /**
       * @description 停止检测
       */
      _stopCheckPayStatus() {
        clearInterval(this.time_out)
        this.time_out = null
      },
    },
    components: {
      SpeedButton: speed_button,
      PayResult: speed_pay_result
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-dialog {
    width: 800px;
  }

  header {
    font-size: 18px;
    color: #333;
  }

  .variety {
    display: flex;
    margin: 30px 0;

    .package {
      width: 253px;
      height: 70px;
      line-height: 70px;
      color: #494949;
      font-size: 16px;
      border-radius: 6px;
      box-shadow: 0 0 1px 1px #CCCCCC;
      margin-right: 20px;
      cursor: pointer;
      overflow: hidden;
      padding-left: 30px;
      position: relative;

      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 32px;
      }
    }

    .package:last-of-type {
      margin-right: 0;
    }

    .package_active {
      /*box-shadow: 0 0 0 1px #396EEB inset;*/
      box-shadow:  0 0 0px 1px #396EEB;
      position: relative;
      transition: all .2s;
      background-color: rgba(1, 91, 212, 0.1);
    }

    .package_active:before {
      content: '';
      position: absolute;
      bottom: -26px;
      right: -28px;
      width: 50px;
      height: 50px;
      color: #fff;
      background-color: rgba(1, 91, 212, 1);
      transform: rotateZ(45deg);
      text-align: left;
      line-height: 30px;
      font-size: 12px;
    }

    .package_active:after {
      content: "";
      background-image: url(../../../../../../assets/img/order/icon_check.svg);
      background-repeat: no-repeat;
      background-size: 100%;
      position: absolute;
      bottom: 0;
      right: 1px;
      color: #fff;
      font-size: 18px;
      transform: rotateZ(348deg);
      width: 14px;
      height: 14px;
    }
  }

  article {
    border: 1px solid #CCCCCC;
    height: 202px;
    border-radius: 6px;
    display: flex;
    overflow: hidden;

    nav {
      width: 168px;
      height: 100%;

      div {
        height: 33.3%;
        /*height: 50%;*/
        font-size: 13px;
        color: #494949;
        border-bottom: 1px #ccc solid;
        border-right: 1px #ccc solid;
        background-color: rgba(240, 240, 240, 1);
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 24px;
        text-transform: capitalize;

        img {
          width: 22px !important;
          margin-right: 10px !important;
        }

        &:last-of-type {
          border-bottom: 1px transparent solid;
        }
      }

      .pay_way_active {
        background-color: #fff;
        border-right: 1px transparent solid;
      }
    }

    .content {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      img {
        width: 100px;
        margin-right: 20px;
      }

      .pay_info {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        flex-direction: column;

        span {
          font-size: 16px;
        }
      }
    }

    .back_list_wrap {
      height: 138px;
      overflow-x: hidden;

      .back_list {
        width: 590px;
        overflow: hidden;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        padding: 20px 0 0 20px;

        .package {
          width: 116px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 4px;
          box-shadow: 0 0 1px 1px #CCCCCC;
          margin: 0 20px 20px 0;
          cursor: pointer;
          overflow: hidden;
          position: relative;
          font-size: 13px;
          color: #000000;

          img {
            position: absolute;
            left: 0;
            top: 0;
            width: 32px;
          }
        }

        .package_active {
          /*box-shadow: 0 0 0 1px #396EEB inset;*/
          box-shadow:  0 0 0px 1px #396EEB;
          position: relative;
          transition: all .2s;
          background-color: rgba(1, 91, 212, 0.1);
        }

        .package_active:before {
          content: '';
          position: absolute;
          bottom: -20px;
          right: -25px;
          width: 40px;
          height: 40px;
          color: #fff;
          background-color: rgba(1, 91, 212, 1);
          transform: rotateZ(45deg);
          text-align: left;
          line-height: 30px;
          font-size: 12px;
        }

        .package_active:after {
          content: "";
          background-image: url(../../../../../../assets/img/order/icon_check.svg);
          background-repeat: no-repeat;
          background-size: 100%;
          position: absolute;
          bottom: 0;
          right: 0.5px;
          color: #fff;
          transform: rotateZ(348deg);
          width: 10px;
          height: 10px;
        }
      }
    }

    .speed_button {
      width: 154px;
      height: 38px;
      line-height: 38px;
      background: #396EEB;
      border-radius: 5px;
    }
  }

  .pay_success {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #646464;
    padding: 15px 0;
    border-bottom: 1px rgba(151, 151, 151, 0.32) solid;
  }
</style>
