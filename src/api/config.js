let host = ''
let host_pay = ''
let host_convert = ''

// 环境判断
if (process.env.NODE_TYPE === 'development') {
  // host = 'https://rd.pc.api.speedoffice.cn'
  // host_pay = 'https://rd.pc.pay.speedoffice.cn'
  // host_convert = 'https://rd.pc.convert.speedoffice.cn'
  host = 'https://pc.api.speedoffice.cn'
  host_pay = 'https://pc.pay.speedoffice.cn'
  host_convert = 'https://pc.convert.speedoffice.cn'
} else {
  host = 'https://pc.api.speedoffice.cn'
  host_pay = 'https://pc.pay.speedoffice.cn'
  host_convert = 'https://pc.convert.speedoffice.cn'
}

export const GET_GUEST_INFO = host + '/guest'; // 获取游客信息
export const GET_LOGIN_INFO = host + '/login/getloginurl'; // 获取登录信息
export const GET_LOGIN_RESULT = host + '/login/checkLogin'; // 检测登录状态
export const LOGIN_BY_EMAIL = host + '/login/email'; // 邮箱登录
export const LOGIN_BY_EMAIL_CODE = host + '/login/emailCode'; // 邮箱验证码登录
export const LOGIN_BY_PHONE = host + '/login/phoneCode'; // 手机号登录、注册
export const REGISTER_BY_EMAIL = host + '/login/emailRegister'; // 邮箱密码注册
export const SEND_EMAIL_CODE = host + '/login/sendEmailCode'; // 邮箱验证码
export const SEND_PHONE_CODE = host + '/login/sendPhoneCode'; // 手机短信验证码
export const CHECK_EMAIL = host + '/login/checkEmail'; // 检测邮箱是否有效
export const CHECK_EMAIL_CODE = host + '/login/checkCode'; // 检测手机号、邮箱验证码是否有效
export const RESET_PASS_WORD_EMAIL_CODE = host + '/login/reset/sendEmailCode'; // 重置密码发送邮箱验证码
export const RESET_PASS_WORD = host + '/login/reset/updateEmailPassword'; // 重置密码


export const GET_CONVERT_INFO = host + '/userinfo'; // 获取用户转换信息
export const GET_VIP_INFO = host + '/user/convertVip'; // 获取VIP信息
export const GET_RECHARGE_RECORD = host + '/user/rechargeRecord'; // 获取购买记录
export const GET_CONVERT_LIST = host + '/user/convertList'; // 获取转换列表


export const GET_PACKAGE = host_pay + '/getPaymentPackage'; // 获取转换套餐列表
export const GET_PAY_QR_CODE = host_pay + '/order/getQrCode'; // 获取支付二维码
export const CHECK_PAY_STATUS = host_pay + '/check/pay/status'; // 检测支付状态


export const GET_CONVERT_CONFIG = host_convert + '/get/convert/deduct/config'; // 获取转换配置信息
export const SUBMIT_CONVERT_DEDUCT = host_convert + '/deduct'; // 转换扣费
export const SAVE_FILE_INFO = host_convert + '/savefileinfo'; // 扣费后文件上传
export const GET_OSS_SIGN = host_convert + '/oss/getTst'; // 文件上传前获取OSS签名
export const GET_CONVERT_RESULT = host_convert + '/checkstate'; // 检测文件转换结果


export const GET_USER_INFO = host + '/User/getUserBaseInfo'; // 获取用户信息
export const UPDATE_USER_INFO = host + '/User/updateUserBaseInfo'; // 更新用户信息
export const BIND_PHONE = host + '/user/bindPhone'; // 手机号绑定
export const BIND_EMAIL = host + '/user/bindEmail'; // 邮箱绑定



