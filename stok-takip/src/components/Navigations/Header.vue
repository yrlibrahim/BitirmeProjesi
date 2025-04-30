<template>
  <header
    class="w-full bg-white shadow px-4 py-2 flex items-center justify-between"
  >
    <!-- Arama Kutusu -->
    <div class="flex items-center gap-3">
      <div class="relative">
        <input
          type="text"
          placeholder="Ara..."
          class="pl-10 pr-4 py-2 border rounded-md w-64 focus:outline-none focus:ring"
          v-model="searchQuery"
        />
        <MagnifyingGlassIcon
          class="w-5 h-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2"
        />
      </div>
    </div>

    <!-- Add New + Kullanıcı Menüsü -->
    <div class="flex items-center gap-4">
      <!-- Add New Dropdown -->
      <div class="relative">
        <button
          @click="toggleAddMenu"
          class="bg-[#FE9F43] text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <div class="flex items-center">
            <span><PlusCircleIcon class="w-5 me-2" /></span>Yeni Ekle
          </div>
        </button>
        <div
          v-if="showAddMenu"
          class="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md z-10"
        >
          <ul class="divide-y divide-gray-200">
            <li>
              <router-link
                to="/create-new-product"
                class="block px-4 py-2 hover:bg-gray-100"
                >➕ Yeni Ürün</router-link
              >
            </li>
            <li>
              <router-link
                to="/addCustomer"
                class="block px-4 py-2 hover:bg-gray-100"
                >👤 Yeni Müşteri</router-link
              >
            </li>
            <li>
              <router-link
                to="/addCompany"
                class="block px-4 py-2 hover:bg-gray-100"
                >🏢 Yeni Firma</router-link
              >
            </li>
          </ul>
        </div>
      </div>

      <!-- Kullanıcı Dropdown -->
      <div class="relative">
        <button @click="toggleUserMenu" class="flex items-center gap-2">
          <img src="" class="w-8 h-8 rounded-full" />
        </button>
        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md z-10"
        >
          <ul class="divide-y divide-gray-200">
            <li>
              <router-link
                to="/profile"
                class="block px-4 py-2 hover:bg-gray-100"
                >👤 Profil</router-link
              >
            </li>
            <li>
              <button
                @click="logout"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                🚪 Çıkış Yap
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/vue/24/solid";
const userStore = useUserStore();

const searchQuery = ref("");
const showAddMenu = ref(false);
const showUserMenu = ref(false);

const toggleAddMenu = () => {
  showAddMenu.value = !showAddMenu.value;
  showUserMenu.value = false;
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showAddMenu.value = false;
};

const logout = () => {
  userStore.signOut();
};
</script>

<style scoped>
/* İsteğe bağlı responsive tweaks burada yapılabilir */
</style>
