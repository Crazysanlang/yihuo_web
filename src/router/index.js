import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Layout from '@/layout'
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '欢迎页', icon: 'sjtj' },
      hidden: true
    }]
  },
  {
    path: '/order',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Order',
      component: () => import('@/views/order/index'),
      meta: { title: 'NFT', icon: 'ddgl' }
    }]
  },
  {
    path: '/nftList',
    component: Layout,
    children: [{
      path: 'index',
      name: 'nftList',
      component: () => import('@/views/order/nftList'),
      meta: { title: 'NFT提现列表', icon: 'ddgl' }
    }]
  },
  {
    path: '/payBill',
    component: Layout,
    children: [{
      path: 'index',
      name: 'payBill',
      component: () => import('@/views/payBill/index'),
      meta: { title: '提现列表', icon: 'example' }
    }]
  },
  {
    path: '/userList',
    component: Layout,
    children: [{
      path: 'index',
      name: 'userList',
      component: () => import('@/views/user/userList'),
      meta: { title: '用户列表', icon: 'hylb' }
    }]
  },
  {
    path: '/shop',
    component: Layout,
    children: [{
      path: 'index',
      name: 'shop',
      component: () => import('@/views/shop/index'),
      meta: { title: '商城列表', icon: 'ddgl' }
    }]
  },
  {
    path: '/orderList',
    component: Layout,
    children: [{
      path: 'index',
      name: 'orderList',
      component: () => import('@/views/orderList/index'),
      meta: { title: '订单列表', icon: 'ddgl' }
    }]
  },
  {
    path: '/subscription',
    component: Layout,
    children: [{
      path: 'index',
      name: 'subscription',
      component: () => import('@/views/subscription/index'),
      meta: { title: '认购列表', icon: 'ddgl' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
