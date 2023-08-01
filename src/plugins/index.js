import Vue from "vue";
import "normalize.css";
import element from "./element";
import "./support";
import i18n from "./i18n";
import api from "@/api";
const setting = require("@/config/setting");

import components from "@/components";
import Utils from "@/libs/Utils";
for (let name in components) {
  Vue.component(name, components[name]);
}

Vue.prototype.$utils = Utils;
Vue.prototype.$api = api;
Vue.prototype.$globalSetting = setting;

Vue.use(element, {
  i18n,
});
