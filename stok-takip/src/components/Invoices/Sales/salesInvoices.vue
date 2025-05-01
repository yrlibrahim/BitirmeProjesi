<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Satış Faturaları</h1>

    <div v-if="isLoading">Yükleniyor...</div>

    <div v-else>
      <div class="bg-white border shadow-md rounded-md overflow-hidden mt-6">
        <!-- Arama ve Filtre -->
        <div class="p-4 flex flex-wrap justify-between items-center gap-2">
          <!-- Arama -->
          <div class="relative border rounded-md w-full max-w-xs">
            <input
              type="text"
              v-model="searchTerm"
              class="pl-10 pr-4 py-2 w-full rounded-md focus:outline-none focus:ring-0 border-none"
              placeholder="Fatura No'da Ara..."
            />
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-gray-500"
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

          <!-- Filtreler -->
          <div class="flex gap-3 items-center">
            <!-- Tarih Aralığı -->
            <button
              @click="openDatePicker"
              class="border px-4 py-2 rounded-md text-gray-700 hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
            >
              <CalendarDateRangeIcon class="w-5 h-5" />
            </button>

            <!-- Müşteri Dropdown -->
            <div class="relative w-48" ref="brandDropdownRef">
              <button
                @click="openBrand = !openBrand"
                class="w-full border px-4 py-2 rounded-md text-gray-700 hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
              >
                <span class="flex items-center justify-between">
                  {{ selectedBrand || "Tüm Müşteriler" }}
                  <ChevronDownIcon class="w-4 h-4 ml-2" />
                </span>
              </button>

              <div
                v-if="openBrand"
                class="absolute z-50 w-48 mt-1 bg-white border rounded-md shadow-lg"
              >
                <div
                  class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
                  @click="selectBrand('')"
                >
                  Tüm Müşteriler
                </div>
                <div
                  v-for="brand in brands"
                  :key="brand"
                  class="px-4 py-2 hover:bg-[#FE9F431A] hover:text-[#FE9F43] cursor-pointer"
                  @click="selectBrand(brand)"
                >
                  {{ brand }}
                </div>
              </div>
            </div>

            <!-- Reset -->
            <button
              @click="resetFilters"
              class="border px-4 py-2 rounded-md text-gray-700 hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        </div>

        <!-- Tablo -->
        <div>
          <table class="min-w-full bg-white border">
            <thead class="bg-[#F9FAFB] text-gray-600 text-left">
              <tr>
                <th class="p-3">Fatura No</th>
                <th class="p-3">Müşteri</th>
                <th class="p-3">Tarih</th>
                <th class="p-3">Toplam</th>
                <th class="p-3 flex justify-center">İşlem</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="fatura in filteredInvoices"
                :key="fatura.id"
                class="border-t hover:bg-gray-50"
              >
                <td class="p-3">{{ fatura.invoiceNo }}</td>
                <td class="p-3">{{ fatura.customerName }}</td>
                <td class="p-3">
                  {{
                    new Date(
                      fatura.createdAt?.seconds * 1000
                    ).toLocaleDateString()
                  }}
                </td>
                <td class="p-3">{{ fatura.totalAmount?.toFixed(2) }} ₺</td>
                <td class="p-3">
                  <div class="flex justify-center gap-2">
                    <router-link
                      :to="{
                        name: 'salesInvoiceInfo',
                        params: { id: fatura.id },
                      }"
                      class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                    >
                      <EyeIcon class="w-5 h-5 text-gray-600" />
                    </router-link>

                    <router-link
                      :to="{
                        name: 'setSalesInvoice',
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useToast } from "vue-toast-notification";
import { fetchSalesInvoices, deleteSalesInvoice } from "@/stores/salesInvoice";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  ChevronDownIcon,
  CalendarDateRangeIcon,
} from "@heroicons/vue/24/outline";

const toast = useToast();
const invoices = ref([]);
const isLoading = ref(true);
const searchTerm = ref("");
const brands = ref([]);
const selectedBrand = ref("");
const openBrand = ref(false);
const brandDropdownRef = ref(null);
const selectedDateRange = ref({ start: null, end: null });

// Müşteri seçimi
const selectBrand = (brand) => {
  selectedBrand.value = brand;
  openBrand.value = false;
};

// Reset filtreler
const resetFilters = () => {
  searchTerm.value = "";
  selectedBrand.value = "";
  selectedDateRange.value = { start: null, end: null };
};

// Müşteri listesini filtrele
const getUniqueBrands = () => {
  const all = invoices.value.map((f) => f.customerName);
  brands.value = [...new Set(all)];
};

// Tarih filtresi
const openDatePicker = async () => {
  const { value: dateRange } = await Swal.fire({
    title: "Tarih Aralığı Seç",
    html: `<input type="text" id="date-range-picker" class="swal2-input" placeholder="Tarih aralığı seçin" />`,
    willOpen: () => {
      flatpickr(document.getElementById("date-range-picker"), {
        mode: "range",
        dateFormat: "Y-m-d",
      });
    },
    preConfirm: () => {
      const value = document.getElementById("date-range-picker").value;
      const [start, end] = value.split(" to ");
      if (!start || !end) return null;
      return { start: new Date(start), end: new Date(end) };
    },
    confirmButtonText: "Filtrele",
    cancelButtonText: "İptal",
    showCancelButton: true,
  });

  if (dateRange) {
    selectedDateRange.value = dateRange;
  }
};

// Filtrelenmiş liste
const filteredInvoices = computed(() => {
  return invoices.value.filter((fatura) => {
    const matchesSearch = fatura.invoiceNo
      ?.toLowerCase()
      .includes(searchTerm.value.toLowerCase());

    const matchesBrand =
      !selectedBrand.value || fatura.customerName === selectedBrand.value;

    const matchesDate =
      !selectedDateRange.value.start ||
      (new Date(fatura.createdAt?.seconds * 1000) >=
        selectedDateRange.value.start &&
        new Date(fatura.createdAt?.seconds * 1000) <=
          selectedDateRange.value.end);

    return matchesSearch && matchesBrand && matchesDate;
  });
});

// Silme işlemi
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Emin misin?",
    text: "Bu satış faturası silinecek!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Evet, sil!",
    cancelButtonText: "Vazgeç",
  });

  if (result.isConfirmed) {
    try {
      await deleteSalesInvoice(id);
      invoices.value = invoices.value.filter((f) => f.id !== id);
      toast.success("Silme işlemi başarılı.");
    } catch (err) {
      toast.error("Silme işlemi başarısız.");
    }
  }
};

// Sayfa yüklenince
onMounted(async () => {
  try {
    invoices.value = await fetchSalesInvoices();
    getUniqueBrands();
  } catch (e) {
    console.error(e);
    toast.error("Faturalar alınamadı.");
  } finally {
    isLoading.value = false;
  }
});
</script>
