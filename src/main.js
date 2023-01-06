import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { useSessionStore } from "@/stores/session";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const pinia = createPinia();

const app = createApp(App);

app.use(pinia);
const sessionStore = useSessionStore();

app.use(ElementPlus);
app.use(router);

app.mount("#app");
