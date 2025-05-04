// stores/companyPayments.js
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { DB } from "@/utils/firebase";

const paymentsCol = collection(DB, "CompanyPayments");
const companyCol = collection(DB, "Companys");

export async function getCompanyList() {
  const snapshot = await getDocs(companyCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addCompanyPayment(data) {
  return await addDoc(paymentsCol, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function fetchCompanyPayments() {
  const snapshot = await getDocs(paymentsCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function fetchCompanyPaymentById(id) {
  const ref = doc(DB, "CompanyPayments", id);
  const snapshot = await getDoc(ref);
  return { id: snapshot.id, ...snapshot.data() };
}

export async function updateCompanyPayment(id, updatedData) {
  const ref = doc(DB, "CompanyPayments", id);
  return await updateDoc(ref, {
    ...updatedData,
    timestamp: serverTimestamp(),
  });
}

export async function deleteCompanyPayment(id) {
  const ref = doc(DB, "CompanyPayments", id);
  return await deleteDoc(ref);
}
