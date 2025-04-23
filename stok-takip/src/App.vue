<script setup>
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import { firstLoad } from "./composables/auth";
const hideSidebarRoutes = ["/signin"];
const shouldShowSidebar = computed(
  () => !hideSidebarRoutes.includes(route.path)
);

const { loading } = firstLoad();
const route = useRoute();
</script>

<template>
  <div v-if="loading">
    <div class="flex items-center justify-center min-h-screen">
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
  </div>
  <div v-else>
    <app-header></app-header>
    <div class="flex">
      <!-- Sidebar -->
      <div
        class="w-48 h-screen bg-gray-800 text-white p-4 hidden md:block"
        v-if="shouldShowSidebar"
      >
        <h2 class="text-2xl font-semibold mb-4">Sidebar</h2>
        <ul>
          <li class="mb-2">
            <router-link to="/">
              <span>Anasayfa</span>
            </router-link>
          </li>
          <li class="mb-2">
            <router-link to="product"> <span>Ürün Listesi</span></router-link>
          </li>
          <li class="mb-2">
            <router-link to="customers">Müşteri Sayfası</router-link>
          </li>
          <li>
            <router-link to="companys">Şirketler</router-link>
          </li>
        </ul>
      </div>

      <!-- Ana İçerik -->
      <div class="flex-1 bg-[#f3f3f2]">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
