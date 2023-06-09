import { setToken, getToken, removeToken } from '@/utils/auth'
import { login, userDetail } from '@/api/user'
import { constantRoutes } from '@/router'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userinfo: {},
  routes: constantRoutes
}

const mutations = {
  // payload就是获得的token
  setuserToken(state, payload) {
    state.token = payload
    // 存入本地
    setToken(payload)
  },

  removeuserToken(state) {
    state.token = ''
    removeToken()
  },
  setuserinfo(state, payload) {
    state.userinfo = payload
  },
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}

const actions = {
  async login(cxt, value) {
    // 获取请求后得到token，将得到的token存起来
    // 发送login请求
    const res = await login(value)
    console.log(res)
    cxt.commit('setuserToken', res)
  },
  // 调用接口请求
  async getDetail(cxt) {
    // res就是成功后得到的基本资料
    const res = await userDetail()
    // console.log(res)
    cxt.commit('setuserinfo', res)
    return res
  },
  logout(cxt) {
    cxt.commit('removeuserToken')
    // 将用户资料变为空
    cxt.commit('setuserinfo', {})
    // 退出登录时清空路由权限
    resetRouter()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
