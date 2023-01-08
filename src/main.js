import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import App from "@/App.vue";
import router from "@/router";
import "@/assets/main.css";
import "@/interceptors/base";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);
library.add(far);
library.add(fab);

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(ElementPlus);
app.use(router);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
