<script setup>
import { RouterView } from "vue-router";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
</script>

<template>
  <div>
    <app-header v-if="userStore.auth"></app-header>
    <router-view></router-view>
  </div>
</template>
