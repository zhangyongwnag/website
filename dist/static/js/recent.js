/**
 * @description 起始页最近打开文件相关代码
 * @author zyw
 * @date 04/19 2021
 */

'use strict'

let wrap = getElementByClassName('file_list') // 列表包裹器
let model = getElementByClassName('file_action_model') // 列表每一项的操作弹窗
let data = [] // 打开历史记录的数据
let id = '' // 当前点击项的ID

/**
 * @description 初始化自执行函数，渲染列表 -> 添加点击事件 -> 创建弹窗
 */
let _init = function () {
  /************测试数据*************/
  // let arr = [
  //   {"id": 0, "type": 1, "path": "https://testinfo.teamlab.info/New Document.docx", "modifyed": "11.12.2015 18:45"},
  //   {
  //     "id": 1,
  //     "type": 1,
  //     "path": "C:\\Users\\maxim.kadushkin\\Documents\\DPIConfig_SmallPCs.docx",
  //     "modifyed": "11.12.2015 18:22"
  //   },
  //   {"id": 2, "type": 1, "path": "/Users/ayuzhin/Develop/Web/test.html", "modifyed": "11.12.2015 17:58"},
  //   {"id": 3, "type": 1, "path": "https://testinfo.teamlab.info\\Sadfasd.docx", "modifyed": "10.12.2015 17:25"},
  //   {"id": 4, "type": 1, "path": "https://testinfo.teamlab.info\\Sadfasd.docx", "modifyed": "10.12.2015 17:25"},
  //   {"id": 5, "type": 1, "path": "https://testinfo.teamlab.info\\Sadfasd.docx", "modifyed": "10.12.2015 17:25"},
  //   {
  //     "id": 6,
  //     "type": 1,
  //     "path": "https://testinfo.teamlab.info\\Office 365 Value Added Reseller Guide.docx",
  //     "modifyed": "10.12.2015 16:46"
  //   }
  // ];
  /*******************************/
  // 调用底层封装的sdk方法
  if (window.sdk) {
    window.sdk.LocalFileRecents(); // 注册本地历史记录
    window.sdk.execCommand('app:onready', ''); // 监听客户端初始化
  }
  // 本地历史记录数据获取
  window.sdk.on('onupdaterecents', arr => {
    if (arr.length) {
      // 检查数据，保存数据，渲染数据
      // window.sdk.execCommand('files:check', JSON.stringify(arr));
      data = arr
      handle_data(data)
    } else {
      // 处理数据为空
      handle_data_empty()
    }
  });
}.call(window)

/**
 * @description 处理页面要渲染的数据
 * @param {Array} arr: 要渲染的源数据
 */
function handle_data(arr) {
  wrap.innerHTML = ''
  for (let i in Array.from(arr)) {
    let item = arr[i]
    let el = `<div class="file_item" id="${item.id}">
      <div class="file_info" id="${item.id}">
        <img src="./static/img/${filterFileIcon(item.type)}.png" alt="" id="${item.id}">
        <div class="file_name" id="${item.id}">
          <span id="${item.id}">${filterFileName(item.path)}</span>
          <span id="${item.id}">${item.path}</span>
        </div>
      </div>
      <div class="file_time" id="${item.id}">${filterFileTime(item.modifyed)}</div>
      <div class="file_size" id="${item.id}">${filterFileType(item.type)}</div>
      <div class="file_action" id="${item.id}"></div>
    </div>`
    wrap.innerHTML += el
  }
  // 为列表每一项添加点击事件
  add_item_event()
}

/**
 * @description 处理数据为空
 */
function handle_data_empty() {
  wrap.innerHTML = '暂无数据'
}

/**
 * @description 为列表每一项添加点击事件
 */
function add_item_event() {
  let file_item = document.getElementsByClassName('file_item') // 获取列表每一项，伪数组
  let list = document.getElementsByClassName('file_action') // 获取列表每一项的按钮，伪数组
  // 转成真数组并为列表每一项按钮添加点击事件
  Array.prototype.slice.call(file_item).map(el => {
    el.addEventListener('click', e => {
      openFile(data.filter(i => i.id == parseInt(e.target.id))[0])
    })
  })
  // 转成真数组并为列表每一项按钮添加点击事件
  Array.prototype.slice.call(list).map(el => {
    el.addEventListener('click', e => {
      e.stopPropagation()
      id = e.target.id // 赋值保存ID，操作弹窗中的事件需要
      // 创建操作弹窗
      create_model(e.target.offsetTop, e.target.offsetLeft)
    })
  })
}

/**
 * @description 点击列表每一项的按钮创建操作弹窗
 * @param {Number} top：弹窗距离页面顶部的距离
 * @param {Number} left：弹窗距离页面左边的距离
 */
function create_model(top, left) {
  model.style.display = 'block'
  model.style.top = top + 36 + 'px'
  model.style.left = left - model.offsetWidth + 50 + 'px'
}

/**
 * @description 弹窗的事件点击
 * @param {String} type: 事件类型
 */
function model_item_handle_click(type) {
  let item = data.filter(i => i.id == parseInt(id))[0] // 根据保存的ID取出当前点击的一项数据
  let index = data.findIndex(i => i.id == parseInt(id)) // 根据保存的ID取出当前点击的一项index
  if (type == 'explore') {
    window.sdk.execCommand('files:explore', item.path);
  } else if (type == 'delete') {
    window.sdk.LocalFileRemoveRecent(parseInt(id))
    document.getElementsByClassName('file_item')[index].style.display = 'none'
  }
}

/**
 * @description 回车检索数据
 * @param {Object} event: event事件
 */
function search(event) {
  // if (event.keyCode == 13) {
  // 根据关键字过滤列表
  let arr = data.filter(item => filterFileName(item.path).indexOf(event.target.value) != -1)
  // 过滤结果列表渲染
  handle_data(arr)
  // }
}

/**
 * @description 点击操作弹窗的外部关闭弹窗
 */
function click_out_side() {
  model.style.display = 'none'
}
