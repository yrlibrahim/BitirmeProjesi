<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold">Müşteri Cari Durumları</h2>

    <!-- Arama ve Dropmenu -->
    <div class="flex items-center gap-4 mb-4">
      <!-- Arama -->
      <input
        v-model="searchTerm"
        placeholder="Müşteri Adına Göre Ara..."
        class="border rounded px-4 py-2 w-full max-w-xs"
      />

      <!-- Müşteri Dropmenu -->
      <div class="relative" ref="dropdownRef">
        <button
          @click="toggleDropdown"
          class="border rounded px-4 py-2 bg-white shadow-sm hover:bg-[#FE9F43] hover:text-white transition"
        >
          {{ selectedCustomer || "Tüm Müşteriler" }}
        </button>
        <div
          v-if="dropdownOpen"
          class="absolute mt-1 w-48 bg-white border rounded shadow-md z-10"
        >
          <div
            class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
            @click="selectCustomer('')"
          >
            Tüm Müşteriler
          </div>
          <div
            v-for="customer in uniqueCustomers"
            :key="customer"
            class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
            @click="selectCustomer(customer)"
          >
            {{ customer }}
          </div>
        </div>
      </div>

      <!-- Sıfırlama -->
      <button
        @click="resetFilters"
        class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
      >
        Sıfırla
      </button>
    </div>

    <div class="overflow-auto rounded border">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="header in [
                { label: 'Müşteri', key: 'customerName' },
                { label: 'Toplam Borç (₺)', key: 'totalInvoices' },
                { label: 'Toplam Ödeme (₺)', key: 'totalPayments' },
                { label: 'Kalan Borç (₺)', key: 'remainingDebt' },
              ]"
              :key="header.key"
              @click="sortBy(header.key)"
              class="px-4 py-2 text-left cursor-pointer hover:text-[#FE9F43] transition"
            >
              {{ header.label }}
              <span v-if="sortKey === header.key">
                {{ sortOrder === "asc" ? "▲" : "▼" }}
              </span>
            </th>
            <th class="px-4 py-2 text-left">İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in sortedSummary"
            :key="entry.customerId"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ entry.customerName }}</td>
            <td class="px-4 py-2">
              {{ entry.totalInvoices.toLocaleString("tr-TR") }}₺
            </td>
            <td class="px-4 py-2">
              {{ entry.totalPayments.toLocaleString("tr-TR") }}₺
            </td>
            <td class="px-4 py-2 font-semibold">
              {{ entry.remainingDebt.toLocaleString("tr-TR") }}₺
            </td>
            <td class="px-4 py-2">
              <router-link
                :to="`/customer-accounts/${entry.customerId}`"
                class="text-blue-500 hover:underline"
              >
                Detay
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getCariSummary } from "@/stores/cariAccount";

const summary = ref([]);
const searchTerm = ref("");
// Varsayılan olarak müşteri adına göre alfabetik sıralama (A-Z)
const sortKey = ref("customerName");
const sortOrder = ref("asc");
const selectedCustomer = ref("");
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

onMounted(async () => {
  summary.value = await getCariSummary();
  document.addEventListener("click", handleClickOutside);
});

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

// Dropdown'u kapatma
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Müşteri seçimi
const selectCustomer = (customer) => {
  selectedCustomer.value = customer;
  dropdownOpen.value = false;
};

// Sıralama işlemi
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

// Müşteri isimlerini listeleme
const uniqueCustomers = computed(() => {
  const customerNames = summary.value.map((p) => p.customerName);
  return [...new Set(customerNames)];
});

// Filtreleme işlemi
const filteredSummary = computed(() => {
  return summary.value
    .filter((entry) =>
      entry.customerName.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    .filter((entry) =>
      selectedCustomer.value
        ? entry.customerName === selectedCustomer.value
        : true
    );
});

// Sıralanmış müşteri cari listesi
const sortedSummary = computed(() => {
  return [...filteredSummary.value].sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    // Sayısal değerleri sayısal olarak sıralama
    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder.value === "asc" ? aVal - bVal : bVal - aVal;
    }

    // Metinsel değerleri alfabetik sıralama
    aVal = aVal?.toString().toLowerCase() || "";
    bVal = bVal?.toString().toLowerCase() || "";
    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

// Filtreyi sıfırlama
const resetFilters = () => {
  searchTerm.value = "";
  selectedCustomer.value = "";
};
</script>
