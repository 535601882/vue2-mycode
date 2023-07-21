import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import enLocale from "element-ui/lib/locale/lang/en";
import zhLocale from "element-ui/lib/locale/lang/zh-CN";
import enUS from "@/lang/en-US";
import zhCN from "@/lang/zh-CN";
import VueI18n from "vue-i18n";
import api from "@/api";
import "normalize.css";
const setting = require("@/config/setting");

import("@/permission");
import components from "@/components";
import Utils from "@/libs/Utils";
for (let name in components) {
  Vue.component(name, components[name]);
}
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: "zh", // 默认语言
  fallbackLocale: "zh", // 默认语言环境。如果locale中无匹配项则采用该项值
  messages: {
    en: {
      ...enLocale,
      ...enUS,
    },
    zh: {
      ...zhLocale,
      ...zhCN,
    },
  },
  silentTranslationWarn: true, //避免一些警告 (同时保留那些完全没有翻译给定关键字的警告)，需初始化 VueI18n 实例时设置
});

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
});
Vue.config.productionTip = false;
Vue.prototype.$api = api;
Vue.prototype.$globalSetting = setting;
Vue.prototype.$utils = Utils;

new Vue({
  router,
  i18n,
  store,
  render: (h) => h(App),
}).$mount("#app");
