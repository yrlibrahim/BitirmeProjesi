// src/stores/uploadCompanyInvoices.js
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { DB } from "@/utils/firebase";

export async function uploadCompanyInvoices(companyId, invoices) {
  const companySnap = await getDoc(doc(DB, "Companys", companyId));
  const companyName = companySnap.exists()
    ? companySnap.data().companyName
    : "-";

  const collectionRef = collection(DB, "PurchaseInvoices");

  for (const item of invoices) {
    const price = item.amount;
    const total = price;

    const payload = {
      companyId,
      companyName,
      date: item.date,
      invoiceNumber: item.invoiceNumber,
      note: item.note,
      products: [
        {
          name: "Geçmiş Fatura",
          quantity: 1,
          price,
          total,
          brand: "-",
          model: "-",
          category: "-",
          subCategory: "-",
          sku: "EFSK",
          tax: 0,
          discount: 0,
        },
      ],
      totalAmount: total,
      totalTax: 0,
      createdAt: serverTimestamp(),
    };

    await addDoc(collectionRef, payload);
    console.log(
      `✅ Fatura eklendi → ${payload.invoiceNumber} (${payload.totalAmount} ₺)`
    );
  }
}
