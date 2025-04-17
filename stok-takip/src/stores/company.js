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
  deleteDoc,
  Timestamp,
} from "firebase/firestore";

let companysCol = collection(DB, "Companys");
export const useCompanyStore = defineStore("companys", {
  state: () => ({
    companys: [],
  }),
  getters: {},
  actions: {
    async addCompany(companyData) {
      const newCompany = doc(companysCol);
      await setDoc(newCompany, {
        timestamp: serverTimestamp(),
        ...companyData,
      });
      router.push({ name: "companys" });
    },
    async fetchCompanies() {
      const snapshot = await getDocs(collection(DB, "Companys"));
      this.companyList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    async removeByID(id) {
      await deleteDoc(doc(DB, "Companys", id));
      await this.fetchCompanies();
    },
  },
});
