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
} from "firebase/firestore";

/**
 * Gelen faturayı Firestore'a kaydeder
 */
export async function savePurchaseInvoice(invoiceData, productList) {
  try {
    const invoiceRef = doc(collection(DB, "PurchaseInvoices"));

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
    console.log("Fatura başarıyla kaydedildi.");
  } catch (err) {
    console.error("Fatura kaydedilemedi:", err);
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
 * Ürünlerin stok miktarını artır
 */
export async function increaseStockQuantities(products) {
  try {
    const stockCol = collection(DB, "Stock");

    for (const item of products) {
      const q = query(stockCol, where("sku", "==", item.sku));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const stockDocRef = snapshot.docs[0].ref;
        await updateDoc(stockDocRef, {
          count: increment(Number(item.quantity)),
        });
      } else {
        console.warn(`Stok bulunamadı: ${item.sku}`);
      }
    }
  } catch (err) {
    console.error("Stok güncelleme hatası:", err);
    throw err;
  }
}

export async function fetchPurchaseInvoices() {
  try {
    const snapshot = await getDocs(query(collection(DB, "PurchaseInvoices")));

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("Fatura listesi alınamadı:", err);
    throw err;
  }
}
/**
 * ID ile fatura detayını getir
 */
export async function fetchPurchaseInvoiceById(id) {
  try {
    const docRef = doc(DB, "PurchaseInvoices", id);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    } else {
      throw new Error("Fatura bulunamadı.");
    }
  } catch (err) {
    console.error("Fatura detay hatası:", err);
    throw err;
  }
}
/**
 * Faturayı ID'ye göre sil
 */
export async function deletePurchaseInvoice(id) {
  try {
    await deleteDoc(doc(DB, "PurchaseInvoices", id));
  } catch (err) {
    console.error("Fatura silme hatası:", err);
    throw err;
  }
}
/**
 * Belirli bir ID'ye sahip gelen faturayı günceller
 * @param {string} id - Fatura doküman ID'si
 * @param {Object} invoiceData - Firma ve genel fatura bilgileri
 * @param {Array} productList - Ürün satırları
 */
export async function updatePurchaseInvoice(id, invoiceData, productList) {
  try {
    const invoiceRef = doc(DB, "PurchaseInvoices", id);

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
    console.log("Fatura güncellendi:", id);
  } catch (err) {
    console.error("Fatura güncelleme hatası:", err);
    throw err;
  }
}
