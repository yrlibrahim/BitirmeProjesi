import { ref } from "vue";
import { db } from "@/utils/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export const useStockData = () => {
  // Kullanıcıdan alınan ürün bilgileri
  const brand = ref("");
  const model = ref("");
  const category = ref("");
  const subCategory = ref("");
  const name = ref("");
  const price = ref("");
  const count = ref("");
  const urunler = ref([]); // Firestore'dan çekilecek ürünler

  // Firestore'dan ürünleri çeken fonksiyon
  const fetchStockData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "deneme"));
      urunler.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data().urun, // "urun" adlı map içeriğini al
      }));
    } catch (error) {
      console.error("Ürünler alınırken hata oluştu:", error);
    }
  };

  // Ürün ekleme fonksiyonu (kontrolsüz)
  const addProduct = async () => {
    try {
      // Firestore'a yeni ürün ekle
      await addDoc(collection(db, "deneme"), {
        urun: {
          brand: brand.value,
          model: model.value,
          category: category.value,
          subCategory: subCategory.value,
          name: name.value,
          price: Number(price.value), // Fiyatı sayı olarak sakla
          count: Number(count.value), // Adeti sayı olarak sakla
        },
      });

      alert("Ürün başarıyla eklendi!");
      fetchStockData(); // Yeni eklenen ürünü listeye ekle

      // Formu temizle
      brand.value = "";
      model.value = "";
      category.value = "";
      subCategory.value = "";
      name.value = "";
      price.value = "";
      count.value = "";
    } catch (error) {
      console.error("Ürün eklenirken hata oluştu:", error);
      alert("Ürün eklenirken bir hata oluştu!");
    }
  };

  return {
    brand,
    model,
    category,
    subCategory,
    name,
    price,
    count,
    urunler,
    fetchStockData,
    addProduct,
  };
};
