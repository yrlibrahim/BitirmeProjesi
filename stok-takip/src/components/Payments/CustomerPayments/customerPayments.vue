<template>
  <div class="">
    <div class="">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-[22px] text-[#646B72] font-semibold">
            Gelen Ödemeler
          </h1>
          <h2 class="text-[18px] text-[#646B72] pt-4">
            Gelen Ödemelerinizi Yönetin
          </h2>
        </div>
        <router-link
          to="/add-customer-payment"
          class="btn bg-[#FE9F43] text-white border-[#FE9F43] hover:bg-white hover:text-[#FE9F43] transition rounded-md border px-4 py-2"
        >
          <div class="flex gap-2">
            <BarsArrowDownIcon class="w-5" />Ödeme Ekle
          </div>
        </router-link>
      </div>

      <!-- Arama ve Filtre -->
      <div
        class="flex items-center justify-between p-4 bg-white border shadow-md rounded-t-md"
      >
        <!-- Arama -->
        <input
          v-model="searchTerm"
          placeholder="Müşteri Adına Göre Ara..."
          class="border rounded px-4 py-2 w-full max-w-xs focus:outline-none focus:ring-0"
        />
        <div class="flex gap-2">
          <!-- Müşteri Dropmenu -->
          <div class="relative w-48" ref="dropdownRef">
            <button
              @click="toggleDropdown"
              class="w-full border px-4 py-2 rounded-md text-gray-700 bg-white shadow-sm hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
            >
              <span class="flex justify-between items-center">
                {{ selectedCustomer || "Tüm Müşteriler" }}
                <svg
                  class="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            <div
              v-if="dropdownOpen"
              class="absolute z-50 w-full mt-1 bg-white border rounded shadow-md max-h-60 overflow-y-auto"
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

          <!-- Filtreyi Sıfırla -->
          <button
            @click="resetFilters"
            class="border px-4 py-2 rounded-md text-gray-700 hover:bg-[#FE9F43] hover:text-white hover:border-[#FE9F43] transition"
          >
            Sıfırla
          </button>
        </div>
      </div>

      <!-- Ödeme Tablosu -->
      <div class="overflow-auto rounded border">
        <table class="min-w-full divide-y divide-gray-200 text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th
                v-for="header in headers"
                :key="header.key"
                @click="sortBy(header.key)"
                class="px-4 py-2 text-left cursor-pointer hover:text-[#FE9F43] transition"
              >
                {{ header.label }}
                <span v-if="sortKey === header.key">
                  {{ sortOrder === "asc" ? "▲" : "▼" }}
                </span>
              </th>
              <th class="px-4 py-2 text-left">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="payment in sortedPayments"
              :key="payment.id"
              class="border-t hover:bg-gray-50"
            >
              <td class="px-4 py-2">{{ formatDate(payment.date) }}</td>
              <td class="px-4 py-2">{{ payment.type }}</td>
              <td class="px-4 py-2">{{ payment.companyName }}</td>
              <td class="px-4 py-2">
                {{ payment.amount.toLocaleString("tr-TR") }}₺
              </td>

              <td class="px-4 py-2 flex gap-2">
                <button
                  @click="openDetailModal(payment)"
                  class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                >
                  <EyeIcon class="w-5 h-5 text-gray-600" />
                </button>
                <button
                  @click="openEditModal(payment)"
                  class="p-2 border border-[#E6EAED] hover:bg-gray-200 rounded-md"
                >
                  <PencilSquareIcon class="w-5 h-5" />
                </button>
                <button
                  @click="deletePayment(payment.id)"
                  class="p-2 border border-[#E6EAED] hover:bg-[#092C4C] hover:text-[white] hover:border-[#092C4C] transition rounded-md"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Detay Modal -->

    <div
      v-if="showDetailModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h3 class="text-xl font-semibold text-center pb-2 mb-4">
          Ödeme Detayı
        </h3>

        <table
          class="w-full text-sm text-left text-gray-700 border border-gray-300"
        >
          <tbody>
            <tr class="border-b">
              <td class="px-4 py-2 w-1/3 font-medium bg-gray-50">Müşteri:</td>
              <td class="px-4 py-2">{{ selectedPayment.companyName }}</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 w-1/3 font-medium bg-gray-50">Tutar:</td>
              <td class="px-4 py-2">{{ selectedPayment.amount }} ₺</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 w-1/3 font-medium bg-gray-50">Tür:</td>
              <td class="px-4 py-2">{{ selectedPayment.type }}</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 w-1/3 font-medium bg-gray-50">Açıklama:</td>
              <td class="px-4 py-2">{{ selectedPayment.description }}</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 w-1/3 font-medium bg-gray-50">Tarih:</td>
              <td class="px-4 py-2">{{ formatDate(selectedPayment.date) }}</td>
            </tr>
          </tbody>
        </table>

        <div class="flex justify-end gap-2 pt-4 mt-4">
          <button
            class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            @click="showDetailModal = false"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>

    <!--  Düzenleme Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 min-h-screen"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
        <h3 class="text-xl font-semibold text-center border-b pb-2">
          Ödemeyi Düzenle
        </h3>

        <!-- Tutar -->
        <div>
          <label class="block text-sm font-medium">Tutar</label>
          <input
            type="number"
            v-model="editPayment.amount"
            class="w-full border rounded px-4 py-2"
          />
        </div>

        <!-- Tür -->
        <div>
          <label class="block text-sm font-medium">Tür</label>
          <select
            v-model="editPayment.type"
            class="w-full border rounded px-4 py-2"
          >
            <option value="Nakit">Nakit</option>
            <option value="Havale">Havale</option>
            <option value="Çek">Çek</option>
          </select>
        </div>

        <!-- Açıklama -->
        <div>
          <label class="block text-sm font-medium">Açıklama</label>
          <textarea
            v-model="editPayment.description"
            rows="2"
            class="w-full border rounded px-4 py-2"
          ></textarea>
        </div>

        <!-- Tarih -->
        <div>
          <label class="block text-sm font-medium">Tarih</label>
          <input
            type="date"
            v-model="editPayment.date"
            class="w-full border rounded px-4 py-2"
          />
        </div>

        <!-- Butonlar -->
        <div class="flex justify-end gap-2 pt-4 border-t">
          <button
            class="bg-gray-200 px-4 py-2 rounded"
            @click="showEditModal = false"
          >
            İptal
          </button>
          <button
            class="bg-[#FE9F43] text-white px-4 py-2 rounded"
            @click="updatePayment"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  fetchCustomerPayments,
  deleteCustomerPayment,
  updateCustomerPayment,
} from "@/stores/customerPayments";
import { useToast } from "vue-toast-notification";
import Swal from "sweetalert2";
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  BarsArrowDownIcon,
} from "@heroicons/vue/24/outline";

const payments = ref([]);
const showDetailModal = ref(false);
const showEditModal = ref(false);
const selectedPayment = ref(null);
const editPayment = ref({});
const $toast = useToast();

// Varsayılan olarak tarih sıralaması (en yeni önce)
const sortKey = ref("date");
const sortOrder = ref("desc");
const searchTerm = ref("");
const selectedCustomer = ref("");
const dropdownOpen = ref(false);
const dropdownRef = ref(null);

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectCustomer = (customer) => {
  selectedCustomer.value = customer;
  dropdownOpen.value = false;
};

onMounted(() => {
  document.addEventListener("click", (e) => {
    if (dropdownRef.value && !dropdownRef.value.contains(e.target)) {
      dropdownOpen.value = false;
    }
  });
});

onMounted(async () => {
  payments.value = await fetchCustomerPayments();
});

// Tarih formatlama fonksiyonu
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

const openDetailModal = (payment) => {
  selectedPayment.value = payment;
  showDetailModal.value = true;
};

const openEditModal = (payment) => {
  editPayment.value = { ...payment };
  showEditModal.value = true;
};

const updatePayment = async () => {
  try {
    await updateCustomerPayment(editPayment.value.id, {
      amount: Number(editPayment.value.amount),
      type: editPayment.value.type,
      description: editPayment.value.description,
      date: editPayment.value.date, // ✅ tarih de eklendi
    });
    showEditModal.value = false;
    payments.value = await fetchCustomerPayments();
    $toast.success("Ödeme güncellendi.");
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    $toast.error("Bir hata oluştu.");
  }
};

const deletePayment = async (id) => {
  const result = await Swal.fire({
    title: "Emin misiniz?",
    text: "Bu ödeme kaydı silinecek ve geri alınamaz!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FE9F43",
    cancelButtonColor: "#092C4C",
    confirmButtonText: "Evet, sil",
    cancelButtonText: "Vazgeç",
  });

  if (result.isConfirmed) {
    try {
      await deleteCustomerPayment(id);
      payments.value = await fetchCustomerPayments();
      $toast.success("Ödeme başarıyla silindi.");
      Swal.fire("Silindi!", "Ödeme başarıyla silindi.", "success");
    } catch (error) {
      console.error("Silme hatası:", error);
      $toast.error("Silme sırasında hata oluştu.");
    }
  }
};
// Sıralama yapılacak başlık ve anahtar eşleştirmesi
const headers = [
  { label: "Tarih", key: "date" },
  { label: "Tür", key: "type" },
  { label: "Müşteri", key: "companyName" },
  { label: "Tutar (₺)", key: "amount" },
];

// Sıralama işlemi
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "asc";
  }
};

// Müşteriye göre filtreleme ve arama
const uniqueCustomers = computed(() => {
  const customerNames = payments.value.map((p) => p.companyName);
  return [...new Set(customerNames)];
});

const filteredPayments = computed(() => {
  return payments.value
    .filter((item) =>
      item.companyName.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    .filter((item) =>
      selectedCustomer.value
        ? item.companyName === selectedCustomer.value
        : true
    );
});

// Sıralanmış ödemeler
const sortedPayments = computed(() => {
  return [...filteredPayments.value].sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    // Tutar (amount) sıralaması için sayısal sıralama
    if (sortKey.value === "amount") {
      aVal = parseFloat(aVal) || 0;
      bVal = parseFloat(bVal) || 0;
      return sortOrder.value === "asc" ? aVal - bVal : bVal - aVal;
    }

    // Diğer veriler için alfabetik sıralama
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
