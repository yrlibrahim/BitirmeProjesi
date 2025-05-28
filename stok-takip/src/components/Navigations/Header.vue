<template>
  <header
    class="w-full bg-white shadow px-4 py-2 flex items-center justify-end"
  >
    <!-- Add New + Kullanıcı Menüsü -->
    <div class="flex items-center gap-4">
      <!-- Add New Dropdown -->
      <div
        class="relative"
        v-if="!userStore.getUserData.isAdmin"
        ref="addMenuRef"
      >
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
          class="absolute right-0 mt-2 w-48 bg-white text-[#646B72] border shadow-md rounded-md z-10"
        >
          <ul class="divide-y divide-gray-200">
            <li>
              <router-link
                to="/create-new-product"
                class="px-4 py-2 hover:bg-gray-100 flex items-center"
                ><span><PlusCircleIcon class="w-5 me-2" /></span> Yeni
                Ürün</router-link
              >
            </li>
            <li>
              <router-link
                to="/addCustomer"
                class="px-4 py-2 hover:bg-gray-100 flex items-center"
                ><span><UserIcon class="w-5 me-2" /></span> Yeni
                Müşteri</router-link
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
      <div class="relative" ref="userMenuRef">
        <button @click="toggleUserMenu" class="flex items-center gap-2">
          <span><UserCircleIcon class="w-10 text-[#FE9F43]" /></span>
        </button>
        <div
          v-if="showUserMenu"
          class="absolute right-0 mt-2 w-48 bg-white border shadow-md rounded-md z-10"
        >
          <ul class="divide-y divide-gray-200">
            <li>
              <router-link
                to="/profile"
                class="px-4 py-2 hover:bg-gray-100 flex items-center text-[#646B72]"
                ><span><UserIcon class="w-5 me-2" /></span> Profil</router-link
              >
            </li>
            <li>
              <button
                @click="logout"
                class="w-full text-left px-4 py-2 hover:bg-gray-100 text-[#092C4C] flex items-center"
              >
                <span><ArrowLeftEndOnRectangleIcon class="w-5 me-2" /></span>
                Çıkış Yap
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
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  UserIcon,
  UserCircleIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/vue/24/solid";
import { useClickOutside } from "@/components/Helpers/useClickOutside";
import { useRouter } from "vue-router";
const router = useRouter();

router.afterEach(() => {
  showAddMenu.value = false;
  showUserMenu.value = false;
});

const userStore = useUserStore();

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

// Menü referansları
const addMenuRef = ref(null);
const userMenuRef = ref(null);

// Click outside hook
useClickOutside(addMenuRef, () => {
  showAddMenu.value = false;
});
useClickOutside(userMenuRef, () => {
  showUserMenu.value = false;
});
</script>

<style scoped>
/* İsteğe bağlı responsive tweaks burada yapılabilir */
</style>
