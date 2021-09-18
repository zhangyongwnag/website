<template>
  <section class="_flex_column_space_between">
    <header class="_flex_between_center">
      <div>
        <h1>正在审核您的加盟信息</h1>
        <span>智能加密，保护您的信息安全。</span>
      </div>
      <div>
        <SpeedButton text="撤销" class="_flex_center"></SpeedButton>
      </div>
    </header>
    <article class="_flex_column_center">
      <h1>等待审核..</h1>
      <p>预计审核结果是2-3天，请耐心等待。如果要重新申请，请先<span>撤销</span>此申请信息</p>
      <div class="info">
        <div class="_flex_center">分销比例</div>
        <div>
          <span>1.单笔订单如果总佣金是100元，返利比例是30%，那么用户的返利佣金就是：100×30%=30元。在用户确认使用后，这30的佣金会冻结5天后才会进入可提现余额进行提现。</span>
          <span>2.总佣金 100.00，默认设置的返利比例为30%，分销比例为：20%，15%，10%</span>
          <span>3.本系统的返利是作为佣金阶梯设置比例，即按照总佣金的金额区间去针对性的设置返利的比例</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
  import speed_button from "@/components/common/speed_button";

  export default {
    props: {
      info: {},
    },
    data() {
      return {}
    },
    created() {

    },
    mounted() {

    },
    methods: {
      // 撤销
      revocation() {

      },
    },
    components: {
      SpeedButton: speed_button,
    }
  }
</script>

<style lang="less" scoped>
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

      span {
        display: inline-block;
        font-size: 18px;
        margin-top: 8px;
        color: #999;
      }
    }

    article {
      height: 100%;
      min-height: 400px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      margin-top: 20px;
      padding: 12px 45px;
      overflow: auto;

      h1 {
        font-size: 22px;
        color: #232323;
      }

      p {
        font-size: 16px;
        color: #646464;
        margin-top: 15px;

        span {
          color: #0f41d6;
          cursor: pointer
        }

        span:hover {
          text-decoration: underline;
        }
      }

      .info {
        width: 70%;
        background-color: #F1F1F1;
        padding: 30px 20px;
        border-radius: 8px;
        color: #000;
        font-weight: bold;
        display: flex;
        margin-top: 14px;

        div:first-of-type {
          padding: 0 30px;
          height: 100%;
          border-right: 1px rgba(151, 151, 151, 0.2) solid;
          white-space: nowrap;
          font-size: 16px;
          margin-right: 30px;
        }

        span {
          display: block;
          margin-top: 15px;
          font-size: 14px;
        }

        span:first-of-type {
          margin-top: 0;
        }
      }
    }
  }
</style>
