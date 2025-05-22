// src/stores/uploadCompanyPayments.js
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { DB } from "@/utils/firebase";

export async function uploadCompanyPayments(companyId, payments) {
  const companySnap = await getDoc(doc(DB, "Companys", companyId));
  const companyName = companySnap.exists()
    ? companySnap.data().companyName
    : "-";

  const collectionRef = collection(DB, "CompanyPayments");

  for (const item of payments) {
    const payload = {
      companyId,
      companyName,
      date: item.date,
      description: item.description,
      amount: item.amount,
      type: "Diğer",
      createdAt: serverTimestamp(),
    };

    await addDoc(collectionRef, payload);
    console.log(
      `✅ Ödeme eklendi → ${payload.description} (${payload.amount} ₺)`
    );
  }
}
