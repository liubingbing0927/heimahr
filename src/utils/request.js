import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import router from '@/router'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

request.interceptors.request.use(config => {
  // 在请求时，请求头携带token
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

request.interceptors.response.use(response => {
  // 先结构出data里面的属性
  const { data, success, message } = response.data
  // 如果success为true时，则代表请求成功，否则则失败

  if (success) {
    return data
  } else {
    Message({ type: 'error', message })
    return Promise.reject(new Error(message))
  }
}, async(error) => {
  if (error.response.status === 401) {
    // 向actions提交清除token和用户资料的申请
    await store.dispatch('user/logout')
    // 然后跳转到登录页
    router.push('/login')
    // 最后打出错误退出
    Message({ type: 'error', message: 'token过期,请重新登录' })
    return Promise.reject(error)
  }
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})

export default request
