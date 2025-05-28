// 📁 src/utils/bulkUploader.js
import { DB } from "@/utils/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function uploadCSVProducts(productsArray) {
  for (const [index, item] of productsArray.entries()) {
    const {
      ["STOK KODU"]: stokKodu,
      subCategory,
      description,
      price,
      brand,
      model,
      name,
      category,
    } = item;

    const sku = stokKodu?.trim();
    if (
      !brand ||
      !model ||
      !category ||
      !subCategory ||
      !name ||
      !sku ||
      price === undefined
    ) {
      console.warn(`❌ Eksik alan! Satır atlandı (${index + 1}):`, item);
      continue;
    }

    const product = {
      brand,
      model,
      category,
      subCategory,
      name,
      description,
      sku,
      price: Number(price),
      count: 10,
      minCount: 0,
      seller: "DİKMEN",
      owner: {
        uid: "znT6nCgq69cCIuVo7r0jvAc6uUL2",
        name: null,
        lastname: null,
      },
      timestamp: serverTimestamp(),
    };

    const ref = doc(collection(DB, "Stock"));
    await setDoc(ref, product);
    console.log(`✔️ ${index + 1}. ürün eklendi:`, product.name);
  }
}
