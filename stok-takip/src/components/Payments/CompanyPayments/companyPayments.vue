<template>
  <div class="">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold">Firma Ödemeleri</h2>
      <router-link
        to="/add-company-payment"
        class="bg-[#FE9F43] text-white px-4 py-2 rounded hover:bg-orange-500 transition"
      >
        Yeni Ödeme
      </router-link>
    </div>

    <!-- Tablo -->
    <div class="overflow-auto rounded border">
      <table class="min-w-full divide-y divide-gray-200 text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Firma</th>
            <th class="px-4 py-2 text-left">Tutar</th>
            <th class="px-4 py-2 text-left">Tür</th>
            <th class="px-4 py-2 text-left">Açıklama</th>
            <th class="px-4 py-2 text-left">Tarih</th>
            <th class="px-4 py-2 text-left">İşlemler</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="payment in payments"
            :key="payment.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ payment.companyName }}</td>
            <td class="px-4 py-2">
              {{ payment.amount.toLocaleString("tr-TR") }} ₺
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
                class="text-green-600 hover:underline"
              >
                Düzenle
              </button>
              <button
                @click="deletePayment(payment.id)"
                class="text-red-600 hover:underline"
              >
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
              <td class="px-4 py-2 font-medium bg-gray-50 w-1/3">Firma:</td>
              <td class="px-4 py-2">{{ selectedPayment.companyName }}</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 font-medium bg-gray-50">Tutar:</td>
              <td class="px-4 py-2">{{ selectedPayment.amount }} ₺</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 font-medium bg-gray-50">Tür:</td>
              <td class="px-4 py-2">{{ selectedPayment.type }}</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 font-medium bg-gray-50">Açıklama:</td>
              <td class="px-4 py-2">{{ selectedPayment.description }}</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 font-medium bg-gray-50">Tarih:</td>
              <td class="px-4 py-2">{{ formatDate(selectedPayment.date) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-end gap-2 pt-4 mt-4">
          <button
            @click="showDetailModal = false"
            class="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>

    <!-- Düzenleme Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg w-full max-w-md shadow-lg space-y-4">
        <h3 class="text-xl font-semibold text-center border-b pb-2">
          Ödemeyi Düzenle
        </h3>
        <div>
          <label class="block text-sm font-medium">Tutar</label>
          <input
            v-model="editPayment.amount"
            type="number"
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
            class="w-full border rounded px-4 py-2"
            rows="2"
          ></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-4 border-t">
          <button
            @click="showEditModal = false"
            class="bg-gray-200 px-4 py-2 rounded"
          >
            İptal
          </button>
          <button
            @click="updatePayment"
            class="bg-[#FE9F43] text-white px-4 py-2 rounded"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toast-notification";
import {
  fetchCompanyPayments,
  deleteCompanyPayment,
  updateCompanyPayment,
} from "@/stores/companyPayments";

const payments = ref([]);
const showDetailModal = ref(false);
const showEditModal = ref(false);
const selectedPayment = ref({});
const editPayment = ref({});
const $toast = useToast();

onMounted(async () => {
  payments.value = await fetchCompanyPayments();
});

const openDetailModal = (payment) => {
  selectedPayment.value = payment;
  showDetailModal.value = true;
};

const openEditModal = (payment) => {
  editPayment.value = { ...payment };
  showEditModal.value = true;
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}
const updatePayment = async () => {
  try {
    await updateCompanyPayment(editPayment.value.id, {
      amount: Number(editPayment.value.amount),
      type: editPayment.value.type,
      description: editPayment.value.description,
    });
    showEditModal.value = false;
    payments.value = await fetchCompanyPayments();
    $toast.success("Ödeme güncellendi.");
  } catch (err) {
    console.error("Güncelleme hatası:", err);
    $toast.error("Bir hata oluştu.");
  }
};

const deletePayment = async (id) => {
  try {
    await deleteCompanyPayment(id);
    payments.value = await fetchCompanyPayments();
    $toast.success("Ödeme silindi.");
  } catch (err) {
    console.error("Silme hatası:", err);
    $toast.error("Silme sırasında hata oluştu.");
  }
};
</script>
