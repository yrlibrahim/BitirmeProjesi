// stores/customerPayments.js
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

const paymentsCol = collection(DB, "CustomerPayments");
const customersCol = collection(DB, "Customers");

export async function getCustomerList() {
  const snapshot = await getDocs(customersCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function addCustomerPayment(data) {
  return await addDoc(paymentsCol, {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function fetchCustomerPayments() {
  const snapshot = await getDocs(paymentsCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function fetchPaymentById(id) {
  const ref = doc(DB, "CustomerPayments", id);
  const snapshot = await getDoc(ref);
  return { id: snapshot.id, ...snapshot.data() };
}

export async function updateCustomerPayment(id, updatedData) {
  const ref = doc(DB, "CustomerPayments", id);
  return await updateDoc(ref, {
    ...updatedData,
    createdAt: serverTimestamp(),
  });
}

export async function deleteCustomerPayment(id) {
  const ref = doc(DB, "CustomerPayments", id);
  return await deleteDoc(ref);
}
