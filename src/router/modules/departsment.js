import Layout from '@/layout'
export default {
  path: '/departments',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/departsment'),
      name: 'Departments',
      meta: { title: '组织', icon: 'tree' }
    }
  ]
}
