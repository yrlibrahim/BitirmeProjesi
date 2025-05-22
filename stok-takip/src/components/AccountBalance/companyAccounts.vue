<template>
  <div class="">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-[22px] text-[#646B72] font-semibold">
          Firma Cari Durumları
        </h1>
        <h2 class="text-[18px] text-[#646B72] pt-4">
          Cari Durumlarınızı Takip Edin
        </h2>
      </div>
    </div>

    <!-- Arama ve Dropmenu -->
    <div
      class="flex justify-between items-center gap-2 p-4 rounded-t-md bg-white border"
    >
      <!-- Arama -->
      <input
        v-model="searchTerm"
        placeholder="Firma Adına Göre Ara..."
        class="border rounded px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-0"
      />
      <div class="flex gap-2">
        <!-- Firma Dropmenu -->
        <div class="relative" ref="dropdownRef">
          <button
            @click="toggleDropdown"
            class="border rounded px-4 py-2 bg-white shadow-sm hover:bg-[#FE9F43] hover:text-white transition"
          >
            {{ selectedCompany || "Tüm Firmalar" }}
          </button>
          <div
            v-if="dropdownOpen"
            class="absolute mt-1 w-48 bg-white border rounded shadow-md z-10 max-h-60 overflow-y-auto"
          >
            <div
              class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
              @click="selectCompany('')"
            >
              Tüm Firmalar
            </div>
            <div
              v-for="company in uniqueCompanies"
              :key="company"
              class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
              @click="selectCompany(company)"
            >
              {{ company }}
            </div>
          </div>
        </div>

        <!-- Sıfırlama -->
        <button
          @click="resetFilters"
          class="border rounded px-4 py-2 bg-white shadow-sm hover:bg-[#FE9F43] hover:text-white transition"
        >
          Sıfırla
        </button>
      </div>
    </div>

    <div class="overflow-auto rounded border">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th
              v-for="header in [
                { label: 'Firma', key: 'companyName' },
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
            :key="entry.companyId"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ entry.companyName }}</td>
            <td class="px-4 py-2">
              {{ entry.totalInvoices.toLocaleString("tr-TR") }} ₺
            </td>
            <td class="px-4 py-2">
              {{ entry.totalPayments.toLocaleString("tr-TR") }} ₺
            </td>
            <td class="px-4 py-2 font-semibold">
              {{ entry.remainingDebt.toLocaleString("tr-TR") }} ₺
            </td>
            <td class="px-4 py-2">
              <router-link
                :to="`/company-accounts/${entry.companyId}`"
                class="text-blue-500 hover:underline"
              >
                <EyeIcon class="w-5 h-5 text-gray-600" />
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
import { getCompanySummary } from "@/stores/companyAccount";
import { EyeIcon } from "@heroicons/vue/24/outline";

const summary = ref([]);
const searchTerm = ref("");
const sortKey = ref("companyName");
const sortOrder = ref("asc");
const selectedCompany = ref("");
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

onMounted(async () => {
  summary.value = await getCompanySummary();
  document.addEventListener("click", handleClickOutside);
});

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectCompany = (company) => {
  selectedCompany.value = company;
  dropdownOpen.value = false;
};

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const uniqueCompanies = computed(() => {
  const names = summary.value.map((p) => p.companyName);
  return [...new Set(names)];
});

const filteredSummary = computed(() => {
  return summary.value
    .filter((entry) =>
      entry.companyName.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    .filter((entry) =>
      selectedCompany.value ? entry.companyName === selectedCompany.value : true
    );
});

const sortedSummary = computed(() => {
  return [...filteredSummary.value].sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder.value === "asc" ? aVal - bVal : bVal - aVal;
    }

    aVal = aVal?.toString().toLowerCase() || "";
    bVal = bVal?.toString().toLowerCase() || "";
    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

const resetFilters = () => {
  searchTerm.value = "";
  selectedCompany.value = "";
};
</script>
