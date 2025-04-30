import { defineStore } from "pinia";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { DB } from "@/utils/firebase";

const invoiceCol = collection(DB, "Invoices");
const stockCol = collection(DB, "Stock");

export const useInvoiceStore = defineStore("invoices", {
  state: () => ({
    invoiceList: [],
  }),

  actions: {
    // ✅ Tüm faturaları çek
    async fetchInvoices() {
      const q = query(invoiceCol, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      this.invoiceList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },

    // ✅ Fatura sil
    async removeInvoice(id) {
      await deleteDoc(doc(DB, "Invoices", id));
      this.invoiceList = this.invoiceList.filter((f) => f.id !== id);
    },

    // ✅ Belirli SKU'ya sahip ürünü getir (stok kodu ile)
    async getProductBySku(sku) {
      const q = query(stockCol, where("sku", "==", sku));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        return {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        };
      }
      return null;
    },

    // ✅ Fatura ekle ve stokları güncelle
    async addInvoiceWithStock(form) {
      const productList = form.products || [];

      // 🔁 Stok güncelleme
      for (const item of productList) {
        const q = query(stockCol, where("sku", "==", item.sku));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const stockDoc = snapshot.docs[0];
          const stockRef = doc(DB, "Stock", stockDoc.id);
          const stockData = stockDoc.data();
          const currentCount = stockData.count || 0;

          let newCount =
            form.type === "giden"
              ? currentCount - item.quantity
              : currentCount + item.quantity;

          await updateDoc(stockRef, { count: newCount });
        } else {
          console.warn(`Stok bulunamadı: ${item.sku}`);
        }
      }

      // 🧾 Fatura verisi oluştur
      const invoiceData = {
        type: form.type,
        clientId: form.clientId,
        notes: form.notes || "",
        products: form.products || [],
        totalAmount: form.totalAmount,
        taxAmount: form.taxAmount,
        netAmount: form.netAmount,
        createdAt: serverTimestamp(),
      };

      await addDoc(invoiceCol, invoiceData);
    },
  },
});
