<template>
  <div class="w-60 h-screen bg-white text-gray-800 p-4 shadow-md">
    <h2 class="text-2xl font-bold mb-6">Menü</h2>
    <ul class="space-y-1">
      <!-- Anasayfa -->
      <li>
        <router-link
          to="/"
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          exact
        >
          Anasayfa
        </router-link>
      </li>

      <!-- Divider -->
      <li class="border-t border-gray-300 my-3"></li>

      <!-- Stok Yönetimi -->
      <li class="text-sm font-semibold text-gray-500 uppercase px-3">
        Stok Yönetimi
      </li>
      <li>
        <router-link
          to="/product"
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          >Ürünler</router-link
        >
      </li>
      <li>
        <router-link
          to="/create-new-product"
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          >Ürün Ekle</router-link
        >
      </li>
      <li>
        <router-link
          to="/low-stock"
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          >Düşük Stoklar</router-link
        >
      </li>

      <!-- Divider -->
      <li class="border-t border-gray-300 my-3"></li>

      <!-- Faturalar -->
      <li class="text-sm font-semibold text-gray-500 uppercase px-3">
        Faturalar
      </li>
      <li class="ml-2 text-xs text-orange-400 mt-1">Alış</li>
      <li class="ml-4">
        <router-link
          to="/purchase-invoices"
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          >Alış Faturaları</router-link
        >
      </li>
      <li class="ml-4">
        <router-link
          to="/create-purchase-invoice"
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          >Fatura Oluştur</router-link
        >
      </li>

      <li class="ml-2 text-xs text-orange-400 mt-2">Satış</li>
      <li class="ml-4">
        <router-link
          to="/sales-invoices"
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          >Satış Faturaları</router-link
        >
      </li>
      <li class="ml-4">
        <router-link
          to="/create-sales-invoice"
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          >Fatura Oluştur</router-link
        >
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
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          >Müşteriler</router-link
        >
      </li>
      <li>
        <router-link
          to="/companys"
          class="block px-3 py-2 rounded hover:bg-gray-100"
          active-class="text-orange-500 font-semibold"
          >Şirketler</router-link
        >
      </li>
    </ul>
  </div>
</template>
