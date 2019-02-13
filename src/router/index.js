import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let needAuth = false

const router = new Router({
  mode:'history',
  routes: [
    // 授权
    {
      path: '/',
      name: 'ground',
      component: () => import('@/components/ground/ground'),
      meta: {
        auth: needAuth,
        title: '看看视频红包'
      }
    },
    // 首页
    {
      path: '/index',
      name: 'index',
      component: () => import('@/components/index/index'),
      meta: {
        auth: needAuth,
        title: '看看视频红包'
      }
    },
    // 领取详情页
    {
      path: '/indexList',
      name: 'indexList',
      component: () => import('@/components/indexList/indexList'),
      meta: {
        auth: needAuth,
        title: '看看视频红包'
      }
    },
    // 落地下载页面
    {
      path: '/LdDown',
      name: 'LdDown',
      component: () => import('@/components/LandingDown/LandingDown'),
      meta: {
        auth: needAuth,
        title: '看看视频'
      }
    },
    // APP需要的视频插件
    {
      path: '/AppMovie',
      name: 'AppMovie',
      component: () => import('@/components/movieVideo/movie'),
      meta: {
        auth: needAuth,
        title: '下载落地页'
      }
    },
  ]
})

router.afterEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
})

export default router
