import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'HomeLayout',
      component: () => import('@/layouts/home/index.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/home/index.vue'),
          meta: { title: '欢迎来到乐高 lego' },
        },
      ],
    },
    {
      path: '/editor/:id',
      name: 'editor',
      component: () => import('@/views/editor/index.vue'),
      meta: { requiredLogin: true, title: '编辑我的设计' },
    },
  ],
})

router.beforeEach(async (to, _from) => {
  const { title } = to.meta
  if (title) {
    document.title = title as string
  }
})

export default router
