<template>
  <div class="p-6 space-y-8">
    <h2 class="text-2xl font-bold">Gelen Fatura Ekle</h2>

    <!-- 1. Kademe: Firma Seçimi ve Fatura No -->
    <div class="flex items-center gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Firma Seç</label>
        <div class="relative">
          <div
            class="border rounded px-4 py-2 cursor-pointer bg-white shadow-sm"
            @click="showDropdown = !showDropdown"
          >
            {{ selectedCompanyLabel }}
          </div>
          <ul
            v-if="showDropdown"
            class="absolute z-50 mt-1 w-full bg-white border rounded shadow-md max-h-48 overflow-auto"
          >
            <li
              v-for="firma in companys"
              :key="firma.id"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="selectCompany(firma)"
            >
              {{ firma.companyName }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Fatura Numarası -->
      <div>
        <label class="block text-sm font-medium mb-1">Fatura Numarası</label>
        <input
          type="text"
          v-model="invoiceNumber"
          placeholder="Örn: AL-2025-001"
          class="w-full px-4 py-2 border rounded"
        />
      </div>
    </div>

    <!-- 2. Kademe: Ürün Satırları -->
    <div class="space-y-6 border-t pt-6">
      <h3 class="text-xl font-semibold">Mal Hizmet Bilgileri</h3>

      <div
        v-for="(row, index) in productRows"
        :key="index"
        class="p-4 mb-4 space-y-2"
      >
        <div class="flex items-center justify-between gap-5">
          <div class="grid grid-cols-5 gap-4">
            <div>
              <label>Stok Kodu</label>
              <input
                v-model="row.sku"
                @blur="fetchProductDetails(index)"
                placeholder="Stok kodu girin"
                class="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label>Adet</label>
              <input
                type="number"
                v-model.number="row.quantity"
                @input="calculateRowTotal(index)"
                class="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label>Fiyat</label>
              <input
                type="number"
                v-model.number="row.price"
                @input="calculateRowTotal(index)"
                class="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label>Vergi %</label>
              <input
                type="number"
                v-model.number="row.tax"
                @input="calculateRowTotal(index)"
                class="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label>İskonto %</label>
              <input
                type="number"
                v-model.number="row.discount"
                @input="calculateRowTotal(index)"
                class="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div class="flex items-center gap-5">
            <div>
              <label>Toplam</label>
              <input
                type="text"
                :value="`${row.total.toFixed(2)} ₺`"
                readonly
                class="w-full px-3 py-2 border rounded bg-gray-100 text-gray-800"
              />
            </div>

            <button @click="removeRow(index)" class="mt-5">
              <TrashIcon class="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>

        <div v-if="row.name" class="flex text-sm gap-4">
          <p>{{ row.brand }}</p>
          //
          <p>{{ row.model }}</p>
          //
          <p>{{ row.subCategory }}</p>
          //
          <p>{{ row.name }}</p>
        </div>
      </div>

      <button
        @click="addRow"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        + Satır Ekle
      </button>
    </div>

    <!-- 3. Kademe: Toplamlar -->
    <div class="mt-10 space-y-3 border-t pt-6">
      <h3 class="text-xl font-semibold">Toplamlar</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <p><strong>Ara Toplam:</strong> {{ subtotal.toFixed(2) }} ₺</p>
        <p><strong>Toplam KDV:</strong> {{ totalTax.toFixed(2) }} ₺</p>
        <p>
          <strong>Toplam İskonto:</strong> -{{ totalDiscount.toFixed(2) }} ₺
        </p>
        <p><strong>Genel Toplam:</strong> {{ grandTotal.toFixed(2) }} ₺</p>
      </div>
    </div>

    <!-- 4. Kademe: Not -->
    <div class="mt-10 space-y-4 border-t pt-6">
      <h3 class="text-xl font-semibold">Not</h3>
      <textarea
        v-model="note"
        placeholder="Faturaya not ekleyin..."
        rows="4"
        class="w-full px-4 py-2 border rounded"
      ></textarea>

      <button
        @click="saveInvoice"
        class="mt-4 px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
      >
        Faturayı Kaydet
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import { useCompanyStore } from "@/stores/company";
import { storeToRefs } from "pinia";
import {
  getProductBySKU,
  savePurchaseInvoice,
  increaseStockQuantities,
} from "@/stores/invoice";
import { useRouter } from "vue-router";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { useToast } from "vue-toast-notification";

const toast = useToast();

// Firma store
const companyStore = useCompanyStore();
const { companys } = storeToRefs(companyStore);

// Router
const router = useRouter();

// Fatura bilgileri
const selectedCompany = ref(null);
const invoiceNumber = ref("");
const note = ref("");
const showDropdown = ref(false);

// Seçilen firma label'ı
const selectedCompanyLabel = computed(
  () => selectedCompany.value?.companyName || "Firma seçiniz"
);

// Ürün satırları
const productRows = ref([
  {
    sku: "",
    name: "",
    brand: "",
    model: "",
    category: "",
    subCategory: "",
    quantity: 1,
    price: 0,
    tax: 20,
    discount: 0,
    total: 0,
  },
]);

// Firma listeleme
onMounted(() => {
  companyStore.fetchCompanies();
});

function selectCompany(company) {
  selectedCompany.value = company;
  showDropdown.value = false;
}

// Satır ekle/sil
const addRow = () => {
  productRows.value.push({
    sku: "",
    name: "",
    brand: "",
    model: "",
    category: "",
    subCategory: "",
    quantity: 1,
    price: 0,
    tax: 20,
    discount: 0,
    total: 0,
  });
};

const removeRow = (index) => {
  productRows.value.splice(index, 1);
};

// Stok kodu ile ürün bilgisi çek
const fetchProductDetails = async (index) => {
  const sku = productRows.value[index].sku.trim();
  if (!sku) return;

  const product = await getProductBySKU(sku);
  if (product) {
    productRows.value[index] = {
      ...productRows.value[index],
      ...product,
    };
    calculateRowTotal(index);
  } else {
    toast.error("Stok kodu bulunamadı.");
  }
};

// Satır toplam hesaplama
const calculateRowTotal = (index) => {
  const row = productRows.value[index];
  const unitTotal = row.quantity * row.price;
  const taxAmount = unitTotal * (row.tax / 100);
  const discountAmount = unitTotal * (row.discount / 100);
  row.taxAmount = taxAmount;
  row.total = unitTotal + taxAmount - discountAmount;
};

// Toplamlar
const subtotal = computed(() =>
  productRows.value.reduce((acc, row) => acc + row.price * row.quantity, 0)
);
const totalTax = computed(() =>
  productRows.value.reduce(
    (acc, row) => acc + row.price * row.quantity * (row.tax / 100),
    0
  )
);
const totalDiscount = computed(() =>
  productRows.value.reduce(
    (acc, row) => acc + row.price * row.quantity * (row.discount / 100),
    0
  )
);
const grandTotal = computed(
  () => subtotal.value + totalTax.value - totalDiscount.value
);

// KAYDET
const saveInvoice = async () => {
  if (
    !selectedCompany.value ||
    !invoiceNumber.value ||
    productRows.value.length === 0
  ) {
    alert("Lütfen tüm zorunlu alanları doldurun.");
    return;
  }

  const invoiceData = {
    companyId: selectedCompany.value.id,
    companyName: selectedCompany.value.companyName,
    invoiceNumber: invoiceNumber.value,
    invoiceDate: new Date().toISOString(),
    note: note.value,
  };

  try {
    await savePurchaseInvoice(invoiceData, productRows.value);
    await increaseStockQuantities(productRows.value); // 🔥 stok arttırımı
    toast.success("Fatura ve stok başarıyla kaydedildi!");
    router.push({ name: "home" }); // varsa liste sayfası
  } catch (err) {
    console.error("Fatura/stok kaydında hata:", err);
    toast.error("Fatura kaydedildi ama stok güncellenemedi.");
  }
};
</script>
