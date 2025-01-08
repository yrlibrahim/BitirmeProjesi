import { ref } from "vue";
import { db } from "@/utils/firebase"; // Firebase yapılandırma dosyanız
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export const useStockData = () => {
  const stockData = ref([]);

  // Stok verilerini çekme
  const fetchStockData = async () => {
    const stockCollection = collection(db, "Stok");
    const stockSnapshot = await getDocs(stockCollection);

    // Her bir marka için
    for (const docSnapshot of stockSnapshot.docs) {
      const brand = docSnapshot.data();
      const models = await fetchModels(docSnapshot.id); // Marka ID'sine göre modelleri çekiyoruz
      stockData.value.push({
        id: docSnapshot.id,
        ...brand,
        models,
      });
    }
  };

  // Modelleri çekme
  const fetchModels = async (brandId) => {
    const modelsCollection = collection(db, "Stok", brandId, "Modeller");
    const modelsSnapshot = await getDocs(modelsCollection);
    const models = [];

    // Her model için
    for (const modelDoc of modelsSnapshot.docs) {
      const modelData = modelDoc.data();
      const categories = await fetchCategories(brandId, modelDoc.id); // Model ID'sine göre kategorileri çekiyoruz
      models.push({
        id: modelDoc.id,
        ...modelData,
        categories,
      });
    }

    return models;
  };

  // Kategorileri çekme
  const fetchCategories = async (brandId, modelId) => {
    const categoriesCollection = collection(
      db,
      "Stok",
      brandId,
      "Modeller",
      modelId,
      "Kategoriler"
    );
    const categoriesSnapshot = await getDocs(categoriesCollection);
    const categories = [];

    // Her kategori için
    for (const categoryDoc of categoriesSnapshot.docs) {
      const categoryData = categoryDoc.data();
      const subCategories = await fetchSubCategories(
        brandId,
        modelId,
        categoryDoc.id
      ); // Kategori ID'sine göre alt kategorileri çekiyoruz
      categories.push({
        id: categoryDoc.id,
        ...categoryData,
        subCategories,
      });
    }

    return categories;
  };

  // Alt kategorileri çekme
  const fetchSubCategories = async (brandId, modelId, categoryId) => {
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
    const subCategories = [];

    // Her alt kategori için
    for (const subCategoryDoc of subCategoriesSnapshot.docs) {
      const subCategoryData = subCategoryDoc.data();
      const products = await fetchProducts(
        brandId,
        modelId,
        categoryId,
        subCategoryDoc.id
      ); // Alt kategori ID'sine göre ürünleri çekiyoruz
      subCategories.push({
        id: subCategoryDoc.id,
        ...subCategoryData,
        products,
      });
    }

    return subCategories;
  };

  // Ürünleri çekme
  const fetchProducts = async (brandId, modelId, categoryId, subCategoryId) => {
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

    return products;
  };

  return { stockData, fetchStockData };
};
