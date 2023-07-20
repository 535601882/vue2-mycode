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
    components: {
      default: () => import(/* webpackChunkName: "Home" */ "@/views/Home.vue"),
      RightSidebar: () => import("@/views/About.vue"),
    },
  },
  {
    path: "/about",
    name: "About",
    component: () => import(/* webpackChunkName: "About" */ "@/views/About.vue"),
  },
  {
    path: "/axios",
    name: "Axios",
    component: () => import(/* webpackChunkName: "Axios" */ "@/views/axios.vue"),
  },
  {
    path: "/form",
    name: "Form",
    component: () => import(/* webpackChunkName: "Form" */ "@/views/form/index.vue"),
  },
  {
    path: "/404",
    component: () => import(/* webpackChunkName: "fail" */ "@/views/exception/404.vue"),
  },
  {
    path: "/grid-dash-board",
    name: "GridDashBoard",
    component: () => import(/* webpackChunkName: "GridDashBoard" */ "@/views/GridDashBoard/index.vue"),
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
