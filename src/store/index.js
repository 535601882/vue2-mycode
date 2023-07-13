import Vue from "vue";
import Vuex from "vuex";
import auth from "./module/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    layout: "defaultLayout",
  },
  mutations: {
    SETLAYOUT(state, data) {
      state.layout = data;
    },
  },
  actions: {
    setLayout({ commit }, data) {
      commit("SETLAYOUT", data);
    },
  },
  modules: {
    auth,
  },
});
