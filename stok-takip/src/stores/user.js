import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { isAdmin } from "@firebase/util";

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
  actions: {},
});
