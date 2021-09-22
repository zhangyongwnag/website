import request from '../../api/request'
import * as config from '../../api/config'
import store from "../../store";
import join from '../../assets/img/convert/join_select.png'
import vip from '../../assets/img/convert/vip_select.png'
import record from '../../assets/img/convert/record_select.png'
import group from '../../assets/img/convert/group_select.png'
import convertion from '../../assets/img/convert/convertion_select.png'
import protocol from '../../assets/img/convert/protocol_select.png'
import Icon from '../../assets/img/convet_icon/index'

export default {
  state: {
    // 全局搜索列表
    search_list: [
      // {"value": "我的转换 - 分销加盟", "tab_id": 1, "item_id": 1, "item_name": "join", icon: join, icon_size: 16},
      {"value": "个人简介", "tab_id": 1, "item_id": 2, "item_name": "vip", icon: vip, icon_size: 16},
      {"value": "申请合作", "tab_id": 3, "item_id": 0, "item_name": "vip", icon: vip, icon_size: 16},
      {"value": "留言板", "tab_id": 4, "item_id": 0, "item_name": "vip", icon: vip, icon_size: 16},
      // {"value": "我的转换 - 购买记录", "tab_id": 1, "item_id": 3, "item_name": "record", icon: record, icon_size: 16},
      // {"value": "我的转换 - 多人共享", "tab_id": 1, "item_id": 4, "item_name": "group", icon: group, icon_size: 16},
      // {"value": "我的转换 - 转换记录", "tab_id": 1, "item_id": 5, "item_name": "convertion", icon: convertion, icon_size: 16},
      // {"value": "我的转换 - 用户协议", "tab_id": 1, "item_id": 6, "item_name": "protocol", icon: protocol, icon_size: 16},
      {"value": "PDF 转 Word", "tab_id": 5, "item_id": 0, "file_type": 1, icon: Icon.PDF_Word_2x},
      {"value": "PDF 转 Excel", "tab_id": 5, "item_id": 0, "file_type": 2, icon: Icon.PDF_Excel_2x},
      {"value": "PDF 转 PPT", "tab_id": 5, "item_id": 0, "file_type": 3, icon: Icon.PDF_PPT_2x},
      {"value": "PDF 转 JPG", "tab_id": 5, "item_id": 0, "file_type": 4, icon: Icon.PDF_Jpg_2x},
      {"value": "Word 转 PDF", "tab_id": 5, "item_id": 0, "file_type": 7, icon: Icon.Word_PDF_2x},
      {"value": "Excel 转 PDF", "tab_id": 5, "item_id": 0, "file_type": 8, icon: Icon.Excel_PDF_2x},
      {"value": "PPT 转 PDF", "tab_id": 5, "item_id": 0, "file_type": 9, icon: Icon.PPT_PDF_2x},
      {"value": "JPG 转 PDF", "tab_id": 5, "item_id": 0, "file_type": 5, icon: Icon.JPG_PDF_2x},
      {"value": "CAJ 转 PDF", "tab_id": 5, "item_id": 0, "file_type": 24, icon: Icon.CAJ_PDF_2x},
      {"value": "OFD 转 PDF", "tab_id": 5, "item_id": 0, "file_type": 30, icon: Icon.OFD_PDF_2x},
      {"value": "XPS 转 PDF", "tab_id": 5, "item_id": 0, "file_type": 31, icon: Icon.XPS_PDF_2x},
      {"value": "CAD 转 PDF", "tab_id": 5, "item_id": 0, "file_type": 32, icon: Icon.CAD_PDF_2x},
      {"value": "JPG 转 Word", "tab_id": 5, "item_id": 0, "file_type": 15, icon: Icon.JPG_Word_2x},
      {"value": "CAJ 转 Word", "tab_id": 5, "item_id": 0, "file_type": 10, icon: Icon.CAJ_Word_2x},
      {"value": "OFD 转 Word", "tab_id": 5, "item_id": 0, "file_type": 33, icon: Icon.OFD_Word_2x},
      {"value": "XPS 转 Word", "tab_id": 5, "item_id": 0, "file_type": 34, icon: Icon.XPS_Word_2x},
      {"value": "CAD 转 Word", "tab_id": 5, "item_id": 0, "file_type": 35, icon: Icon.CAD_Word_2x},
      {"value": "WEBP 转 JPG", "tab_id": 5, "item_id": 0, "file_type": 18, icon: Icon.WEBP_JPG_2x},
      {"value": "WEBP 转 JPEG", "tab_id": 5, "item_id": 0, "file_type": 21, icon: Icon.WEBP_JPEG_2x},
      {"value": "WEBP 转 PNG", "tab_id": 5, "item_id": 0, "file_type": 20, icon: Icon.WEBP_PNG_2x},
      {"value": "JPG 转 WEBP", "tab_id": 5, "item_id": 0, "file_type": 19, icon: Icon.JPG_WEBP_2x},
      {"value": "压缩 PDF", "tab_id": 5, "item_id": 0, "file_type": 16, icon: Icon.C_PDF_2x},
      {"value": "压缩 Image", "tab_id": 5, "item_id": 0, "file_type": 17, icon: Icon.C_Image_2x},
      {"value": "加密 PDF", "tab_id": 5, "item_id": 0, "file_type": 13, icon: Icon.P_PDF_2x},
      {"value": "解密 PDF", "tab_id": 5, "item_id": 0, "file_type": 14, icon: Icon.U_PDF_2x},
      {"value": "合并 PDF", "tab_id": 5, "item_id": 0, "file_type": 11, icon: Icon.M_PDF_2x},
      {"value": "分割 PDF", "tab_id": 5, "item_id": 0, "file_type": 12, icon: Icon.S_PDF_2x}
    ],
    signature: {}, // OSS签名
  },
  getters: {},
  mutations: {},
  actions: {
    // 设置展示VIP续费组件
    turn_to_vip({state}, data) {
      // 将当前选择的子Tab保存，动态引入子组件
      store.dispatch('update_active_tab_info', {
        id: state.search_list[0].item_id,
        component_name: state.search_list[0].item_name
      })
    },
    // 获取OSS签名
    get_oss_signature({state}) {
      return new Promise((resolve, reject) => {
        // 如果存在直接返回，否则去获取数据
        if ('AccessKeyId' in state.signature) {
          resolve(state.signature)
        } else {
          request.get(config.GET_OSS_SIGN)
            .then(res => {
              state.signature = res.data
              resolve(res.data)
            })
            .catch(err => {
              reject(err)
            })
        }
      })
    },
  }
}
