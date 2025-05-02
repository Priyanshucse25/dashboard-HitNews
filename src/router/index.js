import { createRouter, createWebHistory } from "vue-router";

import Dashboard from "@/Layout/Dashboard.vue";
import HomeView from "@/views/HomeView.vue";
import Signup from "@/views/Signup.vue";
import Login from "@/views/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      component: Login,
    },
    {
      path: "/signup",
      name: "SignUp",
      component: Signup,
    },
    {
      path: "/",
      name: "dashboard",
      component: Dashboard,
      children: [
        {
          path: "",
          name: "homeView",
          component: HomeView,
        },
        {
          path: "category/:name",
          name: "CategoryPage",
          component: () => import("@/views/CategoryPage.vue"),
        },
      ],
      meta: { requiresAuth: true }, // Protected route
    },
  ],
});

// ✅ Global navigation guard using correct token key
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("token");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
