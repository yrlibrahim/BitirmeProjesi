<template>
  <div>
    <!-- Diğer içerikler -->

    <button
      @click="navigateToAddProduct"
      class="bg-blue-500 text-white py-2 px-4 rounded"
    >
      Yeni Ürün Ekle
    </button>

    <ul>
      <li v-for="brand in stockData" :key="brand.id">
        {{ brand.id }}
        <ul>
          <li v-for="model in brand.models" :key="model.id">
            {{ model.id }}
            <ul>
              <li v-for="category in model.categories" :key="category.id">
                {{ category.id }}
                <ul>
                  <li
                    v-for="subCategory in category.subCategories"
                    :key="subCategory.id"
                  >
                    {{ subCategory.name }}
                    <ul>
                      <li
                        v-for="product in subCategory.products"
                        :key="product.id"
                      >
                        {{ product.name }} - {{ product.price }} TL
                        {{ product.count }}adet
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useStockData } from "@/stores/useStockData";
import { useRouter } from "vue-router"; // Router kullanımı

export default {
  setup() {
    const { stockData, fetchStockData } = useStockData();
    const router = useRouter(); // useRouter hook'u

    onMounted(() => {
      fetchStockData();
    });

    // Yeni ürün ekleme butonuna tıklandığında yönlendirme fonksiyonu
    const navigateToAddProduct = () => {
      router.push("/create-new-product");
    };

    return { stockData, navigateToAddProduct };
  },
};
</script>
