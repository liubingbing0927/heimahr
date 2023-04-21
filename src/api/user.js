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

// 修改密码
export function changepassword(data) {
  return request({
    url: '/sys/user/updatepass',
    method: 'put',
    data
  })
}
