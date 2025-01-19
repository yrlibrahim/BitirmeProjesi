<script setup>
import { RouterView, useRoute } from "vue-router";
import { firstLoad } from "./composables/auth";

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
    <router-view></router-view>
  </div>
</template>
