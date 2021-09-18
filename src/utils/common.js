let md5 = require('./md5.min')

/**
 * @description 全局监听socket
 */
if (window.sdk) {
  window.sdk.on('on_native_message', (cmd, param) => {
    if (cmd == 'app:ready') {

    } else if (cmd == 'setting:init') {
      getElementByClassName('aside_setting').innerHTML = param
    } else if (cmd == 'settings:username') {
      setUserName(param)
      // localStorage.setItem('username', param)
    } else if (cmd == 'file:skip') {
      window.sdk.LocalFileRemoveRecent(parseInt(param));
    }
  });
}

/**
 * @description 创建新的文件
 * @param {String} type：文件类型
 */
export function createFile(type) {
  window.sdk.command("create:new", type);
}

/**
 * @description 打卡新的文件
 * @param {Object} model: 要打开的文件信息
 */
export function openFile(model = '') {
  if (model) {
    window.sdk.LocalFileOpenRecent(parseInt(model.id));
    window.sdk.command("open:recent", JSON.stringify(model));
  } else {
    window.sdk.command("open:folder", '');
  }
}

/**
 * @description 根据文件路径信息获取文件名称
 * @param {String} path: 文件路径信息
 */
export function filterFileName(path) {
  let _re_name = /([^\\/]+\.[a-zA-Z0-9]{3,})$/ // 正则
  return _re_name.exec(path)[1]
}

/**
 * @description 过滤文件最后打开时间
 * @param {String} time: 要过滤的时间
 */
export function filterFileTime(time) {
  let year_split = time.split('.')
  let minute_split = year_split[2].split(' ')
  return new Date(`${minute_split[0]}-${year_split[1]}-${year_split[0]} ${minute_split[1]}`).getTime()
}

let FILE_DOCUMENT = 0x0040
let FILE_PRESENTATION = 0x0080
let FILE_SPREADSHEET = 0x0100
let FILE_CROSSPLATFORM = 0x0200

let FileFormat = {
  FILE_UNKNOWN: 0x0000,

  FILE_DOCUMENT: FILE_DOCUMENT,
  FILE_DOCUMENT_DOCX: FILE_DOCUMENT + 0x0001,
  FILE_DOCUMENT_DOC: FILE_DOCUMENT + 0x0002,
  FILE_DOCUMENT_ODT: FILE_DOCUMENT + 0x0003,
  FILE_DOCUMENT_RTF: FILE_DOCUMENT + 0x0004,
  FILE_DOCUMENT_TXT: FILE_DOCUMENT + 0x0005,
  FILE_DOCUMENT_HTML: FILE_DOCUMENT + 0x0006,
  FILE_DOCUMENT_MHT: FILE_DOCUMENT + 0x0007,
  FILE_DOCUMENT_EPUB: FILE_DOCUMENT + 0x0008,
  FILE_DOCUMENT_FB2: FILE_DOCUMENT + 0x0009,
  FILE_DOCUMENT_MOBI: FILE_DOCUMENT + 0x000a,
  FILE_DOCUMENT_DOCM: FILE_DOCUMENT + 0x000b,
  FILE_DOCUMENT_DOTX: FILE_DOCUMENT + 0x000c,
  FILE_DOCUMENT_DOTM: FILE_DOCUMENT + 0x000d,
  FILE_DOCUMENT_ODT_FLAT: FILE_DOCUMENT + 0x000e,
  FILE_DOCUMENT_OTT: FILE_DOCUMENT + 0x000f,
  FILE_DOCUMENT_DOC_FLAT: FILE_DOCUMENT + 0x0010,

  FILE_PRESENTATION: FILE_PRESENTATION,
  FILE_PRESENTATION_PPTX: FILE_PRESENTATION + 0x0001,
  FILE_PRESENTATION_PPT: FILE_PRESENTATION + 0x0002,
  FILE_PRESENTATION_ODP: FILE_PRESENTATION + 0x0003,
  FILE_PRESENTATION_PPSX: FILE_PRESENTATION + 0x0004,
  FILE_PRESENTATION_PPTM: FILE_PRESENTATION + 0x0005,
  FILE_PRESENTATION_PPSM: FILE_PRESENTATION + 0x0006,
  FILE_PRESENTATION_POTX: FILE_PRESENTATION + 0x0007,
  FILE_PRESENTATION_POTM: FILE_PRESENTATION + 0x0008,
  FILE_PRESENTATION_ODP_FLAT: FILE_PRESENTATION + 0x0009,
  FILE_PRESENTATION_OTP: FILE_PRESENTATION + 0x000a,

  FILE_SPREADSHEET: FILE_SPREADSHEET,
  FILE_SPREADSHEET_XLSX: FILE_SPREADSHEET + 0x0001,
  FILE_SPREADSHEET_XLS: FILE_SPREADSHEET + 0x0002,
  FILE_SPREADSHEET_ODS: FILE_SPREADSHEET + 0x0003,
  FILE_SPREADSHEET_CSV: FILE_SPREADSHEET + 0x0004,
  FILE_SPREADSHEET_XLSM: FILE_SPREADSHEET + 0x0005,
  FILE_SPREADSHEET_XLTX: FILE_SPREADSHEET + 0x0006,
  FILE_SPREADSHEET_XLTM: FILE_SPREADSHEET + 0x0007,
  FILE_SPREADSHEET_ODS_FLAT: FILE_SPREADSHEET + 0x0008,
  FILE_SPREADSHEET_OTS: FILE_SPREADSHEET + 0x0009,

  FILE_CROSSPLATFORM: FILE_CROSSPLATFORM,
  FILE_CROSSPLATFORM_PDF: FILE_CROSSPLATFORM + 0x0001,
  FILE_CROSSPLATFORM_SWF: FILE_CROSSPLATFORM + 0x0002,
  FILE_CROSSPLATFORM_DJVU: FILE_CROSSPLATFORM + 0x0003,
  FILE_CROSSPLATFORM_XPS: FILE_CROSSPLATFORM + 0x0004,
  FILE_CROSSPLATFORM_PDFA: FILE_CROSSPLATFORM + 0x0009
};

/**
 * @description 根据文件类型编码获取文件类型
 * @param {Number} code: 文件类型编码
 */
export function filterFileType(code) {
  switch (code) {
    case FileFormat.FILE_DOCUMENT_DOC:
      return 'doc';
    case FileFormat.FILE_DOCUMENT_DOCX:
      return 'docx';
    case FileFormat.FILE_DOCUMENT_ODT:
      return 'odt';
    case FileFormat.FILE_DOCUMENT_RTF:
      return 'rtf';
    case FileFormat.FILE_DOCUMENT_TXT:
      return 'txt';
    case FileFormat.FILE_DOCUMENT_HTML:
    case FileFormat.FILE_DOCUMENT_MHT:
      return 'htm';

    case FileFormat.FILE_SPREADSHEET_XLS:
      return 'xls';
    case FileFormat.FILE_SPREADSHEET_XLTX:
    case FileFormat.FILE_SPREADSHEET_XLSX:
      return 'xlsx';
    case FileFormat.FILE_SPREADSHEET_ODS:
      return 'ods';
    case FileFormat.FILE_SPREADSHEET_CSV:
      return 'csv';

    case FileFormat.FILE_PRESENTATION_PPT:
      return 'ppt';
    case FileFormat.FILE_PRESENTATION_POTX:
    case FileFormat.FILE_PRESENTATION_PPTX:
      return 'pptx';
    case FileFormat.FILE_PRESENTATION_ODP:
      return 'odp';
    case FileFormat.FILE_PRESENTATION_PPSX:
      return 'pps';

    case FileFormat.FILE_CROSSPLATFORM_PDFA:
    case FileFormat.FILE_CROSSPLATFORM_PDF:
      return 'pdf';
    case FileFormat.FILE_CROSSPLATFORM_DJVU:
      return 'djvu';
    case FileFormat.FILE_CROSSPLATFORM_XPS:
      return 'xps';
  }

  return '-';
}

/**
 * @description 根据文件类型编码获取文件类型icon
 * @param {Number} code: 文件类型编码
 */
export function filterFileIcon(code) {
  let type = filterFileType(code)
  console.log(type)
  switch (type) {
    case 'doc':
      return 'word';
    case 'docs':
      return 'word';
    case 'xls':
      return 'excel';
    case 'xlsx':
      return 'excel';
    case 'ppt':
      return 'ppt';
    case 'pptx':
      return 'ppt';
    default:
      return 'word';
  }
}

// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
// (new Date()).Format("yyyy-MM-dd")      ==> 2006-07-02
// (new Date()).Format("yyyy年MM月dd日 上午hh:mm")      ==> 2006年07月-02日 上午08:09
// (new Date()).Format("yyyyMMdd")      ==> 20060702
// (new Date()).Format("yyyyMMddhhmmss")      ==> 20060702080904
Date.prototype.format = function (fmt) {
  var o = {
    'M+': this.getMonth() + 1,                 //月份
    'd+': this.getDate(),                    //日
    'h+': this.getHours(),                   //小时
    'm+': this.getMinutes(),                 //分
    's+': this.getSeconds(),                 //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    'S': this.getMilliseconds()             //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  return fmt
}

// 日期格式转换
export function dateResult(result, fmt) {
  return new Date(result).format(fmt)
}

/**
 * @description 判断是否手机号属实
 */
export function isPhone(value) {
  var partten = /^1[3,5,8,2,4,6,7,9]\d{9}$/
  var fl = false
  if (partten.test(value)) {
    return true
  } else {
    return false
  }
}

/**
 * @description 判断邮箱属实
 */
export function isEmail(str) {
  var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
  return reg.test(str)
}

/**
 * @description 判断浏览器的隐身(无痕)模式
 */
export function browserIsHide() {
  let fs = window.RequestFileSystem || window.webkitRequestFileSystem;
  if (!fs) {
    console.log("check failed?");
  } else {
    fs(window.TEMPORARY, 100, function () {
      // console.log('非无痕模式')
    }, function () {
      alert('您已开启无痕模式，为了不影响正常功能使用，请立即关闭！');
    });
  }
}

/**
 * @description 函数防抖
 * @param {Function} fun: 要优化的函数
 * @param {Number} delay: 函数间断执行时间
 */
export function debounce(fun, delay = 500) {
  let args = Array.prototype.slice.call(arguments, 2)
  if (fun.timer) return
  fun.timer = setTimeout(() => {
    fun.apply(this, args)
    fun.timer = ''
  }, delay)
}

/**
 * @description 函數节流
 * @param {Function} fun: 要优化的函数
 * * @param {Number} delay: 函数间断执行时间
 */
export function throttle(fun, delay = 500) {
  let args = Array.prototype.slice.call(arguments, 2)
  clearTimeout(fun.timer)
  fun.timer = setTimeout(() => {
    console.log(args)
    fun.apply(this, args)
  }, delay)
}

/**
 * @description 立即执行函数节流
 * @param {Function} fun: 要优化的函数
 * * @param {Number} delay: 函数间断执行时间
 */
export function look(fun, delay = 1000) {
  let args = Array.prototype.slice.call(arguments, 2)
  if (!fun.looked) {
    fun.apply(this, args)
    fun.looked = true
  }
  clearTimeout(fun.timer)
  fun.timer = setTimeout(() => {
    fun.looked = false
  }, delay)
}

/**
 * @description 判断是否Array，并返回第一项
 * @param {Object | Array | String} value: 要处理的数据
 */
export function filterObj(value) {
  let type = Object.prototype.toString.call(value)
  switch (type) {
    case '[object Array]':
      return value[0];
    case '[object Object]':
      return value
  }
}

/**
 * @description 获取地址栏参数
 * @param {String} key: 参数名
 */
function getParam(key) {
  let results = new RegExp('[\?&]' + key + '=([^&#]*)').exec(window.location.href)
  if (results) {
    return results[1]
  } else {
    return ''
  }
}

/**
 * @description 设置cookie
 * @param {String} name: 参数名
 * @param {String} value: 参数值
 * @param {Number} days: 有效期（天）
 */
export function setCookie(name, value, days) {
  let d = new Date()
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000))
  let expires = 'expires=' + d.toUTCString()
  document.cookie = name + '=' + value + '; path=/;' + expires
}

/**
 * @description 获取cookie
 * @param {String} name: 参数名
 */
export function getCookie(name) {
  let arr = false
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
 * @description 删除cookie
 * @param {String} name: 参数名
 */
export function delCookie(name) {
  let exp = new Date()
  exp.setTime(exp.getTime() - 1)
  let cval = getCookie(name)
  if (cval != null)
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
}

/**
 * @description 将map转换为数组
 */
export function mapToArray(obj) {
  let arr = []
  obj.forEach(item => {
    arr.push(obj.get(item))
  })
  console.log(arr)
  return arr
}

/**
 * @description 生成UUID
 */
function uuid () {
  if (localStorage.getItem('uuid')){
    return localStorage.getItem('uuid')
  }else {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4'  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    var uuid = s.join('')
    localStorage.setItem('uuid',uuid)
    return uuid
  }
}

/**
 * @description 类型检测
 * @param {String | Object | Array | Number | Boolean | Symbol} value: 要检测的值
 */
export function typeDetection(value) {
  let type_ = Object.prototype.toString.call(value)
  switch (type_) {
    case '[object Object]':
      return 'object';
    case '[object Array]':
      return 'array';
    case '[object String]':
      return 'string';
    case '[object Number]':
      return 'number';
    case '[object Boolean]':
      return 'boolean';
    case '[object Symbol]':
      return 'symbol';
    default:
      return typeof(value)
  }
}

/**
 * @description 加密params，生成签名
 * @param {Object} params: 参数对象
 * @param {Number} timestamp: 时间戳
 */
export function encryptParam(params, timestamp) {
  params = {...params, timestamp, sign_key: 'yQ7fGXfm2tYV8ff6pKlQ5fpIR79SI1nQ'}
  let signature = ''
  let keys = params ? Object.keys(params) : []
  if (keys.length) {
    keys.sort().map(key => {
      signature += `${key}=${typeDetection(params[key]) === 'object' ? JSON.stringify(params[key]) : params[key]}`
    })
  }
  return md5.md5(md5.md5(signature))
}
