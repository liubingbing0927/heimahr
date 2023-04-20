const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userinfo.userId,
  // 获取userinfo中的头像和名称
  avatar: state => state.user.userinfo.staffPhoto,
  name: state => state.user.userinfo.username
}
export default getters
