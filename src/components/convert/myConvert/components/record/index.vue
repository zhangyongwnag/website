<template>
  <section class="_flex_column_space_between">
    <header class="_flex_between_center" v-if="vip_info.is_vip == 2">
      <h1>您目前还不是VIP</h1>
      <SpeedButton @confirm="turn_to_vip" class="become_vip">升级至<span style="font-weight: bold">VIP</span></SpeedButton>
    </header>
    <header class="_flex_between_center" v-else-if="vip_info.is_vip == 1">
      <div class="_flex_column_align_start">
        <h1>转换次数 : <span style="color: #1165D6">{{vip_info.convert_number}}</span></h1>
        <span>效期至 : <span style="color: #1165D6">{{vip_info.expire_time}}</span></span>
      </div>
      <SpeedButton @confirm="turn_to_vip" text="VIP续费" class="renew"/>
    </header>
    <header v-else></header>
    <article>
      <span class="title">购买记录</span>
      <el-table v-loading="loading" :data="recharge_record" height="100%" max-height="calc(100% - 65px)" style="width: 99%;">
        <el-table-column prop="createdTime" label="支付日期"></el-table-column>
        <el-table-column prop="order_name" label="套餐类型"></el-table-column>
        <el-table-column prop="expire_time" label="VIP有效期至"></el-table-column>
        <el-table-column label="支付费用">
          <template slot-scope="scope">￥{{scope.row.price}}</template>
        </el-table-column>
        <template slot='empty'>
          <div class="_common_empty">
            <img src="../../../../../assets/img/empty.png" alt="">
            <span>目前没有任何记录</span>
          </div>
        </template>
      </el-table>
    </article>
  </section>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import { mapState, mapMutations, mapActions } from 'vuex'

  export default {
    computed: {
      ...mapState({
        loading: state => state.myConvert.loading, // Loading 加载
        vip_info: state => state.myConvert.vip_info, // VIP信息
        recharge_record: state => state.myConvert.recharge_record, // 购买记录
      })
    },
    created() {
      // 获取VIP信息
      this.$store.dispatch('get_vip_info')
      // 根据是否有缓存数据设置Loading，
      this.$store.dispatch('update_lading', Boolean(!this.recharge_record.length))
      // 获取购买记录
      this.$store.dispatch('get_recharge_record')
    },
    mounted() {

    },
    methods: {
      ...mapActions(['turn_to_vip']),
    },
    components: {
      SpeedButton: speed_button,
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-table th, .el-table tr {
    background-color: #f6f6f6;
    border-bottom: 0;
  }

  /deep/ .el-table th > .cell {
    font-weight: normal;
  }

  /deep/ .el-table__header-wrapper {
    border: 1px rgba(151, 151, 151, 0.3) solid;
    border-bottom: 0;
    font-size: 18px;
  }

  /deep/ .el-table__body-wrapper {
    border: 1px rgba(151, 151, 151, 0.3) solid;
    border-top: 0;
    border-bottom: 0;
  }

  /deep/ .el-table{
    border-radius: 4px;
  }

  section {
    width: 100%;
    height: 100%;
    margin-left: 20px;

    header {
      width: 100%;
      height: 100px;
      min-height: 100px;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      padding: 0 45px;

      h1 {
        font-size: 20px;
        font-weight: bold;
        color: #3A3A3A;
      }

      span {
        margin-top: 8px;
      }

      .renew {
        width: 130px;
        background: #FFFFFF !important;
        color: rgba(250, 184, 51, 1) !important;
        font-weight: bold;
        border-radius: 18px;
        box-shadow: 0 0 2px 2px #fab833;
        /*border-image: linear-gradient(180deg, , rgba(242, 130, 23, 1)) 2 2;*/
      }

      .become_vip {
        width: 134px;
        background: linear-gradient(90deg, #FEAA13 0%, #F18017 100%);
        border-radius: 21px;
      }
    }

    article {
      width: 100%;
      height: 100%;
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      margin-top: 20px;
      overflow: auto;
      padding: 30px 45px;

      .title {
        display: inline-block;
        font-size: 18px;
        color: #000;
        margin-bottom: 20px;
      }

    }
  }
</style>
