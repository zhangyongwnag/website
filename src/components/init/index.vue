<template>
  <article>
    <!--顶部按钮-->
    <header class="hvr-push">
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
    </header>

    <!--中间搜索栏-->
    <div class="search_toolbar">
      <h1>最近使用文件</h1>
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
          <div class="search_list _flex_item_center" style="height: 35px; padding: 0" @click="handle_click(item,index)">
            <div class="search_item _flex_item_center">
              <img src="../../assets/img/index/excel.svg" alt=""
                   v-if="common.filterFileType(item.type) === 'xls' || common.filterFileType(item.type) === 'xlsx'">
              <img src="../../assets/img/index/ppt.svg" alt=""
                   v-else-if="common.filterFileType(item.type) === 'ppt' || common.filterFileType(item.type) === 'pptx'">
              <img src="../../assets/img/index/pdf.svg" alt=""
                   v-else-if="common.filterFileType(item.type) === 'pdf'">
              <img src="../../assets/img/index/word.svg" alt="" v-else>
              <div class="_ellipsis" style="margin-left: 10px; width: 360px">
                <span style="line-height: inherit;">{{common.filterFileName(item.path)}}</span>
              </div>
            </div>
          </div>
        </template>
      </el-autocomplete>
    </div>

<!--    &lt;!&ndash;最近打开文件&ndash;&gt;
    <el-scrollbar class="file_list" v-if="today_list.length && after_list.length && data_week.length" :native="false" wrapStyle="overflow-x: hidden;" wrapClass="" viewClass="" viewStyle="" :noresize="false" tag="section">
      <el-collapse v-model="active">
        <el-collapse-item name="today">
          <template slot="title">
            <p class="_flex_item_center">
              今天
              <i class="el-icon-arrow-right" :class="{'icon_active': active.includes('today')}"></i>
            </p>
          </template>
          <transition-group name="el-fade-in" tag="span" v-if="today_list.length" ref="today_list">
              <div class="file_item" v-for="(item,index) in today_list" @click="handle_click(item,index)" :key="item.id">
                <div class="file_info">
                  <img src="../../assets/img/index/excel.svg" alt="" v-if="common.filterFileType(item.type) === 'xls' || common.filterFileType(item.type) === 'xlsx'">
                  <img src="../../assets/img/index/ppt.svg" alt="" v-else-if="common.filterFileType(item.type) === 'ppt' || common.filterFileType(item.type) === 'pptx'">
                  <img src="../../assets/img/index/pdf.svg" alt="" v-else-if="common.filterFileType(item.type) === 'pdf'">
                  <img src="../../assets/img/index/word.svg" alt="" v-else>
                  <div class="file_name">
                    <span class="_ellipsis">{{common.filterFileName(item.path)}}</span>
                    <span class="_ellipsis">{{item.path}}</span>
                  </div>
                </div>
                <div class="file_time">{{common.dateResult(common.filterFileTime(item.modifyed), 'MM月dd日 hh:mm')}}</div>
                <div class="file_size">{{common.filterFileType(item.type)}}</div>
                <el-popover
                    placement="bottom-end"
                    width="150"
                    transition="el-zoom-in-top"
                    popper-class="file_action_model"
                    v-model="item.status"
                >
                  <p @click="model_item_handle_click(item, index, 'explore')">在文件夹中显示</p>
                  <p @click="model_item_handle_click(item, index, 'delete')">从列表中删除</p>
                  <div slot="reference" @click.stop class="file_action"></div>
                </el-popover>
              </div>
            </transition-group>
        </el-collapse-item>
        <el-collapse-item name="after">
          <template slot="title">
            <p class="_flex_item_center">
              昨天
              <i class="el-icon-arrow-right" :class="{'icon_active': active.includes('after')}"></i>
            </p>
          </template>
          <transition-group name="el-fade-in" tag="span">
              <div class="file_item" v-for="(item,index) in after_list" @click="handle_click(item,index)" :key="item.id">
                <div class="file_info">
                  <img src="../../assets/img/index/excel.svg" alt="" v-if="common.filterFileType(item.type) === 'xls' || common.filterFileType(item.type) === 'xlsx'">
                  <img src="../../assets/img/index/ppt.svg" alt="" v-else-if="common.filterFileType(item.type) === 'ppt' || common.filterFileType(item.type) === 'pptx'">
                  <img src="../../assets/img/index/pdf.svg" alt="" v-else-if="common.filterFileType(item.type) === 'pdf'">
                  <img src="../../assets/img/index/word.svg" alt="" v-else>
                  <div class="file_name">
                    <span class="_ellipsis">{{common.filterFileName(item.path)}}</span>
                    <span class="_ellipsis">{{item.path}}</span>
                  </div>
                </div>
                <div class="file_time">{{common.dateResult(common.filterFileTime(item.modifyed), 'MM月dd日 hh:mm')}}</div>
                <div class="file_size">{{common.filterFileType(item.type)}}</div>
                <el-popover
                    placement="bottom-end"
                    width="150"
                    transition="el-zoom-in-top"
                    popper-class="file_action_model"
                    v-model="item.status"
                >
                  <p @click="model_item_handle_click(item, index, 'explore')">在文件夹中显示</p>
                  <p @click="model_item_handle_click(item, index, 'delete')">从列表中删除</p>
                  <div slot="reference" @click.stop class="file_action"></div>
                </el-popover>
              </div>
            </transition-group>
        </el-collapse-item>
        <el-collapse-item name="week">
          <template slot="title">
            <p class="_flex_item_center">
              7天内
              <i class="el-icon-arrow-right" :class="{'icon_active': active.includes('week')}"></i>
            </p>
          </template>
          <transition-group name="el-fade-in" tag="span">
              <div class="file_item" v-for="(item,index) in data_week" @click="handle_click(item,index)" :key="item.id">
                <div class="file_info">
                  <img src="../../assets/img/index/excel.svg" alt="" v-if="common.filterFileType(item.type) === 'xls' || common.filterFileType(item.type) === 'xlsx'">
                  <img src="../../assets/img/index/ppt.svg" alt="" v-else-if="common.filterFileType(item.type) === 'ppt' || common.filterFileType(item.type) === 'pptx'">
                  <img src="../../assets/img/index/pdf.svg" alt="" v-else-if="common.filterFileType(item.type) === 'pdf'">
                  <img src="../../assets/img/index/word.svg" alt="" v-else>
                  <div class="file_name">
                    <span class="_ellipsis">{{common.filterFileName(item.path)}}</span>
                    <span class="_ellipsis">{{item.path}}</span>
                  </div>
                </div>
                <div class="file_time">{{common.dateResult(common.filterFileTime(item.modifyed), 'MM月dd日 hh:mm')}}</div>
                <div class="file_size">{{common.filterFileType(item.type)}}</div>
                <el-popover
                    placement="bottom-end"
                    width="150"
                    transition="el-zoom-in-top"
                    popper-class="file_action_model"
                    v-model="item.status"
                >
                  <p @click="model_item_handle_click(item, index, 'explore')">在文件夹中显示</p>
                  <p @click="model_item_handle_click(item, index, 'delete')">从列表中删除</p>
                  <div slot="reference" @click.stop class="file_action"></div>
                </el-popover>
              </div>
            </transition-group>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
    <div class="file_list" v-else>
      <div class="file_empty">
        <img src="../../assets/img/empty.png" alt="">
        <span>暂无数据</span>
      </div>
    </div>-->
    <!--最近打开文件-->
    <el-scrollbar class="file_list" v-if="data.length" :native="false" wrapStyle="overflow-x: hidden;" wrapClass="" viewClass="" viewStyle="" :noresize="false" tag="section">
      <transition-group name="el-fade-in" tag="span">
        <div class="file_item" v-for="(item,index) in data" @click="handle_click(item,index)" :key="item.id">
          <div class="file_info">
            <img src="../../assets/img/index/excel.svg" alt="" v-if="common.filterFileType(item.type) === 'xls' || common.filterFileType(item.type) === 'xlsx'">
            <img src="../../assets/img/index/ppt.svg" alt="" v-else-if="common.filterFileType(item.type) === 'ppt' || common.filterFileType(item.type) === 'pptx'">
            <img src="../../assets/img/index/pdf.svg" alt="" v-else-if="common.filterFileType(item.type) === 'pdf'">
            <img src="../../assets/img/index/word.svg" alt="" v-else>
            <div class="file_name">
              <span class="_ellipsis">{{common.filterFileName(item.path)}}</span>
              <span class="_ellipsis">{{item.path}}</span>
            </div>
          </div>
          <div class="file_time">{{common.dateResult(common.filterFileTime(item.modifyed), 'MM月dd日 hh:mm')}}</div>
          <div class="file_size">{{common.filterFileType(item.type)}}</div>
          <el-popover
              placement="bottom-end"
              width="150"
              transition="el-zoom-in-top"
              popper-class="file_action_model"
              v-model="item.status"
          >
            <p @click="model_item_handle_click(item, index, 'explore')">在文件夹中显示</p>
            <p @click="model_item_handle_click(item, index, 'delete')">从列表中删除</p>
            <div slot="reference" @click.stop class="file_action"></div>
          </el-popover>
        </div>
      </transition-group>
    </el-scrollbar>
    <div class="file_list" v-else>
      <div class="file_empty">
        <img src="../../assets/img/empty.png" alt="">
        <span>暂无数据</span>
      </div>
    </div>


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
        // active: ['today', 'after', 'week'], // 折叠面板打开项
        // data_week: [],
      }
    },
    computed: {
      // // 今天的数据
      // today_list() {
      //   return this.data.filter(item => common.filterFileTime(item.modifyed) > (new Date(new Date().toLocaleDateString()).getTime()))
      // },
      // // 昨天的数据
      // after_list() {
      //   return this.data.filter(item => common.filterFileTime(item.modifyed) > (new Date(new Date().toLocaleDateString()).getTime() - (1000 * 60 * 60 * 24)) && common.filterFileTime(item.modifyed) < (new Date(new Date().toLocaleDateString()).getTime()))
      // },
    },
    mounted() {
      // 调用底层封装的sdk方法
      if (window.sdk) {
        window.sdk.LocalFileRecents(); // 注册本地历史记录
        window.sdk.execCommand('app:onready', ''); // 监听客户端初始化
      } else {
        this.data = this.data_origin
        // let data_clone = JSON.parse(JSON.stringify(this.data_origin))
        // this.data_week = data_clone.filter(item => common.filterFileTime(item.modifyed) > (new Date().getTime() - (1000 * 60 * 60 * 24 * 7)))
      }
      // 本地历史记录数据获取
      window.sdk.on('onupdaterecents', arr => {
        if (arr.length) {
          // 检查数据，保存数据，渲染数据
          // window.sdk.execCommand('files:check', JSON.stringify(arr));
          this.data = arr
          this.data_origin = arr
          // this.data_week = arr.filter(item => common.filterFileTime(item.modifyed) > (new Date().getTime() - (1000 * 60 * 60 * 24 * 7)))
        } else {
          this.data = []
          this.data_origin = []
          // this.data_week = []
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
       * @description 弹窗的事件点击
       * @param {Object} item: 点击的项
       * @param {Number} index: 点击的项index
       * @param {String} type: 事件类型
       */
      model_item_handle_click(item, index, type) {
        item.status = false
        if (type == 'explore') {
          window.sdk.execCommand('files:explore', item.path);
        } else if (type == 'delete') {
          window.sdk.LocalFileRemoveRecent(parseInt(item.id))
          this.data.splice(index, 1)
        }
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
    },
    components: {}
  }
</script>

<style lang="less" scoped>
  /deep/ .el-autocomplete {
    width: 424px;
    margin-left: 10%;

    .el-input {

      &:focus-within {
        .el-input-group__append {
          opacity: 1;
        }
      }

      input {
        width: 100%;
        border: 1px solid #DCDCDC;
        border-radius: 24px;
        padding: 0 40px;
        transition: all .3s;

        &::placeholder {
          font-size: 15px;
        }
      }

      .el-input__prefix {
        top: 0;
        left: 4%;
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
        cursor:pointer;
        font-size: 16px;
        color: #d1d1d1;
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

  /deep/ .el-collapse {
    border: 0;
  }

  /deep/ .el-collapse-item__wrap {
    border: 0;
  }

  /deep/ .el-collapse-item__header {
    border: 0;
    margin-bottom: -10px;
  }

  /deep/ .el-collapse-item__content {
    margin-top: -0px;
    padding: 0;
    line-height: normal;
  }

  /deep/ .el-collapse-item__arrow {
    display: none;
  }

  .search_list {

    .search_item {
      padding: 0 20px;

      img {
        width: 16px;
        height: 16px;
      }
    }

    &:hover {
      background-color: rgba(232, 232, 232, 0.4);
    }
  }

  @keyframes aside_show {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 0.1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }

  .aside_show {
    animation: aside_show .3s .2s forwards;
  }

  article {
    width: 100%;
    height: 100%;
    background-color: #F7F7F7;

    header {
      padding: 30px 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .item {
        width: 25%;
        height: 160px;
        margin-right: 30px;
        border: 1px #E0E0E0 solid;
        position: relative;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        color: #666;
      }

      .item:last-of-type {
        margin-right: 0;
      }

      .item:before {
        content: '';
        position: absolute;
        width: 90%;
        height: 80%;
        left: 5%;
        top: 10%;
        border: 1px #E0E0E0 dashed;
        border-radius: 5px;
      }

      .item img {
        width: 30px;
        height: 30px;
        margin-bottom: 8px;
      }
    }

    .search_toolbar {
      padding: 0 39px 0 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      h1 {
        font-size: 18px;
        font-weight: bold;
        color: #333333;
      }
    }

    .file_list {
      height: calc(100% - 268px);
      background-color: #fff;

      .file_wrap {
        transition: all .3s;
      }

      p {
        font-size: 15px;
        padding: 6px 40px 10px;
        margin: 0;
        color: #8B8B8B;
        cursor: pointer;

        i {
          display: inline-block;
          font-size: 8px;
          margin-left: 5px;
          transition: all 0.3s;
        }

        .icon_active {
          transform: rotateZ(90deg);
        }
      }

      .file_item {
        padding: 15px 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: pointer;

        .file_info {
          display: flex;
          align-items: center;
          width: 30%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          img {
            width: 24px;
            height: 26px;
            margin-right: 10px;
          }

          .file_name {
            display: flex;
            flex-direction: column;
            min-width: 30%;

            span:first-of-type {
              font-size: 14px;
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
        background-color: rgba(232, 232, 232, 0.4);
      }

      .file_time {
        font-size: 14px;
        color: #3c3c3c;
      }

      .file_size {
        font-size: 14px;
        color: #3c3c3c;
      }

      .file_action {
        width: 60px;
        height: 30px;
        margin-right: 80px;
        background-image: url("../../assets/img/more.png");
        background-repeat: no-repeat;
        background-position: 45% 50%;
        background-size: 30%;
      }
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
