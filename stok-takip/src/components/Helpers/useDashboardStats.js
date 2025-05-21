import { collection, getCountFromServer } from "firebase/firestore";
import { DB } from "@/utils/firebase";

export async function fetchCounts() {
  const [customerSnap, companySnap] = await Promise.all([
    getCountFromServer(collection(DB, "Customers")),
    getCountFromServer(collection(DB, "Companys")),
  ]);

  return {
    totalCustomers: customerSnap.data().count,
    totalCompanies: companySnap.data().count,
  };
}
