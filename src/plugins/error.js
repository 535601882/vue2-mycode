import store from "@/store";
import utils from "@/libs/utils";
const { name } = require("/package");

export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.config.errorHandler = function (err, vm, info) {
      Vue.nextTick(() => {
        // // 添加 log
        store.dispatch("log/add", {
          type: "error",
          err,
          vm,
          info,
        });
        // 只在开发模式下打印 log
        if (process.env.NODE_ENV === "development") {
          utils.log.capsule(name, "ErrorHandler", "danger");
          utils.log.danger(">>>>>> 错误信息 >>>>>>");
          console.log(info);
          utils.log.danger(">>>>>> Vue 实例 >>>>>>");
          console.log(vm);
          utils.log.danger(">>>>>> Error >>>>>>");
          console.log(err);
        }
      });
    };

    window.onerror = function (e) {
      console.log("错误====================", e);
    };
  },
};
