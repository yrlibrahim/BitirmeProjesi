<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Kullanıcı Profili</h1>
      <div class="">
        <button
          class="border border-[#092C4C] bg-[#092C4C] rounded-md p-2 text-[#ffffff] hover:text-[#092C4C] hover:bg-[white] flex items-center gap-3 transition"
          @click="router.back()"
        >
          <ArrowUturnLeftIcon class="w-5 h-5" />
          Geri Dön
        </button>
      </div>
    </div>

    <!-- Admin Görünümü -->
    <div v-if="userStore.getUserData.isAdmin">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-600">Tüm Kullanıcılar</h2>
        <button
          @click="showAddModal = true"
          class="px-4 bg-[#fe9f43] text-white py-3 rounded-md border border-[#fe9f43] hover:bg-white hover:text-[#fe9f43] transition"
        >
          Kullanıcı Ekle
        </button>
      </div>

      <div
        v-for="u in users"
        :key="u.uid"
        class="border rounded p-4 shadow-sm mb-2"
      >
        <p><strong>Ad Soyad:</strong> {{ u.firstname }} {{ u.lastname }}</p>
        <p><strong>Email:</strong> {{ u.email }}</p>
        <p><strong>Admin:</strong> {{ u.isAdmin ? "Evet" : "Hayır" }}</p>
        <div class="mt-2 flex gap-2">
          <button
            @click="editUser(u)"
            class="px-4 bg-white text-[#fe9f43] py-2 rounded-md border border-[#fe9f43] hover:bg-[#fe9f43] hover:text-white transition"
          >
            Düzenle
          </button>
          <button
            @click="deleteUser(u.uid)"
            class="px-4 bg-white text-[#092C4C] py-2 rounded-md border border-[#092C4C] hover:bg-[#092C4C] hover:text-white transition"
          >
            Sil
          </button>
        </div>
      </div>
    </div>

    <!-- Normal Kullanıcı Görünümü -->
    <div v-else>
      <form
        @submit.prevent="saveUserInfo"
        class="space-y-4 border p-4 rounded-md bg-white"
      >
        <h2 class="text-xl font-semibold text-gray-600">Profil Bilgileri</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Ad -->
          <div>
            <label class="block text-sm font-medium">Ad:</label>
            <input
              v-model="firstname"
              class="input w-full border p-2 rounded-md mt-2"
            />
          </div>

          <!-- Soyad -->
          <div>
            <label class="block text-sm font-medium">Soyad:</label>
            <input
              v-model="lastname"
              class="input w-full border p-2 rounded-md mt-2"
            />
          </div>
        </div>

        <!-- Email  -->
        <div>
          <label class="block text-sm font-medium">Email</label>
          <input
            v-model="email"
            class="input w-1/2 border p-2 rounded-md mt-2"
          />
        </div>

        <!-- Buton -->
        <div>
          <button
            type="submit"
            class="px-4 bg-[#fe9f43] text-white py-3 rounded-md border border-[#fe9f43] hover:bg-white hover:text-[#fe9f43] transition"
          >
            Profil Güncelle
          </button>
        </div>
      </form>

      <!-- Şifre Güncelleme -->
      <div class="mt-8 border p-4 rounded-md bg-white pt-6">
        <h2 class="text-xl font-semibold mb-4">Şifreyi Güncelle</h2>
        <form @submit.prevent="changePassword" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium w-full">Yeni Şifre</label>
              <input
                type="password"
                v-model="newPassword"
                class="input w-full border p-2 rounded-md mt-2"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium"
                >Yeni Şifre (Tekrar)</label
              >
              <input
                type="password"
                v-model="confirmPassword"
                class="input w-full border p-2 rounded-md mt-2"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            class="px-4 bg-[#fe9f43] text-white py-3 rounded-md border border-[#fe9f43] hover:bg-white hover:text-[#fe9f43] transition"
          >
            Şifreyi Güncelle
          </button>
        </form>
      </div>
    </div>

    <!-- Kullanıcı Düzenleme Modali -->
    <transition name="fade">
      <div
        v-if="showEditModal"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div
          class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4"
        >
          <h2 class="text-xl font-bold mb-2">Kullanıcıyı Düzenle</h2>

          <label class="block text-sm font-medium">Ad</label>
          <input v-model="editForm.firstname" class="input" />

          <label class="block text-sm font-medium">Soyad</label>
          <input v-model="editForm.lastname" class="input" />

          <label class="block text-sm font-medium">Email</label>
          <input v-model="editForm.email" class="input" />

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="editForm.isAdmin" />
            <label>Admin Yetkisi</label>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t">
            <button
              @click="showEditModal = false"
              class="btn bg-gray-300 text-black"
            >
              İptal
            </button>
            <button @click="saveUserChanges" class="btn bg-blue-600 text-white">
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Kullanıcı Ekleme Modali -->
    <transition name="fade">
      <div
        v-if="showAddModal"
        class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      >
        <div
          class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full space-y-4"
        >
          <h2 class="text-xl font-bold mb-2">Yeni Kullanıcı Ekle</h2>

          <label class="block text-sm font-medium">Ad</label>
          <input v-model="newUser.firstname" class="input" />

          <label class="block text-sm font-medium">Soyad</label>
          <input v-model="newUser.lastname" class="input" />

          <label class="block text-sm font-medium">Email</label>
          <input v-model="newUser.email" type="email" class="input" />

          <label class="block text-sm font-medium">Şifre</label>
          <input v-model="newUser.password" type="password" class="input" />

          <div class="flex items-center gap-2">
            <input type="checkbox" v-model="newUser.isAdmin" />
            <label>Admin Yetkisi</label>
          </div>

          <div class="flex justify-end gap-2 pt-4 border-t">
            <button
              @click="showAddModal = false"
              class="btn bg-gray-300 text-black"
            >
              İptal
            </button>
            <button @click="addNewUser" class="btn bg-green-600 text-white">
              Ekle
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { DB, AUTH } from "@/utils/firebase";
import {
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { updatePassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from "vue-toast-notification";
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

const router = useRouter();
const userStore = useUserStore();
const toast = useToast();

const firstname = ref(userStore.getUserData.firstname);
const lastname = ref(userStore.getUserData.lastname);
const email = ref(userStore.getUserData.email);

const newPassword = ref("");
const confirmPassword = ref("");

const users = ref([]);
const showEditModal = ref(false);
const showAddModal = ref(false);

const editForm = ref({
  uid: "",
  firstname: "",
  lastname: "",
  email: "",
  isAdmin: false,
});

const newUser = ref({
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  isAdmin: false,
});

const fetchUsers = async () => {
  const snapshot = await getDocs(collection(DB, "users"));
  users.value = snapshot.docs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  }));
};

const deleteUser = async (uid) => {
  Swal.fire({
    title: "Emin misiniz?",
    text: "Bu kullanıcı kalıcı olarak silinecek!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FE9F43",
    cancelButtonColor: "#092C4C",
    confirmButtonText: "Evet, sil",
    cancelButtonText: "Vazgeç",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteDoc(doc(DB, "users", uid));
        await fetchUsers();
        Swal.fire("Silindi!", "Kullanıcı başarıyla silindi.", "success");
      } catch (error) {
        console.error("Silme hatası:", error);
        Swal.fire("Hata!", "Kullanıcı silinemedi.", "error");
      }
    }
  });
};

const editUser = (user) => {
  editForm.value = { ...user };
  showEditModal.value = true;
};

const saveUserChanges = async () => {
  try {
    await updateDoc(doc(DB, "users", editForm.value.uid), {
      firstname: editForm.value.firstname,
      lastname: editForm.value.lastname,
      email: editForm.value.email,
      isAdmin: editForm.value.isAdmin,
    });
    toast.success("Kullanıcı bilgileri güncellendi");
    showEditModal.value = false;
    await fetchUsers();
  } catch (err) {
    console.error("Kullanıcı güncellenemedi:", err);
    toast.error("Güncelleme başarısız");
  }
};

const saveUserInfo = async () => {
  try {
    const uid = userStore.getUserData.uid;
    await updateDoc(doc(DB, "users", uid), {
      firstname: firstname.value,
      lastname: lastname.value,
    });
    userStore.setUser({
      ...userStore.getUserData,
      firstname: firstname.value,
      lastname: lastname.value,
    });
    toast.success("Profil güncellendi");
  } catch (err) {
    console.error(err);
    toast.error("Profil güncellenemedi");
  }
};

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error("Yeni şifreler eşleşmiyor.");
    return;
  }

  const user = AUTH.currentUser;
  if (!user) {
    toast.error("Kullanıcı oturumu bulunamadı.");
    return;
  }

  try {
    await updatePassword(user, newPassword.value);
    await updateDoc(doc(DB, "users", user.uid), {
      password: newPassword.value,
    });

    toast.success("Şifre başarıyla güncellendi.");
    newPassword.value = "";
    confirmPassword.value = "";
  } catch (error) {
    console.error("Şifre güncelleme hatası:", error);
    toast.error("Şifre güncellenemedi.");
  }
};

const addNewUser = async () => {
  try {
    const result = await createUserWithEmailAndPassword(
      AUTH,
      newUser.value.email,
      newUser.value.password
    );

    await setDoc(doc(DB, "users", result.user.uid), {
      uid: result.user.uid,
      firstname: newUser.value.firstname,
      lastname: newUser.value.lastname,
      email: newUser.value.email,
      isAdmin: newUser.value.isAdmin,
    });

    toast.success("Yeni kullanıcı eklendi.");
    showAddModal.value = false;
    await fetchUsers();

    newUser.value = {
      firstname: "",
      lastname: "",
      email: "",
      isAdmin: false,
    };
  } catch (err) {
    console.error("Kullanıcı eklenemedi:", err);
    toast.error("Kullanıcı oluşturulamadı.");
  }
};

onMounted(() => {
  if (userStore.getUserData.isAdmin) {
    fetchUsers();
  }
});
</script>
