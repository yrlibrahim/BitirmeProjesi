<template>
  <div class="">
    <div class="p-4">
      <!-- Başlık ve Yeni Ekle Butonu -->
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold">Tüm Müşteri Ödemeleri</h2>
        <router-link
          to="/add-customer-payment"
          class="bg-[#FE9F43] hover:bg-orange-500 text-white px-4 py-2 rounded transition"
        >
          Yeni Ödeme Ekle
        </router-link>
      </div>

      <!-- Arama ve Filtre -->
      <div class="flex items-center gap-4 mb-4">
        <!-- Arama -->
        <input
          v-model="searchTerm"
          placeholder="Müşteri Adına Göre Ara..."
          class="border rounded px-4 py-2 w-full max-w-xs"
        />

        <!-- Müşteri Filtreleme -->
        <select v-model="selectedCustomer" class="border rounded px-4 py-2">
          <option value="">Tüm Müşteriler</option>
          <option
            v-for="customer in uniqueCustomers"
            :key="customer"
            :value="customer"
          >
            {{ customer }}
          </option>
        </select>

        <!-- Filtreyi Sıfırla -->
        <button
          @click="resetFilters"
          class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
        >
          Sıfırla
        </button>
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
              <td class="px-4 py-2">{{ payment.companyName }}</td>
              <td class="px-4 py-2">
                {{ payment.amount.toLocaleString("tr-TR") }}₺
              </td>
              <td class="px-4 py-2">{{ payment.type }}</td>
              <td class="px-4 py-2">{{ payment.description }}</td>
              <td class="px-4 py-2">{{ formatDate(payment.date) }}</td>
              <td class="px-4 py-2 flex gap-2">
                <button
                  @click="openDetailModal(payment)"
                  class="text-blue-500 hover:underline"
                >
                  Detay
                </button>
                <button
                  @click="openEditModal(payment)"
                  class="text-green-500 hover:underline"
                >
                  Düzenle
                </button>
                <button
                  @click="deletePayment(payment.id)"
                  class="text-red-500 hover:underline"
                >
                  Sil
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

    <!-- Düzenleme Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 min-h-screen"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md space-y-4 shadow-lg">
        <h3 class="text-xl font-semibold text-center border-b pb-2">
          Ödemeyi Düzenle
        </h3>

        <div>
          <label class="block text-sm font-medium">Tutar</label>
          <input
            type="number"
            v-model="editPayment.amount"
            class="w-full border rounded px-4 py-2"
          />
        </div>

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

        <div>
          <label class="block text-sm font-medium">Açıklama</label>
          <textarea
            v-model="editPayment.description"
            rows="2"
            class="w-full border rounded px-4 py-2"
          ></textarea>
        </div>

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
  try {
    await deleteCustomerPayment(id);
    payments.value = await fetchCustomerPayments();
    $toast.success("Ödeme silindi.");
  } catch (error) {
    console.error("Silme hatası:", error);
    $toast.error("Silme sırasında hata oluştu.");
  }
};

// Sıralama yapılacak başlık ve anahtar eşleştirmesi
const headers = [
  { label: "Müşteri", key: "companyName" },
  { label: "Tutar (₺)", key: "amount" },
  { label: "Tür", key: "type" },
  { label: "Açıklama", key: "description" },
  { label: "Tarih", key: "date" },
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
