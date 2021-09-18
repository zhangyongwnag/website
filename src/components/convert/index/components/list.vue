<template>
  <div class="table_wrap" :style="fileList.length ? {} : {minHeight: 0, border: 0, margin: 0}">
<!--  @row-click="handle_click_data"
  @select="handle_select"
  @select-all="handle_click_all"-->
    <el-table
        v-if="fileList.length"
        :data="fileList"
        ref="multipleTable"
        @row-click=""
        @select=""
        @select-all=""
        style="width: 99%;">
<!--      <el-table-column type="selection" width="60"></el-table-column>-->
      <el-table-column label="名称" width="180" show-overflow-tooltip>
        <template slot-scope="scope">
          <div style="text-align: left;padding-left: 5px" class="_flex_item_center">
            <img v-if="convert_info.file_type === 7" src="../../../../assets/img/convert/type/word.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else-if="convert_info.file_type === 9" src="../../../../assets/img/convert/type/ppt.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else-if="convert_info.file_type === 8" src="../../../../assets/img/convert/type/excel.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else-if="convert_info.file_type === 32 || convert_info.file_type === 35" src="../../../../assets/img/convert/type/cad.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else-if="convert_info.file_type === 24 || convert_info.file_type === 10" src="../../../../assets/img/convert/type/caj.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else-if="convert_info.file_type === 5 || convert_info.file_type === 15 || convert_info.file_type === 19" src="../../../../assets/img/convert/type/jpg.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else-if="convert_info.file_type === 30 || convert_info.file_type === 33" src="../../../../assets/img/convert/type/ofd.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else-if="convert_info.file_type === 31 || convert_info.file_type === 34" src="../../../../assets/img/convert/type/xps.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else-if="convert_info.file_type === 18 || convert_info.file_type === 20 || convert_info.file_type === 21" src="../../../../assets/img/convert/type/webp.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else-if="convert_info.file_type === 17" src="../../../../assets/img/convert/type/jpg.png" alt="" style="width: 24px; margin-right: 10px">
            <img v-else src="../../../../assets/img/convert/type/pdf.png" alt="" style="width: 24px; margin-right: 10px">
            <span class="_ellipsis">{{scope.row.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="size_filter" label="大小"></el-table-column>
      <el-table-column label="消耗转换">
        <template slot-scope="scope">{{scope.row.time}} 次转换</template>
      </el-table-column>
      <el-table-column label="转换进度" width="200">
        <template slot-scope="scope">
          <el-progress :format="format" :percentage="scope.row.percent" :class="{'finish': scope.row.percent === 100}"></el-progress>
        </template>
      </el-table-column>
      <el-table-column>
        <template slot="header" slot-scope="scope">
          下载
<!--          <SpeedButton :disabled="!choice_data.size" @confirm="download_multiple" text="批量下载" radius="4px" :size="13" class="speed_button" />-->
        </template>
        <template slot-scope="scope">
          <div class="_flex_center">
            <!--未开始转换-->
            <SpeedButton v-if="scope.row.status == 1" @confirm="convert_file(scope.row, scope.$index)" :text="!convert_user_info.uflag ? '立即转换' : '转换'" radius="4px" :size="13" class="speed_button" />
            <!--转换进行中-->
            <SpeedButton v-else-if="scope.row.status == 2" type="cancel" disabled text="转换中" radius="4px" :size="13" class="speed_button" />
            <!--转换成功-->
            <div v-else-if="scope.row.status == 6" class="_flex_center" style="width: 100%; height: 28px;" @click.stop="download(scope.row, scope.$index)">
              <img src='../../../../assets/img/order/download.svg' alt="">
            </div>
            <!--转换失败-->
            <SpeedButton v-else-if="scope.row.status == 4" disabled :text="scope.row.failed" radius="4px" :size="13" class="speed_button" />
            <!--转换中短，重新创建转换任务-->
            <SpeedButton v-else-if="scope.row.status == 8" @confirm="save_file_info(scope.row, scope.$index)" :text="scope.row.failed" radius="4px" :size="13" class="speed_button" />
            <!--转换中短，输入密码-->
            <SpeedButton v-else-if="scope.row.status == 10" @confirm="handle_password_before(scope.row, scope.$index)" text="输入密码" radius="4px" :size="13" class="speed_button" style="background-color: #DE1535" />
            <!--合并前，文件准备就绪-->
            <!--          <SpeedButton v-else-if="scope.row.status == 11" @confirm="$message.success(`文件准备就绪，请点击下方合并按钮`)" text="准备就绪" radius="4px" :size="13" class="speed_button"  style="background-color: rgb(70, 209, 106)" />-->
            <!--次数不足，去升级VIP-->
            <SpeedButton v-else-if="scope.row.status == 12" @confirm="turn_to_vip_page" text="升级至VIP" radius="4px" :size="13" class="speed_button upgrade_vip" />
            <!--游客需要登录-->
            <SpeedButton v-else-if="scope.row.status == 13" @confirm="$store.dispatch('update_login_model_status', true)" text="登录转换" radius="4px" :size="13" class="speed_button" style="background-color: #18BF74" />
          </div>
        </template>
      </el-table-column>
      <template slot='empty'>
        <div class="_common_empty" style="min-height: 400px">
          <img src="../../../../assets/img/empty.png" alt="">
          <span>目前没有任何记录</span>
        </div>
      </template>
    </el-table>

    <!--合并按钮-->
    <SpeedButton v-if="show_merge_button" @confirm="merge_pdf_config" class="merge_button _flex_center" radius="5px" text="点击合并" style="background-color: rgb(70, 209, 106)" />

    <!--输入密码弹窗-->
    <Password v-model="show" :file="file" @confirm="handle_model_after" />
    <!--分割PDF配置弹窗-->
    <SplitPdf v-model="split_pdf_model" :file="file" @confirm="handle_model_after" />
    <!--保护PDF配置弹窗-->
    <ProtectPdf v-model="protect_pdf_model" :file="file" @confirm="handle_model_after" />
  </div>
</template>

<script>
  import speed_button from "../../../common/speed_button";
  import * as common from '../../../../utils/common'
  import * as config from '../../../../api/config'
  import * as convertUtils from '../../../../utils/convert_utils'
  import { mapState, mapGetters, mapActions } from 'vuex'
  import OSS from '../../../../utils/oss'
  import password from "./password";
  import split_pdf from "./split_pdf";
  import protect_pdf from "./protect_pdf";

  export default {
    data() {
      return {
        choice_data: new Set([]), // 选择的数据
        task_list: new Set([]), // 检测任务状态队列，先进后出
        time_int: '', // 定时器
        show: false, // 密码输入弹窗
        file: {}, // 当前要处理密码的文件信息
        split_pdf_model: false, // 分割PDF弹窗
        protect_pdf_model: false, // 保护PDF弹窗
      }
    },
    watch: {
      // 当转换类型改变时，清除检测定时器
      'convert_info.file_type': {
        handler() {
          clearInterval(this.time_int)
          this.task_list = new Set([])
        }
      }
    },
    computed: {
      ...mapState({
        convert_list: state => state.convert.convert_list, // 转换列表
        convert_info: state => state.convert.convert_info, // 选择的转换类型信息
        convert_config: state => state.convert.convert_config, // 转换配置信息
        file_list: state => state.convert.file_list, // 选择的文件列表
        convert_user_info: state => state.convert.convert_user_info, // 用户转换信息
      }),
      ...mapGetters(['fileList']),
      // 当file_type为11时，合并按钮是否显示
      show_merge_button() {
        // 过滤要合并的数据
        let list = this.fileList.filter(item => item.status === 11)
        return this.convert_info.file_type === 11 && list.length > 1
      },
      // 当file_type为11时，合并按钮是否禁用
      disabled_merge_button() {
        // 过滤要合并的数据
        return this.fileList.filter(item => item.status === 10).length !== 0
      }
    },
    beforeDestroy() {
      clearInterval(this.time_int)
    },
    methods: {
      ...mapActions(['turn_to_vip']),
      /**
       * @description 执行转换方法
       * @param {Object} item: 当前选中项
       * @param {Number} index: 选中项下标index
       */
      convert_file(item, index) {
        // 如果是PDF分割，并且分割参数不存在，那么配置PDF分割信息
        if (this.convert_info.file_type === 12 && !item.data) {
          // 配置分割PDF信息
          this.split_pdf_config(item)
          return
        }
        // 如果是PDF保护，并且密码不存在，那么配置PDF保护信息
        if (this.convert_info.file_type === 13 && !item.target_password) {
          // 配置保护PDF信息
          this.protect_pdf_config(item)
          return
        }
        // 设置转换任务为转换中
        this.set_task_convert_ing(item)
        // 获取文件hash值
        convertUtils.getHASH(item)
          .then(hash => {
            // 设置转换进度
            this.set_task_convert_percent(item, 30)
            let data = {
              filetype: this.convert_info.file_type + 1000,
              filename: item.name,
              filehash: hash,
              filesize: (item.size / 1024).toFixed(2),
              system: convertUtils.getOsInfo(),
              data: this.convert_info.file_type !== 11 ? item.data || [] : ''
            }
            this.http.post(config.SUBMIT_CONVERT_DEDUCT, data)
              .then(res => {
                item.taskId = res.taskid
                item.hash = hash
                // 更新剩余转换次数
                this.$store.dispatch('update_convert_time', res.count)
                // 如果结果中存在url，即为秒转，否则走流程
                if (res.data.url) {
                  // 转换完成设置任务状态
                  this.set_task_convert_finish(item, res.data.url)
                }else {
                  // 上传oss
                  // 创建oss对象
                  let oss = new OSS(item)
                  this.$nextTick(() => {
                    oss.put()
                      .then(res => {
                        // 设置转换前的url
                        item.file_url = res.url
                        // 设置转换进度
                        this.set_task_convert_percent(item, 60)
                        // 创建转换任务
                        this.save_file_info(item)
                      })
                      .catch(_ => {
                        // 设置转换失败
                        this.set_task_convert_fail(item, '上传oss失败')
                      })
                  })
                }
              })
              .catch(err => {
                // 设置转换失败
                this.set_task_convert_fail(item, '扣费失败')
              })
          })
          .catch(err => {
            // 设置获取hash转换失败
            this.set_task_convert_fail(item, 'hash error')
          })
      },
      /**
       * @description 将任务状态设置为转换中
       * @param {Object} item: 设置的任务信息
       */
      set_task_convert_ing(item) {
        item.status = 2
        this.$store.dispatch('set_file_list')
      },
      /**
       * @description 设置任务转换中的进度
       * @param {Object} item: 设置的任务信息
       * @param {Number} percent: 进度值
       */
      set_task_convert_percent(item, percent) {
        item.percent = percent
        this.$store.dispatch('set_file_list')
      },
      /**
       * @description 将任务状态设置为转换完毕
       * @param {Object} item: 设置的任务信息
       * @param {String} url: 转换完成后的文件url
       */
      set_task_convert_finish(item, url) {
        item.status = 6
        item.percent = 100
        item.url = url
        this.$store.dispatch('set_file_list')
      },
      /**
       * @description 将任务状态设置为转换失败
       * @param {Object} item: 设置的任务信息
       * @param {String} text: 失败的详情
       */
      set_task_convert_fail(item, text) {
        item.status = 4
        item.failed = text
        this.$store.dispatch('set_file_list')
      },
      /**
       * @description 将任务状态设置为转换失败，但是可以重新执行，重新执行直接走saveinfo接口
       * @param {Object} item: 设置的任务信息
       * @param {String} text: 失败的详情
       */
      set_task_convert_recover(item, text) {
        item.status = 8
        item.failed = text
        this.$store.dispatch('set_file_list')
      },
      /**
       * @description 将任务状态设置为转换中断，需要输入密码
       * @param {Object} item: 设置的任务信息
       */
      set_task_convert_recover_by_password(item) {
        item.status = 10
        this.$store.dispatch('set_file_list')
      },
      /**
       * @description 创建转换任务
       * @param {Object} item: 任务信息
       */
      save_file_info(item) {
        let data = {
          taskid: item.taskId,
          fileurl: item.file_url,
          convertType: this.convert_info.file_type + 1000,
          targetFileName: item.filename,
          sourceFilePassword: item.password || '',
          targetFilePassword: item.target_password || '',
          system: convertUtils.getOsInfo(),
          data: item.data || [],
          filehash: item.hash,
        }
        this.http.post(config.SAVE_FILE_INFO, data)
          .then(res => {
            // 设置转换进度
            this.set_task_convert_percent(item, 90)
            // 检测任务进度
            this.check_status(item.taskId)
          })
          .catch(err => {
            // 创建失败
            this.set_task_convert_fail(item, '创建任务失败')
          })
      },
      /**
       * @description 处理密码之前
       * @param {Object} item: 当前选中项
       * @param {Number} index: 选中项下标index
       */
      handle_password_before(item, index) {
        this.show = true
        this.file = item
      },
      /**
       * @description 如果是分割 PDF，配置config
       * @param {Object} item: 设置的任务信息
       */
      split_pdf_config(item) {
        this.split_pdf_model = true
        this.file = item
      },
      /**
       * @description 如果是合并 PDF，配置config
       */
      merge_pdf_config() {
        let list = new Map([]); // 新的map，存储合并后的结果
        let merge_list = []; // 要合并的list
        let data = []; // data数据
        // 过滤数据，未开始的全部添加到合并列表，其他的全部保留
        this.file_list.forEach((item, index) => {
          if (item.status === 11) {
            merge_list.push(item)
          }else {
            list.set(item.name, item)
          }
        })
        this.$store.dispatch('cover_file_list', list)
        // 过滤要合并的数据，并且赋值
        merge_list.map(item => data.push({filename: item.name, password: item.password || '', start: '0', end: '0'}))
        // 新建Blob对象
        convertUtils.compress_files(merge_list, { name : merge_list[merge_list.length - 1].name.toLowerCase().replace('.pdf', '') + '.zip', data: JSON.stringify(data)})
          .then(res => {
            // 添加新文件数据，如果有同名，则随机名
            if (list.has(res.name)){
              this.$notify({
                title: '命名重复提示',
                message: '检测到文件合并同名，已为您随机处理',
                type: 'warning',
                showClose: true,
              })
              res.name = res.name.replace('.zip', parseInt(Math.random()*10000) + '.zip')
            }
            this.$store.dispatch('update_file_list', res)
            this.convert_file(res)
          })
        // merge_result = new File([...merge_list], merge_list[merge_list.length - 1].name + '.zip', {size: 10000, type: 'application/zip'})
      },
      /**
       * @description 如果是保护 PDF，配置config
       * @param {Object} item: 设置的任务信息
       */
      protect_pdf_config(item) {
        this.protect_pdf_model = true
        this.file = item
      },
      /**
       * @description 处理密码、配置分割 PDF 弹窗信息、配置保护 PDF 弹窗信息之后
       * @param {Object} item: 设置的任务信息
       */
      handle_model_after(item) {
        this.show = false
        this.split_pdf_model = false
        this.protect_pdf_model = false
        // 如果任务ID存在，直接创建转换任务，否则从头走流程
        if (item.taskId) {
          // 创建转换任务
          this.save_file_info(item)
        }else {
          // 如果扣费转换，如果转换类型是合并，不执行
          if (this.convert_info.file_type === 11) return
          this.convert_file(item)
        }
      },
      /**
       * @description 检测任务转换结果
       * @param {String} taskId: 任务ID
       */
      check_status(taskId) {
        this.task_list.add(taskId)
        clearInterval(this.time_int)
        this.time_int = setInterval(() => {
          let data = {
            taskid: JSON.stringify(Array.from(this.task_list))
          }
          this.http.post(config.GET_CONVERT_RESULT, data)
            .then(res => {
              if (res.task_data.length) {
                res.task_data.map(item => {
                  switch (Number(item.filestate)) {
                    case 5:
                      this.set_task_convert_fail(this.fileList.filter(row => row.taskId == item.id)[0], '转换失败')
                      this.task_list.delete(item.id)
                      break;
                    case 6:
                      this.set_task_convert_finish(this.fileList.filter(row => row.taskId == item.id)[0], item.convert_file_url)
                      this.task_list.delete(item.id)
                      break;
                    case 8:
                      this.set_task_convert_recover(this.fileList.filter(row => row.taskId == item.id)[0], '文件未上传')
                      this.task_list.delete(item.id)
                      break;
                    case 10:
                      this.set_task_convert_recover_by_password(this.fileList.filter(row => row.taskId == item.id)[0])
                      this.task_list.delete(item.id)
                      break;
                  }
                })
                if (!this.task_list.size) {
                  clearInterval(this.time_int)
                }
              }else {
                clearInterval(this.time_int)
              }
            })
        }, 1000)
      },
      /**
       * @description 批量下载
       */
      download_multiple() {
        let failure = []; // 无效文件
        // 过滤已选择数据
        let list = this.fileList.filter(item => {
          this.choice_data.has(item.name) && item.status != 6 ? failure.push(item.name) : ''
          return this.choice_data.has(item.name) && item.status == 6
        })
        // 如果文件全部失效
        if (!list.length) {
          this.$notify({
            title:'提示',
            message:'所选文件均为无效文件，请重新选择',
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
            message:`检测到所选文件包含${failure.length}个无效文件，已为您过滤下载`,
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
        let oA = document.createElement('a')
        oA.href = item.url
        oA.click()
      },
      /**
       * @description 进度文字格式化
       * @param {Number} percent: 进度值
       */
      format(percent) {
        return percent === 0 ? '等待' : (percent == 100 ? '完成' : `${percent}%`);
      },
      // 点击复选框
      handle_select(selection, row) {
        this.handle_click_data(row)
      },
      // 选择某一条数据
      handle_click_data(obj) {
        this.choice_data.has(obj.name) ? this.choice_data.delete(obj.name) : this.choice_data.add(obj.name)
        this.$nextTick(() => {
          this._set_choice_data()
        })
      },
      // 点击全局选中
      handle_click_all(selection) {
        this.convert_list.map(row => {
          selection.length ? this.choice_data.add(row.name) : this.choice_data.delete(row.name)
        })
        this.choice_data = new Set(Array.from(this.choice_data))
      },
      // 设置选中数据
      _set_choice_data() {
        this.fileList.map(row => {
          this.$refs.multipleTable.toggleRowSelection(row, this.choice_data.has(row.name))
          // this.$refs.multipleTable.setCurrentRow(row, this.choice_data.has(row))
        })
      },
      // 表格滚动条滚动到最底部
      _scroll_to_bottom() {
        this.$nextTick(() => {
          this.$refs.multipleTable.bodyWrapper.scrollTop = this.$refs.multipleTable.bodyWrapper.scrollHeight;
        })
      },
      // 次数不足，跳转到VIP页面
      turn_to_vip_page() {
        // 将当前选择的Tab保存，动态引入组件
        this.$store.dispatch('update_convert_header_active', {
          tab: {
            id: 1,
            name: '我的转换',
            component_name: 'myConvert'
          },
          index: 0
        })
        setTimeout(() => {
          this.turn_to_vip()
        })
      }
    },
    components: {
      SpeedButton: speed_button,
      Password: password,
      SplitPdf: split_pdf,
      ProtectPdf: protect_pdf
    }
  }
</script>

<style lang="less" scoped>
  /deep/ .finish {
    .el-progress-bar {
      .el-progress-bar__outer {
        .el-progress-bar__inner:before{
          display: none !important;
        }
      }
    }
  }

  .speed_button {
    font-size: 12px !important;
    width: 100px !important;
    height: 28px !important;
    line-height: 28px !important;
    font-weight: normal;
    padding: 0 0 !important;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .upgrade_vip {
    background: linear-gradient(264deg, rgba(247, 145, 65, 1) 0%, rgba(252, 168, 48, 1) 33%, rgba(255, 187, 90, 1) 100%) !important;
  }

  .table_wrap {
    padding: 0 1px 0 10px;
    border: 1px rgba(151, 151, 151, 0.3) solid;
    margin: 25px 0 20px;
    border-radius: 8px;
    min-height: 400px;
    position: relative;

    .merge_button {
      position: absolute;
      left: 50%;
      bottom: 30px;
      font-size: 15px !important;
      transform: translateX(-50%);
      width: 180px !important;
      height: 38px !important;
      line-height: 38px !important;
    }
  }
</style>
