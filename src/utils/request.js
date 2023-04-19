import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
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
    Message.error(message)
    return Promise.error(new Error(message))
  }
}, error => {
  Message.error(error.message)
  return Promise.reject(error)
})
