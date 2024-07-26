import axios from "@/plugins/axios";
let baseUrl = process.env.VUE_APP_API;

export function getUsers(params) {
  return axios({
    url: `${baseUrl}/getUsers`,
    method: "get",
    params: params,
  });
}
export function getUserId(params) {
  return axios({
    url: `${baseUrl}/getUserId`,
    method: "get",
    params: params,
    data: { name: "st" },
    // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
    // transformResponse: [function (data) {
    //   console.log("transformResponse",data);
    //   data = JSON.parse(data);
    //   data.result.test = "hahha "
    //   return data;
    // }],
    // adapter: config => {
    //   // eslint-disable-next-line no-unused-vars
    //   return new Promise((resolve, reject) =>{
    //     console.log("adapter ==",config)
    //     xhrAdapter(config)
    //       .then((response) => {
    //         settle(resolve, reject, response);
    //       })
    //       .catch(reject);
    //   })
    // },
    cache: true, // 是否启动缓存能力
    exppries: Date.now() + 3600000, // 过期时间
  });
}
export function getImg(params) {
  return axios({
    url: `${baseUrl}/getImg`,
    method: "get",
    params: params,
    responseType: "blob",
  });
}
