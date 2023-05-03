import request from '@/utils/request'

export function getpermissonData() {
  return request({
    url: '/sys/permission'
  })
}

// 新增权限
export function addpermission(data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

// 更新权限
export function updatepermission(data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

// 获取权限详情
export function getpermissiondetail(id) {
  return request({
    url: `/sys/permission/${id}`
  })
}

// 删除权限
export function removepermission(id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}
