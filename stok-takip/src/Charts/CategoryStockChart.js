import { collection, getDocs } from "firebase/firestore";
import { DB } from "@/utils/firebase";

export async function getCategoryStockChartData() {
  const stockCol = collection(DB, "Stock");
  const snapshot = await getDocs(stockCol);

  const categoryCounts = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const category = data.category || "Bilinmiyor";
    const quantity = Number(data.count || 0);
    if (!categoryCounts[category]) {
      categoryCounts[category] = 0;
    }
    categoryCounts[category] += quantity;
  });

  const labels = Object.keys(categoryCounts);
  const data = Object.values(categoryCounts);

  // Otomatik renk paleti oluştur
  const backgroundColor = labels.map((_, i) => {
    const hue = (i * 360) / labels.length;
    return `hsl(${hue}, 70%, 60%)`;
  });

  return {
    labels,
    datasets: [
      {
        label: "Ürün Sayısı",
        data,
        backgroundColor,
        borderWidth: 1,
      },
    ],
  };
}
