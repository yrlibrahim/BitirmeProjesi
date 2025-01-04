import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import SignIn from "@/components/user/SignIn.vue";
import Products from "@/components/Products/ProductsLists/Products.vue";
import createNewProduct from "@/components/Products/ProductsLists/create-new-product.vue";
import customer from "@/components/Customers/customer.vue";
import customerDetail from "@/components/Customers/customer-detail.vue";

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
    {
      path: "/create-new-product",
      name: "createNewProduct",
      component: createNewProduct,
    },
    {
      path: "/customer",
      name: "customer",
      component: customer,
    },
    {
      path: "/customer/:id",
      name: "customerDetail",
      component: customerDetail,
      props: true,
    },
  ],
});

export default router;
