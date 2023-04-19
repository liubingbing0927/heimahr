import { setToken, getToken, removeToken } from '@/utils/auth'

const state = {
  token: getToken() || ''
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
  login(cxt, value) {
    // 获取请求后得到token，将得到的token存起来
    console.log(value)
    cxt.commit('setuserToken', 1234)
  }
}

export default {
  state,
  mutations,
  actions
}
