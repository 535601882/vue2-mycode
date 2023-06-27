import axios from "@/plugins/axios";

export function getApiSuccess(params) {
  return axios.get("/api/success", { params });
}

export function getApiError() {
  return axios.get("/api/error");
}
