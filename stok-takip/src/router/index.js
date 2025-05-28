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
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/",
      redirect: "/signin",
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
    {
      path: "/add-customer-payment",
      name: "addCustomerPayment",
      component: () =>
        import("@/components/Payments/CustomerPayments/addCustomerPayment.vue"),
    },
    {
      path: "/customer-payments",
      name: "customerPayments",
      component: () =>
        import("@/components/Payments/CustomerPayments/customerPayments.vue"),
    },
    {
      path: "/customer-accounts/:id",
      name: "customerAccountDetail",
      component: () =>
        import("@/components/AccountBalance/customerAccountDetail.vue"),
    },

    {
      path: "/customer-accounts",
      name: "customerAccounts",
      component: () =>
        import("@/components/AccountBalance/customerAccounts.vue"),
    },
    {
      path: "/company-accounts",
      name: "companyAccounts",
      component: () =>
        import("@/components/AccountBalance/companyAccounts.vue"),
    },
    {
      path: "/company-accounts/:id",
      name: "companyAccountDetail",
      component: () =>
        import("@/components/AccountBalance/companyAccountDetail.vue"),
    },
    {
      path: "/add-company-payment",
      name: "addCompanyPayment",
      component: () =>
        import("@/components/Payments/CompanyPayments/addCompanyPayment.vue"),
    },
    {
      path: "/company-payments",
      name: "companyPayments",
      component: () =>
        import("@/components/Payments/CompanyPayments/companyPayments.vue"),
    },
    {
      path: "/low-stock",
      name: "lowStock",
      component: () => import("@/components/Products/Stocks/lowStock.vue"),
    },
    {
      path: "/invoice-add",
      name: "invoiceAdd",
      component: () => import("@/components/user/invoiceAdd.vue"),
    },
    {
      path: "/payment-add",
      name: "paymentAdd",
      component: () => import("@/components/user/uploadPayment.vue"),
    },
    {
      path: "/companys-add",
      name: "companysAdd",
      component: () => import("@/components/user/UploadCompanies.vue"),
    },
    {
      path: "/customers-add",
      name: "customersAdd",
      component: () => import("@/components/user/UploadCustomers.vue"),
    },
    {
      path: "/upload-company-invoices",
      name: "uploadCompanyInvoices",
      component: () => import("@/components/user/uploadCompanyInvoices.vue"),
    },
    {
      path: "/upload-company-payments",
      name: "uploadCompanyPayments",
      component: () => import("@/components/user/uploadCompanyPayments.vue"),
    },
    {
      path: "/bulk-upload-page",
      name: "bulkUploadPage",
      component: () => import("@/components/user/BulkUploadPage.vue"),
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
