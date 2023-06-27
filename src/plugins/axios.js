import axios from "axios";
import store from "@/store";
import router from "@/router";
import setting from "@/config/setting";
// 标记是否正在刷新 Token
let isRefreshing = false;
// 存储待重发的请求
let retryRequests = [];

// 创建axios实例
const instance = axios.create({
  baseURL: setting.BASE_URL, // 设置接口的基础url
  timeout: 5000, // 请求超时时间
  withCredentials: false, // cookie跨域必备
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些处理，如添加请求头信息
    const token = store.getters["auth/accessToken"];
    if (token) {
      config.headers[setting.AUTHORIZATION] = token;
    }
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
    // 2xx 范围内的状态码都会触发该函数。
    // console.log("请求响应成功:",response);
    // 对响应数据做点什么
    return response.data;
  },
  async (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    console.error("请求响应失败:", error);
    const { config, response } = error;
    const status = response?.status;

    if (!response) {
      return Promise.reject(error);
    }
    const originalRequest = config;

    if (status === 401 && originalRequest.url.includes("/api/refreshToken")) {
      router.push("/login");
      return Promise.reject(error);
    }

    // 响应错误处理
    if (status === 401 && !originalRequest._retry) {
      console.log("重新执行 refreshToken");
      // 刷新token（如果请求再次失败，服务器继续返回401状态码，避免进入死循环）
      originalRequest._retry = true;
      // Access Token was expired
      // 判断是否已经在刷新 Token
      if (!isRefreshing) {
        isRefreshing = true;
        console.log("originalRequest._retry", originalRequest._retry);
        store
          .dispatch("auth/refreshToken")
          .then(({ token }) => {
            // 更新原始请求的 headers.Authorization
            originalRequest.headers[setting.AUTHORIZATION] = token || `111111`;
            // 将所有待重发的请求重新发送
            retryRequests.forEach((subscriber) => {
              subscriber(token);
            });
            return instance(originalRequest);
          })
          .catch(() => {
            retryRequests.forEach((cb) => cb(null));
          })
          .finally(() => {
            isRefreshing = false;
            retryRequests = []; // 重置
          });
      } else {
        // 正在刷新 token，将请求添加到待重发的队列中
        return new Promise((resolve, reject) => {
          retryRequests.push((newToken) => {
            if (newToken) {
              originalRequest.headers[setting.AUTHORIZATION] = newToken;
              return resolve(instance(originalRequest));
            }
            reject(error);
          });
        });
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
