import axios from "@/plugins/axios";
let baseUrl = process.env.VUE_APP_API;

export function getWeixinAccessToken(params) {
  return axios({
    url: `${baseUrl}/getWeixinAccessToken`,
    method: "get",
    params: params,
  });
}
export function getWeixinUserinfo(params) {
  return axios({
    url: `${baseUrl}/getWeixinUserinfo`,
    method: "get",
    params: params,
  });
}
