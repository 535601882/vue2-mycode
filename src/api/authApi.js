import axios from "@/plugins/axios";
let baseUrl = process.env.VUE_APP_API;

export function login(params) {
  return axios.post(`${baseUrl}/login`, params);
}

export function register(params) {
  return axios.post(`${baseUrl}/register`, params);
}
export function logout(params) {
  return axios.post(`${baseUrl}/logout`, params);
}
export function refreshToken(params) {
  return axios.post(`${baseUrl}/refresh_token`, params);
}
