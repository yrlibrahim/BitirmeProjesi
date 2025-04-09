<template>
  <div
    v-if="userStore.auth"
    class="flex items-center justify-between px-10 py-3 bg-gray-800 text-white p-4"
  >
    <div>
      <h1 class="text-2xl font-semibold text-white">On Muhasabe Sistemi</h1>
    </div>
    <div>
      <div class="relative inline-block text-left">
        <!-- Dropdown Button -->
        <button
          @click="toggleMenu"
          type="button"
          class="inline-flex justify-center w-full rounded-md border border-gray-300 bg-gray-800 text-white px-4 py-2 text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Menü
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isMenuOpen"
          class="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <div class="py-1">
            <a
              href="/profile"
              class="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
              >Profil</a
            >
            <button
              @click="userStore.signOut()"
              class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";

const router = useRouter();
const userStore = useUserStore();

//Dropdown
import { ref } from "vue";

// Menü açılma durumunu kontrol etmek için ref
const isMenuOpen = ref(false);

// Menü açma/kapama fonksiyonu
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Çıkış yapma fonksiyonu
const logout = () => {
  alert("Çıkış yapılıyor...");
  // Burada oturumdan çıkma işlemi yapılabilir.
  // Örneğin: authService.logout();
};
</script>
