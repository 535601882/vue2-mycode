import "normalize.css";
import "@/assets/scss/global.scss";
import element from "./element";
// 旧版本浏览器提示
import "./support";
import i18n from "./i18n";
import api from "@/api";
const setting = require("@/config/setting");
// svg 图标
import "@/assets/svg-icons";
import components from "@/components";
import utils from "@/libs/utils";
// 功能插件
import pluginError from "@/plugins/error";
import pluginLog from "@/plugins/log";
import pluginOpen from "@/plugins/open";
// 右键菜单
import "./contextmenu/styles/index.scss";
import contentmenu from "./contextmenu";

export default {
  // eslint-disable-next-line no-unused-vars
  async install(Vue, options) {
    for (let name in components) {
      Vue.component(name, components[name]);
    }

    Vue.prototype.$utils = utils;
    Vue.prototype.$api = api;
    Vue.prototype.$globalSetting = setting;

    // 设置为 false 以阻止 vue 在启动时生成生产提示。
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false;
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV;
    // 当前的 baseUrl
    // 简化代码中 process.env.BASE_URL 取值
    Vue.prototype.$baseUrl = process.env.BASE_URL;
    // 插件
    Vue.use(pluginError);
    Vue.use(pluginLog);
    Vue.use(pluginOpen);
    Vue.use(contentmenu);

    Vue.use(element, {
      i18n,
      size: "small",
    });
  },
};
