<template>
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

  <div v-else class="p-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold mb-4">Müşteriler</h1>
      <div v-if="!userStore.user.isAdmin">
        <button
          @click="router.push('/addCustomer')"
          class="bg-[#fe9f43] hover:bg-orange-500 text-white px-4 py-2 rounded-md"
        >
          Yeni Müşteri Ekle
        </button>
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg shadow mt-6">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              @click="sortBy(header.key)"
              class="px-4 py-3 text-left text-md font-medium text-gray-700 cursor-pointer hover:text-indigo-500 select-none"
            >
              {{ header.label }}
              <span v-if="sortKey === header.key">
                {{ sortOrder === "asc" ? "▲" : "▼" }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
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
import { ref, computed, onMounted } from "vue";
import { useCustomerStore } from "@/stores/customer";
import { useUserStore } from "@/stores/user";
import Swal from "sweetalert2";
import router from "@/router";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";

const customerStore = useCustomerStore();
const userStore = useUserStore();
const isLoading = ref(true);
const sortKey = ref("");
const sortOrder = ref("asc");

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

// Veri çekme
onMounted(async () => {
  await customerStore.fetchCustomers();
  isLoading.value = false;
});

// Sıralama
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const sortedCustomers = computed(() => {
  return [...customerStore.customerList].sort((a, b) => {
    const aVal = a[sortKey.value]?.toString().toLowerCase() || "";
    const bVal = b[sortKey.value]?.toString().toLowerCase() || "";
    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});

// Silme işlemi
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

// Sayfa yönlendirmeleri
const goToCustomerInfo = (id) => {
  router.push({ name: "customerInfo", params: { id } });
};
const goToSetCustomer = (id) => {
  router.push({ name: "setCustomer", params: { id } });
};
</script>
