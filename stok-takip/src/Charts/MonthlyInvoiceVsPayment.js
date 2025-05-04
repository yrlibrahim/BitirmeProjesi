import { fetchSalesInvoices } from "@/stores/salesInvoice";
import { fetchCustomerPayments } from "@/stores/customerPayments";

// Yardımcı: YYYY-MM
const getMonthKey = (dateStr) => dateStr?.slice(0, 7);

// Yardımcı: Tüm ayları sıfırla
const getEmptyMonths = () => {
  const now = new Date();
  const map = {};
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), i, 1);
    const key = d.toISOString().slice(0, 7);
    map[key] = 0;
  }
  return map;
};

export async function getMonthlyInvoiceVsPaymentData() {
  const invoices = await fetchSalesInvoices();
  const payments = await fetchCustomerPayments();

  const faturaMap = getEmptyMonths();
  const odemeMap = getEmptyMonths();

  for (const inv of invoices) {
    const ay = getMonthKey(inv.date);
    faturaMap[ay] += inv.totalAmount || 0;
  }

  for (const pay of payments) {
    const ay = getMonthKey(pay.date);
    odemeMap[ay] += Number(pay.amount || 0);
  }

  const keys = Object.keys(faturaMap);
  const labels = keys.map((key) => {
    const date = new Date(key + "-01");
    return date.toLocaleDateString("tr-TR", { month: "long" });
  });

  return {
    labels,
    datasets: [
      {
        type: "bar",
        label: "Fatura Tutarı",
        data: keys.map((m) => faturaMap[m]),
        backgroundColor: "rgba(239, 68, 68, 0.4)",
        stack: "combined",
      },
      {
        type: "line",
        label: "Alınan Ödeme",
        data: keys.map((m) => odemeMap[m]),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.3)",
        fill: false,
        tension: 0.4,
        stack: "combined",
      },
    ],
  };
}
