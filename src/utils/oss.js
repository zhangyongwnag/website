/**
 * @author zyw
 * @description 上传文件到oss
 * @date 2021-05-28
 * @param {Object} file: 文件信息
 */
import OSS from 'ali-oss'
import store from '../store'
import {Message} from 'element-ui'

export default class Upload {
  constructor(file) {
    this.file = file
    this.client = {}
  }

  async init() {
    // 获取服务端签名
    await store.dispatch('get_oss_signature')
      .then(res => {
        this.client = new OSS({
          accessKeyId: res.AccessKeyId,
          accessKeySecret: res.AccessKeySecret,
          stsToken: res.SecurityToken,
          region: "oss-accelerate",
          bucket: "speedpdf-hk",
          secure: true,
        })
      })
  }

  // 上传文件
  put() {
    return new Promise(async (resolve, reject) => {
      await this.init()
      this.client.put(this.file.name.split('.')[0], this.file)
        .then(res => {
          resolve(res)
        })
        .catch(err => {
          Message.error(`上传失败：${err}`)
          reject(err)
        })
    })
  }
}
