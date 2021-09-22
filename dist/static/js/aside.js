'use strict'

var control = true // 侧边栏状态

/**
 * @description 操作侧边栏缩放按钮
 */
function handle_control() {
  control = !control
  if (!control) {
    getElementByClassName('aside_content').style.opacity = 0
    getElementByClassName('aside_setting').style.opacity = 0
    setTimeout(function () {
      // getElementByClassName('aside_content').style.display = 'none'
      // getElementByClassName('aside_setting').style.display = 'none'
      document.getElementsByTagName('aside')[0].style.width = '0'
      document.getElementsByTagName('aside')[0].style.minWidth = '0'
      document.getElementById('control').style.transform = 'rotateZ(180deg)'
    })
  } else {
    document.getElementsByTagName('aside')[0].style.width = '280px'
    document.getElementsByTagName('aside')[0].style.minWidth = '280px'
    document.getElementById('control').style.transform = 'rotateZ(0deg)'
    setTimeout(function () {
      // getElementByClassName('aside_content').style.display = 'block'
      // getElementByClassName('aside_setting').style.display = 'flex'
      getElementByClassName('aside_content').style.opacity = 1
      getElementByClassName('aside_setting').style.opacity = 1
    }, 200)
  }
}


/**
 * @description 封装获取DOM方法
 * @param {String} className：className
 */
function getElementByClassName(className) {
  return document.getElementsByClassName(className)[0]
}
