import layout from '@/layout'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  },
  {
    path: '/employee/detail/:id?',
    component: () => import('@/views/employee/employee-detail.vue'),
    // hidden表示在左侧菜单栏中不显示
    hidden: true,
    meta: {
      title: '员工详情'
    }
  }]
}
