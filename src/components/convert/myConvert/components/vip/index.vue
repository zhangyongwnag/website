<template>
  <section class="_flex_column_space_between">
<!--    <header class="_flex_between_center">-->
<!--      <div class="_flex_item_center">-->
<!--        <h1>{{user_info.user_name}}</h1>-->
<!--        <img src="../../../../../assets/img/gril.png" alt="">-->
<!--      </div>-->
<!--      <div>1363944092@qq.com</div>-->
<!--    </header>-->
    <article class="_common_scroll_wrap" v-loading="loading">
<!--      <div class="vip">-->
<!--        <nav class="normal _flex_center" :class="vip_type == 1 ? 'active' : ''" @click="vip_type = 1">-->
<!--          <div class="_flex_item_center">-->
<!--            <img src="../../../../../assets/img/order/multiple_vip.png" alt="" style="margin-right: 20px">-->
<!--            <div class="_flex_column_align_start">-->
<!--              <p>批量转换套餐 <span>推荐</span></p>-->
<!--              <p>有效期内可批量转换文件，有转换次数限制</p>-->
<!--            </div>-->
<!--          </div>-->
<!--        </nav>-->
<!--        <nav class="special _flex_center" :class="vip_type == 2 ? 'active' : ''" @click="vip_type = 2">-->
<!--          <div class="_flex_item_center">-->
<!--            <img src="../../../../../assets/img/order/single_vip.png" alt="" style="margin-right: 20px; width: 34px">-->
<!--            <div class="_flex_column_align_start">-->
<!--              <p>单次转换套餐</p>-->
<!--              <p>有效期内转换次数无限制</p>-->
<!--            </div>-->
<!--          </div>-->
<!--        </nav>-->
<!--      </div>-->
<!--      <div class="content _flex_column_center" style="margin-top: 20px">
        <h2>请选择合适您的套餐</h2>
&lt;!&ndash;        <div class="tab">&ndash;&gt;
&lt;!&ndash;          <span v-for="(item,index) in vip_use_list" @click="choice_use_type(item,index)">{{item.name}}</span>&ndash;&gt;
&lt;!&ndash;          <div class="active" :style="{left:33.3 * (vip_use_value.id - 1) + '%'}">{{vip_use_value.name}}</div>&ndash;&gt;
&lt;!&ndash;        </div>&ndash;&gt;
        <div class="tab">
          <span v-for="(item,index) in package_info.list" @click="choice_use_type(item, index)">{{item.use_time}}&nbsp;{{item.time_types}}</span>
          <div class="active" :style="{left:33.3 * package_choice.index + '%'}">{{package_choice.use_time}}&nbsp;{{package_choice.time_types}}</div>
        </div>
        &lt;!&ndash;套餐种类&ndash;&gt;
        <div class="list" v-if="vip_use_value.id != 3">
          <div
              :class="{'item_active': package_id == item.id}"
              class="item _flex_column_center"
              :style="item.popular ? {height: '2.4rem',marginTop:'-6px'} : {}"
              @click="handle_package_click(item, index)"
              v-for="(item,index) in package_info.list">
                <span class="time">{{item.use_time}}&nbsp;{{item.time_types}}</span>
                <span class="best_price" v-if="item.popular">{{item.original_price}}</span>
                <span class="price">￥{{item.cny_price}}</span>
                <span class="size">{{item.use_number}}&nbsp;转换次数</span>
                <span class="discription" v-html="item.description"> </span>
                <span class="keyword" v-if="item.promotion_ratio">{{item.promotion_ratio}}</span>
                <SpeedButton @confirm="handle_package_click(item, index)" text="立即购买" radius="5px"/>
                <span class="optimum" v-if="item.popular">最佳推荐</span>
                <img v-if="item.popular && package_id === item.id" src="../../../../../assets/img/order/package_check.png" alt="">
                <img v-if="item.popular && package_id !== item.id" src="../../../../../assets/img/order/package_check_default.png" alt="">
          </div>
        </div>
        &lt;!&ndash;        <div class="list" v-if="vip_use_value.id != 3">
                  <div :class="vip_package == 1 ? 'item_active' : ''" class="item _flex_column_center" @click="vip_package = 1">
                    <span class="time">1年</span>
                    <span class="price">￥58</span>
                    <span class="size">5台共享设备</span>
                    <span class="discription">一年有效期内无限次转换 </span>
                    <span class="discription">不支持批量转换 </span>
                    <SpeedButton text="立即购买" radius="5px"
                                 style="width: 80%;background-color: #fff;border: 2px rgba(77, 128, 240, 1) solid;color: rgba(77, 128, 240, 1)"/>
                  </div>
                  <div :class="vip_package == 2 ? 'item_active' : ''" class="item _flex_column_center" style="height: 360px"
                       @click="vip_package = 2">
                    <span class="time">1年</span>
                    <span class="best_price">￥399.6</span>
                    <span class="price">￥58</span>
                    <span class="size">5台共享设备</span>
                    <span class="discription">一年有效期内无限次转换 </span>
                    <span class="discription">不支持批量转换 </span>
                    <span class="keyword">节省 75.4%</span>
                    <SpeedButton @confirm="pay_status = true" text="立即购买" radius="5px"
                                 style="width: 80%;background-color: #fff;border: 2px rgba(77, 128, 240, 1) solid;color: rgba(77, 128, 240, 1);margin-top: 5px"/>
                    <span class="optimum">最佳推荐</span>
                  </div>
                  <div :class="vip_package == 3 ? 'item_active' : ''" class="item _flex_column_center" @click="vip_package = 3">
                    <span class="time">1年</span>
                    <span class="price">￥58</span>
                    <span class="size">5台共享设备</span>
                    <span class="discription">一年有效期内无限次转换 </span>
                    <span class="discription">不支持批量转换 </span>
                    <SpeedButton text="立即购买" radius="5px"
                                 style="width: 80%;background-color: #fff;border: 2px rgba(77, 128, 240, 1) solid;color: rgba(77, 128, 240, 1)"/>
                  </div>
                </div>&ndash;&gt;
        &lt;!&ndash;分销加盟&ndash;&gt;
&lt;!&ndash;        <div class="join" v-if="vip_use_value.id == 3">&ndash;&gt;
&lt;!&ndash;          <JoinAfter style="padding-right: 40px" :info="{}"/>&ndash;&gt;
&lt;!&ndash;        </div>&ndash;&gt;
      </div>-->
<!--      <el-carousel :interval="4000">-->
<!--            <el-carousel-item>-->
<!--              <h3 class="medium"><img src="../../../../../assets/img/banner1.jpg" alt=""></h3>-->
<!--            </el-carousel-item>-->
<!--            <el-carousel-item>-->
<!--              <h3 class="medium"><img src="../../../../../assets/img/banner2.jpg" alt=""></h3>-->
<!--            </el-carousel-item>-->
<!--            <el-carousel-item>-->
<!--              <h3 class="medium"><img src="../../../../../assets/img/banner2.jpg" alt=""></h3>-->
<!--            </el-carousel-item>-->
<!--          </el-carousel>-->
    </article>
  </section>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import Pay from "./components/pay";
  import join_before from "../join/components/join_before";
  import join_check from "../join/components/join_check";
  import join_after from "../join/components/join_after";
  import { mapState, mapMutations } from 'vuex'

  export default {
    data() {
      return {
        vip_type: 1, // 选择VIP类型 1(批量) or 2(单次)
        vip_use_list: [{name: '单人使用', id: 1}, {name: '多人使用', id: 2}, {name: '分享加盟', id: 3}], // 使用套餐类型列表
        vip_use_value: {name: '单人使用', id: 1}, // 使用套餐类型
        package_choice: {}, // 选中的套餐
        pay_status: false, // 是否调起支付窗口
      }
    },
    watch: {
      // 修改package_id
      package_id: {
        handler(value) {
          if (!value) return
          this.package_info.list.filter((item, index) => {
            if (item.id == value) {
              this.package_choice = item
              this.package_choice.index = index
            }
          })
        },
        immediate: true
      },
    },
    computed: {
      ...mapState({
        user_info: state => state.login.user_info, // 用户信息
        loading: state => state.myConvert.loading, // Loading 加载
        vip_info: state => state.myConvert.vip_info, // VIP信息
        package_info: state => state.myConvert.package_info, // 套餐信息
        package_id: state => state.myConvert.package_id, // 套餐ID
      })
    },
    created() {
      // 获取VIP信息
      this.$store.dispatch('get_vip_info')
      // 根据是否有缓存数据设置Loading
      this.$store.dispatch('update_lading', Boolean(!this.package_id))
      // 获取套餐列表
      this.$store.dispatch('get_package_info')
    },
    methods: {
      /**
       * @description 选择使用类型
       * @param {Object} item: 选择每一项item
       * @param {Number} index: 每一项下标index
       */
      choice_use_type(item, index) {
        this.package_choice = item
        this.package_choice.index = index
        this.$store.dispatch('update_package_id', item.id)
      },
      /**
       * @description 点击套餐
       * @param {Object} item: 当前选中项
       * @param {Number} index: 选中项下标index
       */
      handle_package_click(item, index) {
        this.pay_status = true
        this.$store.dispatch('update_package_id', item.id)
        // Object.assign(this.package_info, {package_id: item.id})
      },
    },
    components: {
      SpeedButton: speed_button,
      Pay,
      JoinBefore: join_before,
      JoinCheck: join_check,
      JoinAfter: join_after,
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-carousel--horizontal{
    width: 96%;
    margin-left: 2%;
  }

  /deep/ .el-carousel__container{
    height: 300px;
  }

  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
    height: 300px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

  section {
    width: 100%;
    height: 100%;
    margin-left: 20px;

    header {
      height: 100px;
      min-height: 100px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 0 45px;

      ._flex_item_center {

        img {
          width: 23px;
          margin: -2px 0 0 12px;
        }
      }

      h1 {
        font-size: 22px;
        font-weight: bold;
        color: #3A3A3A;
      }

      span {
        color: #495057;
      }

      div {
        color: #495057;

        span {
          color: #999;
          font-size: 14px;
        }
      }
    }

    article {
      width: 100%;
      height: calc(100vh - 132px);
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      overflow: auto;

      .vip {
        display: flex;
        height: 94px;
        background-color: rgba(231, 231, 231, 0.7);

        nav {
          width: 50%;
          cursor: pointer;
          border-right: 1px #d8d8d8 solid;
          border-bottom: 1px #d8d8d8 solid;

          p:first-of-type {
            font-size: 20px;
            font-weight: bold;
            color: #333;
            position: relative;
            margin-top: 14px;

            span {
              position: absolute;
              right: -30px;
              top: -11px;
              font-size: 10px;
              font-weight: normal;
              padding: 1px 4px;
              border-radius: 3px 3px 3px 0;
              color: #fff;
              background-color: rgba(255, 81, 64, 1);
            }

            span:before {
              content: '';
              position: absolute;
              left: -1px;
              bottom: -5px;
              width: 0;
              height: 0;
              border-top: 6px solid rgba(255, 81, 64, 1);
              border-right: 6px solid transparent;
              transform: rotateZ(14deg);
            }
          }

          p:last-of-type {
            font-size: 14px;
            color: #999;
            margin-top: -14px;
          }
        }

        nav:last-of-type {
          border-right: 0;
        }

        .active {
          background-color: #fff;
          border-bottom: 1px #fff solid;
        }
      }

      .content {

        h2 {
          font-size: 22px;
          margin: 40px 0 32px;
          color: #333;
        }

        .tab {
          border: 1px rgba(51, 51, 51, 0.2) solid;
          font-size: 14px;
          color: #999;
          border-radius: 15px;
          width: 350px;
          display: flex;
          overflow: hidden;
          position: relative;

          span {
            display: inline-block;
            width: 33.3%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
          }

          .active {
            width: 33.3%;
            height: 30px;
            line-height: 30px;
            text-align: center;
            cursor: pointer;
            background-color: #20B759;
            border-radius: 15px;
            position: absolute;
            left: 0;
            top: 0;
            color: #fff;
            transition: all .3s;
          }
        }
      }

      .list {
        width: 100%;
        display: flex;
        margin: 60px 0;
        align-items: center;
        justify-content: center;

        .item {
          width: 260px;
          height: 320px;
          border-radius: 6px;
          box-shadow: 0px 4px 12px 0px rgba(0, 0, 0, 0.28);
          margin-right: 50px;
          cursor: pointer;
          position: relative;

          .time {
            font-size: 19px;
            color: #000;
            margin-top: 40px;
            font-weight: bold;
          }

          .best_price {
            color: #999999;
            font-size: 16px;
            margin: 10px 0 -20px;
            text-decoration: line-through;
          }

          .price {
            font-size: 32px;
            color: #333;
            font-weight: bold;
            margin-top: 26px;
          }

          .size {
            font-size: 14px;
            color: #000;
            margin: 10px 0 30px;
            font-weight: bold;
          }

          .discription {
            font-size: 12px;
            color: #DD001B;
            margin-bottom: 5px;
          }

          .keyword {
            color: #000;
            font-size: 18px;
            font-weight: bold;
            margin: 8px 0 3px;
            color: rgba(255, 34, 34, 1);
          }

          .speed_button {
            width: 80%;
            height: 41px;
            background-color: #fff;
            border: 2px rgba(77, 128, 240, 1) solid;
            color: rgba(77, 128, 240, 1);
            margin-top: 5px;
            display: flex !important;
            justify-content: center;
            align-items: center;
          }

          div {
            margin: 15px 0 5px;
          }

          .optimum {
            position: absolute;
            top: -17px;
            right: 16px;
            width: 118px;
            height: 38px;
            line-height: 38px;
            text-align: center;
            background-image: linear-gradient(to bottom, rgba(203, 0, 0, 1), rgba(255, 34, 34, 1));
            font-size: 16px;
            color: #fff;
            /*font-weight: bold;*/
            text-shadow: 0.5px 0 0.5px #fff;
            letter-spacing: 2px;
            border-radius: 10px 0 5px 5px;
          }

          .optimum:before {
            content: '';
            position: absolute;
            right: -7px;
            top: 0;
            width: 8px;
            height: 44%;
            background-color: rgba(203, 0, 0, 1);
            border-radius: 2px 6px 0 0;
          }

          img {
            position: absolute;
            left: 26px;
            top: 18px;
            width: 40px;
          }
        }

        .item:last-of-type {
          margin-right: 0;
        }

        .item:hover {
          /*transform: scale(1.13);*/
        }

        .item:nth-child(2) {
          width: 280px;
        }

        .item_active {
          box-shadow: 0 0 0 9px #20B759 inset;

          .price {
            color: #20B759;
          }

          .keyword {
            color: #20B759;
          }

          div {
            background-color: #20B759 !important;
            color: #fff !important;
            border: 2px #20B759 solid !important;
          }
        }

      }

      .join {
        width: 95%;
        background-color: #f6f6f6;
        padding: 40px 20px;
        border-radius: 20px;
        margin: 40px 2.5% 30px;
      }
    }
  }

  @media (max-width: 1676px) {
    section {
      article {
        .list {
          .item {
            zoom: 0.9;
          }
        }
      }
    }
  }

  @media (max-width: 1539px) {
    section {
      article {
        .list {
          .item {
            zoom: 0.8;
          }
        }
      }
    }
  }
</style>
