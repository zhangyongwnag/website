<template>
  <header class="_flex_between_center">
    <!--菜单栏-->
    <nav class="_flex_center">
      <div v-if="!tab.hidden" :ref="`tab${index}`" class="nav_item _flex_center" v-for="(tab,index) in tabs"
           @click="handle_change(tab,index)">{{tab.name}}
      </div>
      <div v-if="convert_header_active_index < 6" class="nav_active_line" :style="{left: tab_translate}"
           ref="line"></div>
    </nav>
    <!--搜索框、会员中心按钮-->
    <section class="_flex_center">
      <div class="search">
        <el-autocomplete
            ref="complete"
            class="inline-input"
            v-model.trim="value"
            type="text"
            :fetch-suggestions="querySearch"
            placeholder="任何搜索"
            @select="handleSelect"
            highlight-first-item
            :debounce="0"
        >
          <div slot="prefix" class="el-icon-search"></div>
          <div slot="suffix" class="el-icon-error" @click="clear"></div>
          <template slot-scope="{ item }">
            <div class="search_item _flex_item_center">
              <img :src="item.icon" alt="" :style="item.icon_size ? {width: item.icon_size + 'px', marginRight: '10px'} : {width: '18px', marginRight: '10px'}">
              {{ item.value }}
            </div>
          </template>
        </el-autocomplete>
      </div>
      <div class="user _flex_center" v-active @click="handleSelect(search_list[0])">
        会员中心
      </div>
    </section>
  </header>
</template>
<script>
  import {mapState} from 'vuex'
  import * as common from '../../utils/common'

  export default {
    data() {
      return {
        // Tab栏
        tabs: [
          {
            id: 1,
            name: '我的转换',
            component_name: 'myConvert'
          },
          {
            id: 2,
            name: '常用转换',
            component_name: 'basicConvert'
          },
          {
            id: 3,
            name: 'PDF转换',
            component_name: 'pdfConvert'
          },
          {
            id: 4,
            name: 'Office转换',
            component_name: 'officeConvert'
          },
          {
            id: 5,
            name: '压缩',
            component_name: 'compress'
          },
          {
            id: 6,
            name: '所有工具',
            component_name: 'all'
          },
          {
            id: 7,
            name: '转换详细页面',
            component_name: 'index',
            hidden: true
          }
        ],
        value: '', // 搜索值
        number: 10, // 随机数
      };
    },
    computed: {
      ...mapState({
        convert_header_active_index: state => state.app.convert_header_active_index,
        search_list: state => state.common.search_list
      }),
      // 选中移动效果
      tab_translate() {
        if (this.number) {
          let index = this.convert_header_active_index + 1
          let line_width = this.$refs.line ? this.$refs.line.offsetWidth : 30
          let tab_width = this.$refs.tab0 ? this.$refs.tab0[0].offsetWidth + 0.4 : document.documentElement.style.fontSize.replace('px', '') * 0.73333
          // 当前选中Tab的总宽度 - 滑块的宽度 / 2(居中) + 当前选中第几个 * 一个Tab的宽度 / 2(居中)
          return (index * tab_width - line_width) / 2 + (index - 1) * tab_width / 2 + 'px'
        }
      }
    },
    created() {
      window.addEventListener('resize', this._resize)
    },
    destroyed() {
      window.removeEventListener('resize', this._resize)
    },
    methods: {
      /**
       * @description tab change
       * @param {Object} tab: 当前选择项
       * @param {Number} index: 当前选择项index
       */
      handle_change(tab, index) {
        // 将当前选择的Tab保存，动态引入组件
        this.$store.dispatch('update_convert_header_active', {tab, index})
      },
      /**
       * @description 过滤列表
       * @param {String} queryString: 要过滤的值
       * @param {Function} cb: callback
       */
      querySearch(queryString, cb) {
        let results = queryString ? this.search_list.filter(item => item.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.search_list;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      /**
       * @description 选中某一项搜索结果
       * @param {Object} item: 选中项
       */
      handleSelect(item) {
        // 将当前选择的Tab保存，动态引入组件
        this.$store.dispatch('update_convert_header_active', {
          tab: this.tabs[item.tab_id - 1],
          index: item.tab_id - 1
        })
        // 如果file_type存在，则特殊单独处理
        if (item.file_type) {
          // 更新当前选择的转换类型信息
          this.$store.dispatch('update_convert_info', item.file_type)
          // 更新选择的文件列表
          this.$store.dispatch('set_file_list', true)
          // 更新剩余转换次数
          this.$store.dispatch('update_convert_time')
          return
        }
        setTimeout(() => {
          // 将当前选择的子Tab保存，动态引入子组件
          this.$store.dispatch('update_active_tab_info', {
            id: item.item_id,
            component_name: item.item_name
          })
        })
      },
      /**
       * @description 清空输入框的值
       */
      clear() {
        this.value = ''
        // 调用源码中的方法
        this.$refs.complete.debouncedGetData(this.value)
        this.$refs.complete.activated = false
      },
      /**
       * @description 窗口大小改变
       */
      _resize() {
        common.debounce(() => this.number = parseInt(Math.random() * 1000000000), 1000)
      }
    }
  };
</script>

<style lang="less" scoped>
  /deep/ .el-autocomplete {
    width: 300px;

    .el-input__prefix,
    .el-input__suffix {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 12px;
    }
  }

  /deep/ .el-input--prefix .el-input__inner {
    padding-left: 40px;
  }

  /deep/ .el-input__inner {
    height: 38px;
    background: #FFFFFF;
    border-radius: 19px;
    border: 1px solid #DCDCDC;
  }

  .search_item {
    padding: 0 20px;

    &:hover {
      background-color: #F1F1F1;
    }
  }

  header {
    width: 100%;
    height: 78px;
    min-height: 78px;
    background: #FFFFFF;
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.07);
    padding: 0 38px 0 18px;
    animation: fade-top .5s 0s forwards;

    nav {
      position: relative;
      height: 45px;

      .nav_item {
        width: 110px;
        height: 100%;
        cursor: pointer;
        text-shadow: 0.5px 0 0.5px #999;
        letter-spacing: 1px;
      }

      .nav_item:last-of-type {
        margin-right: 0;
      }

      .nav_active_line {
        position: absolute;
        left: 40px;
        bottom: 0px;
        width: 30px;
        height: 2px;
        background: #1B2077;
        border-radius: 17px;
        transition: all .3s;
      }
    }

    .user {
      width: 104px;
      height: 32px;
      line-height: 32px;
      background: linear-gradient(180deg, #242143 0%, #1E1D2E 100%);
      border-radius: 16px;
      font-size: 15px;
      color: #EFD9CC;
      margin-left: 20px;
      cursor: pointer;
      position: relative;
    }
  }
</style>
