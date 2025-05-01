<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Fatura Detayı</h1>

    <div v-if="isLoading">Yükleniyor...</div>

    <div v-else-if="invoice">
      <div class="">
        <table class="min-w-full bg-white border rounded shadow-sm mb-6">
          <tbody>
            <tr class="border-b">
              <th class="p-2 bg-gray-50 text-left w-1/3">Firma</th>
              <td class="p-2">{{ invoice.companyName }}</td>
            </tr>
            <tr class="border-b">
              <th class="p-2 bg-gray-50 text-left">Fatura No</th>
              <td class="p-2">{{ invoice.invoiceNumber }}</td>
            </tr>
            <tr class="border-b">
              <th class="p-2 bg-gray-50 text-left">Tarih</th>
              <td class="p-2">
                {{ new Date(invoice.invoiceDate).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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

      <div class="space-y-1">
        <table class="min-w-[300px] w-full bg-white border rounded shadow-sm">
          <tbody>
            <tr class="border-b">
              <th class="p-2 bg-gray-50 text-left w-1/2">Ara Toplam</th>
              <td class="p-2">{{ invoice.totalAmount.toFixed(2) }} ₺</td>
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
                {{
                  (invoice.totalAmount + (invoice.totalTax || 0)).toFixed(2)
                }}
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
import { useRoute } from "vue-router";
import { fetchPurchaseInvoiceById } from "@/stores/invoice";

const route = useRoute();
const invoice = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    invoice.value = await fetchPurchaseInvoiceById(route.params.id);
  } catch (e) {
    alert("Fatura bulunamadı.");
  } finally {
    isLoading.value = false;
  }
});
</script>
