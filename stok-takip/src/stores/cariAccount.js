// stores/cariAccount.js
import { collection, getDocs } from "firebase/firestore";
import { DB } from "@/utils/firebase";

const invoicesCol = collection(DB, "SalesInvoices");
const paymentsCol = collection(DB, "CustomerPayments");

export async function getCariSummary() {
  const [invoiceSnap, paymentSnap] = await Promise.all([
    getDocs(invoicesCol),
    getDocs(paymentsCol),
  ]);

  const invoices = invoiceSnap.docs.map((doc) => doc.data());
  const payments = paymentSnap.docs.map((doc) => doc.data());

  // Müşterileri grupla
  const summaryMap = {};

  invoices.forEach((inv) => {
    if (!summaryMap[inv.customerId]) {
      summaryMap[inv.customerId] = {
        customerId: inv.customerId,
        customerName: inv.companyName,
        totalInvoices: 0,
        totalPayments: 0,
      };
    }
    summaryMap[inv.customerId].totalInvoices += inv.totalAmount || 0;
  });

  payments.forEach((pay) => {
    if (!summaryMap[pay.customerId]) {
      summaryMap[pay.customerId] = {
        customerId: pay.customerId,
        customerName: pay.companyName,
        totalInvoices: 0,
        totalPayments: 0,
      };
    }
    summaryMap[pay.customerId].totalPayments += pay.amount || 0;
  });

  // Kalan borcu hesapla ve array'e çevir
  const summaryList = Object.values(summaryMap).map((entry) => ({
    ...entry,
    remainingDebt: entry.totalInvoices - entry.totalPayments,
  }));

  return summaryList;
}
