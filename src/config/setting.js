module.exports = {
  BASE_URL: process.env.VUE_APP_API, // 接口地址
  AUTHORIZATION: "Authorization",
  USE_MOCK: process.env.VUE_USE_MOCK === "true" || false, // 是否使用mock
  // 侧边栏默认折叠状态
  menu: {
    asideCollapse: false,
  },
  // 在读取持久化数据失败时默认页面
  page: {
    opened: [
      {
        name: "Home",
        title: "首页",
        route: {},
        fixed: true,
      },
    ],
  },
};
