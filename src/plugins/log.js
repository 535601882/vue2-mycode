import store from "@/store";
import utils from "@/libs/utils";

export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    // 快速打印 log
    Vue.prototype.$log = utils.log;
    // 快速记录日志
    Vue.prototype.$logAdd = function (info, show = true) {
      // store 赋值
      store.dispatch("log/add", {
        type: "log",
        info,
      });
      // 显示在控制台
      if (show && process.env.NODE_ENV === "development") {
        utils.log.default(info);
      }
    };
  },
};
