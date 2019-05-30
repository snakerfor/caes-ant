import { axios } from '@/utils/request'
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  BlankLayout: BlankLayout,
  RouteView: RouteView,
  PageView: PageView,

  // 你需要动态引入的页面组件
  analysis: () => import('@/views/dashboard/Analysis'),
  workplace: () => import('@/views/dashboard/Workplace'),
  monitor: () => import('@/views/dashboard/Monitor'),
  baseForm: () => import('@/views/form/BasicForm'),
  stepForm: () => import('@/views/form/stepForm/StepForm'),
  advancedForm: () => import('@/views/form/advancedForm/AdvancedForm.vue'),
  tableList: () => import('@/views/list/TableList'),
  standardList: () => import('@/views/list/StandardList'),
  cardList: () => import('@/views/list/CardList'),
  profileBasic: () => import('@/views/profile/basic/Index'),
  profileAdvanced: () => import('@/views/profile/advanced/Advanced'),
  resultSucc: () => import('@/views/result/Success'),
  resultErr: () => import('@/views/result/Error'),
  userList: () => import('@/views/other/UserList'),
  roleList: () => import('@/views/other/RoleList'),
  permissionList: () => import('@/views/other/PermissionList'),
  deptList: () => import('@/views/other/DeptList')
  // ...more
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

/**
 * 获取后端路由信息的 axios API
 * @returns {Promise}
 */
export const getRouterByUser = () => {
  return axios({
    url: '/system/menu/user',
    method: 'get',
    dataType: 'json'
    /* headers: {
      'Access-Token': 'xxx'
    }
    */
  })
}

/**
 * 获取路由菜单信息
 *
 * 1. 调用 getRouterByUser() 访问后端接口获得路由结构数组
 *    @see https://github.com/sendya/ant-design-pro-vue/blob/feature/dynamic-menu/public/dynamic-menu.json
 * 2. 调用
 * @returns {Promise<any>}
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    // ajax
    getRouterByUser().then(res => {
      const result = buildmenu(res)
      const routers = generator(result)
      routers.push(notFoundRouter)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化 后端 结构信息并递归生成层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const currentRouter = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${parent && parent.path || ''}/${item.key}`,
      // 路由名称，建议唯一
      name: item.name || item.key || '',
      // 该路由对应页面的 组件
      component: constantRouterComponents[item.component || item.key],
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: { title: item.title, icon: item.icon || undefined, permission: item.key && [ item.key ] || null }
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/')
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

export function buildmenu (rows) {
  const menus = [
    {
      'title': '首页',
      'key': '',
      'name': 'index',
      'component': 'BasicLayout',
      'redirect': '/dashboard/workplace',
      'children': [
        {
          'title': '仪表盘',
          'key': 'dashboard',
          'component': 'RouteView',
          'icon': 'dashboard',
          'children': [{
            'title': '分析页',
            'key': 'analysis',
            'icon': ''
          },
          {
            'title': '监控页',
            'key': 'monitor',
            'icon': ''
          },
          {
            'title': '工作台',
            'key': 'workplace',
            'icon': ''
          }
          ]
        },
        {
          'title': '表单页',
          'key': 'form',
          'component': 'PageView',
          'icon': 'form',
          'children': [{
            'title': '基础表单',
            'key': 'baseForm',
            'icon': ''
          },
          {
            'title': '分步表单',
            'key': 'stepForm',
            'icon': ''
          },
          {
            'title': '高级表单',
            'key': 'advancedForm',
            'icon': ''
          }
          ]
        },
        {
          'title': '列表页',
          'key': 'list',
          'component': 'PageView',
          'icon': 'table',
          'children': [{
            'title': '查询表格',
            'key': 'tableList',
            'icon': ''
          },
          {
            'title': '标准列表',
            'key': 'standardList',
            'icon': ''
          },
          {
            'title': '卡片列表',
            'key': 'cardList',
            'icon': ''
          }
          ]
        },
        {
          'title': '详情页',
          'key': 'profile',
          'component': 'PageView',
          'icon': 'profile',
          'children': [{
            'title': '基础详情页',
            'key': 'profileBasic',
            'icon': ''
          },
          {
            'title': '高级详情页',
            'key': 'profileAdvanced',
            'icon': ''
          }
          ]
        },
        {
          'title': '结果页',
          'key': 'result',
          'component': 'PageView',
          'icon': 'check-circle-o',
          'children': [{
            'title': '成功',
            'key': 'resultSucc',
            'icon': ''
          },
          {
            'title': '失败',
            'key': 'resultErr',
            'icon': ''
          }
          ]
        }]
    }
  ]
  const arr = []
  buildtree(rows, arr, 0)
  arr.forEach(row => {
    menus[0].children.push(row)
  })
  return menus
}
export function buildtree (list, arr, parentId) {
  list.forEach(item => {
    if (item.parentId === parentId) {
      var child = {
        title: item.menuName,
        key: item.menuKey,
        icon: item.icon,
        component: 'PageView',
        children: []
      }
      buildtree(list, child.children, item.menuId)
      if (child.children.length === 0) {
        delete child.children
        delete child.component
      }
      arr.push(child)
    }
  })
}