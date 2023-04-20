import { setToken, getToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
const state = {
  token: getToken()
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
  }
}

const actions = {
  async login(cxt, value) {
    // 获取请求后得到token，将得到的token存起来
    // 发送login请求
    const res = await login(value)
    console.log(res)
    cxt.commit('setuserToken', res)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
