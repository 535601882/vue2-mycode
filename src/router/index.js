import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

console.log("START_LOCATION =======", VueRouter.START_LOCATION);
Vue.use(VueRouter);
// 防止连续点击多次路由报错
let routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return routerPush.call(this, location).catch((err) => err);
};
const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior: () => ({ y: 0 }),
  routes,
});

export default router;
