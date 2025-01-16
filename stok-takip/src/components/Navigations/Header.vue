<template>
  <div class="flex items-center justify-between px-10 py-3">
    <div>
      <router-link to="/">Anasayfa</router-link>
      <router-link to="product">Ürün Listesi</router-link>
      <router-link to="customer">Müşteri Sayfası</router-link>
    </div>
    <div class="p-1 border border-gray-300 rounded-md flex gap-2">
      <div>
        <img src="" class="rounded" />
        <input
          @input="handleSearch"
          type="search"
          placeholder="Ara.."
          class="ms-2 focus:outline-none focus:ring-0"
        />
      </div>
    </div>
    <div>
      <!-- Giriş durumu kontrolü -->
      <router-link v-if="!userStore.auth" to="SignIn">Giriş Yap</router-link>
      <button v-else @click="handleLogout">Çıkış Yap</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
const emit = defineEmits(["search"]);

const searchQuery = ref("");
const userStore = useUserStore();

const handleSearch = (event) => {
  searchQuery.value = event.target.value;
  emit("search", searchQuery.value);
};

const handleLogout = async () => {
  try {
    await userStore.signOut();
    userStore.auth = false;
  } catch (error) {
    console.error("Çıkış işlemi sırasında hata oluştu:", error);
  }
};
</script>
