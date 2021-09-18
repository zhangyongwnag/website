<template>
  <div class="wrap"  @dragenter="dragleave($event)">
    <input
        ref="upload"
        :multiple="multiple"
        @change="choiceFile($event)"
        :accept="format"
        type="file"
        title=""
        @drop="onDrop($event)"
        @dragleave="dragleave($event)"
        @dragover="dragleave($event)"
    >
    <div class="_flex_column_center content">
      <img src="../../assets/img/convert/upload.png" alt="">
      <span>点击添加文件 或 拖拽到此处区域</span>
    </div>
  </div>
<!--  <div class="updata-body" >-->
<!--    <div>-->
<!--      <div class="drag-box">123123</div>-->
<!--    </div>-->
<!--    <ul>-->
<!--      <li v-for="(item, index) in fileData" :key="index">{{item.name}}</li>-->
<!--    </ul>-->
<!--  </div>-->
</template>

<script>

  /**
   * @description 图片批量上传、预览插件
   * @props {Boolean} multiple：是否单选/多选，默认多选
   * @props {String} format：支持的图片格式，默认全部图片，多种格式以逗号隔开，example：jpeg,gif,png,ico
   * @callback {
   *     callback(success)：上传完成时的回调，return {当次上传成功的图片，当前已上传的图片}
   * }
   */

  import OSS from '../../utils/oss'
  import { mapState, mapGetters } from 'vuex'

  export default {
    props: {
      multiple: {
        type: Boolean,
        default: true,
      },
      format: {
        type: String,
        default: ''
      },
    },
    computed: {
      ...mapState({
        convert_info: state => state.convert.convert_info // 选择的转换类型信息
      })
   },
    methods: {
      /**
       * @description 拖拽结束
       * @param {Object} event: event对象
       */
      onDrop: function(event) {
        event.stopPropagation();
        event.preventDefault();
        let files = [] // 过滤后的文件列表
        Object.values(event.dataTransfer.files).map(item => {
          // 过滤文件类型
          let file_format = item.name.split(".").splice(-1).join('').toLowerCase()
          // 根据转换类型的文件格式过滤拖拽的文件
          if (this.convert_info.format.indexOf(file_format) !== -1) {
            files.push(item)
          }
        })
        if (files.length) {
          this.$emit('before', files)
          this._updateInputType('file')
        }
      },
      /**
       * @description 拖拽中途时间
       * @param {Object} event: event对象
       */
      dragleave(event) {
        event.stopPropagation();
        event.preventDefault();
      },
      /**
       * @description 选择文件
       * @param {Object} event: event对象
       */
      choiceFile(event) {
        /**
         * @description 拖拽中
         * @param {Object} event: event对象
         */
        // 创建oss对象
        // let oss = new OSS(event.target.files[0])
        // 重置input类型
        // this._updateInputType('text')
        // this.$nextTick(() => {
        //   oss.put()
        //     .then(res => {
        //       this.$emit('success', res)
        //       this._updateInputType('file')
        //     })
        //     .catch(_ => {
        //       this._updateInputType('file')
        //     })
        // })
        if (!event.target.files.length) return
        this.$emit('before', event.target.files)
        this._updateInputType('file')
      },
      /**
       * @description 更新input的类型
       * @param {String} type：更新的类型
       */
      _updateInputType(type) {
        this.$refs.upload.type = type
      },
    }
  }
</script>

<style lang="less" scoped>
  .wrap {
    width: 100%;
    height: 247px;
    background: #F7F7F7;
    border-radius: 8px;
    border: 1px rgba(151, 151, 151, 0.3) solid;
    margin-top: 36px;
    position: relative;

    input {
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
      z-index: 2;
      position: relative;
    }

    .content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;

      span {
        font-size: 16px;
        color: #999;
        margin-top: 25px;
      }
    }
  }
</style>

