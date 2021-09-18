<template>
  <div class="_common_scroll_wrap" style="width: 100%;height: calc(100% - 76px);padding-bottom: 20px" ref="container">
    <div id="container">
      <nav class="_common_scroll_wrap">
        <div
            :class="convert_info.file_type == item.file_type ? 'item_active' : ''"
            class="item _flex_center"
            v-for="(item,index) in convert_list"
            @click="handle_click(item,index)">
          <img :src="item.icon_2x" alt="">
          <span>{{item.name}}</span>
        </div>
      </nav>
      <article>
        <h1>{{convert_info.name}}</h1>
        <h5>{{convert_info.description}}</h5>
        <div class="_flex_center">
          <div class="tab tab_active _flex_center" :style="{backgroundColor: convert_info.color}">
            <img :src="convert_info.icon_1x_white" alt="">
            {{convert_info.name}}
          </div>
          <div class="tab _flex_center" :style="{color: matched_convert_info.color}" @click="handle_matched_click">
            <img :src="matched_convert_info.icon_1x_color" alt="">
            {{matched_convert_info.name}}
          </div>
        </div>
        <SpeedUploadFile
            ref="upload"
            mode="form"
            @before="choice_file"
            @success="handle_upload"
            :format="convert_info.format"
        />
        <List />
        <div class="promptPop _flex_item_center" v-if="fileList.length">
          <img src="../../../assets/img/convert/warning.png" alt="" />
          <div>
            <p>1. 转换完成前，请不要关闭此页面，否则转换可能失败！</p>
            <p style="margin-top: -7px">2. 已注册登录用户，文件上传成功后，可以通过用户中心查看转换状态和下载已转换完成的文档。</p>
          </div>
        </div>
        <div class="sub_title">
          <h1>快速直观的PDF转换</h1>
          <h5>一个小而快速的PDF转换以获得更好的效率</h5>
        </div>
        <div class="details">
          <div class="_flex_column_center">
            <img alt="" :src="details_list[0].url" />
            <h2>{{details_list[0].title}}</h2>
            <p>{{details_list[0].description}}</p>
          </div>
          <div class="_flex_column_center">
            <img alt="" :src="details_list[1].url" />
            <h2>{{details_list[1].title}}</h2>
            <p>{{details_list[1].description}}</p>
          </div>
        </div>
        <div class="details">
          <div class="_flex_column_center">
            <img alt="" :src="details_list[2].url" />
            <h2>{{details_list[2].title}}</h2>
            <p>{{details_list[2].description}}</p>
          </div>
          <div class="_flex_column_center">
            <img alt="" :src="details_list[3].url" />
            <h2>{{details_list[3].title}}</h2>
            <p>{{details_list[3].description}}</p>
          </div>
        </div>
      </article>
    </div>

    <!--文件大小超过限制15m弹窗-->
    <FileLimit v-model="show" />
  </div>
</template>

<script>
  import speed_upload_file from "../../common/speed_update_file";
  import speed_button from "../../common/speed_button";
  import list from "./components/list";
  import file_limit from "./components/file_limit";
  import * as common from '../../../utils/common'
  import * as config from '../../../api/config'
  import * as convertUtils from '../../../utils/convert_utils'
  import { mapState, mapGetters } from 'vuex'
  import use from '../../../assets/img/convert/use.png'
  import extent from '../../../assets/img/convert/extent.png'
  import quality from '../../../assets/img/convert/quality.png'
  import safe from '../../../assets/img/convert/safe.png'

  export default {
    data() {
      return {
        choice_data: new Set([]), // 选择的数据
        // 详情数据
        details_list: [
          {
            title: '易于使用',
            description: '拖放文件，等待几秒钟缩小，然后单击一下即可下载。该过程快速简便。',
            url: use
          },
          {
            title: '支持所有平台',
            description: 'speedoffice 压缩器基于浏览器，适用于所有平台。使用Mac，Windows或Linux都没关系。',
            url: extent
          },
          {
            title: '完美品质',
            description: '减小PDF的大小，非常适合将文件上传到Web和通过电子邮件上传。',
            url: quality
          },
          {
            title: '高安全性',
            description: '支持许多设置来保护您的文件，例如密码，授权等。',
            url: safe
          },
        ],
        show: false // 展示文件大小超出提示
      }
    },
    computed: {
      ...mapState({
        user_info: state => state.login.user_info, // 用户信息
        convert_list: state => state.convert.convert_list, // 转换列表
        convert_info: state => state.convert.convert_info, // 选择的转换类型信息
        convert_config: state => state.convert.convert_config, // 转换配置信息
        file_list: state => state.convert.file_list, // 选择的文件列表
        convert_user_info: state => state.convert.convert_user_info, // 用户转换信息
      }),
      ...mapGetters(['fileList']),
      // 本页面对应的转换匹配信息
      matched_convert_info() {
        let container = this.$refs.container
        container ? container.scrollTop = 0 : ''
        return this.convert_list.filter(item => item.file_type == this.convert_info.matched_file_type)[0]
      },
    },
    created() {
      // 获取转换配置信息
      this.$store.dispatch('get_convert_config')
      // 更新选择的文件列表
      this.$store.dispatch('set_file_list', true)
      // 更新剩余转换次数
      this.$store.dispatch('update_convert_time')
    },
    methods: {
      /**
       * @description 点击转换元素
       * @param {Object} item: 当前选中项
       * @param {Number} index: 选中项下标index
       */
      handle_click(item, index) {
        // 更新当前选择的转换信息
        this.$store.dispatch('update_convert_info', item.file_type)
        // 更新选择的文件列表
        this.$store.dispatch('set_file_list', true)
        // 更新剩余转换次数
        this.$store.dispatch('update_convert_time')
      },
      // 点击对应的转换类型
      handle_matched_click() {
        // 更新当前选择的转换信息
        this.$store.dispatch('update_convert_info', this.matched_convert_info.file_type)
        // 更新选择的文件列表
        this.$store.dispatch('set_file_list', true)
        // 更新剩余转换次数
        this.$store.dispatch('update_convert_time')
      },
      /**
       * @description 选择文件回调
       * @param {Array} files: 选择的文件列表
       */
      choice_file(files) {
        let { file_type } = this.convert_info
        // 如果当前列表不存在文件，则添加
        Object.values(files).map(item => {
          if (!this.file_list.has(item.name)){
            // 如果是游客模式、非会员模式，校验文件是否大于15M
            if (this._check_file_size(item)) return
            // 如果是PDF相关，则先去校验密码
            if (file_type === 1 || file_type === 2 || file_type === 3 || file_type === 4 || file_type === 11 || file_type === 12 || file_type === 13 || file_type === 14 || file_type === 16) {
              convertUtils.pdfData(item)
                .then(res => {
                  // 加密
                  if (res.code) {
                    item.status = 10
                  }else if (file_type === 11) {
                    item.status = 11
                  }else {
                    item.pages = res.numPages
                  }
                  // 添加新文件数据
                  this.$store.dispatch('update_file_list', item)
                  // 表格滚动条滚动到最底部
                  // this.$refs.list._scroll_to_bottom()
                })
            }else {
              // 添加新文件数据
              this.$store.dispatch('update_file_list', item)
              // 表格滚动条滚动到最底部
              // this.$refs.list._scroll_to_bottom()
            }
          }
        })
        // 滚动到操作区域
        this._scrollInToHeight()
        // 将Input的类型设置为text
        this.$refs.upload._updateInputType('text')
      },
      // 上传成功
      handle_upload(response) {
        console.log(response)
      },
      /**
       * @description 如果是游客模式，校验文件大小是否超过15M
       * @param {Object} item: 文件
       */
      _check_file_size(item) {
        if (!this.convert_user_info.uflag || !this.convert_user_info.vip_flag) {
          if (item.size > 15728640) {
            this.show = true
            return true
          } else {
            return false
          }
        }
      },
      // 页面滚动到操作区域
      _scrollInToHeight() {
        let el = document.getElementsByClassName('table_wrap')[0]; // Table 包裹器
        let height = el.offsetTop
        height = 514 - 20; // 滚动的最后高度
        let time = height / 10; // 滚动的次数
        let time_int = setInterval(() => {
          this.$refs.container.scrollTop += 10
          if (this.$refs.container.scrollTop >= height) {
            clearInterval(time_int)
          }
        }, 10)
      },
    },
    components: {
      SpeedButton: speed_button,
      SpeedUploadFile: speed_upload_file,
      List: list,
      FileLimit: file_limit
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-table td, .el-table th.is-leaf {
    border: 0 !important;
  }

  /deep/ .el-table__header-wrapper {
    border: 0;
  }

  /deep/ .el-table__body-wrapper {
    border: 0;
  }

  /deep/ .el-table::before {
    display: none;
  }

  /deep/ .el-table tr {
    cursor: pointer !important;
  }


  #container {
    width: 100%;
    padding: 25px 0 0px 26px;
    display: flex;
    animation: fade-bottom .5s 0s forwards;

    nav {
      width: 220px;
      height: calc(100% - 60px);

      .item {
        width: 198px;
        height: 54px;
        border-radius: 27px;
        margin-bottom: 15px;
        cursor: pointer;
      }

      .item_active {
        background: #eee;
      }

      .item:last-of-type {
        margin-bottom: 0;
      }

      img {
        width: 30px;
        margin: 0 12px 0 6px;
      }

      span {
        display: inline-block;
        width: 130px;
        text-align: left;
        color: #737373;
        font-size: 16px;
      }
    }

    article {
      background: #FFFFFF;
      border-radius: 20px;
      width: 952px;
      padding: 24px;

      h1 {
        font-size: 20px;
        font-weight: bold;
        color: #212121;
        text-align: center;
        margin: 16px 0 -10px;
      }

      h5 {
        font-size: 14px;
        font-weight: normal;
        color: #8B8B8B;
        text-align: center;
      }

      .tab {
        width: 50%;
        height: 45px;
        line-height: 45px;
        text-align: center;
        background: #f4f4f4;
        border-radius: 100px;
        cursor: pointer;
        color: #999;
        margin-top: 10px;

        img {
          margin-right: 12px;
          width: 20px;
        }
      }

      .tab:first-of-type {
        border-radius: 100px 0 0 100px;
      }

      .tab:last-of-type {
        border-radius: 0 100px 100px 0;
      }

      .tab_active {
        background: #4293E7;
        color: #ffffff;
      }

      .promptPop {
        height: 90px;
        background: #fbbc04;
        width: 100%;
        position: relative;
        margin-top: 25px;
        border-radius: 8px;
        margin-bottom: 30px;

        img {
          margin: 0 26px 0 30px;
          width: 28px;
        }

        p {
          color: #fff;
          font-size: 14px;
        }
      }

      .sub_title {
        margin: 60px 0 20px 0;
      }

      .details {
        width: 90%;
        margin-left: 5.7%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;

        div {
          width: 300px;
          margin-top: 64px;

          img {
            width: 46px;
            display: block
          }

          h2 {
            font-size: 16px;
            color: #333333;
            font-weight: normal;
            text-shadow: 0.5px 0 0.5px #000;
            height: 40px;
            line-height: 40px;
            margin-top: 18px
          }

          p {
            font-size: 14px;
            color: #333333;
            line-height: 22px;
            margin-top: 2px
          }
        }
      }
    }
  }
</style>
