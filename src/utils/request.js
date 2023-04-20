import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
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
  Message({ type: 'error', message: error.message })
  return Promise.reject(error)
})

export default request
