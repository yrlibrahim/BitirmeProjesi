<template>
  <div
    class="w-60 h-screen bg-white text-gray-800 px-4 border-e overflow-y-auto"
  >
    <div class="flex items-center">
      <router-link
        to="/home"
        class="flex items-center no-underline hover:opacity-80 transition"
      >
        <img src="../../assets/Images/logo-no-bg.png" class="w-24 h-24" />
        <h1 class="text-2xl font-medium font-serif text-[#000]">
          <p>Yerli</p>
          <p>Otomakas</p>
        </h1>
      </router-link>
    </div>
    <ul class="space-y-1">
      <!-- Anasayfa -->
      <li>
        <router-link
          to="/home"
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
      <li v-if="!userStore.getUserData.isAdmin">
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
        Cari Takip
      </li>
      <li class="ml-2 text-xs text-orange-400 mt-1">Müşteri</li>
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
      <li>
        <router-link
          to="/customer-payments"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
        >
          <div class="flex items-center gap-2">
            <BarsArrowDownIcon class="w-5" />
            <p class="text-[16px]">Gelen Ödemeler</p>
          </div>
        </router-link>
      </li>
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
      <li class="ml-2 text-xs text-orange-400 mt-2">Firma</li>
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
      <li>
        <router-link
          to="/company-payments"
          class="block px-3 py-2 rounded hover:bg-gray-100 transition"
          active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
        >
          <div class="flex items-center gap-2">
            <BarsArrowUpIcon class="w-5" />
            <p class="text-[16px]">Giden Ödemeler</p>
          </div>
        </router-link>
      </li>
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

      <div v-if="!userStore.getUserData.isAdmin">
        <li class="text-sm font-semibold text-gray-500 uppercase px-3">
          Eklemeler
        </li>
        <li>
          <router-link
            to="/invoice-add"
            class="block px-3 py-2 rounded hover:bg-gray-100 transition"
            active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          >
            <div class="flex items-center gap-2">
              <DocumentArrowDownIcon class="w-5" />
              <p class="text-[16px]">Fatura Ekleme</p>
            </div>
          </router-link>
        </li>
        <li>
          <router-link
            to="/payment-add"
            class="block px-3 py-2 rounded hover:bg-gray-100 transition"
            active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          >
            <div class="flex items-center gap-2">
              <DocumentArrowDownIcon class="w-5" />
              <p class="text-[16px]">Ödeme Ekleme</p>
            </div>
          </router-link>
        </li>
        <li>
          <router-link
            to="/companys-add"
            class="block px-3 py-2 rounded hover:bg-gray-100 transition"
            active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          >
            <div class="flex items-center gap-2">
              <DocumentArrowDownIcon class="w-5" />
              <p class="text-[16px]">Firma Ekleme</p>
            </div>
          </router-link>
        </li>
        <li>
          <router-link
            to="/customers-add"
            class="block px-3 py-2 rounded hover:bg-gray-100 transition"
            active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          >
            <div class="flex items-center gap-2">
              <DocumentArrowDownIcon class="w-5" />
              <p class="text-[16px]">Müşteri Ekleme</p>
            </div>
          </router-link>
        </li>
        <li>
          <router-link
            to="/upload-company-invoices"
            class="block px-3 py-2 rounded hover:bg-gray-100 transition"
            active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          >
            <div class="flex items-center gap-2">
              <DocumentArrowDownIcon class="w-5" />
              <p class="text-[16px]">Firma Fatura Ekleme</p>
            </div>
          </router-link>
        </li>
        <li>
          <router-link
            to="/upload-company-payments"
            class="block px-3 py-2 rounded hover:bg-gray-100 transition"
            active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          >
            <div class="flex items-center gap-2">
              <DocumentArrowDownIcon class="w-5" />
              <p class="text-[16px]">Firma Ödeme Ekleme</p>
            </div>
          </router-link>
        </li>
        <li>
          <router-link
            to="/bulk-upload-page"
            class="block px-3 py-2 rounded hover:bg-gray-100 transition"
            active-class="text-[#FE9F43] bg-[#FE9F43] bg-opacity-[0.08] transition"
          >
            <div class="flex items-center gap-2">
              <DocumentArrowDownIcon class="w-5" />
              <p class="text-[16px]">Ürün Ekleme</p>
            </div>
          </router-link>
        </li>
      </div>
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
  BarsArrowDownIcon,
  BarsArrowUpIcon,
} from "@heroicons/vue/24/outline";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
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
