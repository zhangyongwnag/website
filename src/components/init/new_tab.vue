<template>
  <article class="_flex_center">
    <section>
      <!--中间搜索栏-->
<!--      <div class="common_input">-->
<!--        <i class="el-icon-search"></i>-->
<!--        <input v-model.trim="value" type="text" maxLength="32" placeholder="搜索" @input="search">-->
<!--      </div>-->
<!--      <el-col :span="12">-->
        <el-autocomplete
            ref="autocomplete"
            class="inline-input"
            v-model.trim="value"
            :fetch-suggestions="querySearch"
            placeholder="搜索"
            @select="handleSelect"
            :debounce="0"
            @blur="value = ''"
            @clear="clear"
            popper-class="autocomplete-suggestion"
        >
          <div slot="prefix" class="el-icon-search"></div>
          <div slot="append" class="el-icon-error" @click="clear"></div>
          <template slot-scope="{ item, index }">
            <div class="file_item _flex_item_center" style="height: 50px; padding: 0" @click="handle_click(item,index)">
              <div class="file_info _flex_item_center _ellipsis" style="padding: 0 20px">
                <img src="../../assets/img/index/excel.svg" alt=""
                     v-if="common.filterFileType(item.type) === 'xls' || common.filterFileType(item.type) === 'xlsx'">
                <img src="../../assets/img/index/ppt.svg" alt=""
                     v-else-if="common.filterFileType(item.type) === 'ppt' || common.filterFileType(item.type) === 'pptx'">
                <img src="../../assets/img/index/pdf.svg" alt=""
                     v-else-if="common.filterFileType(item.type) === 'pdf'">
                <img src="../../assets/img/index/word.svg" alt="" v-else>
                <div class="file_name">
                  <span class="_ellipsis" style="line-height: inherit">{{common.filterFileName(item.path)}}</span>
                  <span style="line-height: inherit">{{common.dateResult(common.filterFileTime(item.modifyed), 'yyyy-MM-dd hh:mm')}}</span>
                </div>
              </div>
            </div>
          </template>
        </el-autocomplete>
<!--      </el-col>-->
      <!--内容区-->
      <div class="content">
        <!--文件列表-->
        <div class="file_list">
          <el-tabs v-model="tab">
            <el-tab-pane label="最近" name="first"></el-tab-pane>
            <el-tab-pane label="本地" name="second"></el-tab-pane>
          </el-tabs>
          <el-scrollbar class="list" v-if="filter_data.length" :native="false" wrapStyle="overflow-x: hidden;height: 100%"
                        wrapClass=""
                        viewClass="" viewStyle="" :noresize="false" tag="section">
            <transition-group name="el-fade-in" tag="span">
              <div class="file_item" v-for="(item,index) in filter_data" @click="handle_click(item,index)"
                   :key="item.id">
                <div class="file_info _flex_item_center _ellipsis">
                  <img src="../../assets/img/index/excel.svg" alt=""
                       v-if="common.filterFileType(item.type) === 'xls' || common.filterFileType(item.type) === 'xlsx'">
                  <img src="../../assets/img/index/ppt.svg" alt=""
                       v-else-if="common.filterFileType(item.type) === 'ppt' || common.filterFileType(item.type) === 'pptx'">
                  <img src="../../assets/img/index/pdf.svg" alt=""
                       v-else-if="common.filterFileType(item.type) === 'pdf'">
                  <img src="../../assets/img/index/word.svg" alt="" v-else>
                  <div class="file_name">
                    <span class="_ellipsis" style="width: 400px">{{common.filterFileName(item.path)}}</span>
                    <span>{{common.dateResult(common.filterFileTime(item.modifyed), 'yyyy-MM-dd hh:mm')}}</span>
                  </div>
                </div>
              </div>
            </transition-group>
          </el-scrollbar>
          <div class="list" v-else style="margin-top: -20px">
            <div class="file_empty">
              <img src="../../assets/img/empty.png" alt="">
              <span>暂无数据</span>
            </div>
          </div>
        </div>
        <div class="action">
          <!--文档操作-->
          <div class="active_file">
            <div class="item hvr-push" @click="common.debounce(common.openFile,200)">
              <img src="../../assets/img/index/open.svg" alt="">
              打开文件
            </div>
            <div class="item" @click="common.look(common.createFile,1000,'word')">
              <img src="../../assets/img/index/word.svg" alt="">
              新建Word
            </div>
            <div class="item" @click="common.look(common.createFile,1000,'cell')">
              <img src="../../assets/img/index/excel.svg" alt="">
              新建Excel
            </div>
            <div class="item" @click="common.look(common.createFile,1000,'slide')">
              <img src="../../assets/img/index/ppt.svg" alt="">
              新建PPT
            </div>
          </div>
          <!--常用转换-->
          <div class="convert">
            <div class="convert_tab">
              常用转换
              <span @click="turn_to_page('more')">更多</span>
            </div>
            <div class="convert_list">
              <div class="convert_wrap">
                <div class="convert_block _flex_column_center" v-for="(item,index) in init_convert_list"
                     @click="handle_convert_click(item,index)">
                  <img :src="item.icon_2x" alt="">
                  <span>{{item.name}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>


    <!--操作弹窗-->
    <!--    <transition name="el-zoom-in-top">-->
    <!--      <div v-if="model_info.show" class="file_action_model el-popper"-->
    <!--           :style="{left:model_info.left + 'px',top:model_info.top + 'px'}" x-placement="bottom-end"-->
    <!--           v-click-outside="hide_action_model">-->
    <!--        <p @click="model_item_handle_click('explore')">在文件夹中显示</p>-->
    <!--        <p @click="model_item_handle_click('delete')">从列表中删除</p>-->
    <!--        <div class="popper__arrow" style="right: 16px;left: auto">-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </transition>-->
  </article>
</template>

<script>
  import * as common from '../../utils/common'
  import { mapState } from 'vuex'

  export default {
    data() {
      return {
        common,
        // data源数据
        data_origin: [
          {
            "id": 0,
            "type": 1,
            "path": "https://testinfo.teamlab.info/New Document_ellipsis_ellipsis_ellipsis_ellipsis_ellipsis_ellipsis_ellipsis_ellipsis_ellipsis_ellipsis.docx",
            "modifyed": "18.08.2021 10:21"
          },
          {
            "id": 1,
            "type": 1,
            "path": "C:\\Users\\maxim.kadushkin\\Documents\\DPIConfig_SmallPCs.docx",
            "modifyed": "08.05.2021 10:21"
          },
          {"id": 2, "type": 1, "path": "/Users/ayuzhin/Develop/Web/test.html", "modifyed": "11.12.2015 17:58"},
          {"id": 3, "type": 1, "path": "https://testinfo.teamlab.info\\Sadfasd.docx", "modifyed": "10.12.2015 17:25"},
          {"id": 4, "type": 1, "path": "https://testinfo.teamlab.info\\Sadfasd.docx", "modifyed": "10.12.2015 17:25"},
          {"id": 5, "type": 1, "path": "https://testinfo.teamlab.info\\Sadfasd.docx", "modifyed": "10.12.2015 17:25"},
          {
            "id": 6,
            "type": 1,
            "path": "https://testinfo.teamlab.info\\Office 365 Value Added Reseller Guide.docx",
            "modifyed": "10.12.2015 16:46"
          }
        ],
        data: [], // 打开历史记录的数据
        value: '', // 搜索信息
        tab: 'first' // Tab选中标签
      }
    },
    computed: {
      ...mapState({
        convert_list: state => state.convert.convert_list // 转换列表
      }),
      // 首页转换过滤
      init_convert_list() {
        return this.convert_list.filter(item => item.init)
      },
      // 过滤列表
      filter_data() {
        if (this.data.length) {
          if (this.tab === 'first') {
            return this.data.filter(item => common.filterFileTime(item.modifyed) > (new Date().getTime() - (1000 * 60 * 60 * 24 * 7)))
          }else if (this.tab === 'second') {
            return this.data
          }
        }else {
          return []
        }
      },
    },
    mounted() {
      // 根据缓存操作侧边栏
      if (localStorage.getItem('aside')) {
        this.$store.dispatch('update_aside_status', localStorage.getItem('aside') === 'true' ? true : false)
      }
      // 调用底层封装的sdk方法
      if (window.sdk) {
        window.sdk.LocalFileRecents(); // 注册本地历史记录
        window.sdk.execCommand('app:onready', ''); // 监听客户端初始化
      } else {
        this.data = this.data_origin
      }
      // 本地历史记录数据获取
      window.sdk.on('onupdaterecents', arr => {
        if (arr.length) {
          // 检查数据，保存数据，渲染数据
          // window.sdk.execCommand('files:check', JSON.stringify(arr));
          this.data = arr
          this.data_origin = arr
        } else {
          this.data = []
          this.data_origin = []
        }
      });

    },
    methods: {
      /**
       * @description 为列表每一项添加点击事件
       * @param {Object} item: 点击项
       * @param {Number} index: 点击项下标
       */
      handle_click(item, index) {
        common.openFile(item)
      },
      /**
       * @description 检索数据
       * @param {Object} queryString: 搜索值
       * @param {Function} cb: 回调函数
       */
      querySearch(queryString, cb) {
        let results = queryString ? this.data.filter(item => common.filterFileName(item.path).toLowerCase().indexOf(queryString.toLowerCase()) !== -1) : this.data;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      /**
       * @description 选中某一项搜索结果
       * @param {Object} item: 选中项
       */
      handleSelect(item) {
        common.openFile(item)
      },
      /**
       * @description 清空输入框的值
       */
      clear() {
        this.value = ''
        // 调用源码中的方法
        this.$refs.autocomplete.debouncedGetData(this.value)
        this.$refs.autocomplete.activated = false
      },
      /**
       * @description 跳转页面
       */
      turn_to_page() {
        this.$router.push({name: 'convert', params: {
            tab: {
              id: 6,
              component_name: 'all',
            },
            index: 5
          }
        })
      },
      /**
       * @description 选中某一项转换类型跳转
       * @param {Object} item: 选中项
       */
      handle_convert_click(item) {
        this.$router.push({name: 'convert', params: {
            tab: {
              id: 7,
              component_name: 'index',
            },
            index: 6
          }
        })
        // 更新当前选择的转换信息
        this.$store.dispatch('update_convert_info', item.file_type)
      },
    },
    components: {}
  }
</script>

<style lang="less" scoped>
  .el-icon-error {
    cursor:pointer;
    font-size: 20px;
    color: #d1d1d1;
  }

  /deep/ .el-autocomplete {
    width: 80%;
    margin-left: 10%;

    .el-input {

      &:focus-within {

        input {
          text-align: left;
        }

        .el-input__prefix {
          left: 2%;
        }

        .el-input-group__append {
          opacity: 1;
        }
      }

      input {
        width: 100%;
        height: 42px;
        line-height: 42px;
        border: 0;
        border-radius: 24px;
        padding: 0 40px;
        text-align: center;
        transition: all .3s;

        &::placeholder {
          font-size: 15px;
        }
      }

      .el-input__prefix {
        left: 45%;
        font-size: 15px;
        color: #CBCBCB;
        transition: all 0s;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .el-input-group__append {
        height: 100%;
        opacity: 0;
        border: 0;
        background: transparent;
        position: absolute;
        right: 1%;
        top: 0;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }

  /deep/ .el-tabs__nav-wrap {
    .el-tabs__nav-scroll {
      padding: 7px 0 0 26px;

      .el-tabs__nav {
        .el-tabs__active-bar {
          background-color: #2E5A9D;
          border-radius: 2px;
          height: 3px;
        }

        .el-tabs__item {
          font-size: 16px;
          font-weight: bold;
          height: 42px;
          line-height: 42px;
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

  .file_item {
    padding: 15px 26px;
    cursor: pointer;

    .file_info {
      width: 100%;

      img {
        width: 24px;
        height: 26px;
        margin-right: 10px;
      }

      .file_name {
        display: flex;
        flex-direction: column;

        span:first-of-type {
          font-size: 15px;
          color: #333;
        }

        span:last-of-type {
          font-size: 12px;
          color: #999;
          margin-top: 2px;
        }
      }
    }
  }

  .file_item:hover {
    background-color: #F1F1F1;
  }

  article {
    width: 100%;
    height: 100%;
    background-color: #F1F1F1;

    section {
      width: 900px;
      height: 700px;

      .common_input {
        width: 80%;
        height: 42px;
        border: 0;
        margin-left: 10%;
      }

      .content {
        display: flex;
        margin-top: 30px;
        height: calc(100% - 75px);

        .file_list {
          width: 430px;
          background-color: #fff;
          margin-right: 10px;
          border-radius: 8px;
          overflow: hidden;

          .list {
            padding-top: 10px;
            height: 630px;
            background-color: #fff;

          }

          .file_empty {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;

            span {
              font-size: 15px;
              color: #999;
              margin-top: 30px;
            }
          }
        }

        .action {
          width: 470px;

          .active_file {
            height: 38%;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;

            .item {
              width: 49%;
              height: 49%;
              /*margin-right: 10px;*/
              position: relative;
              background-color: #fff;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              color: #666;
            }

            .item:nth-child(1) {
              margin-bottom: 10px;
            }

            .item img {
              width: 33px;
              margin-bottom: 10px;
            }
          }

          .convert {
            height: calc(62% - 14px);
            background-color: #fff;
            margin-top: 14px;
            border-radius: 8px;

            .convert_tab {
              font-size: 14px;
              font-weight: bold;
              height: 49px;
              line-height: 49px;
              display: flex;
              justify-content: space-between;
              padding: 0 26px;
              border-bottom: 1px rgba(151, 151, 151, 0.2) solid;

              span {
                font-size: 13px;
                color: rgba(51, 51, 51, 0.4);
                cursor: pointer;
              }
            }

            .convert_list {

              .convert_wrap {
                padding: 18px 20px 2px 26px;
                overflow: hidden;
                display: grid;
                justify-content: space-between;
                grid-template-columns: repeat(auto-fill, 100px);
                grid-gap: 1px;
                zoom: 0.96;

                .convert_block {
                  width: 90px;
                  height: 90px;
                  border: 1px rgba(151, 151, 151, 0.2) solid;
                  border-radius: 10px;
                  cursor: pointer;
                  margin-bottom: 16px;

                  img {
                    width: 26px;
                  }

                  span {
                    font-size: 14px !important;
                    color: #686868;
                    margin-top: 10px;
                    transform: scale(0.8);
                    white-space: nowrap;
                  }
                }
              }
            }
          }
        }
      }
    }


  }

  @keyframes model_load {
    from {
      height: 0;
      opacity: 0;
    }
    to {
      height: 80px;
      opacity: 1;
    }
  }


</style>
