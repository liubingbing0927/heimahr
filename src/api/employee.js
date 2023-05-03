import request from '@/utils/request'

// 获取员工列表
export function getemployeedata(params) {
  return request({
    url: '/sys/user',
    params
  })
}

// 导出excel
export function exportexcel() {
  return request({
    url: '/sys/user/export',
    // 导出为二进制数据流
    responseType: 'blob'
  })
}

// 导入excel模板
export function importexcel() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob'
  })
}

// 导入员工，上传excel
export function uploadexcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data // file类型
  })
}

// 删除员工数据
export function delemployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

// 新增员工
export function addemployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

// 获取员工详情
export function getemployeedetail(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

// 修改员工数据
export function changemployee(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

// 获取已启用的角色列表
export function getenableRole() {
  return request({
    url: '/sys/role/list/enabled'
  })
}

// 分配员工角色 /sys/user/assignRoles
export function assignrole(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}
