import api from "@/api";

export default {
  namespaced: true,
  state: {
    status: { loggedIn: false },
    user: null,
    token: "111111",
    roles: [],
  },
  getters: {
    accessToken(state) {
      return state.token;
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
          return Promise.resolve(user);
        },
        (error) => {
          commit("loginFailure");
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
        api.authApi.refreshToken(accessToken).then(
          (response) => {
            commit("refreshToken", response.token);
            resolve({
              token: "111111",
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
    refreshToken(state, accessToken) {
      state.user = { ...state.user, accessToken: accessToken };
      state.token = "111111";
    },
    setToken(state) {
      state.token = "222";
    },
    clearUserData() {},
    setRoles(state) {
      state.roles = ["1"];
    },
  },
};
