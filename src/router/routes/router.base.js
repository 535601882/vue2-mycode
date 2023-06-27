const routes = [
  {
    path: "/",
    name: "Layout",
    redirect: {
      name: "Home",
    },
    component: () => import(/* webpackChunkName: "layout" */ "@/layout/default.layout.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import(/* webpackChunkName: "Home" */ "@/views/Home.vue"),
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
    ],
  },
  {
    path: "*",
    redirect: "/404",
    hidden: true,
  },
];

export default routes;
