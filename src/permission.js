import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './router'
import store from './store'

const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  nProgress.start()// 开启进度条
  // 分两种情况，有token和没有token
  if (store.getters.token) {
    // 有token是，如果访问的是登录页，则直接跳转到首页
    // 如果有token访问的不是登录页，直接跳转到对应页面
    if (to.path === '/login') {
      // 当next里面有地址是，不会进入后置守卫，需要手动结束进度条
      next('/')
      nProgress.done()
    } else {
      next()
    }
  } else {
    // 如果没有token，访问的是白名单里面的，直接放行，否则拦截到登录页
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      nProgress.done()
    }
  }
})

router.afterEach(() => {
// 关闭进度条
  nProgress.done()
})
