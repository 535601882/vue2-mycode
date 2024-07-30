import axios from "@/plugins/axios";
let baseUrl = process.env.VUE_APP_API;

// 获取用户信息AccessToken
export function getWeixinAccessToken(params) {
  return axios({
    url: `${baseUrl}/getWeixinAccessToken`,
    method: "get",
    params: params,
  });
}
// 获取用户信息
export function getWeixinUserinfo(params) {
  return axios({
    url: `${baseUrl}/getWeixinUserinfo`,
    method: "get",
    params: params,
  });
}
// 获取签名算法
export function getJsApiData(params) {
  return axios({
    url: `${baseUrl}/getJsApiData`,
    method: "get",
    params: params,
  });
}
