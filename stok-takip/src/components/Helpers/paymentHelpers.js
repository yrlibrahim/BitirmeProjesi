import { DB } from "@/utils/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function saveCustomerPayments(customer, payments) {
  try {
    for (const payment of payments) {
      const paymentRef = doc(collection(DB, "CustomerPayments"));

      const fullPayment = {
        companyName: customer.companyName,
        customerId: customer.id,
        createdAt: serverTimestamp(),
        date: payment.date,
        amount: payment.amount,
        type: payment.type,
        description: payment.description,
      };

      await setDoc(paymentRef, fullPayment);
      console.log(`Ödeme kaydedildi: ${fullPayment.description}`);
    }
    console.log("Tüm ödemeler başarıyla kaydedildi.");
  } catch (err) {
    console.error("Ödeme kaydetme hatası:", err);
    throw err;
  }
}
