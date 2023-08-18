const routes = [
  // {
  //   path: "/",
  //   name: "Layout",
  //   redirect: {
  //     name: "Home",
  //   },
  //   components: {
  //     default: () => import(/* webpackChunkName: "layout" */ "@/layout/default.layout.vue"),
  //   },
  //   children: [
  {
    path: "/home",
    name: "Home",
    meta: { title: "Home", keepalive: true },
    components: {
      default: () => import(/* webpackChunkName: "Home" */ "@/views/Home.vue"),
      // RightSidebar: () => import("@/views/About.vue"),
    },
  },
  {
    path: "/about",
    name: "About",
    meta: { title: "About", keepalive: true },
    component: () => import(/* webpackChunkName: "About" */ "@/views/About.vue"),
  },
  {
    path: "/axios",
    name: "Axios",
    meta: { title: "Axios", keepalive: true },
    component: () => import(/* webpackChunkName: "Axios" */ "@/views/axios.vue"),
  },
  {
    path: "/form",
    name: "Form",
    meta: { title: "Form", keepalive: true },
    component: () => import(/* webpackChunkName: "Form" */ "@/views/form/index.vue"),
  },
  {
    path: "/404",
    name: "404",
    meta: { title: "404" },
    component: () => import(/* webpackChunkName: "fail" */ "@/views/exception/404.vue"),
  },
  {
    path: "/grid-dash-board",
    name: "GridDashBoard",
    meta: { title: "GridDashBoard" },
    component: () => import(/* webpackChunkName: "GridDashBoard" */ "@/views/GridDashBoard/index.vue"),
  },
  {
    path: "/gsap-page",
    name: "GsapPage",
    meta: { title: "GsapPage" },
    component: () => import(/* webpackChunkName: "GsapPage" */ "@/views/GsapPage/index.vue"),
  },
  {
    path: "/three-js",
    name: "ThreeJs",
    meta: { title: "ThreeJs" },
    component: () => import(/* webpackChunkName: "ThreeJs" */ "@/views/ThreeJs/index.vue"),
  },
  {
    path: "/log",
    name: "Log",
    meta: { title: "Log", keepalive: true },
    component: () => import(/* webpackChunkName: "Log" */ "@/views/Log/index.vue"),
  },
  {
    path: "/d3-demo",
    name: "d3Demo",
    meta: { title: "d3Demo", keepalive: true },
    component: () => import(/* webpackChunkName: "d3Demo" */ "@/views/d3Demo/index.vue"),
  },
  // ROUTE IMPORT
  //   ],
  // },
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];

export default routes;
