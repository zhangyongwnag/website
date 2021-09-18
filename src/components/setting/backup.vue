<template>
  <section class="_flex_column_space_between">
    <header class="_flex_between_center">
      <div class="_flex_column_align_start">
        <h1>备份操作</h1>
        <span>保障您文档的安全</span>
      </div>
    </header>
    <article class="_common_scroll_wrap">
      <div class="item _flex_between_center" @click="viewBackupData">
        <h2>查看备份目录</h2>
        <span >打开</span>
      </div>
      <div class="item _flex_between_center" @click="show = true">
        <h2>清除备份数据</h2>
        <span >全部清除</span>
      </div>
    </article>

    <el-dialog :visible.sync="show" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
      <h1>确认清除全部备份数据？</h1>
      <p style="color: #333">清除后将无法恢复，请谨慎操作</p>
      <footer class="_flex_between_center">
        <SpeedButton
            text="确认清除"
            type="cancel"
            @confirm="clearBackupData"
            style="color: #666"
        />
        <SpeedButton
            text="取消"
            @confirm="show = false"
        />
      </footer>
    </el-dialog>
  </section>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import * as common from '../../utils/common';

  export default {
    data() {
      return {
        show: false, // 清除缓存弹窗
      }
    },
    methods: {
      /**
       * @description 查看备份目录
       */
      viewBackupData() {
        window.sdk._viewBackupData()
      },
      /**
       * @description 清除备份数据
       */
      clearBackupData() {
        this.show = false
        window.sdk._clearBackupData()
        this.$message.success(`备份数据清除成功`)
      },
    },
    components: {
      SpeedButton: speed_button,
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-dialog {
    width: 465px !important;
  }

  /deep/ .el-dialog__body{
    padding: 12px 55px;
  }

  section {
    width: 100%;
    height: 100%;
    margin-left: 20px;
    animation: fade-bottom .5s 0s;

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
        font-size: 13px;
        margin-top: 8px;
        color: rgba(28, 28, 28, 0.5) !important;
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
      padding: 0 45px;

      .item {
        border-bottom: 1px solid rgba(235, 235, 235, 1);
        padding: 20px 0;
        cursor: pointer;

        h2 {
          font-size: 16px;
          font-weight: bold;
          color: #3A3A3A;
        }

        span {
          color: rgba(1, 91, 212, 1);
          cursor: pointer;
        }
      }
    }
  }

  h1 {
    font-size: 18px;
    color: #353535;
    font-weight: bold;
    margin-top: -5px;
  }

  footer {
    width: 100%;
    margin-top: 30px;

    .speed_button {
      height: 32px !important;
      line-height: 32px !important;
      font-size: 14px;
      width: 168px;
      margin-bottom: 15px;
      border-radius: 5px !important;
    }
  }
</style>
