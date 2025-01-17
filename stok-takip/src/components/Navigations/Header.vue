<template>
  <div class="flex items-center justify-between px-10 py-3">
    <div>
      <router-link to="/">Anasayfa</router-link>
      <router-link to="product">Ürün Listesi</router-link>
      <router-link to="customer">Müşteri Sayfası</router-link>
    </div>

    <div>
      <button @click="handleLogout, router.push({ name: 'Signin' })">
        Çıkış Yap
      </button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const handleLogout = async () => {
  try {
    userStore.auth = false;

    router.push({ name: "Signin" });

    console.log("Çıkış işlemi başarıyla tamamlandı.");
  } catch (error) {
    console.error("Çıkış işlemi sırasında hata oluştu:", error);
  }
};
</script>
