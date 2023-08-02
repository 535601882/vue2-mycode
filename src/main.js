import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import plugins from "@/plugins";
import i18n from "./plugins/i18n";
import("@/permission");
// 核心插件
Vue.use(plugins);

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app");
