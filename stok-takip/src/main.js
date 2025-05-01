import "./assets/style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Header from "@/components/Navigations/Header.vue";

//Toast Notification
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

//Firabase
import { onAuthStateChanged } from "firebase/auth";
import { AUTH } from "@/utils/firebase";

let app;
onAuthStateChanged(AUTH, () => {
  if (!app) {
    const app = createApp(App);

    app.component("app-header", Header);
    app.use(createPinia());
    app.use(router);
    app.mount("#app");
  }
});
