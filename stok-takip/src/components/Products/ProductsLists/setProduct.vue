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

  <div v-else>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl">Ürün Güncelle</h1>
        <p class="text-lg">Bu ürünü düzenle</p>
      </div>
      <div>
        <button
          class="bg-[#092c4c] rounded-md p-2 text-white"
          @click="router.back()"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-left" />
          Geri Dön
        </button>
      </div>
    </div>

    <div class="bg-white mt-4 px-4 py-2 rounded-lg border border-[#c1c7cc]">
      <h1 class="text-2xl border-b mb-4 p-2">Ürün Bilgileri</h1>
      <Form :initial-values="productData" @submit="onSubmit">
        <div class="grid grid-cols-2 gap-4">
          <Field name="sku" v-slot="{ field, errors }">
            <div>
              <label>Stok Kodu</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="name" v-slot="{ field, errors }">
            <div>
              <label>Ürün</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="brand" v-slot="{ field, errors }">
            <div>
              <label>Araç</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="model" v-slot="{ field, errors }">
            <div>
              <label>Model</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="category" v-slot="{ field, errors }">
            <div>
              <label>Kategori</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="subCategory" v-slot="{ field, errors }">
            <div>
              <label>Alt Kategori</label>
              <input
                v-bind="field"
                type="text"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="count" v-slot="{ field, errors }">
            <div>
              <label>Adet</label>
              <input
                v-bind="field"
                type="number"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              />
              <div v-if="errors.length" class="text-red-500">
                {{ errors[0] }}
              </div>
            </div>
          </Field>

          <Field name="price" v-slot="{ field, errors }">
            <div>
              <label>Fiyat</label>
              <input
                v-bind="field"
                type="number"
                class="w-full h-10 rounded-md border border-grey-2 mt-1 px-4 py-1 focus:outline-none"
              />
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
library.add(faArrowLeft);

const router = useRouter();
const route = useRoute();
const $toast = useToast();

const loading = ref(true);
const productData = ref({});

const productId = route.params.id;

onMounted(async () => {
  try {
    const docRef = doc(DB, "Stock", productId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      productData.value = {
        sku: data.sku || "",
        name: data.name || "",
        brand: data.brand || "",
        model: data.model || "",
        category: data.category || "",
        subCategory: data.subCategory || "",
        count: data.count ?? 0,
        price: data.price ?? 0,
      };
    } else {
      $toast.error("Ürün bulunamadı");
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
    // undefined field varsa temizle
    const filtered = {};
    for (const key in values) {
      if (values[key] !== undefined) filtered[key] = values[key];
    }

    await updateDoc(doc(DB, "Stock", productId), filtered);
    $toast.success("Ürün başarıyla güncellendi!");
    router.back();
  } catch (err) {
    $toast.error("Güncelleme sırasında hata oluştu");
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>
