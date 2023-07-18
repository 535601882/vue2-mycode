module.exports = {
  BASE_URL: process.env.VUE_APP_API, // 接口地址
  AUTHORIZATION: "Authorization",
  USE_MOCK: process.env.VUE_USE_MOCK === "true" || false, // 是否使用mock
};
