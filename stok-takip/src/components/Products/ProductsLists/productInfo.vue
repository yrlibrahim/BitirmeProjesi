<template>
  <div class="p-6 bg-white rounded-lg border border-gray-200 shadow-md">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-[22px] font-bold">Fatura Detayı</h2>
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

    <table
      class="w-full text-sm text-left text-gray-700 border border-gray-300"
    >
      <tbody>
        <tr
          v-for="(value, label) in productFields"
          :key="label"
          class="border-b"
        >
          <th class="px-4 py-2 w-1/3 font-medium bg-gray-50">{{ label }}</th>
          <td class="px-4 py-2">{{ value }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doc, getDoc } from "firebase/firestore";
import { DB } from "@/utils/firebase";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const route = useRoute();
const productId = route.params.id;
const productData = ref({});

const productFields = ref({});

onMounted(async () => {
  const docRef = doc(DB, "Stock", productId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    productData.value = docSnap.data();
    productFields.value = {
      "Stok Kodu": productData.value.sku || "-",
      Satıcı: productData.value.seller || "-",
      Ürün: productData.value.name || "-",
      Araç: productData.value.brand || "-",
      Model: productData.value.model || "-",
      Kategori: productData.value.category || "-",
      "Alt Kategori": productData.value.subCategory || "-",
      Adet: productData.value.count || "-",
      Fiyat: productData.value.price ? `${productData.value.price} ₺` : "-",
    };
  }
});
</script>
