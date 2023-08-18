import store from "@/store";
import utils from "@/libs/utils";
const { name } = require("/package");

export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    class ResourceError extends Error {
      constructor(message) {
        super(message);
        this.name = "ResourceError";
      }
    }

    class Unhandledrejection extends Error {
      constructor(message) {
        super(message);
        this.name = "Unhandledrejection";
      }
    }

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
    // 可以捕获资源加载异常
    window.addEventListener(
      "error",
      (event) => {
        // 资源文件 加载错误处理
        let tagName = event.target?.tagName;
        if (["SCRIPT", "IMG"].includes(tagName)) {
          console.log("资源错误", event);
          store.dispatch("log/add", {
            type: "error",
            err: new ResourceError(`文件加载错误，${event.target.src}`),
            vm: null,
            info: `${event.target.src}`,
          });
          return;
        }
        console.log("文件错误", event);
        // 添加 log
        store.dispatch("log/add", {
          type: "error",
          err: event.error,
          vm: null,
          info: `错误信息: ${event.message},发生错误的脚本filename：${event.filename}， 发生错误的行号: ${event.lineno}, 发生错误的列号: ${event.colno}`,
        });
      },
      true
    );

    window.addEventListener("unhandledrejection", (event) => {
      // 在这里处理 Promise 错误，可以记录错误信息到日志服务
      console.log(`UNHANDLED PROMISE REJECTION 错误：${event.reason}`, event);
      // 添加 log
      store.dispatch("log/add", {
        type: "unhandledrejection",
        err: new Unhandledrejection(event.reason),
        vm: null,
        info: event.reason.message,
      });
      // 阻止默认处理（例如将错误输出到控制台）
      event.preventDefault();
    });
  },
};
