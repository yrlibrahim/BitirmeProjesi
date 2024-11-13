<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div>
    <app-header></app-header>
  </div>
  <div>
    <router-view></router-view>
  </div>
</template>
