// stores/companyAccount.js
import { collection, getDocs } from "firebase/firestore";
import { DB } from "@/utils/firebase";

const invoicesCol = collection(DB, "PurchaseInvoices");
const paymentsCol = collection(DB, "CompanyPayments");

export async function getCompanySummary() {
  const [invoiceSnap, paymentSnap] = await Promise.all([
    getDocs(invoicesCol),
    getDocs(paymentsCol),
  ]);

  const invoices = invoiceSnap.docs.map((doc) => doc.data());
  const payments = paymentSnap.docs.map((doc) => doc.data());

  const summaryMap = {};

  invoices.forEach((inv) => {
    if (!summaryMap[inv.companyId]) {
      summaryMap[inv.companyId] = {
        companyId: inv.companyId,
        companyName: inv.companyName,
        totalInvoices: 0,
        totalPayments: 0,
      };
    }
    summaryMap[inv.companyId].totalInvoices += inv.totalAmount || 0;
  });

  payments.forEach((pay) => {
    if (!summaryMap[pay.companyId]) {
      summaryMap[pay.companyId] = {
        companyId: pay.companyId,
        companyName: pay.companyName,
        totalInvoices: 0,
        totalPayments: 0,
      };
    }
    summaryMap[pay.companyId].totalPayments += pay.amount || 0;
  });

  return Object.values(summaryMap).map((entry) => ({
    ...entry,
    remainingDebt: entry.totalInvoices - entry.totalPayments,
  }));
}
