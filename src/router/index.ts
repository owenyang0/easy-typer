import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: '赛文跟打 - 木易跟打器'
    },
    component: Home
  },
  {
    path: '/practice',
    name: 'Practice',
    meta: {
      title: '词库练习 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "practice" */ '../views/Practice.vue')
  },
  {
    path: '/kata',
    name: 'Kata',
    meta: {
      title: '发文 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "kata" */ '../views/Kata.vue')
  },
  {
    path: '/reading',
    name: 'Reading',
    meta: {
      title: '阅读 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "kata" */ '../views/Reading.vue')
  },
  {
    path: '/setting',
    name: 'Setting',
    meta: {
      title: '设置 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "setting" */ '../views/Setting.vue')
  },
  {
    path: '/summary',
    name: 'Summary',
    meta: {
      title: '键盘统计 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "summary" */'../views/Summary.vue')
  },
  {
    path: '/changelog',
    name: 'Changelog',
    meta: {
      title: '变更历史 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "changelog" */'../views/Changelog.vue')
  },
  {
    path: '/help',
    name: 'Help',
    meta: {
      title: '使用帮助 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "help" */ '../views/Help.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      title: '关于 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/history',
    name: 'History',
    meta: {
      title: '跟打记录 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/History.vue')
  },
  {
    path: '/buy-me-a-coffee',
    name: 'Donate',
    meta: {
      title: '捐赠 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Donate.vue')
  },
  {
    path: '/download',
    name: 'Download',
    meta: {
      title: '程序下载 - 木易跟打器'
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Download.vue')
  },
  {
    path: '*',
    redirect: '/'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title)

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags)

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    document.title = nearestWithTitle.meta.title
  } else if (previousNearestWithMeta) {
    document.title = previousNearestWithMeta.meta.title
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el!.parentNode!.removeChild(el))

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next()

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map((tagDef: Record<string, any>) => {
    const tag = document.createElement('meta')

    Object.keys(tagDef).forEach(key => {
      tag.setAttribute(key, tagDef[key])
    })

    // We use this to track which meta tags we create so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '')

    return tag
  }).forEach((tag: HTMLElement) => document.head.appendChild(tag))

  next()
})

export default router
