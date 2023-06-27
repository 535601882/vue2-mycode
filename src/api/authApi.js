import axios from "@/plugins/axios";

export function login() {
  return axios.get("/api/login");
}

export function register() {
  return axios.get("/api/register");
}
export function logout() {
  return axios.get("/api/logout");
}
export function refreshToken() {
  return axios.get("/api/refreshToken");
}
