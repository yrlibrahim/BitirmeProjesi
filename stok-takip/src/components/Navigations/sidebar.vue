<template>
  <div
    class="w-60 h-screen bg-white text-gray-800 px-4 border-e overflow-y-auto"
  >
    <div class="flex items-center">
      <img src="../../assets/Images/logo-no-bg.png" class="w-24 h-2w-24" />
      <h1 class="text-2xl font-medium font-serif">
        <p>Yerli</p>
        <p>Otomakas</p>
      </h1>
    </div>
    <ul class="space-y-1">
      <!-- Anasayfa -->
      <li>
        <router-link
          to="/"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          exact
          ><div class="flex items-center gap-2">
            <HomeIcon class="w-5" />
            <p class="text-[16px]">Anasayfa</p>
          </div>
        </router-link>
      </li>

      <!-- Divider -->
      <li class="border-t border-gray-300 my-3"></li>

      <!-- Stok Yönetimi -->
      <li class="text-sm font-semibold text-gray-500 uppercase px-3">
        <p>Stok Yönetimi</p>
      </li>
      <li>
        <router-link
          to="/product"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
        >
          <div class="flex items-center gap-2">
            <CubeIcon class="w-5" />
            <p class="text-[16px]">Ürünler</p>
          </div></router-link
        >
      </li>
      <li>
        <router-link
          to="/create-new-product"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          ><div class="flex items-center gap-2">
            <SquaresPlusIcon class="w-5" />
            <p class="text-[16px]">Ürün Ekle</p>
          </div></router-link
        >
      </li>

      <!-- Divider -->
      <li class="border-t border-gray-300 my-3"></li>

      <!-- Faturalar -->
      <li class="text-sm font-semibold text-gray-500 uppercase px-3">
        Faturalar
      </li>
      <li class="ml-2 text-xs text-orange-400 mt-1">Alış</li>
      <li class="">
        <router-link
          to="/purchase-invoices"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
        >
          <div class="flex items-center gap-2">
            <DocumentArrowDownIcon class="w-5" />
            <p class="text-[16px]">Gelen Faturalar</p>
          </div>
        </router-link>
      </li>
      <li class="ml-2 text-xs text-orange-400 mt-2">Satış</li>
      <li class="">
        <router-link
          to="/sales-invoices"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          ><div class="flex items-center gap-2">
            <DocumentArrowUpIcon class="w-5" />
            <p class="text-[16px]">Giden Faturalar</p>
          </div>
        </router-link>
      </li>

      <!-- Divider -->
      <li class="border-t border-gray-300 my-3"></li>

      <!-- Kayıtlar -->
      <li class="text-sm font-semibold text-gray-500 uppercase px-3">
        Kayıtlar
      </li>
      <li>
        <router-link
          to="/customers"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          ><div class="flex items-center gap-2">
            <UsersIcon class="w-5" />
            <p class="text-[16px]">Müşteriler</p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link
          to="/companys"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          ><div class="flex items-center gap-2">
            <UserGroupIcon class="w-5" />
            <p class="text-[16px]">Firmalar</p>
          </div>
        </router-link>
      </li>
      <!-- Divider -->
      <li class="border-t border-gray-300 my-3"></li>

      <!-- Cari Takip -->
      <li class="text-sm font-semibold text-gray-500 uppercase px-3">
        Cari Takip
      </li>

      <!-- Müşteri Cari -->
      <li class="ml-2 text-xs text-orange-400 mt-1">Müşteriler</li>
      <li>
        <router-link
          to="/customer-accounts"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
        >
          <div class="flex items-center gap-2">
            <UsersIcon class="w-5" />
            <p class="text-[16px]">Cari Hesaplar</p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link
          to="/customer-payments"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
        >
          <div class="flex items-center gap-2">
            <DocumentArrowDownIcon class="w-5" />
            <p class="text-[16px]">Ödemeler</p>
          </div>
        </router-link>
      </li>

      <!-- Firma Cari -->
      <li class="ml-2 text-xs text-orange-400 mt-2">Firmalar</li>
      <li>
        <router-link
          to="/company-accounts"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
        >
          <div class="flex items-center gap-2">
            <UserGroupIcon class="w-5" />
            <p class="text-[16px]">Cari Hesaplar</p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link
          to="/company-payments"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
        >
          <div class="flex items-center gap-2">
            <DocumentArrowDownIcon class="w-5" />
            <p class="text-[16px]">Ödemeler</p>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script setup>
import {
  HomeIcon,
  CubeIcon,
  SquaresPlusIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  UsersIcon,
  UserGroupIcon,
} from "@heroicons/vue/24/outline";
</script>

<style scoped>
/* tailwind.css veya global.css içine */
::-webkit-scrollbar {
  width: 6px;
  height: 1px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #e6eaed;
  border-radius: 10px;
}
</style>
