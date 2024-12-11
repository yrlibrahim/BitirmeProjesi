import { ref, computed, registerRuntimeCompiler } from "vue";
import { defineStore } from "pinia";
import { isAdmin } from "@firebase/util";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { DB, AUTH } from "@/utils/firebase";
import { getDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import router from "@/router";

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
  }),
  getters: {},
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
        router.push("/home");
      } catch (error) {
        console.error("Error during registration:", error.message);
      } finally {
        this.loading = false;
      }
    },
  },
});
