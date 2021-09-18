<template>
  <div>
    <div class="img_upload_warp" v-if="multiple || (!multiple && !imgList.length)"
         :style="{width,height,minWidth:width,minHeight:height}">
      <input
          :ref="`img_upload_${mode}`"
          :id="`img_upload_${mode}`"
          :multiple="multiple"
          @change="choiceImg($event)"
          :accept="accept"
          type="file"
      >
      <!--上传前-->
      <div class="img_upload_inside before" v-if="schedule == '0'">
        <i class="el-icon-upload" style="font-size: 24px;color: deepskyblue"></i>
        <span style="margin-top: -3px">点击上传</span>
      </div>
      <!--上传中-->
      <div class="img_upload_inside schedule" v-else-if="schedule > '0' && schedule < '100'">
        <div><span :style="{width:schedule + '%'}"></span></div>
      </div>
      <!--上传成功或者失败-->
      <div class="img_upload_inside after" v-else-if="schedule < '0' || schedule == '100'">
        <i class="el-icon-success" style="font-size: 24px;color: limegreen" v-if="schedule == '100'"></i>
        <i class="el-icon-error" style="font-size: 24px;color: red" v-else-if="schedule < '0'"></i>
        <span style="margin-top: -3px;" v-if="schedule == '100'">上传成功</span>
        <span style="margin-top: -3px;color: red" v-else-if="schedule < '0'">上传失败</span>
      </div>
    </div>
    <!--上传的图片列表-->
    <div class="scrollWrap img_view_scroll">
      <div class="img_view_warp" v-if="imgList.length">
        <div class="img_view" v-for="(item,index) in imgList"
             :style="{width,height,minWidth:width,minHeight:height}">
          <img :src="item" alt="item">
          <div class="img_view_layer">
            <i @click="previewImg(item,index)" class="el-icon-view"
               style="font-size: 20px;color: #fff;margin-right: 10px;cursor: zoom-in"></i>
            <i @click="deleteImg(item,index)" class="el-icon-delete"
               style="font-size: 19px;color: #fff"></i>
          </div>
        </div>
      </div>
    </div>
    <!--查看图片大图-->
    <el-dialog title="查看大图" :visible.sync="previewDialogStatus" :destroy-on-close='true' model lock-scroll
               :close-on-click-modal="false" :close-on-press-escape="false" :show-close="true" left top="20vh">
      <div class="common_dialog_content">
        <div class="preview">
          <img :src="previewDialogImg" alt="img">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  /**
   * @description 图片批量上传、预览插件
   * <!--已废弃-->@param {String} type：上传图片模式，支持 单图像模式/普通模式，可选值：single/normal
   * @props {Array} imgList：默认展示的图片，当multiple为true时，全部展示，否则只展示第一张
   * @props {String} mode：上传图片方式，支持 base64 和 formData，可选值：base64/form
   * @props {Boolean} multiple：是否单选/多选，默认多选
   * @props {Boolean} maxLength：最多可同时上传多少张图片，默认 5，如果超过最大数量，则取最大数量的图片数
   * @props {Number} size：图片最大大小，默认 3M，单位字节
   * @props {Boolean} compress：是否压缩图片，默认压缩
   * @props {String} format：支持的图片格式，默认全部图片，多种格式以逗号隔开，example：jpeg,gif,png,ico
   * @props {String} width：上传/预览图片的容器宽度
   * @props {String} height：上传/预览图片的容器高度
   * @callback {
   *     callback(beforeUpload)：上传前回调，选择完毕图片，return {选择的结果event}
   *     callback(update)：更新上传结果，返回上传成功的列表，return {当前已上传的图片}
   *     callback(finish)：上传完成时的回调，return {当次上传成功的图片，当前已上传的图片}
   *     callback(error)：上传失败时的回调，return {当次上传失败的错误信息}
   * }
   */

  // TODO 1.上传进度条，根据原生请求过程实现实时进度，目前模拟进度
  // TODO 2.实现图片可裁剪，目前直接选择
  // TODO 3.多选上传并发利用队列控制，目前根据配置同时可上传数量，进而截取

  import lrz from 'lrz'
  import * as config from '../../api/config'

  export default {
    model: {
      prop: 'imgList',
      event: 'update'
    },
    props: {
      // type: {
      //     type: String,
      //     default: 'normal'
      // },
      imgList: {
        type: Array,
        default: () => []
      },
      mode: {
        type: String,
        required: true,
      },
      multiple: {
        type: Boolean,
        default: true,
      },
      maxLength: {
        type: Number,
        default: 5
      },
      size: {
        type: Number,
        default: 3145728,
      },
      compress: {
        type: Boolean,
        default: true
      },
      format: {
        type: String,
        default: '*'
      },
      width: {
        type: String,
        default: '80px'
      },
      height: {
        type: String,
        default: '80px'
      }
    },
    data() {
      return {
        schedule: 0, // 上传进度
        previewDialogStatus: false, // 预览状态
        previewDialogImg: '', // 要预览的图片
      }
    },
    computed: {
      // 过滤格式
      accept() {
        if (this.format) {
          let str = ''
          let arr = this.format.split(',')
          arr.map(item => str += 'image/' + item + ',')
          return str.substring(0, str.length - 1)
        }
      }
    },
    methods: {
      /**
       * @description 选择图片
       * @param {Object} event：选择图片后的回调函数
       */
      choiceImg(event) {
        // 上传前
        this.$emit('beforeUpload', event)
        // 开始处理
        this._uploadBefore(event)
      },
      /**
       * @description 上传前校验图片数量
       * @param {Object} event：选择图片后的回调函数
       */
      _uploadBefore(event) {
        let imgList = Object.values(event.target.files);
        if (imgList.length > this.maxLength) {
          this._notifies('上传提示', `最多同时上传 ${this.maxLength} 张图片，已自动选择前 ${this.maxLength} 张`, `warning`, 0);
          this._checkout_format(imgList.slice(0, this.maxLength))
        } else if (imgList.length) {
          this._checkout_format(imgList)
        } else {
          this.$message.warning(this.multiple ? `请至少上传一张图片` : '请选择上传图片')
        }
      },
      /**
       * @description 批量校验图片格式、大小
       * @param {Array} files：选择的图片结果
       */
      _checkout_format(files) {
        let format = this.format.replace(/,/g, '|')
        // let regExp = new RegExp(format + '/g')
        let regExp = new RegExp(format)
        // let regExp = /\gif|jpe?g|png|GIP|JPE?G|PNG$/;
        // 开始校验
        try {
          files.map(file => {
            if (!regExp.test(file.type)) {
              // 校验格式
              throw new Error('handle format error + 请上传 ' + format + ' 格式图片')
            } else if (file.size > this.size) {
              // 校验大小
              throw new Error(`handle size error + 选择的图片大小不得超过 ${Math.ceil(this.size / 1024)} kb`)
            }
          });
          // 如果校验成功，则开启进度
          this._upload_schedule();
          // 如果校验成功，则批量压缩
          this._compress_images(files)
        } catch (e) {
          // 如果校验失败，提示用户
          this._notifies(e.message.split('+')[0], e.message.split('+')[1], 'warning', 100)
          // 返回失败结果
          this.$emit('error', e)
        }
      },
      /**
       * @description 批量压缩图片
       * @param {Array} files：图片列表
       */
      _compress_images(files) {
        let promise = [];
        let base64List = []; // base64位形式
        let formDataList = []; // formData形式
        // 批量添加压缩队列
        files.map(file => promise.push(lrz(file, {quality: this.compress ? 0.7 : 1})));
        // 批量并发压缩
        Promise.all(promise).then(result => {
          result.map(item => {
            base64List.push(item.base64);
            formDataList.push(item.formData)
          });

          // 根据不同的上传条件上传图片
          if (this.mode == 'base64') {
            this._upload_by_base64(base64List)
          } else if (this.mode == 'form') {
            this._upload_by_formData(formDataList, base64List)
          }
        })
      },
      /**
       * @description 通过base64位上传
       * @param {Array} list：压缩后的base64图片列表
       */
      _upload_by_base64(list) {
        // let promise = [];
        // list.map(item => promise.push(this.httpCli.post(config.URL_UPLOAD, {file: item})));
        // Promise.all(promise)
        //     .then(res => {
        //         // 上传成功
        //         this._upload_success(res, list)
        //     })
        //     .catch(err => {
        //         // 上传失败
        //         this._upload_error(err)
        //     })

        setTimeout(() => {
          // 上传成功
          this._upload_success([], list)
        }, 500)
      },
      /**
       * @description 通过formData上传
       * @param {Array} list：压缩后的formData表单列表
       * @param {Array} base64List：base64位图片列表
       */
      _upload_by_formData(list, base64List) {
        // let promise = [];
        // list.map(item => promise.push(this.httpCli.post(config.URL_UPLOAD, item, true)));
        // Promise.all(promise)
        //     .then(res => {
        //         // 上传成功
        //         this._upload_success(res, base64List)
        //     })
        //     .catch(err => {
        //         // 上传失败
        //         this._upload_error(err)
        //     })

        setTimeout(() => {
          // 上传成功
          this._upload_success([], list)
        }, 500)
      },
      /**
       * @description 上传成功回调
       * @param {Array} result：上传成功结果
       * @param {Array} originList：选择的源base64位图片
       */
      _upload_success(result, originList) {
        let timeOver = setInterval(() => {
          this.schedule++;
          if (this.schedule == 100) {
            clearInterval(timeOver);
            this.$message.success(`图片上传成功`);
            this._updateInputType('file')
            // 更新上传结果
            let cloneImgList = [...this.imgList]
            cloneImgList.push(...originList)
            this.updateResult(cloneImgList)
              .then(res => {
                // 返回当次上传结果
                this.$emit('finish', originList, res)
              })
          }
        }, 20)
      },
      /**
       * @description 上传失败回调
       * @param {Object | Array} errors：上传失败结果原因
       */
      _upload_error(errors) {
        this.schedule = -1
        this.$emit('error', errors)
        this._updateInputType('file')
      },
      /**
       * @description 上传进度控制
       */
      _upload_schedule() {
        this.schedule = 1
        this._updateInputType('text')
      },
      /**
       * @description 消息提示
       * @param {String} title：提示标题
       * @param {String} message：提示消息体
       * @param {String} type：提示类型
       * @param {String} time：延迟提示时间
       */
      _notifies(title, message, type, time) {
        setTimeout(() => {
          this.$notify({
            title,
            message,
            type,
            showClose: true
          })
        }, time)
      },
      /**
       * @description 更新input的类型
       * @param {String} type：更新的类型
       */
      _updateInputType(type) {
        this.$refs[`img_upload_${this.mode}`]['type'] = type
      },
      /**
       * @description 预览图片
       * @param {String} item：图片地址
       * @param {Number} index：图片index
       */
      previewImg(item, index) {
        this.previewDialogStatus = true;
        this.previewDialogImg = item
      },
      /**
       * @description 删除图片
       * @param {String} item：图片地址
       * @param {Number} index：图片index
       */
      deleteImg(item, index) {
        let cloneImgList = [...this.imgList]
        cloneImgList.splice(index, 1);
        cloneImgList.length == 0 ? this.schedule = 0 : ''
        this.updateResult(cloneImgList)
      },
      /**
       * @description 更新当前已选择图片
       * @param {Array} files：要更新的结果
       */
      updateResult(files) {
        return new Promise((resolve, reject) => {
          this.$emit('update', files)
          resolve(files)
        })
      }
    }
  }
</script>

<style scoped>
  .img_upload_warp {
    border-radius: 3px;
    border: 1px #c8c8c8 dashed;
    transition: all .3s;
    position: relative;
    /*box-shadow: 0px 0px 3px 0px #999999;*/
  }

  .img_upload_warp:hover {
    border: 1px deepskyblue dashed;
  }

  .img_upload_warp input {
    width: 100%;
    height: 100%;
    opacity: 0;
    z-index: 2;
    cursor: pointer;
    position: relative;
  }

  .img_upload_inside {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .before {
    font-size: 12px;
    color: deepskyblue;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 1;
  }

  .schedule {
    display: flex;
    align-items: center;
    z-index: 3;
    background-color: rgba(153, 153, 153, 0.2);
    cursor: wait;
  }

  .schedule div {
    width: 100%;
    height: 10px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px 0 #eee;
    display: flex;
    align-items: center;
  }

  .schedule div span {
    display: inline-block;
    height: 100%;
    max-width: 100%;
    border-radius: 10px;
    background-color: #409eff;
    position: relative;
  }

  .schedule span:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    height: 100%;
    border-radius: 10px;
    background-color: #fff;
    animation: progress-upload-img 1.2s 0s ease-in-out infinite;
  }

  @keyframes progress-upload-img {
    from {
      opacity: 0.3;
      width: 0;
    }
    to {
      opacity: 0;
      width: 100%;
    }
  }

  /*.schedule span::after {*/
  /*    content: '';*/
  /*    position: absolute;*/
  /*    left: 0;*/
  /*    top: 0;*/
  /*    width: 100%;*/
  /*    max-width: 100%;*/
  /*    height: 100%;*/
  /*    border-radius: 10px;*/
  /*    background-color: limegreen;*/
  /*}*/

  .after {
    font-size: 12px;
    color: limegreen;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .img_view_scroll {
    width: 400px;
    min-width: 400px;
    max-width: 70%;
    /*box-shadow: 0 0 5px 0 #eeeeee;*/
    margin-top: 10px;
    overflow-y: hidden;
    overflow-x: auto;
    padding: 2px;
  }

  .img_view_warp {
    width: 100%;
    display: flex;
    align-items: center;
  }

  .img_view {
    margin-right: 10px;
    box-shadow: 0 0 5px 0 #eeeeee;
    padding: 5px;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .img_view_layer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all .3s;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
  }

  .img_view:hover .img_view_layer {
    opacity: 1;
  }

  .img_view:last-of-type {
    margin-right: 0;
  }

  .img_view img {
    max-width: 100%;
  }

  .preview {
    padding: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .preview img {
    max-width: 85%;
  }
</style>
