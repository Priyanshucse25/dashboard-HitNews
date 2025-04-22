import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/views/Dashboard.vue'
import HomeView from '@/views/HomeView.vue'
import CategoryPage from '@/views/CategoryPage.vue' // make sure this file exists

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          name: 'homeView',
          component: HomeView,
        },
        {
          path: '/category/:name',
          name: 'CategoryPage',
          component: () => import('@/views/CategoryPage.vue') // whatever the file is
        }
        
        
      ]
    }
  ]
})

export default router
