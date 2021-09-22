<template>
  <div class="_flex_column_space_between">
<!--    <header class="_flex_between_center" v-if="vip_info.is_vip == 2">-->
<!--      <h1>您目前还不是VIP</h1>-->
<!--      <SpeedButton @confirm="turn_to_vip" class="become_vip">升级至<span style="font-weight: bold">VIP</span></SpeedButton>-->
<!--    </header>-->
<!--    <header class="_flex_between_center" v-else-if="vip_info.is_vip == 1">-->
<!--      <div class="_flex_column_align_start">-->
<!--        <h1>转换次数 : <span style="color: #1165D6">{{vip_info.convert_number}}</span></h1>-->
<!--        <span>效期至 : <span style="color: #1165D6">{{vip_info.expire_time}}</span></span>-->
<!--      </div>-->
<!--      <SpeedButton @confirm="turn_to_vip" text="VIP续费" class="renew"/>-->
<!--    </header>-->
<!--    <header v-else></header>-->
    <article>
      <el-table
          v-loading="loading"
          :data="list"
          ref="multipleTable"
          @row-click=""
          @select=""
          @select-all=""
          height="500px"
          style="width: 98%;margin-left: 10px">
<!--        <el-table-column type="selection" width="70"></el-table-column>-->
        <el-table-column label="荣誉名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-align: center;padding-left: 20px" class="_ellipsis">{{scope.row.name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="获得时间">
          <template slot-scope="scope">{{scope.row.time}}</template>
        </el-table-column>
        <template slot='empty'>
          <div class="_common_empty">
            <img src="../../../../../assets/img/empty.png" alt="">
            <span>目前没有任何记录</span>
          </div>
        </template>
      </el-table>
      <!--分页加载-->
      <SpeedPagination :total="total" :size="page_size" @handle-current="handle_current"/>
    </article>
  </div>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import speed_pagination from "../../../../common/speed_pagination";
  import { mapState, mapMutations, mapActions } from 'vuex'
  import * as utils from '../../../../../utils/convert_utils'

  export default {
    data() {
      return {
        choice_data: new Set([]), // 选择的数据
        total: 0, // 数据总数量
        current_page: 1, // 当前的页码
        page_size: 10, // 每页的数量
        loading: false
      }
    },
    mounted() {
      this.list = [
        {
          id: 1,
          name: '湖北省翻译大赛二等奖',
          time: '2018 02-12 12:12',
        },
        {
          id: 2,
          name: '入围英语词汇大赛初赛',
          time: '2019 11-01 20:59',
        },
        {
          id: 3,
          name: '全国语文文字能力大赛优秀奖',
          time: '2019 06-05 19:11',
        },
        {
          id: 4,
          name: '武汉传媒学院读书月“最美读书瞬间”摄影比赛入围',
          time: '2020 11-02 10:31',
        },
        {
          id: 5,
          name: '获得武汉传媒学院“最美笔记”奖',
          time: '2020 02-24 12:01',
        },
        {
          id: 6,
          name: '通过了“武汉传媒学院风向标创业训练营”的课程和考核，考核良好',
          time: '2021 12-02 15:22',
        },
        {
          id: 7,
          name: '曾任校学生会学习部干事和院学生会监察部干事',
          time: '2021 05-04 11:02',
        },
        {
          id: 8,
          name: '曾任华媒青年报社团人事部部长',
          time: '2021 02-12 08:22',
        },
      ]
    },
    methods: {
      // 点击复选框
      handle_select(selection, row) {
        this.handle_click(row)
      },
      // 选择某一条数据
      handle_click(obj) {
        this.choice_data.has(obj.id) ? this.choice_data.delete(obj.id) : this.choice_data.add(obj.id)
        this.$nextTick(() => {
          this._set_choice_data()
        })
      },
      // 点击全局选中
      handle_click_all(selection) {
        this.convert_list.map(row => {
          selection.length ? this.choice_data.add(row.id) : this.choice_data.delete(row.id)
        })
        this.choice_data = new Set(Array.from(this.choice_data))
      },
      // 页码变化
      handle_current(value) {
        this.current_page = value
        this.$store.dispatch('update_lading', true)
        this.$store.dispatch('get_convert_list', { current_page: this.current_page, page_size: this.page_size })
          .then(res => {
            this._set_choice_data()
            // this.total = res.count
          })
      },
      // 设置选中数据
      _set_choice_data() {
        this.convert_list.map(row => {
          this.$refs.multipleTable.toggleRowSelection(row, this.choice_data.has(row.id))
          // this.$refs.multipleTable.setCurrentRow(row, this.choice_data.has(row))
        })
      }
    },
    components: {
      SpeedButton: speed_button,
      SpeedPagination: speed_pagination
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-table tr {
    cursor: pointer !important;
  }

  /deep/ .el-table-column--selection {
    padding-left: 18px;
  }

  ._flex_column_space_between {
    margin-top: 24px;
    width: 100%;
    animation: fade-bottom .5s 0s;
    padding-bottom: 50px;

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
      background: #FFFFFF;
      box-shadow: 0px 2px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      margin-top: 20px;
      overflow: auto;
      padding-top: 10px;

      .title {
        display: inline-block;
        font-size: 18px;
        color: #000;
        margin-bottom: 20px;
      }
    }
  }
</style>
