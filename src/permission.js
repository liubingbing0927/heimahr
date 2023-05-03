import nProgress from 'nprogress'
import 'nprogress/nprogress.css'
import router from './router'
import store from './store'
import { asyncRoutes } from './router'

const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
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
      // 当获取不到数据时，就去获取，否则不用重新获取
      if (!store.getters.userId) {
        // 需要异步执行，当获取资料成功后在跳转
        const { roles: { menus }} = await store.dispatch('user/getDetail')
        // console.log(menus)
        const filterRoutes = asyncRoutes.filter(item => {
          return menus.includes(item.name)
        })
        // 提交mutation，修改routes
        store.commit('user/setRoutes', filterRoutes)
        // console.log(filterRoutes)
        // 需要把*匹配，放在路由的最后面
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])

        // 重新进入路径，否则刷新以后是空白
        next(to.path)
      } else {
        next()
      }
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
