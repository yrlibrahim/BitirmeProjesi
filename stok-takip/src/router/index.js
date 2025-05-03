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
import addPurchaseInvoice from "@/components/Invoices/Purchase/addPurchaseInvoice.vue";
import purchaseInvoices from "@/components/Invoices/Purchase/purchaseInvoices.vue";
import purchaseInvoiceInfo from "@/components/Invoices/Purchase/purchaseInvoiceInfo.vue";
import setPurchaseInvoice from "@/components/Invoices/Purchase/setPurchaseInvoice.vue";
import addSalesInvoice from "@/components/Invoices/Sales/addSalesInvoice.vue";
import salesInvoices from "@/components/Invoices/Sales/salesInvoices.vue";
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
      path: "/add-purchase-invoice",
      name: "addPurchaseInvoice",
      component: addPurchaseInvoice,
    },
    {
      path: "/purchase-invoices",
      name: "purchaseInvoices",
      component: purchaseInvoices,
    },
    {
      path: "/purchase-invoices/:id",
      name: "purchaseInvoiceInfo",
      component: purchaseInvoiceInfo,
    },
    {
      path: "/set-purchase-invoices/:id",
      name: "setPurchaseInvoiceInfo",
      component: setPurchaseInvoice,
    },
    {
      path: "/add-sales-invoice",
      name: "addSalesInvoice",
      component: addSalesInvoice,
    },
    {
      path: "/sales-invoices",
      name: "salesInvoices",
      component: salesInvoices,
    },
    {
      path: "/sales-invoices/:id",
      name: "salesInvoiceInfo",
      component: () =>
        import("@/components/Invoices/Sales/salesInvoiceInfo.vue"),
    },
    {
      path: "/set-sales-invoice/:id",
      name: "setSalesInvoice",
      component: () =>
        import("@/components/Invoices/Sales/setSalesInvoice.vue"),
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
