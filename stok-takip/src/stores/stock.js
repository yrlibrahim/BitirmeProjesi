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
} from "firebase/firestore";
import { useUserStore } from "./user";

let stockCol = collection(DB, "Stock");

export const useStockData = defineStore("stock", {
  state: () => ({
    homeStock: "",
    adminStock: "",
    adminLastVisible: "",
  }),
  actions: {
    async getStockData(formData) {
      const userStore = useUserStore();
      const user = userStore.getUserData;
      const newStock = doc(stockCol);
      await setDoc(newStock, {
        timestamp: serverTimestamp(),
        owner: {
          uid: user.uid,
          name: user.firstname,
          lastname: user.lastname,
        },
        ...formData,
      });
      router.push({ name: "product" });
    },
    async adminGetStock(docLimit) {
      const q = query(stockCol, orderBy("timestamp", "desc"), limit(docLimit));
      const querySnapshot = await getDocs(q);
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const stocks = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      this.adminStock = stocks;
      this.adminLastVisible = lastVisible;
    },
  },
});
