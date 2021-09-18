import Icon from '../assets/img/convet_icon/index'

/**
 * @description 全局转换类型数据
 * @return {String} name: 转换类型名称
 * @return {String} type: 转换类型标识，根据标识显示在菜单栏的哪个模块
 * @return {Number} file_type: 转换类型和后台约定的唯一值
 * @return {String} icon_2x: 转换类型大图标
 * @return {String} icon_1x_white: 转换类型小图标白色
 * @return {String} icon_1x_color: 转换类型小图标彩色
 * @return {String} color: 转换类型固定颜色
 * @return {Number} matched_file_type: 转换类型对应的转换类型，在转化内页显示，点击可跳转
 * @return {String} description: 转换描述
 * @return {String} format: 过滤的格式
 * @return {String} details: 转换详情配置
 * @return {Boolean} init: 是否在tab首页展示
 */

export default [
  {
    name: 'PDF 转 Word',
    type: 'from-pdf',
    file_type: 1,
    icon_2x: Icon.PDF_Word_2x,
    icon_1x_white: Icon.PDF_Word_1x_white,
    icon_1x_color: Icon.PDF_Word_1x_color,
    color: '#2A95FE',
    matched_file_type: 7,
    description: '100%免费在线将 PDF 转换为 Word',
    format: '.pdf, application/pdf',
    init: true
  },
  {
    name: 'PDF 转 Excel',
    type: 'from-pdf',
    file_type: 2,
    icon_2x: Icon.PDF_Excel_2x,
    icon_1x_white: Icon.PDF_Excel_1x_white,
    icon_1x_color: Icon.PDF_Excel_1x_color,
    color: '#1FB45A',
    matched_file_type: 8,
    description: '100%免费在线将 PDF 转换为 Excel',
    format: '.pdf, application/pdf',
    init: true
  },
  {
    name: 'PDF 转 PPT',
    type: 'from-pdf',
    file_type: 3,
    icon_2x: Icon.PDF_PPT_2x,
    icon_1x_white: Icon.PDF_PPT_1x_white,
    icon_1x_color: Icon.PDF_PPT_1x_color,
    color: '#FF5901',
    matched_file_type: 9,
    description: '100%免费在线将 PDF 转换为 PPT',
    format: '.pdf, application/pdf',
    init: true
  },
  {
    name: 'PDF 转 JPG',
    type: 'from-pdf',
    file_type: 4,
    icon_2x: Icon.PDF_Jpg_2x,
    icon_1x_white: Icon.PDF_Jpg_1x_white,
    icon_1x_color: Icon.PDF_Jpg_1x_color,
    color: '#FF9D02',
    matched_file_type: 5,
    description: '100%免费在线将 PDF 转换为 JPG',
    format: '.pdf, application/pdf',
    init: true
  },
  {
    name: 'Word 转 PDF',
    type: 'to-pdf',
    file_type: 7,
    icon_2x: Icon.Word_PDF_2x,
    icon_1x_white: Icon.Word_PDF_1x_white,
    icon_1x_color: Icon.Word_PDF_1x_color,
    color: '#E473E4',
    matched_file_type: 1,
    description: '100%免费在线将 Word 转换为 PDF',
    format: '.doc, .docx, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    init: true
  },
  {
    name: 'Excel 转 PDF',
    type: 'to-pdf',
    file_type: 8,
    icon_2x: Icon.Excel_PDF_2x,
    icon_1x_white: Icon.Excel_PDF_1x_white,
    icon_1x_color: Icon.Excel_PDF_1x_color,
    color: '#FC7CBB',
    matched_file_type: 2,
    description: '100%免费在线将 Excel 转换为 PDF',
    format: '.xls, .xlsx, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    init: true
  },
  {
    name: 'PPT 转 PDF',
    type: 'to-pdf',
    file_type: 9,
    icon_2x: Icon.PPT_PDF_2x,
    icon_1x_white: Icon.PPT_PDF_1x_white,
    icon_1x_color: Icon.PPT_PDF_1x_color,
    color: '#F27276',
    matched_file_type: 3,
    description: '100%免费在线将 PPT 转换为 PDF',
    format: '.ppt, .pptx, application/vnd.ms-powerpoint, application/vnd.openxmlformats-officedocument.presentationml.presentation',
    init: true
  },
  {
    name: 'OFD 转 PDF',
    type: 'to-pdf',
    file_type: 30,
    icon_2x: Icon.OFD_PDF_2x,
    icon_1x_white: Icon.OFD_PDF_1x_white,
    icon_1x_color: Icon.OFD_PDF_1x_color,
    color: '#F77777',
    matched_file_type: 33,
    description: '100%免费在线将 OFD 转换为 PDF',
    format: '.ofd, application/ofd'
  },
  {
    name: 'JPG 转 PDF',
    type: 'to-pdf',
    file_type: 5,
    icon_2x: Icon.JPG_PDF_2x,
    icon_1x_white: Icon.JPG_PDF_1x_white,
    icon_1x_color: Icon.JPG_PDF_1x_color,
    color: '#FB6F58',
    matched_file_type: 4,
    description: '100%免费在线将 JPG 转换为 PDF',
    format: '.jpg, image/jpg'
  },
  {
    name: 'CAJ 转 PDF',
    type: 'to-pdf',
    file_type: 24,
    icon_2x: Icon.CAJ_PDF_2x,
    icon_1x_white: Icon.CAJ_PDF_1x_white,
    icon_1x_color: Icon.CAJ_PDF_1x_color,
    color: '#F2E063',
    matched_file_type: 10,
    description: '100%免费在线将 CAJ 转换为 PDF',
    format: '.caj, application/caj'
  },
  {
    name: 'JPG 转 Word',
    type: 'office',
    file_type: 15,
    icon_2x: Icon.JPG_Word_2x,
    icon_1x_white: Icon.JPG_Word_1x_white,
    icon_1x_color: Icon.JPG_Word_1x_color,
    color: '#FD8845',
    matched_file_type: 18,
    description: '100%免费在线将 JPG 转换为 Word',
    format: '.jpg, image/jpg'
  },
  {
    name: 'CAJ 转 Word',
    type: 'office',
    file_type: 10,
    icon_2x: Icon.CAJ_Word_2x,
    icon_1x_white: Icon.CAJ_Word_1x_white,
    icon_1x_color: Icon.CAJ_Word_1x_color,
    color: '#FDA43D',
    matched_file_type: 24,
    description: '100%免费在线将 CAJ 转换为 Word',
    format: '.caj, application/caj'
  },
  {
    name: 'OFD 转 Word',
    type: 'office',
    file_type: 33,
    icon_2x: Icon.OFD_Word_2x,
    icon_1x_white: Icon.OFD_Word_1x_white,
    icon_1x_color: Icon.OFD_Word_1x_color,
    color: '#FFBB61',
    matched_file_type: 30,
    description: '100%免费在线将 OFD 转换为 Word',
    format: '.ofd, application/ofd'
  },
  {
    name: 'WEBP 转 JPG',
    type: 'office',
    file_type: 18,
    icon_2x: Icon.WEBP_JPEG_2x,
    icon_1x_white: Icon.WEBP_JPEG_1x_white,
    icon_1x_color: Icon.WEBP_JPEG_1x_color,
    color: '#BF282B',
    matched_file_type: 19,
    description: '100%免费在线将 WEBP 转换为 JPG',
    format: '.webp, image/webp'
  },
  {
    name: 'WEBP 转 JPEG',
    type: 'office',
    file_type: 21,
    icon_2x: Icon.WEBP_JPEG_2x,
    icon_1x_white: Icon.WEBP_JPEG_1x_white,
    icon_1x_color: Icon.WEBP_JPEG_1x_color,
    color: '#BF282B',
    matched_file_type: 20,
    description: '100%免费在线将 WEBP 转换为 JPEG',
    format: '.webp, image/webp'
  },
  {
    name: 'WEBP 转 PNG',
    type: 'office',
    file_type: 20,
    icon_2x: Icon.WEBP_JPEG_2x,
    icon_1x_white: Icon.WEBP_JPEG_1x_white,
    icon_1x_color: Icon.WEBP_JPEG_1x_color,
    color: '#BF282B',
    matched_file_type: 21,
    description: '100%免费在线将 WEBP 转换为 PNG',
    format: '.webp, image/webp'
  },
  {
    name: 'JPG 转 WEBP',
    type: 'office',
    file_type: 19,
    icon_2x: Icon.JPG_WEBP_2x,
    icon_1x_white: Icon.JPG_WEBP_1x_white,
    icon_1x_color: Icon.JPG_WEBP_1x_color,
    color: '#BB9CFF',
    matched_file_type: 18,
    description: '100%免费在线将 JPG 转换为 WEBP',
    format: '.jpg, image/jpg'
  },
  {
    name: 'XPS 转 PDF',
    type: 'to-pdf',
    file_type: 31,
    icon_2x: Icon.XPS_PDF_2x,
    icon_1x_white: Icon.XPS_PDF_1x_white,
    icon_1x_color: Icon.XPS_PDF_1x_color,
    color: '#E1D432',
    matched_file_type: 34,
    description: '100%免费在线将 XPS 转换为 PDF',
    format: '.xps, application/xps'
  },
  {
    name: '压缩 PDF',
    type: 'compress',
    file_type: 16,
    icon_2x: Icon.C_PDF_2x,
    icon_1x_white: Icon.C_PDF_1x_white,
    icon_1x_color: Icon.C_PDF_1x_color,
    color: '#7198EE',
    matched_file_type: 17,
    description: '在线缩小 PDF 的大小',
    format: '.pdf, application/pdf',
    init: true
  },
  {
    name: '压缩 Image',
    type: 'compress',
    file_type: 17,
    icon_2x: Icon.C_Image_2x,
    icon_1x_white: Icon.C_Image_1x_white,
    icon_1x_color: Icon.C_Image_1x_color,
    color: '#7C55CB',
    matched_file_type: 16,
    description: '在线缩小图片的大小',
    format: 'image/*'
  },
  {
    name: '加密 PDF',
    type: 'safe',
    file_type: 13,
    icon_2x: Icon.P_PDF_2x,
    icon_1x_white: Icon.P_PDF_1x_white,
    icon_1x_color: Icon.P_PDF_1x_color,
    color: '#0ABFD0',
    matched_file_type: 14,
    description: '通过添加密码来保护您的 PDF 文件',
    format: '.pdf, application/pdf',
    init: true
  },
  {
    name: '解密 PDF',
    type: 'safe',
    file_type: 14,
    icon_2x: Icon.U_PDF_2x,
    icon_1x_white: Icon.U_PDF_1x_white,
    icon_1x_color: Icon.U_PDF_1x_color,
    color: '#33ACE1',
    matched_file_type: 13,
    description: '从 PDF 文件中删除密码',
    format: '.pdf, application/pdf',
    init: true
  },
  {
    name: 'CAD 转 PDF',
    type: 'to-pdf',
    file_type: 32,
    icon_2x: Icon.CAD_PDF_2x,
    icon_1x_white: Icon.CAD_PDF_1x_white,
    icon_1x_color: Icon.CAD_PDF_1x_color,
    color: '#30D8A0',
    matched_file_type: 35,
    description: '100%免费在线将 CAD 转换为 PDF',
    format: '.cad, application/cad'
  },
  {
    name: 'CAD 转 Word',
    type: 'office',
    file_type: 35,
    icon_2x: Icon.CAD_Word_2x,
    icon_1x_white: Icon.CAD_Word_1x_white,
    icon_1x_color: Icon.CAD_Word_1x_color,
    color: '#30D8D6',
    matched_file_type: 32,
    description: '100%免费在线将 CAD 转换为 Word',
    format: '.cad, application/cad'
  },
  {
    name: '合并 PDF',
    type: 's-pdf',
    file_type: 11,
    icon_2x: Icon.M_PDF_2x,
    icon_1x_white: Icon.M_PDF_1x_white,
    icon_1x_color: Icon.M_PDF_1x_color,
    color: '#46D16A',
    matched_file_type: 12,
    description: '将多个 PDF 文件合并为一个 PDF 文件',
    format: '.pdf, application/pdf',
    init: true
  },
  {
    name: 'XPS 转 Word',
    type: 'office',
    file_type: 34,
    icon_2x: Icon.XPS_Word_2x,
    icon_1x_white: Icon.XPS_Word_1x_white,
    icon_1x_color: Icon.XPS_Word_1x_color,
    color: '#72D834',
    matched_file_type: 31,
    description: '100%免费在线将 XPS 转换为 Word',
    format: '.xps, application/xps'
  },
  {
    name: '分割 PDF',
    type: 's-pdf',
    file_type: 12,
    icon_2x: Icon.S_PDF_2x,
    icon_1x_white: Icon.S_PDF_1x_white,
    icon_1x_color: Icon.S_PDF_1x_color,
    color: '#71E46B',
    matched_file_type: 11,
    description: '按页面范围 PDF 分割文件，或联机将所有 PDF 页面提取为多个 PDF 文件',
    format: '.pdf, application/pdf',
    init: true
  },
]
