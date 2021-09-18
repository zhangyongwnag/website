<template>
  <section class="_flex_column_space_between">
    <header class="_flex_between_center">
      <div class="_flex_column_align_start">
        <h1>设置语言</h1>
        <span>设置界面语言</span>
      </div>
<!--      <SpeedButton v-if="!editor" @confirm="editor = true">编辑</SpeedButton>-->
<!--      <div class="_flex_center" v-else>-->
<!--        <SpeedButton type="cancel" style="margin-right: 20px" @confirm="editor = false">取消</SpeedButton>-->
<!--        <SpeedButton @confirm="editor = false">完成</SpeedButton>-->
<!--      </div>-->
    </header>
    <article class="_common_scroll_wrap" :disabled="false">
      <h2>显示语言</h2>
      <el-select v-model="value" placeholder="请选择">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
    </article>
  </section>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import * as common from '../../utils/common';

  export default {
    data() {
      return {
        editor: false, // 整体编辑状态
        options: [
          {
            value: 1,
            label: '中文（简体）'
          },
        ],
        value: 1
      }
    },
    components: {
      SpeedButton: speed_button,
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-input__inner {
    border-width: 2px;
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
        color: rgba(28, 28, 28, 0.5);
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
      padding: 20px 45px 0;

      h2 {
        font-size: 16px;
        font-weight: bold;
        color: #3A3A3A;
        margin-bottom: 11px;
      }
    }

    article[disabled] {
      opacity: 0.6;
      pointer-events: none;
    }
  }
</style>
