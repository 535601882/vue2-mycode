import axios from "axios";

// 创建axios实例

const instance = axios.create({
  baseURL: null, // 设置接口的基础url

  timeout: 5000, // 请求超时时间
});

// 请求拦截器

instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些处理，如添加请求头信息

    config.headers["Authorization"] = localStorage.getItem("token");

    return config;
  },

  (error) => {
    // 发送请求错误处理

    console.error("请求发送失败:", error);

    return Promise.reject(error);
  }
);

// 响应拦截器

instance.interceptors.response.use(
  (response) => {
    // 对响应数据进行处理，如获取data字段

    return response.data;
  },

  (error) => {
    // 响应错误处理

    console.error("请求响应失败:", error);

    return Promise.reject(error);
  }
);

export default instance;
