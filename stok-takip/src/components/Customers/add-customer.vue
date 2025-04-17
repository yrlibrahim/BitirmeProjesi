<template>
  <!--Loading Iconu-->
  <div v-if="loading" class="flex items-center justify-center min-h-screen">
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
  <div v-else>
    <Form @submit="onSubmit">
      <div class="flex items-center justify-start gap-4 mb-4">
        <div class="mb-10">
          <Field name="brand" v-slot="{ field, errors }">
            <p>Firma Adı</p>
            <input
              type="text"
              class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              v-bind="field"
            />
            <div v-if="errors.length">{{ errors[0] }}</div>
          </Field>
        </div>
        <div class="mb-10">
          <Field name="brand" v-slot="{ field, errors }">
            <p>E-Mail</p>
            <input
              type="email"
              class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              v-bind="field"
            />
            <div v-if="errors.length">{{ errors[0] }}</div>
          </Field>
        </div>
      </div>
      <div class="flex items-center justify-start mb-4 w-1/3">
        <div class="mb-10">
          <Field name="brand" v-slot="{ field, errors }">
            <p>Vergi No</p>
            <input
              type="text"
              class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              v-bind="field"
            />
            <div v-if="errors.length">{{ errors[0] }}</div>
          </Field>
        </div>
      </div>

      <div class="text-left mt-6">
        <button
          type="submit"
          class="w-40 bg-[#fe9f43] text-white py-3 rounded-lg relative overflow-hidden group border border-[#fe9f43] hover:bg-white hover:text-[#fe9f43]"
        >
          <span
            class="absolute inset-0 bg-white scale-y-0 group-hover:scale-y-100 transform transition-transform duration-300 origin-top"
          ></span>
          <span
            class="relative group-hover:text-[#fe9f43] transition-colors duration-300"
          >
            Müşteri Ekle
          </span>
        </button>
      </div>
    </Form>
  </div>
  <!--Loading Iconu-->
</template>
<script setup>
import { ref } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { useCustomerData } from "@/stores/customer";
import { useToast } from "vue-toast-notification";
import { errorMessages } from "vue/compiler-sfc";

const $toast = useToast();
const loading = ref(false);

const customerData = useCustomerData();

function onSubmit(values, { resetForm }) {
  loading.value = true;
  customerData
    .getCustomerData(values)
    .then(() => {
      $toast.success("Müşteri başarıyla eklendi");
    })
    .catch((error) => {
      $toast.error("Müşteri eklenirken hata oluştu !");
      $toast.error(error.message);
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
