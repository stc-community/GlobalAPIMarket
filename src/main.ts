import App from "./App.vue";
import router from "./router";
import { setupStore } from "@/store";
import { useAccountStore } from "@/store/modules/account";
import { useNostrStore } from "@/store/modules/nostr";
import { getServerConfig } from "./config";
import { createApp } from "vue";
import { injectResponsiveStorage } from "@/utils/responsive";
import { useI18n } from "@/plugins/i18n";

import "./style/reset.scss";
import "./style/index.scss";
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题
import "./style/tailwind.css";

const app = createApp(App);

// import charts
import VueApexCharts from "vue3-apexcharts";
import ApexCharts from "apexcharts";
app.use(VueApexCharts);
app.config.globalProperties.$apexcharts = ApexCharts;
// Add this when into a TypeScript codebase
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $apexcharts: typeof ApexCharts;
  }
}

// Vue writer
import VueWriter from "vue-writer";
app.use(VueWriter);

// register @iconify/vue
import { IconifyIconOffline, IconifyIconOnline } from "./components/ReIcon";
app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);

getServerConfig(app).then(async config => {
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  setupStore(app);

  app.use(useI18n);

  // get user info from smart contract, for nostr private key
  await useAccountStore().init();

  app.mount("#app");
  try {
    // 尝试预获取 instance
    await useNostrStore().asyncGetNostrInstance();
  } catch (e) {
    // ignore
  }
});
