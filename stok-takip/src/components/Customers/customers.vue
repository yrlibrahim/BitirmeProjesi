<template>
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-[22px] text-[#646B72] font-semibold">Müşteriler</h1>
      <p class="text-[18px] text-[#646B72] pt-4">
        Mevcut Müşterilerinizi Görüntüleyin
      </p>
    </div>

    <div v-if="!userStore.user.isAdmin">
      <button
        @click="router.push('/addCustomer')"
        class="btn bg-[#FE9F43] text-white border-[#FE9F43] hover:bg-white hover:text-[#FE9F43] transition rounded-md border px-4 py-2"
      >
        <span class="flex items-center"
          ><UserPlusIcon class="w-5 me-2" /> Müşteri Ekle</span
        >
      </button>
    </div>
  </div>
  <!-- LOADING EKRANI -->
  <div v-if="isLoading" class="flex justify-center items-center h-screen">
    <svg
      class="animate-spin h-16 w-16 mr-3 text-[#fe9f43]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"
      ></path>
    </svg>
  </div>

  <div v-else class="bg-white border shadow-md rounded-md overflow-hidden mt-6">
    <div>
      <!-- Arama ve Filtre -->
      <div class="p-4 flex flex-wrap justify-between items-center gap-2">
        <!-- Arama -->
        <div class="relative border rounded-md w-full max-w-xs">
          <input
            type="text"
            v-model="searchTerm"
            class="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none"
            placeholder="Firma adına göre ara..."
          />
          <div
            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>
        </div>
        <!--Filtreler-->
        <div class="flex gap-3 items-center">
          <div class="relative w-48" ref="dropdownRef">
            <button
              @click="dropdownOpen = !dropdownOpen"
              class="w-full border px-4 py-2 rounded-md text-gray-700 bg-white shadow-sm hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
            >
              <span class="flex items-center justify-between">
                {{ selectedCompany || "Tüm Müşteriler" }}
                <ChevronDownIcon class="w-4 h-4 ml-2" />
              </span>
            </button>

            <div
              v-if="dropdownOpen"
              class="absolute z-50 w-full bg-white border rounded-md shadow-lg mt-1 max-h-48 overflow-auto"
            >
              <div
                class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
                @click="selectCompany('')"
              >
                Tüm Firmalar
              </div>
              <div
                v-for="comp in uniqueCompanies"
                :key="comp"
                class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
                @click="selectCompany(comp)"
              >
                {{ comp }}
              </div>
            </div>
          </div>

          <!-- Sıfırlama -->
          <button
            @click="resetFilters"
            class="border px-4 py-2 rounded-md text-gray-700 hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
          >
            Filtreleri Sıfırla
          </button>
        </div>
        <!-- Custom Dropdown -->
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg shadow rounded-t-none border-t">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              @click="sortBy(header.key)"
              class="px-4 py-3 text-left text-sm font-semibold text-[#646B72] pt-4 cursor-pointer hover:text-[#FE9F43] transition select-none"
            >
              {{ header.label }}
              <span v-if="sortKey === header.key">
                {{ sortOrder === "asc" ? "▲" : "▼" }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200 text-sm text-[#646B72]">
          <tr
            v-for="item in sortedCustomers"
            :key="item.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ item.companyName }}</td>
            <td class="px-4 py-2">{{ item.email }}</td>
            <td class="px-4 py-2">{{ item.taxNumber }}</td>
            <td class="px-4 py-2">{{ item.taxOffice }}</td>
            <td class="px-4 py-2">{{ item.invoiceTitle }}</td>
            <td class="px-4 py-2">{{ item.invoiceAddress }}</td>
            <td class="px-4 py-2">{{ item.phone }}</td>
            <td class="p-3">
              <div class="flex gap-2">
                <router-link
                  :to="{
                    name: 'customerInfo',
                    params: { id: item.id },
                  }"
                  class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                >
                  <EyeIcon class="w-5 h-5 text-gray-600" />
                </router-link>

                <router-link
                  :to="{
                    name: 'setCustomer',
                    params: { id: item.id },
                  }"
                  class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </router-link>

                <button
                  @click="removeCustomer(item.id)"
                  class="flex justify-center item center p-2 border [#E6EAED] text-[#092C4C] hover:bg-[#092C4C] hover:border-[#092C4C] hover:text-white rounded-md transition"
                >
                  <TrashIcon class="w-5 h-5" />
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
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useCustomerStore } from "@/stores/customer";
import { useUserStore } from "@/stores/user";
import Swal from "sweetalert2";
import router from "@/router";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  FunnelIcon,
  ChevronDownIcon,
} from "@heroicons/vue/24/outline";

const customerStore = useCustomerStore();
const userStore = useUserStore();
const isLoading = ref(true);
const sortKey = ref("");
const sortOrder = ref("asc");

// Yeni eklenen
const searchTerm = ref("");
const selectedCompany = ref("");
const openFilter = ref(false);

const headers = [
  { key: "name", label: "Firma Adı" },
  { key: "email", label: "Mail Adresi" },
  { key: "taxNumber", label: "Vergi Numarası" },
  { key: "taxOffice", label: "Vergi Dairesi" },
  { key: "invoiceTitle", label: "Fatura Başlığı" },
  { key: "invoiceAddress", label: "Fatura Adresi" },
  { key: "phone", label: "Telefon Numarası" },
  { key: "description", label: "İşlemler" },
];

onMounted(async () => {
  await customerStore.fetchCustomers();
  isLoading.value = false;
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const uniqueCompanies = computed(() => {
  const names = customerStore.customerList.map((c) => c.companyName);
  return [...new Set(names)];
});

const filteredCustomers = computed(() => {
  return customerStore.customerList
    .filter((item) =>
      item.companyName.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    .filter((item) =>
      selectedCompany.value ? item.companyName === selectedCompany.value : true
    );
});

const sortedCustomers = computed(() => {
  return [...filteredCustomers.value].sort((a, b) => {
    const aVal = a[sortKey.value]?.toString().toLowerCase() || "";
    const bVal = b[sortKey.value]?.toString().toLowerCase() || "";
    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

const removeCustomer = (id) => {
  Swal.fire({
    title: "Emin misiniz?",
    text: "Bu işlem geri alınamaz!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Evet, sil!",
    cancelButtonText: "İptal",
  }).then((result) => {
    if (result.isConfirmed) {
      customerStore.removeByID(id).then(() => {
        Swal.fire("Silindi!", "Müşteri başarıyla silindi.", "success");
      });
    }
  });
};

const dropdownOpen = ref(false);
const dropdownRef = ref(null);

// Tıklama dışında dropdown'ı kapat
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

// Seçim
const selectCompany = (val) => {
  selectedCompany.value = val;
  dropdownOpen.value = false;
};

// Sıfırla
const resetFilters = () => {
  searchTerm.value = "";
  selectedCompany.value = "";
};
</script>
