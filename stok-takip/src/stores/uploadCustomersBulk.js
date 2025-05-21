import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { DB } from "@/utils/firebase";

export async function uploadCustomersBulk(customerList) {
  const customersRef = collection(DB, "Customers");

  for (const customer of customerList) {
    try {
      await addDoc(customersRef, {
        companyName: customer.companyName,
        email: customer.email,
        invoiceTitle: customer.invoiceTitle,
        phone: customer.phone,
        taxOffice: customer.taxOffice,
        description: customer.description ?? "",
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Hata:", err, "Müşteri:", customer.companyName);
    }
  }

  console.log("✅ Tüm müşteriler başarıyla yüklendi.");
}
