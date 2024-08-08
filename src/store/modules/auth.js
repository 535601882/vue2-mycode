import api from "@/api";
import utils from "@/libs/utils";

export default {
  namespaced: true,
  state: {
    status: { loggedIn: false },
    user: utils.storage.get("user", null),
    token: utils.storage.get("token", null),
    refreshToken: utils.storage.get("refreshToken", null),
    roles: [],
  },
  getters: {
    accessToken(state) {
      return state.token;
    },
    refreshToken(state) {
      return state.refreshToken;
    },
    roles(state) {
      return state.roles;
    },
  },
  actions: {
    login({ commit }, user) {
      return api.authApi.login(user).then(
        (user) => {
          commit("loginSuccess", user);
          commit("setToken", user.token);
          commit("refreshToken", user.refreshToken);
          utils.storage.set("user", user);
          utils.storage.set("token", user.token);
          utils.storage.set("refreshToken", user.refreshToken);
          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure");
          utils.storage.remove("user");
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      api.authApi.logout();
      commit("logout");
    },
    register({ commit }, user) {
      return api.authApi.register(user).then(
        (response) => {
          commit("registerSuccess");
          return Promise.resolve(response.data);
        },
        (error) => {
          commit("registerFailure");
          return Promise.reject(error);
        }
      );
    },
    refreshToken({ commit }, accessToken) {
      return new Promise((resolve, reject) => {
        api.authApi.refreshToken({ refreshToken: accessToken }).then(
          (response) => {
            commit("setToken", response.token);
            utils.storage.set("token", response.token);
            resolve({
              token: response.token,
              ...response.data,
            });
          },
          (error) => {
            commit("registerFailure");
            reject(error);
          }
        );
      });
    },
    GetInfo({ commit }) {
      console.log("GetInfo");
      commit("setRoles");
      return Promise.resolve({});
    },
    GenerateRoutes() {
      return Promise.resolve({ path: "/about" });
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.user = user;
    },
    loginFailure(state) {
      state.user = null;
    },
    logout(state) {
      state.user = null;
    },
    registerSuccess() {},
    registerFailure() {},
    refreshToken(state, refreshToken) {
      state.refreshToken = refreshToken;
    },
    setToken(state, token) {
      state.token = token;
    },
    clearUserData() {},
    setRoles(state) {
      state.roles = ["1"];
    },
  },
};
