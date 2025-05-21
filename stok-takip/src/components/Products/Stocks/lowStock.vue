<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Düşük Stoklu Ürünler</h1>

    <div class="bg-white p-4 rounded shadow">
      <table class="w-full table-auto">
        <thead>
          <tr class="text-left text-gray-600 border-b">
            <th class="py-2">Ürün</th>
            <th class="py-2">Stok Kodu</th>
            <th class="py-2">Adet</th>
            <th class="py-2">Minimum</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="urun in allLowStock"
            :key="urun.id"
            class="border-b text-sm"
          >
            <td>{{ urun.name }}</td>
            <td>{{ urun.sku }}</td>
            <td class="text-red-500">{{ urun.count }}</td>
            <td>{{ urun.minCount }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="allLowStock.length === 0" class="text-sm text-gray-500 mt-2">
        Şu anda minimum stok altında ürün yok 👏
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStockData } from "@/stores/stock";

const stock = useStockData();
const allLowStock = ref([]);

onMounted(async () => {
  allLowStock.value = await stock.getLowStockProducts(999); // tümünü çek
});
</script>
