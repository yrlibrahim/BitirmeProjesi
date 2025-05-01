<template>
  <div class="p-6 space-y-8">
    <h1 class="text-2xl font-bold mb-6">Satış Faturası Oluştur</h1>

    <div class="overflow-hidden">
      <div class="space-y-6">
        <!-- Müşteri Seçimi & Fatura No -->
        <div class="flex flex-wrap md:flex-nowrap items-center gap-4">
          <!-- Müşteri Dropdown -->
          <div class="flex-1 min-w-[200px]">
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
                  v-for="cust in customerStore.customerList"
                  :key="cust.id"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  @click="selectCustomer(cust)"
                >
                  {{ cust.companyName }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Fatura No -->
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm font-medium mb-1"
              >Fatura Numarası</label
            >
            <input
              type="text"
              v-model="invoiceNo"
              placeholder="Örn: SF-2025-001"
              class="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>

        <!-- Ürün Satırları -->
        <div class="space-y-6 border-t pt-6">
          <h3 class="text-xl font-semibold">Mal/Hizmet Bilgileri</h3>
          <div
            class="grid grid-cols-[40px_repeat(9,minmax(0,1fr))] gap-2 font-semibold text-sm text-gray-600 px-1 ms-5"
          >
            <span></span>
            <span>Stok Kodu</span>
            <span>Ad</span>
            <span>Marka</span>
            <span>Model</span>
            <span>Adet</span>
            <span>Fiyat</span>
            <span>KDV %</span>
            <span>İskonto %</span>
            <span>Toplam</span>
          </div>

          <div
            v-for="(item, index) in productList"
            :key="index"
            class="grid grid-cols-[40px_repeat(9,minmax(0,1fr))] gap-2 bg-gray-50 p-4 rounded-md border items-center"
          >
            <button
              @click="removeRow(index)"
              class="text-red-500 hover:text-red-700"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
            <input
              v-model="item.sku"
              @change="onSKUChange(index)"
              placeholder="Stok Kodu"
              class="border rounded px-2 py-1"
            />
            <input
              v-model="item.name"
              disabled
              placeholder="Ad"
              class="border rounded px-2 py-1 bg-gray-100"
            />
            <input
              v-model="item.brand"
              disabled
              placeholder="Marka"
              class="border rounded px-2 py-1 bg-gray-100"
            />
            <input
              v-model="item.model"
              disabled
              placeholder="Model"
              class="border rounded px-2 py-1 bg-gray-100"
            />
            <input
              type="text"
              :value="item.quantity"
              @input="onRawInput($event, 'quantity', index)"
              class="border rounded px-2 py-1"
            />
            <input
              type="text"
              :value="formatCurrency(item.price)"
              @input="onRawInput($event, 'price', index)"
              @blur="calculateRowTotal(index)"
              class="border rounded px-2 py-1"
            />
            <input
              type="text"
              :value="item.tax"
              @input="onRawInput($event, 'tax', index)"
              class="border rounded px-2 py-1"
            />
            <input
              type="text"
              :value="item.discount"
              @input="onRawInput($event, 'discount', index)"
              class="border rounded px-2 py-1"
            />
            <input
              :value="formatCurrency(item.total)"
              readonly
              class="border bg-gray-100 rounded px-2 py-1"
            />
          </div>

          <button
            @click="addRow"
            class="flex items-center btn bg-[#FE9F43] text-white rounded-md border px-4 py-2 hover:bg-white hover:text-[#FE9F43] hover:border-[#FE9F43] transition"
          >
            <PlusCircleIcon class="w-5 me-2" />
            Satır Ekle
          </button>
        </div>

        <!-- Toplamlar -->
        <div
          class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t pt-6"
        >
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

        <!-- Not -->
        <div>
          <label class="block font-semibold mb-1">Not</label>
          <textarea
            v-model="note"
            class="border rounded px-4 py-2 w-full"
            rows="3"
          ></textarea>
        </div>

        <!-- Kaydet -->
        <div class="text-left">
          <button
            @click="submitInvoice"
            class="btn bg-[#FE9F43] text-white rounded-md border px-4 py-2 hover:bg-white hover:text-[#FE9F43] hover:border-[#FE9F43] transition"
          >
            Faturayı Kaydet
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useCustomerStore } from "@/stores/customer";
import { saveSalesInvoice, getProductBySKU } from "@/stores/salesInvoice";
import { TrashIcon, PlusCircleIcon } from "@heroicons/vue/24/outline";

const customerStore = useCustomerStore();
onMounted(() => {
  customerStore.fetchCustomers();
});

const selectedCustomer = ref(null);
const showDropdown = ref(false);
const invoiceNo = ref("");
const note = ref("");

const selectedCustomerLabel = computed(
  () => selectedCustomer.value?.companyName || "Müşteri seçiniz"
);
function selectCustomer(cust) {
  selectedCustomer.value = cust;
  showDropdown.value = false;
}

const productList = ref([
  {
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
  },
]);

function addRow() {
  productList.value.push({
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
}

function removeRow(index) {
  productList.value.splice(index, 1);
}

async function onSKUChange(index) {
  const sku = productList.value[index].sku;
  const product = await getProductBySKU(sku);
  if (product) {
    Object.assign(productList.value[index], product);
  }
  calculateRowTotal(index);
}

function calculateRowTotal(index) {
  const item = productList.value[index];
  const base = item.price * item.quantity;
  const taxAmount = (base * item.tax) / 100;
  const discountAmount = (base * item.discount) / 100;
  item.total = base + taxAmount - discountAmount;
  item.taxAmount = taxAmount;
}

const subtotal = computed(() =>
  productList.value.reduce((acc, item) => acc + item.price * item.quantity, 0)
);
const totalTax = computed(() =>
  productList.value.reduce(
    (acc, item) => acc + item.price * item.quantity * (item.tax / 100),
    0
  )
);
const totalDiscount = computed(() =>
  productList.value.reduce(
    (acc, item) => acc + item.price * item.quantity * (item.discount / 100),
    0
  )
);
const grandTotal = computed(
  () => subtotal.value + totalTax.value - totalDiscount.value
);

async function submitInvoice() {
  if (!selectedCustomer.value || !invoiceNo.value) {
    alert("Müşteri ve fatura numarası zorunludur.");
    return;
  }

  const invoiceData = {
    customerName: selectedCustomer.value.companyName,
    invoiceNo: invoiceNo.value,
    note: note.value,
  };

  await saveSalesInvoice(invoiceData, productList.value);
  alert("Satış faturası kaydedildi.");
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
  }).format(Number(value) || 0);
};

const onRawInput = (event, field, index) => {
  const rawValue = event.target.value.replace(/[^\d]/g, ""); // Sadece sayılar
  const numericValue = parseFloat(rawValue) / (field === "price" ? 100 : 1); // fiyat için bölme
  productList.value[index][field] = isNaN(numericValue) ? 0 : numericValue;
  calculateRowTotal(index); // her input sonrası toplam hesaplama
};
</script>
