<template>
  <div>
    <div class="img_upload_warp">
      <input
          ref="img_upload"
          @change="choiceImg($event)"
          accept="image/*"
          type="file"
          title=""
      >
      <!--上传成功-->
      <div class="img_upload_inside _flex_center">
        <img :src="url" alt="">
      </div>
    </div>

    <!--图片裁剪-->
    <el-dialog title="修改头像" :visible.sync="show" :before-close="before_close" :close-on-click-modal="true" :close-on-press-escape="true" :append-to-body="true">
      <div class="_flex_item_center">
        <div class="cropper">
          <VueCropper
              ref="cropper"
              :img="img"
              outputType="png"
              :autoCrop="true"
              :autoCropWidth="120"
              :autoCropHeight="120"
              :fixedBox="true"
              @realTime="realTime"
          />
        </div>
        <div class="preview _flex_column_center">
          <div :style="preview_info.div" class="preview_avatar">
            <img :src="preview_info.url" :style="preview_info.img" alt="">
          </div>
          <SpeedButton class="_flex_center" @confirm="$refs.img_upload.click()" radius="4px" text="更换头像" />
          <div class="_flex_between_center">
            <el-button icon="el-icon-plus" circle size="medium" @click="changeScale(1)"></el-button>
            <el-button icon="el-icon-minus" circle size="medium" @click="changeScale(-1)"></el-button>
            <el-button icon="el-icon-download" circle size="medium" @click="down('blob')"></el-button>
            <el-button icon="el-icon-refresh-left" circle size="medium" @click="rotateLeft"></el-button>
            <el-button icon="el-icon-refresh-right" circle size="medium" @click="rotateRight"></el-button>
          </div>
        </div>
      </div>
      <div class="dialog-footer _flex_center">
        <div class="_flex_center" @click="show = false">取消</div>
        <div class="_flex_center" @click="saveEditAvatar">确认</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import lrz from 'lrz'
  import * as config from '../../api/config'
  import { VueCropper }  from 'vue-cropper'
  import speed_button from "./speed_button";

  export default {
    model: {
      prop: 'url',
      event: 'update'
    },
    props: {
      // type: {
      //     type: String,
      //     default: 'normal'
      // },
      url: {
        type: String,
        default: ''
      },
      size: {
        type: Number,
        default: 3145728,
      },
    },
    data() {
      return {
        show: false,
        img: 'data:image/jpeg;base64,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', // base64位图片
        preview_info: '',
      }
    },
    methods: {
      /**
       * @description 选择图片
       * @param {Object} event：选择图片后的回调函数
       */
      choiceImg(event) {
        let img = event.target.files[0]
        this._checkout_format(img)
        this._updateInputType('text')
      },
      /**
       * @description 批量校验图片格式、大小
       * @param {Array} img：选择的图片结果
       */
      _checkout_format(img) {
        try {
          if (img.size > this.size) {
            // 校验大小
            throw new Error(`handle size error + 选择的图片大小不得超过 ${Math.ceil(this.size / 1024)} kb`)
          }
          // 如果校验成功，则压缩
          this._compress_images(img)
        } catch (e) {
          // 如果校验失败，提示用户
          this._notifies(e.message.split('+')[0], e.message.split('+')[1], 'warning', 100)
          // 返回失败结果
          this.$emit('error', e)
          this._updateInputType('file')
        }
      },
      /**
       * @description 批量压缩图片
       * @param {Array} img：图片
       */
      _compress_images(img) {
        lrz(img, {quality: this.compress ? 0.7 : 1})
          .then(res => {
            // this.$emit('change', res.file)
            this.img = res.base64
            this.show = true
            this._updateInputType('file')
          })
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
        this.$refs[`img_upload`]['type'] = type
      },
      /**
       * @description 实时预览函数
       */
      realTime(data) {
        this.preview_info = data
      },
      /**
       * @description 裁剪弹窗
       */
      before_close() {
        this.show = false
      },
      /**
       * @description 保存头像修改
       */
      saveEditAvatar() {
        this.show = false
        this.$refs.cropper.getCropData( data => {
          this.$emit('change', this.dataURLtoFile(data, parseInt(Math.random() * 1000000)))
          //访问接口保存到数据库写这儿!
        })
      },
      /**
       * @description base64转换为文件
       */
      dataURLtoFile(dataurl, filename) {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--){
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
      },
      /**
       * @description 放大/缩小
       */
      changeScale(num) {
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      /**
       * @description 左旋转
       */
      rotateLeft() {
        this.$refs.cropper.rotateLeft();
      },
      /**
       * @description 右旋转
       */
      rotateRight() {
        this.$refs.cropper.rotateRight();
      },
      /**
       * @description 下载图片
       */
      down(type) {
        let oA = document.createElement('a')
        oA.download = 'speedoffice'
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob( data => {
            oA.href = window.URL.createObjectURL(data)
            oA.click()
          })
        } else {
          this.$refs.cropper.getCropData( data => {
            oA.href = data;
            oA.click()
          })
        }
      },
      /**
       * @description 保存上传图片
       */
      finish(type) {
        if (type === 'blob') {
          this.$refs.cropper.getCropBlob((data) => {
            this.avatarURL = window.URL.createObjectURL(data)
            //访问接口保存到数据库写这儿!
          })
        } else {
          this.$refs.cropper.getCropData((data) => {
            //访问接口保存到数据库写这儿!
          })
        }
      },
    },
    components: {
      VueCropper,
      SpeedButton: speed_button
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .el-dialog {
    width: 920px !important;
  }

  /deep/ .el-dialog__body{
    padding: 60px 100px 55px
  }

  /deep/ .el-dialog__title {
    font-size: 24px;
    font-weight: bold;
  }

  .cropper {
    width: 320px;
    height: 320px;
    margin-right: 60px;
  }

  .preview {
    width: 320px;
    height: 320px;

    .preview_avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background-color: #ccc;
      overflow: hidden;
      border: 1px #eee solid;
    }

    .speed_button {
      height: 36px;
      margin: 30px 0;
    }
  }

  .dialog-footer {
    margin-top: 60px;

    ._flex_center {
      width: 200px;
      background-color: #195AF6;
      height: 40px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      border-radius: 5px;
      cursor: pointer;

      &:first-of-type {
        background-color: transparent;
        color: #999;
        border: 1px #eee solid;
        margin-right: 40px;
      }
    }
  }
  .img_upload_warp {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px #eee solid;

    input {
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 2;
      cursor: pointer;
      position: relative;

      &::-webkit-file-upload-button {
        display: none;
      }
    }

    .img_upload_inside {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      img {
        width: 108%;
      }
    }
  }
</style>
