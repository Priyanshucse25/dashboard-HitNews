import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '@/Layout/Dashboard.vue'
import HomeView from '@/views/HomeView.vue'
// import LogSign from '@/Layout/LogSign.vue'
import Signup from '@/views/Signup.vue'
import Login from '@/views/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login // Default redirect to login
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: Signup
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      children: [
        {
          path: '',
          name: 'homeView',
          component: HomeView
        },
        {
          path: 'category/:name',
          name: 'CategoryPage',
          component: () => import('@/views/CategoryPage.vue')
        }
      ]
    }
  ]
})

export default router
