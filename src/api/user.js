import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

// 获取用户的基本资料
export function userDetail() {
  return request({
    url: '/sys/profile'
  })
}
