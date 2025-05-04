import { fetchPurchaseInvoices } from "@/stores/invoice";
import { fetchSalesInvoices } from "@/stores/salesInvoice";

// Yardımcı: YYYY-MM formatı üret
const getMonthKey = (dateStr) => dateStr.slice(0, 7);

// Yardımcı: boş aylar da olsun diye 12 ay oluştur
function getEmptyMonthMap() {
  const now = new Date();
  const result = {};
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), i, 1);
    const key = d.toISOString().slice(0, 7);
    result[key] = 0;
  }
  return result;
}

export async function getMonthlyStockChartData() {
  const purchases = await fetchPurchaseInvoices();
  const sales = await fetchSalesInvoices();

  const incoming = getEmptyMonthMap();
  const outgoing = getEmptyMonthMap();
  const labor = getEmptyMonthMap();

  for (const inv of purchases) {
    const month = getMonthKey(inv.date);
    incoming[month] += inv.totalAmount || 0;
  }

  for (const inv of sales) {
    const month = getMonthKey(inv.date);
    for (const item of inv.products || []) {
      const amount = Number(item.total || 0);
      if (item.sku === "0000") {
        labor[month] += amount;
      } else {
        outgoing[month] += amount;
      }
    }
  }

  const rawLabels = Object.keys(incoming);
  const labels = rawLabels.map((key) => {
    const date = new Date(key + "-01");
    return date.toLocaleString("tr-TR", { month: "long" });
  });

  return {
    labels,
    datasets: [
      {
        label: "Gelen Ürünler (₺)",
        data: rawLabels.map((m) => incoming[m]),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
      },
      {
        label: "Giden Ürünler (₺)",
        data: rawLabels.map((m) => outgoing[m]),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        tension: 0.4,
      },
      {
        label: "İşçilik (₺)",
        data: rawLabels.map((m) => labor[m]),
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
      },
    ],
  };
}
