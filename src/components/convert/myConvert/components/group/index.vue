<template>
  <section class="_flex_column_space_between">
    <header class="_flex_between_center" v-if="!user_status">
      <h1>您目前还不是VIP</h1>
      <SpeedButton class="become_vip">升级至<span style="font-weight: bold">VIP</span></SpeedButton>
    </header>
    <header class="_flex_between_center" v-else>
      <div class="_flex_column_align_start">
        <h1>已共享设备 : <span style="color: #1165D6">3</span></h1>
        <span>效期至 : <span style="color: #1165D6">2022.12.03</span></span>
      </div>
      <SpeedButton text="VIP续费" class="renew"/>
    </header>
    <article>
      <span class="title">购买记录</span>
      <el-table :data="tableData" height="100%" max-height="calc(100% - 65px)" style="width: 99%;">
        <el-table-column
            prop="date"
            label="支付日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="套餐类型"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="购买套餐">
        </el-table-column>
        <el-table-column
            prop="address"
            label="VIP有效期至">
        </el-table-column>
        <el-table-column
            prop="address"
            label="支付费用">
        </el-table-column>
      </el-table>
    </article>
  </section>
</template>

<script>
  import speed_button from "@/components/common/speed_button";

  export default {
    data() {
      return {
        user_status: 1, // 是否VIP
        tableData: [
          {
            date: '2016-05-02',
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
      }
    },
    created() {

    },
    mounted() {

    },
    methods: {},
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

  /deep/ .el-table__header-wrapper {
    border: 1px rgba(151, 151, 151, 0.3) solid;
    border-bottom: 0;
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
