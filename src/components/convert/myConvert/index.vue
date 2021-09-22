<template>
    <el-scrollbar class="container" :native="false" wrapStyle="overflow-x: hidden;" wrapClass="" viewClass="" viewStyle=""
                  :noresize="false" tag="section">

      <header class="_flex_between_center">
        <div class="_flex_item_center">
          <img src="../../../assets/img/position.png" alt="">
          位置：湖北省 武汉市
        </div>
        <div class="date">出生日期：2021.12.12</div>
      </header>
      <section class="_flex_column_center">
        <div class="user_avatar _flex_center">
          <img :src="user_info.user_headpic" alt="">
        </div>
        <h1 class="_flex_center">
          {{user_info.user_name}}
          <img src="../../../assets/img/gril.png" alt="">
        </h1>
        <div class="description">
          1363944092@qq.com<span>|</span>武汉传媒学院
        </div>
        <div class="tabs">
          <div class="tab" v-for="(item, index) in tabs">{{item }}</div>
        </div>
      </section>
      <nav>
        <el-tabs v-model="label">
          <el-tab-pane label="个人信息" name="first"></el-tab-pane>
          <el-tab-pane label="个人简介" name="second"></el-tab-pane>
          <el-tab-pane label="技能特长" name="third"></el-tab-pane>
          <el-tab-pane label="兴趣爱好" name="fourth"></el-tab-pane>
          <el-tab-pane label="个人荣誉" name="five"></el-tab-pane>
          <el-tab-pane label="个人作品" name="six"></el-tab-pane>
        </el-tabs>
      </nav>
      <div class="tab_content_wrap">
        <div class="tab_content">
          <Info v-if="label === 'first'" />
          <Description v-else-if="label === 'second'" />
          <Art v-else-if="label === 'third'" />
          <Interest v-else-if="label === 'fourth'" />
          <Convertion v-else-if="label === 'five'" />
          <Example v-else-if="label === 'six'" />
        </div>
      </div>
    </el-scrollbar>
</template>

<script>
  import {mapState} from 'vuex'
  import info from "../person/info";
  import description from "../person/description";
  import art from "../person/art";
  import interest from "../person/interest";
  import convertion from '../myConvert/components/convertion/index'
  import example from "../person/example";

  export default {
    data() {
      return {
        tabs: ['夜猫子', '逛街达人', '选择恐惧症', '古筝狂魔', '逗比控'],
        label: 'first'
      }
    },
    computed: {
      ...mapState({
        user_info: state => state.login.user_info
      }),
    },
    methods: {},
    components: {
      Info: info,
      Description: description,
      Art: art,
      Interest: interest,
      Convertion: convertion,
      Example: example
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-tabs__nav-wrap {
    .el-tabs__nav-scroll {
      padding: 7px 0 0 26px;
      display: flex;
      justify-content: center;

      .el-tabs__nav {
        .el-tabs__active-bar {
          background-color: #2E5A9D;
          border-radius: 2px;
          height: 2px;
          width: 30px !important;
          margin-left: 18px;
        }

        .el-tabs__item {
          font-size: 16px;
          font-weight: bold;
          height: 42px;
          line-height: 42px;
          padding: 0 40px;
        }

        .el-tabs__item.is-active {
          color: #2E5A9D;
        }

        .el-tabs__item:hover {
          color: #2E5A9D;
        }
      }
    }

    &:after {
      height: 1px;
      background-color: rgba(151, 151, 151, 0.2);
    }
  }

  /deep/ .el-tabs__header {
    margin: 0;
  }

  /deep/ .el-tabs__content {
    padding: 0;
    height: calc(100% - 58px);
  }

  .container {
    width: 100%;
    height: calc(100% - 78px);
    animation: fade-bottom .5s 0s;

    header {
      width: 100%;
      height: 80px;
      padding: 0 42px 0 32px;

      .date {
        font-size: 18px;
        color: #999;
      }
    }

    section {
      width: 100%;
      height: 269.2px;
      background-color: #fff;
      position: relative;
      justify-content: flex-start;

      .user_avatar {
        position: absolute;
        left: 50%;
        top: -65px;
        transform: translateX(-50%);
        width: 130px;
        height: 130px;
        border-radius: 50%;
        border: 10px #fff solid;
        overflow: hidden;

        img {
          width: 105%;
        }

        &:before {
          content: '';
          position: absolute;
        }
      }

      h1 {
        font-size: 24px;
        margin-top: 72px;
        font-weight: normal;
        text-shadow: 0.5px 0 0.5px #999;

        img {
          width: 24px;
          margin-left: 12px;
        }
      }

      .description {
        margin-top: 17px;
        font-size: 18px;
        color: #999;

        span {
          margin: -5px 12px 0;
          font-size: 20px;
        }
      }

      .tabs {
        margin-top: 26px;
        display: flex;

        .tab {
          padding: 5px 30px;
          border-radius: 24px;
          background-color: rgba(213, 223, 247, 0.7);
          color: dodgerblue;
          font-size: 14px;
          margin-right: 20px;
          text-align: center;
          line-height: 20px;
          /*box-shadow: 0 0 10px 2px #eee*/
          box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          animation: tab_show 1s .3s forwards;
          transition: all .3s;
          opacity: 0;

          &:hover {
            transform: scale(1.1);
          }
        }
      }
    }

    nav {
      margin-top: -50px;
      opacity: 0;
      animation: section_show 1s 1s forwards;
    }

    .tab_content_wrap {
      display: flex;
      justify-content: center;

      .tab_content {
        width: 1050px;
      }
    }
  }

  @keyframes tab_show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes section_show {
    from {
      opacity: 0;
      transform: translateY(-50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
