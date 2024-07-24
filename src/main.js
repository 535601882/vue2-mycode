import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import plugins from "@/plugins";
import i18n from "./plugins/i18n";
import("@/permission");
// 核心插件
Vue.use(plugins);
// 监听网络状态变化
window.addEventListener("online", function () {
  console.log("网络已连接");
  // 在这里添加网络恢复时需要执行的操作
});

window.addEventListener("offline", function () {
  console.log("网络已断开");
  // 在这里添加网络断开时需要执行的操作
});

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
  mounted() {
    // 加载一系列的设置
    this.$store.dispatch("load");
    // 获取并记录用户 UA
    this.$store.commit("ua/get");
  },
}).$mount("#app");
