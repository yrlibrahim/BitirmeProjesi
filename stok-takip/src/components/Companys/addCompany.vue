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
  <div v-else>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl">Satıcı Oluştur</h1>
        <p class="text-lg">Yeni şirket ekle</p>
      </div>
      <div class="">
        <button
          class="bg-[#092c4c] rounded-md p-2 text-[#ffffff]"
          @click="router.back()"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-left" />
          Geri Dön
        </button>
      </div>
    </div>
    <div class="bg-[#ffffff] mt-4 px-4 p-2 rounded-lg border border-[#c1c7cc]">
      <h1 class="text-2xl border-b mb-4 p-2">Firma Bilgileri</h1>
      <div>
        <Form @submit="onSubmit">
          <div>
            <div class="flex items-center justify-start gap-4">
              <div class="mb-10 w-1/2">
                <Field name="companyName" v-slot="{ field, errors }">
                  <p>Firma Adı</p>
                  <input
                    type="text"
                    v-bind="field"
                    class="w-full h-10 rounded-md border border-grey-2 px-4 py-1 focus:outline-none"
                  />
                  <div v-if="errors.length" class="text-red-500">
                    {{ errors[0] }}
                  </div>
                </Field>
              </div>
              <div class="mb-10 w-1/2">
                <Field name="email" v-slot="{ field, errors }">
                  <p>Mail Adresi</p>
                  <input
                    type="email"
                    class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                    v-bind="field"
                  />
                  <div v-if="errors.length" class="">{{ errors[0] }}</div>
                </Field>
              </div>
            </div>

            <div class="flex items-center justify-center gap-4 mb-3">
              <div class="mb-10 w-1/2">
                <Field name="taxNumber" v-slot="{ field, errors }">
                  <p>Vergi Numarası</p>
                  <input
                    type="number"
                    class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                    v-bind="field"
                  />
                  <div v-if="errors.length" class="">{{ errors[0] }}</div>
                </Field>
              </div>
              <div class="mb-10 w-1/2">
                <Field name="taxOffice" v-slot="{ field, errors }">
                  <p>Vergi Dairesi</p>
                  <input
                    type="text"
                    class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                    v-bind="field"
                  />
                  <div v-if="errors.length" class="">{{ errors[0] }}</div>
                </Field>
              </div>
            </div>
            <div class="flex items-center justify-center gap-4 mb-3">
              <div class="mb-10 w-1/2">
                <Field name="invoiceTitle" v-slot="{ field, errors }">
                  <p>Fatura Başlığı</p>
                  <input
                    type="text"
                    class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                    v-bind="field"
                  />
                  <div v-if="errors.length" class="">{{ errors[0] }}</div>
                </Field>
              </div>
              <div class="mb-10 w-1/2">
                <Field name="invoiceAddress" v-slot="{ field, errors }">
                  <p>Fatura Adresi</p>
                  <input
                    type="text"
                    class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                    v-bind="field"
                  />
                  <div v-if="errors.length" class="">{{ errors[0] }}</div>
                </Field>
              </div>
            </div>
            <div class="flex items-center justify-start gap-4 mb-3">
              <div class="mb-10 w-1/2">
                <Field name="phone" v-slot="{ field, errors }">
                  <p>Telefon Numarası</p>
                  <input
                    type="number"
                    class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                    v-bind="field"
                  />
                  <div v-if="errors.length" class="">{{ errors[0] }}</div>
                </Field>
              </div>
            </div>
            <div class="flex items-center justify-start gap-4 mb-3">
              <div class="mb-10 w-1/2">
                <Field name="description" v-slot="{ field, errors }">
                  <p>Açıklama</p>
                  <textarea
                    type="tel"
                    class="w-full h-20 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                    v-bind="field"
                  ></textarea>
                  <div v-if="errors.length" class="">{{ errors[0] }}</div>
                </Field>
              </div>
            </div>
          </div>
          <div class="text-center mt-6">
            <button
              type="submit"
              class="w-full bg-[#fe9f43] text-white py-3 rounded-lg relative overflow-hidden group border border-[#fe9f43] hover:bg-white hover:text-[#fe9f43]"
            >
              <span
                class="absolute inset-0 bg-white scale-y-0 group-hover:scale-y-100 transform transition-transform duration-300 origin-top"
              ></span>
              <span
                class="relative group-hover:text-[#fe9f43] transition-colors duration-300"
              >
                Urun Ekle
              </span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Field, Form } from "vee-validate";
import { ref, onMounted } from "vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { useCompanyStore } from "@/stores/company";
import { useToast } from "vue-toast-notification";

const userStore = useUserStore();
const isLoading = ref(false);
const companyStore = useCompanyStore();
const $toast = useToast();

function onSubmit(values, { resetForm }) {
  isLoading.value = true;
  companyStore
    .addCompany(values)
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
