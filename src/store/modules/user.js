import { setToken, getToken, removeToken } from '@/utils/auth'
import { login, userDetail } from '@/api/user'
const state = {
  token: getToken(),
  userinfo: {}
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
    console.log(state.userinfo)
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
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
