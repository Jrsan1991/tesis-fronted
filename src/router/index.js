import { createRouter, createWebHistory } from "vue-router";

import { useSessionStore } from "@/stores/session";

import LoginView from "@/views/LoginView.vue";

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
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../views/UserView.vue"),
    },
  ],
});

router.beforeEach((to) => {
  const session = useSessionStore();
  if (to.fullPath !== "/login" && session.accessToken === "") return "/login";
});

export default router;
