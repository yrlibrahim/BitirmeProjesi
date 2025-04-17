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
      <h1 class="text-2xl font-bold mb-4">Şirketler</h1>
      <div v-if="!userStore.user.isAdmin">
        <button
          @click="router.push('/addCompany')"
          class="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Yeni Firma Ekle
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
            v-for="item in sortedCompanies"
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
            <td class="px-4 py-2 flex items-center gap-2">
              <button
                class="p-2 rounded hover:bg-gray-100"
                @click="goToCompanyInfo(item.id)"
              >
                <font-awesome-icon icon="eye" />
              </button>
              <div v-if="!userStore.user.isAdmin">
                <button
                  class="p-2 rounded hover:bg-gray-100"
                  @click="goToSetCompany(item.id)"
                >
                  <font-awesome-icon icon="pen-to-square" />
                </button>
                <button
                  class="p-2 rounded hover:bg-gray-100 text-red-500"
                  @click="removeCompany(item.id)"
                >
                  <font-awesome-icon icon="trash" />
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
import { useCompanyStore } from "@/stores/company";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import Swal from "sweetalert2";

const companyStore = useCompanyStore();
const userStore = useUserStore();
const isLoading = ref(true);
const sortKey = ref("");
const sortOrder = ref("asc");

const headers = [
  { key: "companyName", label: "Firma Adı" },
  { key: "email", label: "Mail Adresi" },
  { key: "taxNumber", label: "Vergi Numarası" },
  { key: "taxOffice", label: "Vergi Dairesi" },
  { key: "invoiceTitle", label: "Fatura Başlığı" },
  { key: "invoiceAddress", label: "Fatura Adresi" },
  { key: "phone", label: "Telefon Numarası" },
  { key: "description", label: "Açıklama" },
];

// Sayfa açıldığında şirket verilerini çek
onMounted(async () => {
  await companyStore.fetchCompanies();
  isLoading.value = false;
});

// Sıralama fonksiyonu
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

const sortedCompanies = computed(() => {
  return [...companyStore.companyList].sort((a, b) => {
    const aVal = a[sortKey.value]?.toString().toLowerCase() || "";
    const bVal = b[sortKey.value]?.toString().toLowerCase() || "";
    if (aVal < bVal) return sortOrder.value === "asc" ? -1 : 1;
    if (aVal > bVal) return sortOrder.value === "asc" ? 1 : -1;
    return 0;
  });
});
// Urun silme fonksiyonu

const removeCompany = (itemID) => {
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
      companyStore.removeByID(itemID).then(() => {
        Swal.fire("Silindi!", "Firma başarıyla silindi.", "success");
      });
    }
  });
};

// Firma detay sayfasi
const goToCompanyInfo = (id) => {
  router.push({ name: "companyInfo", params: { id } });
};
// Firma set sayfasi
const goToSetCompany = (id) => {
  router.push({ name: "setCompany", params: { id } });
};
</script>

<style scoped>
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
