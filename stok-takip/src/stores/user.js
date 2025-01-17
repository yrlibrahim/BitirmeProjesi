import { ref } from "vue";
import { defineStore } from "pinia";
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { AUTH } from "@/utils/firebase";
import { useToast } from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";
import { useRouter } from "vue-router";

const $toast = useToast();

const DEFAULT_USER = {
  uid: null,
  email: null,
  firstname: null,
  lastname: null,
  isAdmin: null,
};

export const useUserStore = defineStore("user", {
  state: () => ({
    loading: false,
    user: DEFAULT_USER,
    auth: false,
    error: null,
  }),
  actions: {
    async signIn(formData) {
      try {
        this.loading = true;
        const response = await signInWithEmailAndPassword(
          AUTH,
          formData.email,
          formData.password
        );
        console.log(response);
        this.auth = true;
        $toast.success("Hoşgeldiniz");
      } catch (error) {
        this.error = error.message;
        $toast.error("Hatalı Giriş");
      } finally {
        this.loading = false;
      }
    },
  },
});
