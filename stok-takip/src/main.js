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

// Font Awesome setup
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faTrash,
  faEdit,
  faEye,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";

library.add(faTrash, faEdit, faEye, faArrowLeft);
let app;
onAuthStateChanged(AUTH, () => {
  if (!app) {
    const app = createApp(App);

    app.component("app-header", Header);
    app.use(createPinia());
    app.use(router);
    app.component("font-awesome-icon", FontAwesomeIcon);
    app.mount("#app");
  }
});
