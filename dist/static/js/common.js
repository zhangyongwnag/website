/**
 * @description
 */


/**
 * @description 全局监听socket
 */
window.sdk.on('on_native_message', (cmd, param) => {
  if (cmd == 'app:ready') {

  } else if (cmd == 'setting:init') {
    getElementByClassName('aside_setting').innerHTML = param
  } else if (cmd == 'settings:username') {
    setUserName(param)
    localStorage.setItem('username', param)
  } else if (cmd == 'file:skip') {
    window.sdk.LocalFileRemoveRecent(parseInt(param));
  }
});

/**
 * @description 获取用户信息
 */
let getUserInfo = function () {
  let username = localStorage.getItem('username')
  if (username) {
    setUserName(username)
  } else {
    window.sdk.command("settings:get", "username");
  }
}.call(window)

/**
 * @description 设置用户信息
 * @param {String} value: 用户名称
 */
function setUserName(value) {
  getElementByClassName('user_name').innerHTML = value
}

/**
 * @description 创建新的文件
 * @param {String} type：文件类型
 */
function createFile(type) {
  window.sdk.command("create:new", type);
}

/**
 * @description 打卡新的文件
 * @param {Object} model: 要打开的文件信息
 */
function openFile(model = '') {
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
function filterFileName(path) {
  let _re_name = /([^\\/]+\.[a-zA-Z0-9]{3,})$/ // 正则
  return _re_name.exec(path)[1]
}

/**
 * @description 过滤文件最后打开时间
 * @param {String} time: 要过滤的时间
 */
function filterFileTime(time) {
  let year_split = time.split('.')
  let minute_split = year_split[2].split(' ')
  return `${year_split[1]}月${year_split[0]}日 ${minute_split[1]}`
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
function filterFileType(code) {
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

  return '';
}

/**
 * @description 根据文件类型编码获取文件类型icon
 * @param {Number} code: 文件类型编码
 */
function filterFileIcon(code) {
  let type = filterFileType(code)
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

/**
 * @description 函数防抖
 * @param {Function} fun: 要优化的函数
 * @param {Number} delay: 函数间断执行时间
 */
function debounce(fun, delay = 500) {
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
function throttle(fun, delay = 500) {
  let args = Array.prototype.slice.call(arguments, 2)
  clearTimeout(fun.timer)
  fun.timer = setTimeout(() => {
    fun.apply(this, args)
  }, delay)
}

/**
 * @description 立即执行函数节流
 * @param {Function} fun: 要优化的函数
 * * @param {Number} delay: 函数间断执行时间
 */
function look(fun, delay = 1000) {
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
 * @description 封装获取DOM方法
 * @param {String} className：className
 */
function getElementByClassName(className) {
  return document.getElementsByClassName(className)[0]
}
