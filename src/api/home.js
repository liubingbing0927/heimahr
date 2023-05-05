import request from '@/utils/request'

// 首页展示接口
export function displaydata() {
  return request({
    url: '/home/data'
  })
}

// 获取首页消息通知
export function getmessagedata() {
  return request({
    url: '/home/notice'
  })
}
