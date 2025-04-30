<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Gelen Fatura Oluştur</h1>

    <Form @submit="onSubmit" class="space-y-6">
      <!-- ✅ Firma Seçimi -->
      <div class="bg-white border rounded-md p-4 shadow">
        <h2 class="text-xl font-semibold mb-4">Fatura Bilgileri</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Firma Seç *</label>
            <select v-model="formValues.clientId" class="form-input" required>
              <option disabled value="">Firma Seç</option>
              <option
                v-for="firm in companyStore.companys"
                :key="firm.id"
                :value="firm.id"
              >
                {{ firm.companyName }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- ✅ Ürünler -->
      <div class="bg-white border rounded-md p-4 shadow">
        <h2 class="text-xl font-semibold mb-4">Ürünler</h2>

        <div
          v-for="(item, index) in products"
          :key="item.key"
          class="grid grid-cols-1 md:grid-cols-6 gap-4 items-start mb-4"
        >
          <div class="col-span-2">
            <label class="form-label">Stok Kodu</label>
            <input
              v-model="item.value.sku"
              class="form-input"
              @blur="autoFillProduct(item.value)"
            />
          </div>

          <div>
            <label class="form-label">Adet</label>
            <input
              v-model.number="item.value.quantity"
              type="number"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">Fiyat</label>
            <input
              v-model.number="item.value.price"
              type="number"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">KDV (%)</label>
            <input
              v-model.number="item.value.taxRate"
              type="number"
              class="form-input"
            />
          </div>

          <div>
            <label class="form-label">İskonto (%)</label>
            <input
              v-model.number="item.value.discount"
              type="number"
              class="form-input"
            />
          </div>

          <div class="col-span-full text-sm text-gray-600 mt-1">
            {{ item.value.name }} / {{ item.value.brand }} /
            {{ item.value.model }} / {{ item.value.category }} /
            {{ item.value.subCategory }}
          </div>
        </div>

        <button type="button" class="text-blue-500" @click="addProductRow">
          + Ürün Ekle
        </button>
        <p class="text-xs text-gray-500 mt-2">
          Toplam Ürün Sayısı: {{ products.length }}
        </p>
      </div>

      <!-- ✅ Toplamlar -->
      <div class="bg-white border rounded-md p-4 shadow">
        <h2 class="text-xl font-semibold mb-4">Toplamlar</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label class="form-label">Ara Toplam</label>
            <div class="form-input bg-gray-100">{{ totalSubtotal }} ₺</div>
          </div>
          <div>
            <label class="form-label">Toplam KDV</label>
            <div class="form-input bg-gray-100">{{ totalTax }} ₺</div>
          </div>
          <div>
            <label class="form-label">Net Toplam</label>
            <div class="form-input bg-gray-100 font-bold text-green-700">
              {{ totalNet }} ₺
            </div>
          </div>
        </div>
      </div>

      <!-- ✅ Açıklama ve Kaydet -->
      <div class="bg-white border rounded-md p-4 shadow">
        <Field name="notes" v-slot="{ field }">
          <label class="form-label">Açıklama</label>
          <textarea v-bind="field" rows="3" class="form-input" />
        </Field>

        <div class="text-center mt-6">
          <button
            type="submit"
            class="bg-[#fe9f43] text-white px-6 py-2 rounded-md hover:bg-orange-500"
          >
            Faturayı Kaydet
          </button>
        </div>
      </div>
    </Form>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { Form, Field, useForm, useFieldArray } from "vee-validate";
import { useCompanyStore } from "@/stores/company";
import { useInvoiceStore } from "@/stores/invoice";

const companyStore = useCompanyStore();
const invoiceStore = useInvoiceStore();

onMounted(() => {
  companyStore.fetchCompanies();
});

const { values: formValues } = useForm({
  initialValues: {
    type: "gelen",
    clientId: "",
    notes: "",
    products: [],
  },
});

const { fields: products, push } = useFieldArray("products");

const addProductRow = () => {
  push({
    sku: "",
    name: "",
    quantity: 1,
    price: 0,
    discount: 0,
    taxRate: 20,
    brand: "",
    model: "",
    category: "",
    subCategory: "",
  });
};

const autoFillProduct = async (item) => {
  const found = await invoiceStore.getProductBySku(item.sku);
  if (found) {
    Object.assign(item, {
      name: found.name || "",
      brand: found.brand || "",
      model: found.model || "",
      category: found.category || "",
      subCategory: found.subCategory || "",
      price: found.price || 0,
    });
  }
};

const totalSubtotal = computed(() =>
  formValues.products.reduce((acc, item) => acc + item.quantity * item.price, 0)
);
const totalTax = computed(() =>
  formValues.products.reduce((acc, item) => {
    const net = item.quantity * item.price * (1 - item.discount / 100);
    return acc + (net * item.taxRate) / 100;
  }, 0)
);
const totalNet = computed(() =>
  formValues.products.reduce((acc, item) => {
    const net = item.quantity * item.price * (1 - item.discount / 100);
    const tax = (net * item.taxRate) / 100;
    return acc + net + tax;
  }, 0)
);

const onSubmit = async (values) => {
  await invoiceStore.addInvoiceWithStock({
    ...values,
    notes: values.notes || "",
    taxAmount: totalTax.value,
    netAmount: totalNet.value,
    totalAmount: totalSubtotal.value,
  });
};
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.form-input {
  @apply w-full border border-gray-300 px-4 py-2 rounded-md focus:ring-2 focus:ring-orange-400 focus:outline-none;
}
</style>
