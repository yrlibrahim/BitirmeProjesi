import "./assets/style.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import Header from "@/components/Navigations/Header.vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas, far);

// Toast Notification
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-sugar.css";

// Firebase
import { onAuthStateChanged } from "firebase/auth";
import { AUTH } from "@/utils/firebase";

let app;
onAuthStateChanged(AUTH, () => {
  if (!app) {
    app = createApp(App); // ❗️Burada tekrar 'const' ile tanımlama yok
    app.use(createPinia());
    app.use(router);
    app.component("app-header", Header);
    app.component("font-awesome-icon", FontAwesomeIcon); // FontAwesome buraya eklenecek
    app.use(ToastPlugin);
    app.mount("#app");
  }
});
