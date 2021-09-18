import SparkMD5 from 'spark-md5'
import store from '../store'

/**
 * @description 获取文件hash值
 * @param {Object} file: 源文件信息
 */
export function getHASH(file) {
  let spark = new SparkMD5.ArrayBuffer()
  return new Promise(function (resolve, reject) {
    let fileReader = new FileReader()

    fileReader.onload = function (e) {
      let buffer = e.target.result
      if (file.size != buffer.byteLength) {
        reject("获取文件hash失败，按理说不可能");
      } else {
        spark.append(buffer) // 解析 Buffer
        resolve(spark.end())
      }
    };

    fileReader.onerror = function () {
      reject("文件初始化读取Buffer失败");
    };

    fileReader.readAsArrayBuffer(file);
  });
}

/**
 * @description 获取系统版本信息
 */
export function getOsInfo() {
  let userAgent = window.navigator.userAgent.toLowerCase();
  let version = "";
  if (userAgent.indexOf("win") > -1) {
    if (userAgent.indexOf("windows nt 5.0") > -1 || userAgent.indexOf("Windows 2000") > -1) {
      version = "1";
    } else if (userAgent.indexOf("windows nt 5.1") > -1 || userAgent.indexOf("Windows XP") > -1) {
      version = "2";
    } else if (userAgent.indexOf("windows nt 5.2") > -1 || userAgent.indexOf("Windows 2003") > -1) {
      version = "3";
    } else if (userAgent.indexOf("windows nt 6.0") > -1 || userAgent.indexOf("Windows Vista") > -1) {
      version = "4";
    } else if (userAgent.indexOf("windows nt 6.1") > -1 || userAgent.indexOf("windows 7") > -1) {
      version = "5";
    } else if (userAgent.indexOf("windows nt 6.2") > -1 || userAgent.indexOf("windows 8") > -1) {
      version = "6";
    } else if (userAgent.indexOf("windows nt 6.3") > -1) {
      version = "7";
    } else if (userAgent.indexOf("windows nt 6.4") > -1 || userAgent.indexOf("windows nt 10") > -1) {
      version = "8";
    } else {
      version = "9";
    }
  } else if (userAgent.indexOf("iphone") > -1) {
    version = "10";
  } else if (userAgent.indexOf("mac") > -1) {
    version = "11";
  } else if (userAgent.indexOf("x11") > -1 || userAgent.indexOf("unix") > -1 || userAgent.indexOf("sunname") > -1 || userAgent.indexOf("bsd") > -1) {
    version = "12";
  } else if (userAgent.indexOf("linux") > -1) {
    if (userAgent.indexOf("android") > -1) {
      version = "13";
    } else {
      version = "14";
    }
  } else {
    version = "15";
  }
  return version;
}

/**
 * @description 获取消耗次数
 * @param {Number} size: 文件大小，单位字节
 */
export function getExpendTime(size) {
  let config = [...store.state.convert.convert_config]
  let size_ = (size / 1024 / 1024).toFixed(1)
  if (size_ > 1){
    let result = config.reverse().find(item => size_ > item.convert_size_min)
    return result.convert_point
  }else {
    return 1
  }
}

/**
 * @description 获取转换文件的大小
 * @param {Number} size: 文件大小，单位字节
 */
export function getFileSize(size) {
  if (size >= 1073741824) {
    return (size / 1024 / 1024 / 1024).toFixed(1) + ' GB'
  } else if (size >= 1048576) {
    return (size / 1024 / 1024).toFixed(1) + ' MB'
  } else if (size >= 1024) {
    return (size / 1024).toFixed(1) + ' KB'
  } else {
    return size.toFixed(1) + ' Bytes'
  }
}

/**
 * @description 获取PDF数据
 * @param {Object} file: file文件信息
 * @param {String} password: 密码信息
 */
export function pdfData(file, password) {
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();
    fileReader.onload = function () {
      //Step 4:turn array buffer into typed array
      var typedarray = new Uint8Array(this.result);
      //Step 5:PDFJS should be able to read this
      PDFJS.getDocument({ data: typedarray, file, password: password || '' })
        .then(function (pdf, b) {
          // do stuff
          resolve(pdf);
        })
        .catch(function (err) {
          resolve(err);
        });
    };
    fileReader.readAsArrayBuffer(file);
  });
}


/**
 * @description 使用JSZip压缩文件包
 * @param {Array} list: 压缩的文件列表
 * @param {Object} options: 额外的参数配置
 */
export function compress_files(list, options) {
  return new Promise((resolve, reject) => {
    try {
      if (!list.length) throw new Error('文件为空')

      let zip = new JSZip();

      // 添加压缩文件
      list.map(item => {
        zip.file(item.name, item);
      })

      // 转换成Blob对象
      zip.generateAsync({type: 'blob',})
        .then(res => {
          // 循环options添加属性
          for (let i in options) {
            res[i] = options[i]
          }
          resolve(res)
        })
        .catch(err => {
          throw new Error(err)
        })
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * @description 使用JSZip压缩文件包
 * @param {Array} list: 压缩的列表
 */
export function compress_list(list) {
  // return new Promise((resolve, reject) => {
  //   try {
  //     if (!list.length) throw new Error('文件为空')
  //
  //     let zip = new JSZip();
  //
  //     // 添加压缩文件
  //     list.map(item => {
  //       let file = new File(item.name)
  //       zip.file(item.name, item);
  //     })
  //
  //     // 转换成Blob对象
  //     zip.generateAsync({type: 'blob',})
  //       .then(res => {
  //         // 循环options添加属性
  //         for (let i in options) {
  //           res[i] = options[i]
  //         }
  //         resolve(res)
  //       })
  //       .catch(err => {
  //         throw new Error(err)
  //       })
  //   } catch (err) {
  //     reject(err)
  //   }
  // })
  let file = new File(['https://speedpdfhk.oss-accelerate.aliyuncs.com/robot/1628678220247413442'], 'test.pdf')
  let fileReader = new FileReader()

  fileReader.onload = function (e) {
    console.log(e.target.result)
  };

  fileReader.onerror = function () {
    reject("文件初始化读取Buffer失败");
  };

  // fileReader.readAsArrayBuffer(file);
  fileReader.readAsBinaryString(file);
}
