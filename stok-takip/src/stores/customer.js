import { defineStore } from "pinia";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { DB } from "@/utils/firebase";
import router from "@/router";

let customersCol = collection(DB, "Customers");

export const useCustomerStore = defineStore("customers", {
  state: () => ({
    customerList: [],
  }),
  actions: {
    async addCustomer(customerData) {
      const newCustomer = doc(customersCol);
      await setDoc(newCustomer, {
        timestamp: serverTimestamp(),
        ...customerData,
      });
      router.push({ name: "customers" }); // liste sayfasına yönlendirme
    },

    async fetchCustomers() {
      const snapshot = await getDocs(customersCol);
      this.customerList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },

    async removeByID(id) {
      await deleteDoc(doc(DB, "Customers", id));
      await this.fetchCustomers();
    },
  },
});
