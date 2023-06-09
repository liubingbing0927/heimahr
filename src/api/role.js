import request from '@/utils/request'

// 获取角色列表
export function getroleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}

// 新增角色
export function addrole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}

// 修改角色
export function changerole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}

// 删除角色
export function delrole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

// 获取角色详情
export function getroleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}

// 分配角色权限
export function assignrolepermission(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
