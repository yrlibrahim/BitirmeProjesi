<template>
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

  <div v-else class="p-6 m-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl">Müşteri Güncelle</h1>
        <p class="text-lg">Bu müşteriyi düzenle</p>
      </div>
      <div class="">
        <button
          class="bg-[#092c4c] rounded-md p-2 text-[#ffffff] flex items-center gap-3"
          @click="router.back()"
        >
          <ArrowUturnLeftIcon class="w-5 h-5" />
          Geri Dön
        </button>
      </div>
    </div>

    <div class="bg-white mt-4 px-4 py-2 rounded-lg border border-[#c1c7cc]">
      <h1 class="text-2xl border-b mb-4 p-2">Müşteri Bilgileri</h1>
      <Form :initial-values="customerData" @submit="onSubmit">
        <div class="grid grid-cols-2 gap-4">
          <Field name="name" v-slot="{ field, errors }">
            <div>
              <label>Firma Adı</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border mt-1 px-4 py-1"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="email" v-slot="{ field, errors }">
            <div>
              <label>Mail Adresi</label>
              <input
                v-bind="field"
                type="email"
                class="w-full h-10 rounded-md border mt-1 px-4 py-1"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="taxOffice" v-slot="{ field, errors }">
            <div>
              <label>Vergi Dairesi</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border mt-1 px-4 py-1"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="invoiceTitle" v-slot="{ field, errors }">
            <div>
              <label>Fatura Başlığı</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border mt-1 px-4 py-1"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="phone" v-slot="{ field, errors }">
            <div>
              <label>Telefon Numarası</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border mt-1 px-4 py-1"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="description" v-slot="{ field, errors }">
            <div>
              <label>Açıklama</label>
              <textarea
                v-bind="field"
                class="w-full rounded-md border mt-1 px-4 py-1"
                rows="3"
              ></textarea>
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>
        </div>

        <div class="text-center mt-6">
          <button
            type="submit"
            class="w-full bg-[#fe9f43] text-white py-3 rounded-lg hover:bg-white hover:text-[#fe9f43] border border-[#fe9f43]"
          >
            Güncelle
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Field, Form } from "vee-validate";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toast-notification";
import { DB } from "@/utils/firebase";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";

const router = useRouter();
const route = useRoute();
const $toast = useToast();

const loading = ref(true);
const customerData = ref({});

const customerId = route.params.id;

onMounted(async () => {
  try {
    const docRef = doc(DB, "Customers", customerId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      customerData.value = {
        name: data.companyName || "",
        email: data.email || "",

        taxOffice: data.taxOffice || "",
        invoiceTitle: data.invoiceTitle || "",

        phone: data.phone || "",
        description: data.description || "",
      };
    } else {
      $toast.error("Müşteri bulunamadı");
      router.back();
    }
  } catch (err) {
    $toast.error("Veri alınırken hata oluştu");
    console.error("Firestore hatası:", err);
  } finally {
    loading.value = false;
  }
});

async function onSubmit(values) {
  loading.value = true;
  try {
    const filtered = {};
    for (const key in values) {
      if (values[key] !== undefined) filtered[key] = values[key];
    }

    await updateDoc(doc(DB, "Customers", customerId), filtered);
    $toast.success("Müşteri başarıyla güncellendi!");
    router.back();
  } catch (err) {
    $toast.error("Güncelleme sırasında hata oluştu");
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>
