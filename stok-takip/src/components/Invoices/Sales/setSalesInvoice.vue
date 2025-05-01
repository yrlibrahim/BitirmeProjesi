<template>
  <div class="p-6 space-y-8">
    <h2 class="text-2xl font-bold">Satış Faturası Düzenle</h2>

    <!-- 1. Kademe: Müşteri ve Fatura No -->
    <div class="flex items-center gap-4">
      <div>
        <label class="block text-sm font-medium mb-1">Müşteri Seç</label>
        <div class="relative">
          <div
            class="border rounded px-4 py-2 cursor-pointer bg-white shadow-sm"
            @click="showDropdown = !showDropdown"
          >
            {{ selectedCustomerLabel }}
          </div>
          <ul
            v-if="showDropdown"
            class="absolute z-50 mt-1 w-full bg-white border rounded shadow-md max-h-48 overflow-auto"
          >
            <li
              v-for="cust in customerList"
              :key="cust.id"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              @click="selectCustomer(cust)"
            >
              {{ cust.companyName }}
            </li>
          </ul>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Fatura Numarası</label>
        <input
          type="text"
          v-model="invoiceNumber"
          class="w-full px-4 py-2 border rounded"
        />
      </div>
    </div>

    <!-- Ürün Satırları -->
    <div
      v-for="(row, index) in productRows"
      :key="index"
      class="grid grid-cols-[40px_repeat(9,minmax(0,1fr))] gap-2 bg-gray-50 p-4 rounded-md border items-center"
    >
      <!-- Çöp butonu -->
      <button @click="removeRow(index)" class="text-red-500 hover:text-red-700">
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
    <button
      @click="addRow"
      class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      + Satır Ekle
    </button>

    <!-- 3. Kademe: Toplamlar -->
    <div class="mt-10 space-y-3 border-t pt-6">
      <h3 class="text-xl font-semibold">Toplamlar</h3>

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
    </div>

    <!-- 4. Kademe: Not ve Güncelle -->
    <div class="mt-10 space-y-4 space-x-4 border-t pt-6">
      <h3 class="text-xl font-semibold">Not</h3>
      <textarea
        v-model="note"
        placeholder="Faturaya not ekleyin..."
        rows="4"
        class="w-full px-4 py-2 border rounded"
      ></textarea>

      <button
        @click="updateInvoice"
        class="mt-4 hover:bg-[#FE9F43] hover:text-white rounded-md border px-4 py-2 bg-white text-[#FE9F43] border-[#FE9F43] transition"
      >
        Faturayı Güncelle
      </button>
      <button
        @click="router.push({ name: 'salesInvoices' })"
        class="px-6 py-2 bg-[#092C4C] text-white border border-[#092C4C] rounded hover:bg-white hover:text-[#092C4C] transition"
      >
        İptal
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useCustomerStore } from "@/stores/customer";
import { storeToRefs } from "pinia";
import {
  getProductBySKU,
  fetchSalesInvoiceById,
  updateSalesInvoice,
} from "@/stores/salesInvoice";
import { TrashIcon } from "@heroicons/vue/24/outline";
import { useToast } from "vue-toast-notification";

const toast = useToast();
const route = useRoute();
const router = useRouter();
const invoiceId = route.params.id;

const customerStore = useCustomerStore();
const { customerList } = storeToRefs(customerStore);

const selectedCustomer = ref(null);
const invoiceNumber = ref("");
const note = ref("");
const showDropdown = ref(false);
const productRows = ref([]);

const selectedCustomerLabel = computed(
  () => selectedCustomer.value?.companyName || "Müşteri seçiniz"
);

onMounted(async () => {
  await customerStore.fetchCustomers();
  try {
    const invoice = await fetchSalesInvoiceById(invoiceId);
    selectedCustomer.value = customerList.value.find(
      (c) => c.companyName === invoice.customerName
    );
    invoiceNumber.value = invoice.invoiceNo;
    note.value = invoice.note || "";
    productRows.value = invoice.products.map((item) => ({ ...item }));
  } catch (err) {
    alert("Fatura verileri getirilemedi.");
    console.error(err);
  }
});

function selectCustomer(customer) {
  selectedCustomer.value = customer;
  showDropdown.value = false;
}

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
    tax: 0,
    discount: 0,
    total: 0,
  });
};

const removeRow = (index) => {
  productRows.value.splice(index, 1);
};

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

const calculateRowTotal = (index) => {
  const row = productRows.value[index];
  const base = row.price * row.quantity;
  const taxAmount = base * (row.tax / 100);
  const discountAmount = base * (row.discount / 100);
  row.taxAmount = taxAmount;
  row.total = base + taxAmount - discountAmount;
};

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

const updateInvoice = async () => {
  if (!selectedCustomer.value || !invoiceNumber.value) {
    alert("Lütfen müşteri ve fatura numarasını girin.");
    return;
  }

  const invoiceData = {
    customerName: selectedCustomer.value.companyName,
    invoiceNo: invoiceNumber.value,
    note: note.value,
  };

  try {
    await updateSalesInvoice(invoiceId, invoiceData, productRows.value);
    toast.success("Fatura güncellendi.");
    router.push({ name: "salesInvoices" });
  } catch (err) {
    toast.error("Hata: Güncelleme başarısız.");
    console.error(err);
  }
};
// Para formatlama
function formatCurrency(value) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(number);
}

// Sayıyı düzgün input'a geri çevirmek
function onRawInput(event, field, index) {
  const raw = event.target.value.replace(/[^\d.,]/g, "").replace(",", ".");
  productRows.value[index][field] = parseFloat(raw) || 0;
}
</script>
