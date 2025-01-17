import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import SignIn from "@/components/user/SignIn.vue";
import product from "@/components/Products/ProductsLists/product.vue";
import createNewProduct from "@/components/Products/ProductsLists/create-new-product.vue";
import customer from "@/components/Customers/customer.vue";
import customerDetail from "@/components/Customers/customer-detail.vue";
import { useUserStore } from "@/stores/user";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: { requiresHeader: true },
    },
    {
      path: "/signin",
      name: "Signin",
      component: SignIn,
      meta: { requiresHeader: false },
    },
    {
      path: "/product",
      name: "product",
      component: product,
      meta: { requiresHeader: true },
    },
    {
      path: "/create-new-product",
      name: "createNewProduct",
      component: createNewProduct,
      meta: { requiresHeader: true },
    },
    {
      path: "/customer",
      name: "customer",
      component: customer,
      meta: { requiresHeader: true },
    },
    {
      path: "/customer/:id",
      name: "customerDetail",
      component: customerDetail,
      props: true,
      meta: { requiresHeader: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.meta.requiresAuth && !userStore.isLogin) {
    next({ name: "Signin" });
  } else {
    next();
  }
});

export default router;
