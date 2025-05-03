<template>
  <!--Loading Iconu-->
  <div v-if="isLoading" class="flex items-center justify-center h-screen">
    <svg
      class="animate-spin h-16 w-16 mr-3 text-[#fe9f43]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      ></circle>
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"
      ></path>
    </svg>
  </div>
  <!--Loading Iconu-->
  <div v-else class="p-6">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-semibold text-gray-800">Müşteri Oluştur</h1>
        <p class="text-lg text-gray-500">Yeni müşteri bilgilerini girin.</p>
      </div>
      <div class="">
        <button
          class="border border-[#092C4C] bg-[#092C4C] rounded-md p-2 text-[#ffffff] hover:text-[#092C4C] hover:bg-[white] flex items-center gap-3 transition"
          @click="router.back()"
        >
          <ArrowUturnLeftIcon class="w-5 h-5" />
          Geri Dön
        </button>
      </div>
    </div>

    <div class="bg-white mt-4 px-4 p-2 rounded-lg border border-[#c1c7cc]">
      <h1 class="text-2xl border-b mb-4 p-2">Müşteri Bilgileri</h1>
      <Form @submit="onSubmit" class="space-y-6 max-w-8xl">
        <div class="grid grid-cols-2 md:grid-cols-2 gap-6">
          <div>
            <label class="form-label">Firma Adı</label>
            <Field name="companyName" type="text" v-slot="{ field, errors }">
              <input
                v-bind="field"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                placeholder="Firma Adı"
              />
              <span class="form-error">{{ errors[0] }}</span>
            </Field>
          </div>

          <div>
            <label class="form-label">Mail Adresi</label>
            <Field name="email" type="email" v-slot="{ field, errors }">
              <input
                v-bind="field"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                placeholder="ornek@mail.com"
              />
              <span class="form-error">{{ errors[0] }}</span>
            </Field>
          </div>

          <div>
            <label class="form-label">Vergi Numarası</label>
            <Field name="taxNumber" v-slot="{ field, errors }">
              <input
                v-bind="field"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                placeholder="Vergi Numarası"
              />
              <span class="form-error">{{ errors[0] }}</span>
            </Field>
          </div>

          <div>
            <label class="form-label">Vergi Dairesi</label>
            <Field name="taxOffice" v-slot="{ field, errors }">
              <input
                v-bind="field"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                placeholder="Vergi Dairesi"
              />
              <span class="form-error">{{ errors[0] }}</span>
            </Field>
          </div>

          <div>
            <label class="form-label">Fatura Başlığı</label>
            <Field name="invoiceTitle" v-slot="{ field, errors }">
              <input
                v-bind="field"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                placeholder="Fatura Başlığı"
              />
              <span class="form-error">{{ errors[0] }}</span>
            </Field>
          </div>

          <div>
            <label class="form-label">Fatura Adresi</label>
            <Field name="invoiceAddress" v-slot="{ field, errors }">
              <input
                v-bind="field"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                placeholder="Fatura Adresi"
              />
              <span class="form-error">{{ errors[0] }}</span>
            </Field>
          </div>

          <div>
            <label class="form-label">Telefon Numarası</label>
            <Field name="phone" v-slot="{ field, errors }">
              <input
                v-bind="field"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                placeholder="+90 5XX XXX XX XX"
              />
              <span class="form-error">{{ errors[0] }}</span>
            </Field>
          </div>
        </div>

        <div>
          <label class="form-label">Açıklama</label>
          <Field name="description" v-slot="{ field, errors }">
            <textarea
              v-bind="field"
              rows="3"
              class="w-full h-20 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              placeholder="Açıklama yazın..."
            ></textarea>
            <span class="form-error">{{ errors[0] }}</span>
          </Field>
        </div>

        <button
          type="submit"
          class="btn bg-[#FE9F43] text-white border-[#FE9F43] hover:bg-white hover:text-[#FE9F43] transition rounded-md border px-4 py-2"
        >
          Kaydet
        </button>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { useCustomerStore } from "@/stores/customer";
import { Form, Field } from "vee-validate";
import { useToast } from "vue-toast-notification";
import { ref, onMounted } from "vue";
import router from "@/router";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";

const $toast = useToast();
const customerStore = useCustomerStore();
const isLoading = ref(false);

function onSubmit(values, { resetForm }) {
  isLoading.value = true;
  customerStore
    .addCustomer(values)
    .then(() => {
      $toast.success("Yeni Firma eklendi !");
    })
    .catch((error) => {
      $toast.error("Ürün eklenirken hata oluştu !");
      $toast.error(error.message);
    })
    .finally(() => {
      isLoading.value = false;
    });
}
</script>
