import Layout from '@/layout'
export default {
  path: '/departments',
  name: 'department',
  component: Layout,
  children: [
    {
      path: '',
      component: () => import('@/views/departsment'),
      name: 'departments',
      meta: { title: '组织', icon: 'tree' }
    }
  ]
}
