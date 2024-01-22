import axios from "@/plugins/axios";

export function getUsers(params) {
  return axios({
    url: `/getUsers`,
    method: "get",
    params: params,
  });
}
