import { fetchCustomerPayments } from "@/stores/customerPayments";
import { fetchCompanyPayments } from "@/stores/companyPayments";

// Yardımcı fonksiyon: Ay isimlerini al
const getMonthLabel = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("tr-TR", { month: "long" });
};

export async function getMonthlyPaymentsChartData() {
  const customerPayments = await fetchCustomerPayments();
  const companyPayments = await fetchCompanyPayments();

  const months = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  const monthlyIncomes = new Array(12).fill(0); // Gelen
  const monthlyExpenses = new Array(12).fill(0); // Giden

  customerPayments.forEach((p) => {
    const monthIndex = new Date(p.date).getMonth();
    monthlyIncomes[monthIndex] += Number(p.amount);
  });

  companyPayments.forEach((p) => {
    const monthIndex = new Date(p.date).getMonth();
    monthlyExpenses[monthIndex] += Number(p.amount);
  });

  return {
    labels: months,
    datasets: [
      {
        label: "Gelen Ödeme",
        backgroundColor: "#4ade80",
        borderRadius: 8,
        data: monthlyIncomes,
      },
      {
        label: "Giden Ödeme",
        backgroundColor: "#f87171",
        borderRadius: 8,
        data: monthlyExpenses,
      },
    ],
  };
}
