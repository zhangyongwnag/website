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
      <el-table
          v-loading="loading"
          :data="convert_list"
          ref="multipleTable"
          @row-click=""
          @select=""
          @select-all=""
          height="100%"
          max-height="calc(100% - 80px)"
          style="width: 98%;margin-left: 10px">
<!--        <el-table-column type="selection" width="70"></el-table-column>-->
        <el-table-column label="文档名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <div style="text-align: left;padding-left: 20px" class="_ellipsis">{{scope.row.filename}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="file_convert_way" label="方式"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status_message === '转换成功'" style="color: forestgreen">{{scope.row.status_message}}</span>
            <span v-else-if="scope.row.status_message === '正在进行'">{{scope.row.status_message}}</span>
            <span v-else style="color: red">{{scope.row.status_message}}</span>
          </template>
        </el-table-column>
        <el-table-column label="到期时间">
          <template slot-scope="scope">{{!scope.row.is_expire ? scope.row.expire_time : '已过期'}}</template>
        </el-table-column>
        <el-table-column>
          <template slot="header" slot-scope="scope">
            下载
<!--            <SpeedButton :disabled="!choice_data.size" @confirm="download_multiple" text="批量下载" style="font-weight: normal; line-height: 15px; padding:7px 17px" />-->
          </template>
          <template slot-scope="scope">
            <div class="_flex_center" style="width: 100%; height: 40px;" @click.stop="download(scope.row, scope.$index)">
              <img v-if="!scope.row.is_expire" src='../../../../../assets/img/order/download.svg' alt="">
              <img v-else src='../../../../../assets/img/order/download_is_expire.svg' alt="">
            </div>
          </template>
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
  </section>
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
      }
    },
    computed: {
      ...mapState({
        loading: state => state.myConvert.loading, // Loading 加载
        vip_info: state => state.myConvert.vip_info, // VIP信息
        convert_list: state => state.myConvert.convert_list, // 转换列表
      })
    },
    created() {
      // 获取VIP信息
      this.$store.dispatch('get_vip_info')
      // 根据是否有缓存数据设置Loading，
      this.$store.dispatch('update_lading', Boolean(!this.convert_list.length))
      // 获取购买记录
      this.$store.dispatch('get_convert_list', { current_page: this.current_page, page_size: this.page_size })
        .then(res => {
          this.total = res.count
        })
    },
    methods: {
      ...mapActions(['turn_to_vip']),
      /**
       * @description 批量下载
       */
      download_multiple() {
        let failure = []; // 失效文件
        // 过滤已选择数据
        let list = this.convert_list.filter(item => {
          this.choice_data.has(item.id) && (!item.converturl) ? failure.push(item.id) : ''
          return this.choice_data.has(item.id) && item.converturl && !item.is_expire
        })
        // 如果文件全部失效
        if (!list.length) {
          this.$notify({
            title:'提示',
            message:'所选文件均为失效文件，请重新选择',
            type:'info',
            showClose:true,
          })
          this.choice_data = new Set([])
          this._set_choice_data()
          return
        }
        // 如果文件部分失效
        if (failure.length) {
          this.$notify({
            title:'提示',
            message:`检测到所选文件包含${failure.length}个失效文件，已为您过滤下载`,
            type:'info',
            showClose:true,
          })
          failure.map(item => this.choice_data.delete(item))
          this._set_choice_data()
        }
        // 下载有效文件
        let index_ = 0
        this.download(list[index_], index_)
        let time_int = setInterval(() => {
          index_ ++
          this.download(list[index_], index_)
          if (list.length - 1 === index_) {
            clearInterval(time_int)
          }
        }, 1000)
      },
      /**
       * @description 下载单条数据
       * @param {Object} item: 当前选中项
       * @param {Number} index: 选中项下标index
       */
      download(item, index) {
        if (!item.converturl) {
          this.$message.info(`文件未转换成功，无法下载`)
          return;
        }
        if (item.is_expire) {
          this.$message.info(`文件已过期，无法下载`)
          return
        }
        var oA = document.createElement('a')
        oA.href = item.converturl
        oA.click()
      },
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
      height: calc(100vh - 252px);
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
