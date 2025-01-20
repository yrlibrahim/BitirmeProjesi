import { ref } from "vue";
import { db } from "@/utils/firebase"; // Firebase yapılandırma dosyanız
import { collection, getDocs } from "firebase/firestore";

export const useStockData = () => {
  const stockData = ref([]);
  const cache = ref(new Map()); // Önbellek oluşturma

  const fetchStockData = async () => {
    if (stockData.value.length > 0) return; // Veri önceden yüklenmişse tekrar yükleme

    const stockCollection = collection(db, "Stok");
    const stockSnapshot = await getDocs(stockCollection);

    // Markaları paralel olarak işle
    const brands = await Promise.all(
      stockSnapshot.docs.map(async (docSnapshot) => {
        const brand = docSnapshot.data();
        const models = await fetchModels(docSnapshot.id); // Modelleri paralel olarak yükle
        return {
          id: docSnapshot.id,
          ...brand,
          models,
        };
      })
    );

    stockData.value = brands; // Stok verilerini güncelle
  };

  const fetchModels = async (brandId) => {
    if (cache.value.has(`models-${brandId}`)) {
      return cache.value.get(`models-${brandId}`); // Önbellekten getir
    }

    const modelsCollection = collection(db, "Stok", brandId, "Modeller");
    const modelsSnapshot = await getDocs(modelsCollection);

    // Modelleri paralel olarak işle
    const models = await Promise.all(
      modelsSnapshot.docs.map(async (modelDoc) => {
        const modelData = modelDoc.data();
        const categories = await fetchCategories(brandId, modelDoc.id);
        return {
          id: modelDoc.id,
          ...modelData,
          categories,
        };
      })
    );

    cache.value.set(`models-${brandId}`, models); // Önbelleğe ekle
    return models;
  };

  const fetchCategories = async (brandId, modelId) => {
    if (cache.value.has(`categories-${brandId}-${modelId}`)) {
      return cache.value.get(`categories-${brandId}-${modelId}`);
    }

    const categoriesCollection = collection(
      db,
      "Stok",
      brandId,
      "Modeller",
      modelId,
      "Kategoriler"
    );
    const categoriesSnapshot = await getDocs(categoriesCollection);

    // Kategorileri paralel olarak işle
    const categories = await Promise.all(
      categoriesSnapshot.docs.map(async (categoryDoc) => {
        const categoryData = categoryDoc.data();
        const subCategories = await fetchSubCategories(
          brandId,
          modelId,
          categoryDoc.id
        );
        return {
          id: categoryDoc.id,
          ...categoryData,
          subCategories,
        };
      })
    );

    cache.value.set(`categories-${brandId}-${modelId}`, categories);
    return categories;
  };

  const fetchSubCategories = async (brandId, modelId, categoryId) => {
    if (cache.value.has(`subCategories-${brandId}-${modelId}-${categoryId}`)) {
      return cache.value.get(
        `subCategories-${brandId}-${modelId}-${categoryId}`
      );
    }

    const subCategoriesCollection = collection(
      db,
      "Stok",
      brandId,
      "Modeller",
      modelId,
      "Kategoriler",
      categoryId,
      "Alt Kategoriler"
    );
    const subCategoriesSnapshot = await getDocs(subCategoriesCollection);

    // Alt kategorileri paralel olarak işle
    const subCategories = await Promise.all(
      subCategoriesSnapshot.docs.map(async (subCategoryDoc) => {
        const subCategoryData = subCategoryDoc.data();
        const products = await fetchProducts(
          brandId,
          modelId,
          categoryId,
          subCategoryDoc.id
        );
        return {
          id: subCategoryDoc.id,
          ...subCategoryData,
          products,
        };
      })
    );

    cache.value.set(
      `subCategories-${brandId}-${modelId}-${categoryId}`,
      subCategories
    );
    return subCategories;
  };

  const fetchProducts = async (brandId, modelId, categoryId, subCategoryId) => {
    if (
      cache.value.has(
        `products-${brandId}-${modelId}-${categoryId}-${subCategoryId}`
      )
    ) {
      return cache.value.get(
        `products-${brandId}-${modelId}-${categoryId}-${subCategoryId}`
      );
    }

    const productsCollection = collection(
      db,
      "Stok",
      brandId,
      "Modeller",
      modelId,
      "Kategoriler",
      categoryId,
      "Alt Kategoriler",
      subCategoryId,
      "Ürünler"
    );
    const productsSnapshot = await getDocs(productsCollection);
    const products = productsSnapshot.docs.map((doc) => doc.data());

    cache.value.set(
      `products-${brandId}-${modelId}-${categoryId}-${subCategoryId}`,
      products
    );
    return products;
  };

  return { stockData, fetchStockData };
};
