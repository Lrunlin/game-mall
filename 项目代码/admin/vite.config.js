import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Pages from "vite-plugin-pages";
import Layouts from "vite-plugin-vue-layouts";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".vue"],
  },
  base: "./",
  server: {
    port: 8002,
  },
  plugins: [
    vue(),
    Pages({
      dirs: "src/pages",
      extensions: ["vue"],
      extendRoute(route) {
        if (route.path.startsWith("/admin") && !route.path.includes("sign")) {
          route.meta = Object.assign(route.meta || {}, { layout: "admin" });
        }

        return route;
      },
    }),
    Layouts(),
    AutoImport({
      imports: ["vue", "vue-router", "vuex"],
      dts: "src/auto-import.d.ts",
      // include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
    }),
  ],
});
