// src/utils/bulkUploadCompanies.js
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { DB } from "@/utils/firebase";

export async function uploadCompaniesBulk(companyList) {
  const companyRef = collection(DB, "Companys");

  for (const company of companyList) {
    try {
      await addDoc(companyRef, {
        companyName: company.companyName,
        email: company.email,
        invoiceTitle: company.invoiceTitle,
        phone: company.phone,
        taxOffice: company.taxOffice,
        description: company.description ?? "",
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error("Hata:", err, "Firma:", company.companyName);
    }
  }

  console.log("Tüm firmalar başarıyla yüklendi.");
}
