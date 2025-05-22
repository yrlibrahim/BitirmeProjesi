import { DB } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

export async function saveSalesInvoice(invoiceData, productList) {
  try {
    const invoiceRef = doc(collection(DB, "SalesInvoices"));

    const fullInvoice = {
      ...invoiceData,
      products: productList.map((item) => ({
        sku: item.sku,
        name: item.name,
        brand: item.brand,
        model: item.model,
        category: item.category,
        subCategory: item.subCategory,
        quantity: Number(item.quantity),
        price: Number(item.price),
        tax: Number(item.tax),
        discount: Number(item.discount),
        total: Number(item.total),
      })),
      totalAmount: productList.reduce(
        (acc, item) => acc + Number(item.total),
        0
      ),
      totalTax: productList.reduce(
        (acc, item) => acc + Number(item.taxAmount || 0),
        0
      ),
      createdAt: serverTimestamp(),
    };

    await setDoc(invoiceRef, fullInvoice);
    await decreaseStockQuantities(productList);
    console.log("Satış faturası kaydedildi ve stok güncellendi.");
  } catch (err) {
    console.error("Satış faturası hatası:", err);
    throw err;
  }
}

/**
 * Satış faturasını günceller ve stok düşüşünü yeniden işler
 */
export async function updateSalesInvoice(id, invoiceData, productList) {
  try {
    const invoiceRef = doc(DB, "SalesInvoices", id);

    const fullInvoice = {
      ...invoiceData,
      products: productList.map((item) => ({
        sku: item.sku,
        name: item.name,
        brand: item.brand,
        model: item.model,
        category: item.category,
        subCategory: item.subCategory,
        quantity: Number(item.quantity),
        price: Number(item.price),
        tax: Number(item.tax),
        discount: Number(item.discount),
        total: Number(item.total),
      })),
      totalAmount: productList.reduce(
        (acc, item) => acc + Number(item.total),
        0
      ),
      totalTax: productList.reduce(
        (acc, item) => acc + Number(item.taxAmount || 0),
        0
      ),
      updatedAt: serverTimestamp(),
    };

    await setDoc(invoiceRef, fullInvoice);
    console.log("Satış faturası güncellendi:", id);
    // Not: İstersen burada önceki stok etkisini geri alıp yeniden düşebilirsin.
  } catch (err) {
    console.error("Satış faturası güncelleme hatası:", err);
    throw err;
  }
}

/**
 * Stok koduna göre ürün getir
 */
export async function getProductBySKU(sku) {
  try {
    const stockQuery = query(collection(DB, "Stock"), where("sku", "==", sku));
    const snapshot = await getDocs(stockQuery);

    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return {
        name: data.name,
        brand: data.brand,
        model: data.model,
        category: data.category,
        subCategory: data.subCategory,
        price: data.price,
      };
    } else {
      return null;
    }
  } catch (err) {
    console.error("Stok koduyla ürün getirme hatası:", err);
    throw err;
  }
}

/**
 * Stoktan ürün adetini düş
 */
export async function decreaseStockQuantities(products) {
  try {
    const stockCol = collection(DB, "Stock");

    for (const item of products) {
      const q = query(stockCol, where("sku", "==", item.sku));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const stockDocRef = snapshot.docs[0].ref;
        await updateDoc(stockDocRef, {
          count: increment(-Number(item.quantity)),
        });
      } else {
        console.warn(`Stok bulunamadı: ${item.sku}`);
      }
    }
  } catch (err) {
    console.error("Stok azaltma hatası:", err);
    throw err;
  }
}

/**
 * Satış faturalarını getir
 */

export async function fetchSalesInvoices() {
  try {
    const q = query(collection(DB, "SalesInvoices"), orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Satış faturaları alınamadı:", err);
    throw err;
  }
}

/**
 * ID ile satış faturasını getir
 */
export async function fetchSalesInvoiceById(id) {
  try {
    const docRef = doc(DB, "SalesInvoices", id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    } else {
      throw new Error("Fatura bulunamadı.");
    }
  } catch (err) {
    console.error("Satış fatura detay hatası:", err);
    throw err;
  }
}

/**
 * Satış faturasını sil
 */
export async function deleteSalesInvoice(id) {
  try {
    await deleteDoc(doc(DB, "SalesInvoices", id));
  } catch (err) {
    console.error("Satış fatura silme hatası:", err);
    throw err;
  }
}

// Top Selling Hesaplama
// Top Selling Hesaplama
export async function getTopSellingProducts(limitCount = 5) {
  try {
    const snapshot = await getDocs(collection(DB, "SalesInvoices"));
    const sales = snapshot.docs.flatMap((doc) => doc.data().products || []);

    // SKU bazlı toplama, işçilik ve eski fatura kodunu hariç tut
    const salesMap = {};
    for (const item of sales) {
      const sku = item.sku;

      // İşçilik ve eski fatura kodlarını atla
      if (!sku || sku === "0000" || sku === "EFSK") continue;

      if (!salesMap[sku]) {
        salesMap[sku] = {
          sku,
          name: item.name,
          totalSold: 0,
        };
      }
      salesMap[sku].totalSold += Number(item.quantity);
    }

    // En çok satanlara göre sırala
    const sortedSales = Object.values(salesMap).sort(
      (a, b) => b.totalSold - a.totalSold
    );

    console.log("En çok satan ürünler:", sortedSales);
    return sortedSales.slice(0, limitCount);
  } catch (err) {
    console.error("Top selling ürün hesaplama hatası:", err);
    throw err;
  }
}
