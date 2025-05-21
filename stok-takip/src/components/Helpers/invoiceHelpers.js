import { DB } from "@/utils/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function savePastSalesInvoices(customer, invoices) {
  try {
    for (const invoice of invoices) {
      if (!customer.companyName) {
        console.warn("Geçersiz müşteri adı:", customer);
        throw new Error("Müşteri adı bulunamadı.");
      }

      const invoiceRef = doc(collection(DB, "SalesInvoices"));

      const fullInvoice = {
        companyName: customer.companyName || "Bilinmeyen",
        customerId: customer.id || "Bilinmeyen",
        createdAt: serverTimestamp(),
        date: invoice.date,
        invoiceNo: invoice.invoiceNo,
        note: invoice.note,
        products: invoice.products,
        totalAmount: invoice.totalAmount,
        totalTax: invoice.totalTax,
      };

      await setDoc(invoiceRef, fullInvoice);
      console.log(
        `${customer.companyName} faturası kaydedildi: ${invoice.invoiceNo}`
      );
    }
    console.log("Tüm faturalar başarıyla kaydedildi.");
  } catch (err) {
    console.error("Satış faturası kaydetme hatası:", err);
    throw err;
  }
}
