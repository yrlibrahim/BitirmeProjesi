<template>
  <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-[22px] text-[#646B72] font-semibold">Firma Detayları</h2>
      <div class="">
        <button
          class="border border-[#092C4C] bg-[#092C4C] rounded-md p-2 text-[#ffffff] hover:text-[#092C4C] hover:bg-[white] flex items-center gap-3 transition"
          @click="router.back()"
        >
          <ArrowUturnLeftIcon class="w-5 h-5" />
          Geri Dön
        </button>
      </div>
    </div>
    <div class="overflow-x-auto w-full">
      <table
        class="min-w-[700px] w-full text-sm text-left text-gray-700 border border-gray-300"
      >
        <tbody>
          <tr
            v-for="(value, label) in companyFields"
            :key="label"
            class="border-b"
          >
            <th class="px-4 py-2 w-1/3 font-medium bg-gray-50">
              {{ label }}
            </th>
            <td
              class="px-4 py-2 whitespace-normal break-words md:max-w-[400px]"
            >
              {{ value }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-6 flex items-center gap-4">
      <!-- Tür seçimi -->
      <div class="w-1/4">
        <label class="block mb-1 font-medium">İşlem Türü</label>
        <select v-model="priceMode" class="w-full border rounded-md px-4 py-2">
          <option value="increase">Zam</option>
          <option value="decrease">İndirim</option>
        </select>
      </div>

      <!-- Yüzde inputu -->
      <div class="w-1/4">
        <label class="block mb-1 font-medium">% Oran</label>
        <input
          v-model.number="priceChange"
          type="number"
          class="w-full border rounded-md px-4 py-2"
          placeholder="Örn: 10"
        />
      </div>

      <!-- Buton -->
      <div class="pt-6">
        <button
          @click="applyPriceChange"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Uygula
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { DB } from "@/utils/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { useToast } from "vue-toast-notification";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";

const priceChange = ref(0);
const priceMode = ref("increase"); // increase = zam, decrease = indirim
const $toast = useToast();

const router = useRouter();
const route = useRoute();
const companyId = route.params.id;
const companyData = ref({});
const companyFields = ref({});

onMounted(async () => {
  const docRef = doc(DB, "Companys", companyId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    companyData.value = docSnap.data();
    companyFields.value = {
      "Firma Adı": companyData.value.companyName || "-",
      "Mail Adresi": companyData.value.email || "-",
      "Vergi Dairesi": companyData.value.taxOffice || "-",
      "Fatura Başlığı": companyData.value.invoiceTitle || "-",
      "Telefon Numarası": companyData.value.phone || "-",
      Açıklama: companyData.value.description || "-",
    };
  }
});

async function applyPriceChange() {
  const percent = priceChange.value;

  if (!percent || isNaN(percent)) {
    $toast.error("Geçerli bir yüzde girin.");
    return;
  }

  try {
    const stockQuery = query(
      collection(DB, "Stock"),
      where("seller", "==", companyData.value.companyName)
    );

    const snapshot = await getDocs(stockQuery);

    if (snapshot.empty) {
      $toast.info("Bu firmaya ait ürün bulunamadı.");
      return;
    }

    let updatedCount = 0;

    for (const docSnap of snapshot.docs) {
      const product = docSnap.data();
      const currentPrice = product.price || 0;

      let newPrice = currentPrice;
      if (priceMode.value === "increase") {
        newPrice = Math.round(currentPrice * (1 + percent / 100));
      } else {
        newPrice = Math.round(currentPrice * (1 - percent / 100));
      }

      await updateDoc(doc(DB, "Stock", docSnap.id), { price: newPrice });
      updatedCount++;
    }

    $toast.success(`${updatedCount} ürün fiyatı başarıyla güncellendi!`);
  } catch (error) {
    console.error(error);
    $toast.error("Güncelleme sırasında bir hata oluştu.");
  }
}
</script>
