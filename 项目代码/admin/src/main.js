import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router";

import "@/style/index.scss";
import "@/plugin/axios";
import { createPinia } from "pinia";
import Vant from "vant";
import "vant/lib/index.css";
import "moment/dist/locale/zh-cn";
const app = createApp(App);

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import axios from "axios";
axios.defaults.baseURL = "http://localhost:3000";

import { setupLayouts } from "virtual:generated-layouts";
import pages from "~pages";

const routes = setupLayouts(pages);
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

app.use(router).use(createPinia()).use(Vant).use(ElementPlus).mount("#app");
