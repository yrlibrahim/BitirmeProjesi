<template>
  <div class="flex items-center justify-between px-10 py-3">
    <div>
      <router-link to="/">Anasayfa</router-link>
      <router-link to="product">Ürün Listesi</router-link>
      <router-link to="customer">Müşteri Sayfası</router-link>
      <router-link to="company">Şirketler</router-link>
    </div>

    <div>
      <button @click="router.push({ name: 'Signin' })">Çıkış Yap</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>
