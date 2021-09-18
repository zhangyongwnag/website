<template>
  <el-dialog :visible.sync="show" :before-close="before_close" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
    <div class="split_config _flex_between_center">
      <div class="split_config_item" :class="{ 'split_config_item_active': type === item.type }" @click="handle_click(item, index)" v-for="(item, index) in split_config_list">
        <img :src="type == item.type ? item.img_active : item.img" alt="">
        <p>{{item.title}}</p>
      </div>
    </div>
    <div class="common_input" v-if="type != '3'">
      <input v-model.trim="value" :type="type == '5' ? 'number' : 'text'" maxLength="32" :placeholder="type == '5' ? '例如：5 ( PDF文档将会按照每隔5页的范围保存为一份文档 )' : '例如：1-3'" @input="handle_change">
    </div>
    <footer class="_flex_center">
      <SpeedButton
          radius="8px"
          @confirm="submit"
          :disabled="!value"
      >
        <div class="_flex_center">
          拆分PDF
          <img src="../../../../assets/img/convert/upluck.png" alt="">
        </div>
      </SpeedButton>
    </footer>
  </el-dialog>
</template>

<script>
  import speed_button from "@/components/common/speed_button";
  import * as common from '../../../../utils/common'
  import * as convertUtils from '../../../../utils/convert_utils'
  import { mapState, mapGetters } from 'vuex'
  import pdf_split_left from '../../../../assets/img/convert/split/pdf_split_left.png'
  import pdf_split_left_select from '../../../../assets/img/convert/split/pdf_split_left_select.png'
  import pdf_split_middle from '../../../../assets/img/convert/split/pdf_split_middle.png'
  import pdf_split_middle_select from '../../../../assets/img/convert/split/pdf_split_middle_select.png'
  import pdf_split_right from '../../../../assets/img/convert/split/pdf_split_right.png'
  import pdf_split_right_select from '../../../../assets/img/convert/split/pdf_split_right_select.png'

  export default {
    model: {
      prop: 'show',
      event: 'cancel'
    },
    props: {
      // 显示窗口
      show: {
        type: Boolean,
        default: false
      },
      // 文件信息
      file: {}
    },
    data() {
      return {
        // 分割配置
        split_config_list: [
          {
            type: "5",
            title: '按固定的范围分割PDF',
            img: pdf_split_left,
            img_active: pdf_split_left_select
          },
          {
            type: "1",
            title: '选择要提取的页面',
            img: pdf_split_middle,
            img_active: pdf_split_middle_select
          },
          {
            type: "3",
            title: '将每页提取为PDF格式',
            img: pdf_split_right,
            img_active: pdf_split_right_select
          },
        ],
        type: '5', // 选中的分割方案 type
        value: '', // 分割的 value
      }
    },
    computed: {
      ...mapGetters(['fileList']),
    },
    methods: {
      /**
       * @description 关闭前的回调
       * @param {Function} done: 回调
       */
      before_close(done) {
        // this.$confirm('确认关闭？')
        //   .then(() => {
        this.$emit('cancel')
        // })
        // .catch(() => {
        // });
      },
      // 输入框值吃触发后
      handle_change() {
        this.value = this.value.replace(/[^\d\-]/g, "")
      },
      /**
       * @description 点击分割每一项
       * @param {Object} item: 当前选中项
       * @param {Number} index: 选中项下标index
       */
      handle_click(item, index) {
        this.type = item.type
        this.value = item.type == '3' ? '0' : ''
      },
      // 提交密码
      submit() {
        let item = this.fileList.filter(row => row.name == this.file.name)[0]
        if (this.type === '5' && this.value > item.pages) {
          this.$message.error(`分割范围不可超过PDF最大页数`)
          return
        }
        if (this.type === '1') {
          let value_ = this.value.split('-')
          if (value_[0] >= value_[1]) {
            this.$message.error(`提取页面起始页码不可大于等于截止页码`)
            return;
          }
          if (value_[1] > item.pages) {
            this.$message.error(`提取页面截止页码不可大于PDF最大页码`)
            return;
          }
        }
        item.data = JSON.stringify({ split_type: this.type, split_value: this.value })
        item.status = 2
        // 验证成功
        this._success(item)
      },
      /**
       * @description 验证成功
       * @param {Object} item: 点击的任务信息
       */
      _success(item) {
        this.$store.dispatch('set_file_list')
        this.$emit('confirm', item)
        this._reset()
      },
      // 重置
      _reset() {
        this.value = ''
      }
    },
    components: {
      SpeedButton: speed_button
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-dialog {
    width: 640px !important;
  }

  /deep/ .el-dialog__body{
    padding: 30px 45px;
  }

  .split_config {

    .split_config_item {
      width: 175px;
      position: relative;
      cursor: pointer;

      img {
        width: 100%;
      }

      p {
        color: #C1C1C1;
        position: absolute;
        top: 95px;
        left: 0;
        width: 200px;
        text-align: left;
        padding: 0 10px 0 25px;
        box-sizing: border-box;
        line-height: 18px;
      }
    }

    .split_config_item_active {
      p {
        color: #065ED4;
      }
    }
  }

  .common_input {
    border-radius: 7px;
    margin-top: 40px;

    .el-icon-message {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: #CBCBCB;
    }

    input {
      text-align: center;
    }

    .el-icon-success,
    .el-icon-error {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 20px;
      color: #CBCBCB;
    }

    .el-icon-success {
      color: limegreen;
    }

    .el-icon-error {
      color: orangered;
    }
  }

  footer {
    width: 100%;
    margin-top: 30px;

    .speed_button {
      font-size: 16px !important;
      width: 50%;
      margin-bottom: 2px;

      img {
        width: 16px;
        margin-left: 5px;
      }
    }
  }
</style>
