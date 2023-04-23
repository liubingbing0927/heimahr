import request from '@/utils/request'
// 获取员工详情
export function departmentDetail() {
  return request({
    url: '/company/department'
  })
}

// 获取员工负责人信息
export function managerDetail() {
  return request({
    url: '/sys/user/simple'
  })
}

// 获取新增数据
export function updateData(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 获取部门详情
export function getdepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 修改部门信息
export function updatedepartment(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data

  })
}

// 删除数据
export function deldepartment(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
