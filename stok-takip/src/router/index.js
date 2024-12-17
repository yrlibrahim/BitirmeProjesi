import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import SignIn from "@/components/user/SignIn.vue";
import Products from "@/components/Products/ProductsLists/Products.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/signin",
      name: "Signin",
      component: SignIn,
    },
    {
      path: "/products",
      name: "Products",
      component: Products,
    },
  ],
});

export default router;
