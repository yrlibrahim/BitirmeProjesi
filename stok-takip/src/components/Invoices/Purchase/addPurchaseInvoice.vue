<template>
  <div class="p-6 space-y-8">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">Gelen Fatura Ekle</h2>
      <button
        class="border border-[#092C4C] bg-[#092C4C] rounded-md p-2 text-[#ffffff] hover:text-[#092C4C] hover:bg-[white] flex items-center gap-3 transition"
        @click="router.back()"
      >
        <ArrowUturnLeftIcon class="w-5 h-5" />
        Geri Dön
      </button>
    </div>

    <!-- 1. Kademe: Firma Seçimi ve Fatura No -->
    <div class="flex flex-wrap md:flex-nowrap items-center gap-4">
      <div class="flex-1 min-w-[200px]">
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
      <div class="flex-1 min-w-[200px]">
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
      <h3 class="text-xl font-semibold">Mal/Hizmet Bilgileri</h3>

      <!-- Başlık Satırı -->
      <div
        class="grid grid-cols-[40px_repeat(9,minmax(0,1fr))] gap-2 text-sm font-semibold text-gray-600 px-1 ms-5"
      >
        <span></span>
        <span>Stok Kodu</span>
        <span>Ad</span>
        <span>Marka</span>
        <span>Model</span>
        <span>Adet</span>
        <span>Fiyat</span>
        <span>Vergi %</span>
        <span>İskonto %</span>
        <span>Toplam</span>
      </div>

      <!-- Ürün Satırları -->
      <div
        v-for="(row, index) in productRows"
        :key="index"
        class="grid grid-cols-[40px_repeat(9,minmax(0,1fr))] gap-2 bg-gray-50 p-4 rounded-md border items-center"
      >
        <!-- Çöp butonu -->
        <button
          @click="removeRow(index)"
          class="text-red-500 hover:text-red-700"
        >
          <TrashIcon class="w-5 h-5" />
        </button>

        <!-- Inputlar -->
        <input
          v-model="row.sku"
          @blur="fetchProductDetails(index)"
          placeholder="Stok Kodu"
          class="border rounded px-2 py-1"
        />
        <input
          v-model="row.name"
          disabled
          placeholder="Ad"
          class="border rounded px-2 py-1 bg-gray-100"
        />
        <input
          v-model="row.brand"
          disabled
          placeholder="Marka"
          class="border rounded px-2 py-1 bg-gray-100"
        />
        <input
          v-model="row.model"
          disabled
          placeholder="Model"
          class="border rounded px-2 py-1 bg-gray-100"
        />
        <input
          type="number"
          v-model.number="row.quantity"
          @input="calculateRowTotal(index)"
          class="border rounded px-2 py-1"
        />
        <input
          type="text"
          :value="formatCurrency(row.price)"
          @input="onRawInput($event, 'price', index)"
          @blur="calculateRowTotal(index)"
          class="border rounded px-2 py-1"
        />
        <input
          type="number"
          v-model.number="row.tax"
          @input="calculateRowTotal(index)"
          class="border rounded px-2 py-1"
        />
        <input
          type="number"
          v-model.number="row.discount"
          @input="calculateRowTotal(index)"
          class="border rounded px-2 py-1"
        />
        <input
          :value="formatCurrency(row.total)"
          readonly
          class="border bg-gray-100 rounded px-2 py-1 text-gray-700"
        />
      </div>

      <!-- Satır Ekle Butonu -->
      <button
        @click="addRow"
        class="flex items-center btn bg-[#FE9F43] text-white rounded-md border px-4 py-2 hover:bg-white hover:text-[#FE9F43] hover:border-[#FE9F43] transition"
      >
        <PlusCircleIcon class="w-5 me-2" />
        Satır Ekle
      </button>
    </div>

    <!-- 3. Kademe: Toplamlar -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <label class="block text-sm font-medium mb-1">Ara Toplam</label>
        <input
          :value="formatCurrency(subtotal)"
          readonly
          class="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Toplam KDV</label>
        <input
          :value="formatCurrency(totalTax)"
          readonly
          class="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Toplam İskonto</label>
        <input
          :value="formatCurrency(-totalDiscount)"
          readonly
          class="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700"
        />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Genel Toplam</label>
        <input
          :value="formatCurrency(grandTotal)"
          readonly
          class="w-full px-4 py-2 border rounded bg-gray-100 text-gray-700 font-semibold"
        />
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
        class="mt-4 btn bg-[#FE9F43] text-white rounded-md border px-4 py-2 hover:bg-white hover:text-[#FE9F43] hover:border-[#FE9F43] transition"
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
import {
  TrashIcon,
  PlusCircleIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/vue/24/outline";
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
    await increaseStockQuantities(productRows.value);
    toast.success("Fatura ve stok başarıyla kaydedildi!");
    router.push({ name: "home" });
  } catch (err) {
    console.error("Fatura/stok kaydında hata:", err);
    toast.error("Fatura kaydedildi ama stok güncellenemedi.");
  }
};
const formatCurrency = (value) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
};

// Kullanıcı input girdikçe formatı kaldır, sayı olarak kaydet
const onRawInput = (event, field, index) => {
  const rawValue = event.target.value.replace(/\D/g, "");
  const numericValue = parseFloat(rawValue) / 100;
  productRows.value[index][field] = isNaN(numericValue) ? 0 : numericValue;
  calculateRowTotal(index);
};
</script>
