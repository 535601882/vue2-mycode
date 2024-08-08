import axios from "axios";
import store from "@/store";
// import router from "@/router";
import xhr from "axios/lib/adapters/xhr";
const setting = require("@/config/setting");
// 标记是否正在刷新 Token
let isRefreshing = false;
// 存储待重发的请求
let retryRequests = [];
// 存储需要缓存的接口
const requestCache = new Map();
// 请求中的接口数据
const pendingRequests = new Map();

//生成标识请求的唯一key(缓存一般都是 GET 接口)
const generateCacheKey = (config) => {
  let { url, method, params } = config;
  return `${encodeURIComponent(url)}_${method.toUpperCase()}_${JSON.stringify(params)}`;
};
// 利用adapter实现相同接口的请求缓存
// eslint-disable-next-line no-unused-vars
const cacheAdapterEnhancer = async (config) => {
  const key = generateCacheKey(config);
  // 是否需要缓存
  if (config.cache) {
    console.log("执行缓存");
    if (requestCache.has(key)) {
      // 增加过期逻辑
      return Promise.resolve(requestCache.get(key));
    }
    if (pendingRequests.has(key)) {
      return new Promise((resolve, reject) => {
        pendingRequests.get(key).push({ resolve, reject });
      });
    }
    pendingRequests.set(key, []);
  }
  try {
    let response = await xhr(config);
    // const cacheValue = {
    //   timestamp: Date.now(),
    //   data: response.data,
    // };
    if (config.cache) {
      requestCache.set(key, response);

      if (pendingRequests.has(key)) {
        pendingRequests.get(key).forEach(({ resolve }) => resolve(response));
        pendingRequests.delete(key);
      }
    }
    return response;
  } catch (error) {
    // 处理错误
    console.error("Request failed:", error);
    if (config.cache && pendingRequests.has(key)) {
      pendingRequests.get(key).forEach(({ reject }) => reject(error));
      pendingRequests.delete(key);
    }
    throw error; // 重抛错误以便进一步处理
  }
};
// 创建axios实例
const instance = axios.create({
  baseURL: setting.BASE_URL, // 设置接口的基础url
  timeout: 5000, // 请求超时时间
  withCredentials: false, // cookie跨域必备
  adapter: cacheAdapterEnhancer,
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
    console.log("请求响应成功:", response);
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
    // refreshToken过期，重新登录
    if (status === 401 && originalRequest.url.includes("/refresh_token")) {
      // router.push({path: "/login"});
      window.location.href = "/login";
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
        return new Promise((resolve, reject) => {
          isRefreshing = true;
          store
            .dispatch("auth/refreshToken", store.getters["auth/refreshToken"])
            .then(({ token }) => {
              // 更新原始请求的 headers.Authorization
              originalRequest.headers[setting.AUTHORIZATION] = token || `111111`;
              // 将所有待重发的请求重新发送
              retryRequests.forEach((subscriber) => {
                subscriber(token);
              });
              let res = instance(originalRequest);
              return resolve(res);
            })
            .catch((e) => {
              retryRequests.forEach((cb) => cb(null));
              reject(e);
            })
            .finally(() => {
              isRefreshing = false;
              retryRequests = []; // 重置
            });
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
    } else {
      return Promise.reject(error);
    }
  }
);

export default instance;
