// stores/dashboard.js
import { defineStore } from "pinia";
import { getDocs, collection } from "firebase/firestore";
import { DB } from "@/utils/firebase";
import { useStockData } from "@/stores/stock";
import { getTopSellingProducts } from "@/stores/salesInvoice";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    stats: null,
    lowStock: [],
    topSelling: [],
    fetched: false,
  }),
  actions: {
    async fetchDashboardData() {
      if (this.fetched) return;

      const customers = await getDocs(collection(DB, "Customers"));
      const companys = await getDocs(collection(DB, "Companys"));

      this.stats = {
        totalCustomers: customers.size,
        totalCompanies: companys.size,
      };

      const stockStore = useStockData();
      this.lowStock = await stockStore.getLowStockProducts(5);
      this.topSelling = await getTopSellingProducts(5);

      this.fetched = true;
    },
  },
});
