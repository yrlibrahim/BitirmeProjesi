import { defineStore } from "pinia";
import { ref, computed } from "vue";
import router from "@/router";
import { db, DB } from "@/utils/firebase";
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
  deleteDoc,
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
      router.push({ name: "product", query: { reload: true } });
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
    async removeByID(itemID) {
      await deleteDoc(doc(DB, "Stock", itemID));
      const newList = this.adminStock.filter((stock) => {
        return stock.id != itemID;
      });
      this.adminStock = newList;
    },
    async getLowStockProducts(limitCount = 5) {
      const q = query(
        stockCol,
        orderBy("count", "asc"), // en az olandan başla
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((doc) => doc.count < doc.minCount); // filtreyi ayrıca koy
    },
  },
});
