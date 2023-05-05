const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userinfo.userId,
  // 获取userinfo中的头像和名称,部门和公司
  avatar: state => state.user.userinfo.staffPhoto,
  name: state => state.user.userinfo.username,
  company: state => state.user.userinfo.company,
  departmentName: state => state.user.userinfo.departmentName,
  // 获取routes
  routes: state => state.user.routes
}
export default getters
