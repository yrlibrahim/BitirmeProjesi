<template>
  <div class="p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">Fatura Detayı</h2>
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

    <div v-if="isLoading">Yükleniyor...</div>

    <div v-else-if="invoice">
      <!-- Fatura Genel Bilgiler -->
      <div>
        <table class="min-w-full bg-white border rounded shadow-sm mb-6">
          <tbody>
            <tr class="border-b">
              <th class="p-2 bg-gray-50 text-left w-1/3">Müşteri</th>
              <td class="p-2">{{ invoice.customerName }}</td>
            </tr>
            <tr class="border-b">
              <th class="p-2 bg-gray-50 text-left">Fatura No</th>
              <td class="p-2">{{ invoice.invoiceNo }}</td>
            </tr>
            <tr class="border-b">
              <th class="p-2 bg-gray-50 text-left">Tarih</th>
              <td class="p-2">
                {{
                  new Date(
                    invoice.createdAt?.seconds * 1000
                  ).toLocaleDateString()
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Ürünler -->
      <h2 class="text-xl font-semibold mb-2">Ürünler</h2>
      <table class="min-w-full bg-white border rounded shadow-sm mb-6">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-2">SKU</th>
            <th class="p-2">Ad</th>
            <th class="p-2">Marka</th>
            <th class="p-2">Model</th>
            <th class="p-2">Kategori</th>
            <th class="p-2">Adet</th>
            <th class="p-2">Fiyat</th>
            <th class="p-2">Vergi %</th>
            <th class="p-2">İskonto %</th>
            <th class="p-2">Toplam</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in invoice.products" :key="item.sku" class="border-t">
            <td class="p-2">{{ item.sku }}</td>
            <td class="p-2">{{ item.name }}</td>
            <td class="p-2">{{ item.brand }}</td>
            <td class="p-2">{{ item.model }}</td>
            <td class="p-2">{{ item.category }}</td>
            <td class="p-2">{{ item.quantity }}</td>
            <td class="p-2">{{ item.price.toFixed(2) }} ₺</td>
            <td class="p-2">{{ item.tax }}%</td>
            <td class="p-2">{{ item.discount }}%</td>
            <td class="p-2">{{ item.total.toFixed(2) }} ₺</td>
          </tr>
        </tbody>
      </table>

      <!-- Toplamlar -->
      <div class="space-y-1">
        <table class="min-w-[300px] w-full bg-white border rounded shadow-sm">
          <tbody>
            <tr class="border-b">
              <th class="p-2 bg-gray-50 text-left w-1/2">Ara Toplam</th>
              <td class="p-2">{{ invoice.totalAmount?.toFixed(2) }} ₺</td>
            </tr>
            <tr class="border-b">
              <th class="p-2 bg-gray-50 text-left">Toplam KDV</th>
              <td class="p-2">
                {{ invoice.totalTax?.toFixed(2) || "0.00" }} ₺
              </td>
            </tr>
            <tr>
              <th class="p-2 bg-gray-50 text-left">Genel Toplam</th>
              <td class="p-2">
                {{ (invoice.totalAmount + (invoice.totalTax || 0)).toFixed(2) }}
                ₺
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { fetchSalesInvoiceById } from "@/stores/salesInvoice";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const route = useRoute();
const invoice = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    invoice.value = await fetchSalesInvoiceById(route.params.id);
  } catch (e) {
    alert("Fatura bulunamadı.");
  } finally {
    isLoading.value = false;
  }
});
</script>
