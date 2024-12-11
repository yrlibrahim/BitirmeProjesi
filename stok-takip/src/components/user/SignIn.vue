<template>
  <div
    class="relative min-h-screen bg-cover bg-center bg-[url('https://images.pexels.com/photos/1145434/pexels-photo-1145434.jpeg')]"
  >
    <div class="absolute inset-0 bg-black bg-opacity-50"></div>

    <div class="relative z-10 flex items-left justify-start min-h-screen">
      <div
        class="bg-white bg-opacity-70 backdrop-blur-md p-8 border-r-8 border-[#fe9f43] shadow-lg w-full md:w-6/12"
      >
        <div class="text-center mb-6">
          <div class="flex items-center justify-center">
            <img
              src="../../assets/Images/logo-no-bg.png"
              alt="Logo"
              class="w-[250px] h-[250px]"
            />
          </div>
          <h1 class="text-2xl font-semibold text-gray-800">Giriş Yap</h1>
        </div>
        <div class="flex flex-col items-center justify-center w-full">
          <div class="w-9/12">
            <Form :validation-schema="formSchema" @submit="onSubmit">
              <div class="mb-10">
                <Field name="email" v-slot="{ field, errors }">
                  <p>Email Adresi</p>
                  <input
                    type="email"
                    class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                    v-bind="field"
                  />
                  <div v-if="errors.length">{{ errors[0] }}</div>
                </Field>
              </div>

              <div class="mb-10">
                <Field name="password" v-slot="{ field, errors }">
                  <p>Şifre</p>
                  <input
                    type="password"
                    class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
                    v-bind="field"
                  />
                  <div v-if="errors.length">{{ errors[0] }}</div>
                </Field>
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
                    Giriş Yap
                  </span>
                </button>
              </div>
            </Form>
            <p v-if="userStore.error" class="text-red-500 mt-4">
              {{ userStore.error }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();

const formSchema = yup.object({
  email: yup
    .string()
    .email("Geçerli bir email adresi girin")
    .required("Bu alan boş bırakılamaz!"),
  password: yup.string().required("Bu alan boş bırakılamaz!"),
});

function onSubmit(values, { resetForm }) {
  userStore.signIn(values);
}
</script>
