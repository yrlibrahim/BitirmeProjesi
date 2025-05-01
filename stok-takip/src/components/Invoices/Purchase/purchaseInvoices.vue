<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Gelen Faturalar</h1>

    <div v-if="isLoading">Yükleniyor...</div>

    <div v-else>
      <table class="min-w-full bg-white border rounded shadow-sm">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-3">Fatura No</th>
            <th class="p-3">Firma</th>
            <th class="p-3">Tarih</th>
            <th class="p-3">Toplam</th>
            <th class="p-3">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="fatura in invoices"
            :key="fatura.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-3">{{ fatura.invoiceNumber }}</td>
            <td class="p-3">{{ fatura.companyName }}</td>
            <td class="p-3">
              {{ new Date(fatura.invoiceDate).toLocaleDateString() }}
            </td>
            <td class="p-3">{{ fatura.totalAmount?.toFixed(2) }} ₺</td>
            <td class="p-3">
              <div class="flex gap-2">
                <router-link
                  :to="{
                    name: 'purchaseInvoiceInfo',
                    params: { id: fatura.id },
                  }"
                  class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                >
                  <EyeIcon class="w-5 h-5 text-gray-600" />
                </router-link>

                <router-link
                  :to="{
                    name: 'setPurchaseInvoiceInfo',
                    params: { id: fatura.id },
                  }"
                  class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </router-link>

                <button
                  @click="handleDelete(fatura.id)"
                  class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                >
                  <TrashIcon class="w-5 h-5 text-red-500" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { fetchPurchaseInvoices, deletePurchaseInvoice } from "@/stores/invoice";
import { useToast } from "vue-toast-notification";
import Swal from "sweetalert2";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
const toast = useToast();
const invoices = ref([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    invoices.value = await fetchPurchaseInvoices();
  } catch (e) {
    console.error("Fatura/stok kaydında hata:", err);
    toast.error("Faturalar alınamadı!");
  } finally {
    isLoading.value = false;
  }
});
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Emin misin?",
    text: "Bu fatura silinecek!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Evet, sil!",
    cancelButtonText: "Vazgeç",
  });

  if (result.isConfirmed) {
    try {
      await deletePurchaseInvoice(id);
      invoices.value = invoices.value.filter((f) => f.id !== id);
      Swal.fire("Silindi!", "Fatura başarıyla silindi.", "success");
    } catch (err) {
      Swal.fire("Hata!", "Silme işlemi başarısız oldu.", "error");
    }
  }
};
</script>
