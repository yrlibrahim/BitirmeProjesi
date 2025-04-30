<script setup>
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import Header from "@/components/Navigations/Header.vue";
import Sidebar from "@/components/Navigations/sidebar.vue";
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
      <!-- Loading Icon -->
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
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8z"
        />
      </svg>
    </div>
  </div>

  <div v-else class="flex h-screen">
    <!-- Sabit Sidebar -->
    <div class="w-60 bg-gray-800 text-white fixed top-0 left-0 h-screen z-20">
      <Sidebar v-if="shouldShowSidebar" />
    </div>

    <!-- İçerik alanı -->
    <div class="flex-1 ml-60 overflow-y-auto h-screen bg-[#F7F7F7]">
      <div class=""><Header /></div>

      <main class="p-4">
        <RouterView />
      </main>
    </div>
  </div>
</template>
