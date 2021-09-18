const Main = () => import("../components/Main/Index")

const Index = () => import("../pages/Index")
const Convert = () => import("../pages/Convert")
const Setting = () => import("../pages/Setting")
const Login = () => import("../pages/Login")

/**
 * @description 路由表
 * @meta {
 *    hideMenu: 在页面隐藏菜单不做渲染
 *    title: Title名称
 *    icon: 图标
 *    active: 选中的颜色
 *    keep-alive: 是否缓存页面
 * }
 */

export default [
  {
    path: '/',
    redirect: {
      path: '/index_',
    },
    meta: {
      hideMenu: true
    }
  },
  {
    path: '/index_',
    redirect: {
      path: '/index',
    },
    component: Main,
    children: [
      {
        path: '/index',
        name: 'index',
        component: Index,
        meta: {
          title: '首页',
          active: '#4F32A3',
        }
      }
    ]
  },
  {
    path: '/convert_',
    redirect: {
      path: '/convert',
    },
    component: Main,
    children: [

      {
        path: '/convert',
        name: 'convert',
        component: Convert,
        meta: {
          title: '转换',
          active: '#FF6059',
        }
      }
    ]
  },
  {
    path: '/setting_',
    redirect: {
      path: '/setting',
    },
    meta: {
      hideMenu: true
    },
    component: Main,
    children: [
      {
        path: '/setting',
        name: 'setting',
        component: Setting,
        meta: {
          title: '设置'
        }
      }
    ]
  },
  {
    path: '/Login',
    meta: {
      hideMenu: true,
      title: '登录'
    },
    component: Login
  }
]
