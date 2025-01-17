<script setup>
import { RouterView, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const route = useRoute();
</script>

<template>
  <div v-if="userStore.auth">
    <!-- Eğer rota `requiresHeader` meta alanına sahipse header'ı göster -->
    <app-header v-if="route.meta.requiresHeader"></app-header>
    <router-view></router-view>
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>
