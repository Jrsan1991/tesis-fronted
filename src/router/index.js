import { createRouter, createWebHistory } from "vue-router";

import { useSessionStore } from "@/stores/session";

import LoginView from "@/views/LoginView.vue";
import Layout from "@/components/Layout.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/",
      name: "Layout",
      component: Layout,
      children: [
        {
          path: "",
          name: "Home",
          component: () => import("@/views/HomeView.vue"),
        },
        {
          path: "users",
          name: "Users",
          component: () => import("@/views/User/UserView.vue"),
        },
        {
          path: "products",
          name: "Productos",
          component: () => import("@/views/Product/ProductView.vue"),
        },
        {
          path: "categories",
          name: "Categorias",
          component: () => import("@/views/Category/CategoryView.vue"),
        },
        {
          path: "assignments",
          name: "Asignaciones",
          component: () => import("@/views/Assignment/AssignmentView.vue"),
        },
        {
          path: "profile",
          name: "Profile",
          component: () => import("@/views/ProfileView.vue"),
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const session = useSessionStore();
  if (to.fullPath !== "/login" && session.token === "") return "/login";
});

export default router;
