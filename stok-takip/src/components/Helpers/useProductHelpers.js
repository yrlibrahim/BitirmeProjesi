// src/helpers/useProductHelpers.js
import { DB } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export async function fetchBrands() {
  const q = query(collection(DB, "Stock"));
  const snapshot = await getDocs(q);
  return [...new Set(snapshot.docs.map((doc) => doc.data().brand))];
}

export async function fetchModels(brand) {
  const q = query(collection(DB, "Stock"), where("brand", "==", brand));
  const snapshot = await getDocs(q);
  return [...new Set(snapshot.docs.map((doc) => doc.data().model))];
}

export async function fetchCategories(brand, model) {
  const q = query(
    collection(DB, "Stock"),
    where("brand", "==", brand),
    where("model", "==", model)
  );
  const snapshot = await getDocs(q);
  return [...new Set(snapshot.docs.map((doc) => doc.data().category))];
}

export async function fetchSubCategories(brand, model, category) {
  const q = query(
    collection(DB, "Stock"),
    where("brand", "==", brand),
    where("model", "==", model),
    where("category", "==", category)
  );
  const snapshot = await getDocs(q);
  return [...new Set(snapshot.docs.map((doc) => doc.data().subCategory))];
}

// Var olan sku sorgulama
export async function isSkuExists(sku) {
  const q = query(collection(DB, "Stock"), where("sku", "==", sku));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}
