import { createRouter, createWebHistory } from "vue-router";
import Home from "@/components/Home.vue";
import SignIn from "@/components/user/SignIn.vue";
import product from "@/components/Products/ProductsLists/product.vue";
import createNewProduct from "@/components/Products/ProductsLists/create-new-product.vue";
import setProduct from "@/components/Products/ProductsLists/setProduct.vue";
import productInfo from "@/components/Products/ProductsLists/productInfo.vue";
import addCompany from "@/components/Companys/addCompany.vue";
import companys from "@/components/Companys/companys.vue";
import companyInfo from "@/components/Companys/companyInfo.vue";
import setCompany from "@/components/Companys/setCompany.vue";
import customers from "@/components/Customers/customers.vue";
import addCustomer from "@/components/Customers/addCustomer.vue";
import customerInfo from "@/components/Customers/customerInfo.vue";
import setCustomer from "@/components/Customers/setCustomer.vue";
import addInvoice from "@/components/Invoices/addInvoice.vue";
import { useUserStore } from "@/stores/user";
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
      path: "/product",
      name: "product",
      component: product,
    },
    {
      path: "/create-new-product",
      name: "createNewProduct",
      component: createNewProduct,
    },
    {
      path: "/set-product/:id",
      name: "setProduct",
      component: setProduct,
    },
    {
      path: "/product-info/:id",
      name: "productInfo",
      component: productInfo,
    },
    {
      path: "/addCompany",
      name: "addCompany",
      component: addCompany,
    },
    {
      path: "/companys",
      name: "companys",
      component: companys,
    },
    {
      path: "/setCompany/:id",
      name: "setCompany",
      component: setCompany,
    },
    {
      path: "/companyInfo/:id",
      name: "companyInfo",
      component: companyInfo,
    },
    {
      path: "/customers",
      name: "customers",
      component: customers,
    },
    {
      path: "/addCustomer",
      name: "addCustomer",
      component: addCustomer,
    },
    {
      path: "/setCustomer/:id",
      name: "setCustomer",
      component: setCustomer,
    },
    {
      path: "/customerInfo/:id",
      name: "customerInfo",
      component: customerInfo,
    },
    {
      path: "/addInvoice",
      name: "addInvoice",
      component: addInvoice,
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
