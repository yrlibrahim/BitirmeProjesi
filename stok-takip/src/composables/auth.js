import { ref } from "vue";
import { AUTH } from "@/utils/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useUserStore } from "@/stores/user";

export const firstLoad = () => {
  const userStore = useUserStore();
  const loading = ref(true);
  onAuthStateChanged(AUTH, async (user) => {
    if (user) {
      await userStore.autoSignIn(user.uid);
    }
    loading.value = false;
  });

  return { loading };
};
