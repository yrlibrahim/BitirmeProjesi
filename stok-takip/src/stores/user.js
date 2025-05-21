import { defineStore } from "pinia";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { AUTH, DB } from "@/utils/firebase";
import router from "@/router";
import { useToast } from "vue-toast-notification";

const $toast = useToast();

const DEFAULT_USER = {
  uid: null,
  firstname: null,
  lastname: null,
  email: null,
  isAdmin: null,
};

export const useUserStore = defineStore("user", {
  state: () => ({
    loading: false,
    user: DEFAULT_USER,
    auth: false,
  }),
  getters: {
    getUserData(state) {
      return state.user;
    },
  },
  actions: {
    setUser(user) {
      this.user = { ...this.user, ...user };
      this.auth = true;
    },

    async signOut() {
      await signOut(AUTH);
      this.user = DEFAULT_USER;
      this.auth = false;
      router.push({ name: "Signin" });
    },

    async autoSignIn(uid) {
      try {
        const userData = await this.getUserProfile(uid);
        this.setUser(userData);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    async getUserProfile(uid) {
      try {
        const userRef = doc(DB, "users", uid);
        const userSnap = await getDoc(userRef);
        return userSnap.data();
      } catch (error) {
        console.error("Profil getirme hatası:", error);
        return null;
      }
    },

    async signIn(formData) {
      this.loading = true;
      const toast = useToast();
      try {
        const response = await signInWithEmailAndPassword(
          AUTH,
          formData.email,
          formData.password
        );

        const userData = await this.getUserProfile(response.user.uid);
        this.setUser(userData);

        if (userData) {
          this.user = { ...DEFAULT_USER, ...userData };
          this.auth = true;
          router.push("/home");
          $toast.success("Hoşgeldiniz");
        } else {
          $toast.error("Kullanıcı verisi bulunamadı.");
        }
      } catch (error) {
        console.error("Giriş hatası:", error.message);
        $toast.error("Giriş işlemi başarısız.");
      } finally {
        this.loading = false;
      }
    },
  },
});
