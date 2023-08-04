import router from "@/router";
import store from "@/store";
import { Message } from "element-ui";
// 进度条
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import utils from "@/libs/utils.js";

// 白名单
const whiteList = ["/login", "/register", "/404"];

router.beforeEach((to, from, next) => {
  // 进度条
  NProgress.start();
  const token = store.getters["auth/accessToken"];
  if (token) {
    /* has token*/
    if (to.path === "/login") {
      next({ path: "/" });
    } else {
      if (store.getters["auth/roles"].length === 0) {
        // 判断当前用户是否已拉取完 user_info 信息
        store
          .dispatch("auth/GetInfo")
          .then(() => {
            store.dispatch("auth/GenerateRoutes").then((accessRoutes) => {
              // 根据 roles 权限生成可访问的路由表
              router.addRoute(accessRoutes); // 动态添加可访问路由表
              next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
            });
          })
          .catch((err) => {
            store.dispatch("LogOut").then(() => {
              Message.error(err);
              next({ path: "/" });
            });
          });
      } else {
        next();
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      const redirect = encodeURIComponent(to.fullPath); // 编码 URI，保证参数跳转回去后，可以继续带上
      next(`/login?redirect=${redirect}`); // 否则全部重定向到登录页
    }
  }
});

router.afterEach((to) => {
  // 进度条
  NProgress.done();
  // 需要的信息
  const app = router.app;
  // 多页控制 打开新的页面
  app.$store.dispatch("page/open", to);
  // 更改标题
  utils.title(to.meta.title);
});
