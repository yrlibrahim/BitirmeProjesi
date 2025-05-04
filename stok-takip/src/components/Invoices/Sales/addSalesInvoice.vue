<template>
  <div class="">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-[22px] text-[#646B72] font-semibold">Fatura Oluştur</h1>
        <p class="text-[18px] text-[#646B72] pt-4">Yeni Gelen Fatura Ekle</p>
      </div>

      <button
        class="border border-[#092C4C] bg-[#092C4C] rounded-md p-2 text-[#ffffff] hover:text-[#092C4C] hover:bg-[white] flex items-center gap-3 transition"
        @click="router.back()"
      >
        <ArrowUturnLeftIcon class="w-5 h-5" />
        Geri Dön
      </button>
    </div>

    <div
      class="bg-[#ffffff] mt-4 px-4 p-2 rounded-lg border overflow-scroll border-[#c1c7cc]"
    >
      <div class="space-y-4">
        <p class="text-[#646B72] text-[18px] font-semibold border-b mb-4 p-2">
          Fatura Bilgileri
        </p>
        <!-- Müşteri Seçimi & Fatura No -->
        <div class="flex flex-wrap md:flex-nowrap items-center gap-4">
          <!-- Müşteri Dropdown -->
          <div class="flex-1 min-w-[200px]">
            <label class="block text-sm text-[#646B72] mb-1">Müşteri Seç</label>
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
        <div class="space-y-4 border-t pt-4">
          <h3 class="text-[18px] text-[#646B72] font-semibold">
            Mal/Hizmet Bilgileri
          </h3>
          <div
            class="grid grid-cols-[40px_repeat(9,minmax(0,1fr))] gap-2 font-semibold text-sm text-[#646B72] px-1 ms-5"
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
              class="flex justify-center item center py-1 border border-[#092C4C] text-[#092C4C] hover:bg-[#092C4C] hover:text-white rounded-md"
            >
              <TrashIcon class="w-4 h-5" />
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
              type="number"
              v-model.number="item.quantity"
              @input="calculateRowTotal(index)"
              class="border rounded px-2 py-1"
            />
            <input
              type="number"
              v-model.number="item.price"
              @input="calculateRowTotal(index)"
              class="border rounded px-2 py-1"
            />
            <input
              type="number"
              v-model.number="item.tax"
              @input="calculateRowTotal(index)"
              class="border rounded px-2 py-1"
            />
            <input
              type="number"
              v-model.number="item.discount"
              @input="calculateRowTotal(index)"
              class="border rounded px-2 py-1"
            />
            <input
              :value="formatCurrency(item.total)"
              readonly
              class="border bg-gray-100 rounded px-2 py-1 text-[#646B72]"
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
        <div>
          <p class="text-[18px] text-[#646B72] border-t pt-4 font-semibold">
            Toplamlar
          </p>
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border-t mt-4 pt-4"
          >
            <div>
              <label class="block text-sm font-medium mb-1">Ara Toplam</label>
              <input
                :value="formatCurrency(subtotal)"
                readonly
                class="w-full px-4 py-2 border rounded bg-gray-50 text-[#646B72]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Toplam KDV</label>
              <input
                :value="formatCurrency(totalTax)"
                readonly
                class="w-full px-4 py-2 border rounded bg-gray-50 text-[#646B72]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1"
                >Toplam İskonto</label
              >
              <input
                :value="formatCurrency(-totalDiscount)"
                readonly
                class="w-full px-4 py-2 border rounded bg-gray-50 text-[#646B72]"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Genel Toplam</label>
              <input
                :value="formatCurrency(grandTotal)"
                readonly
                class="w-full px-4 py-2 border rounded bg-gray-50 text-[#646B72]"
              />
            </div>
          </div>
        </div>

        <!-- Not -->
        <div class="mt-4 border-t pt-4">
          <p class="text-[18px] text-[#646B72] font-semibold mb-4">Not</p>
          <textarea
            v-model="note"
            class="border rounded px-4 py-2 w-full"
            placeholder="Faturaya not ekleyin..."
            rows="4"
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
import { useRouter } from "vue-router";
import {
  TrashIcon,
  PlusCircleIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/vue/24/outline";

// Router
const router = useRouter();

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
    tax: 20,
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
    customerId: selectedCustomer.value.id,
    companyName: selectedCustomer.value.companyName,
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
</script>
