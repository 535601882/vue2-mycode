import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/plugins";
import i18n from "./plugins/i18n";
import("@/permission");
Vue.config.productionTip = false;
new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app");
