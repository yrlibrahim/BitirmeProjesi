import { defineStore } from "pinia";
import { ref, computed } from "vue";
import router from "@/router";
import { DB } from "@/utils/firebase";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  startAfter,
  Timestamp,
} from "firebase/firestore";
import { useUserStore } from "./user";

let customerCol = collection(DB, "Customer");

export const useCustomerData = defineStore("customer", {
  state: () => ({}),
  actions: {
    async getCustomerData(formData) {
      const userStore = useUserStore();
      const user = userStore.getUserData;
      const newCustomer = doc(customerCol);
      await setDoc(newCustomer, {
        timestamp: serverTimestamp(),
        owner: {
          uid: user.uid,
          name: user.firstname,
          lastname: user.lastname,
        },
        ...formData,
      });
      router.push({ name: "customer" });
    },
  },
});
