import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
console.log("modules", modules);
// MODULE IMPORTS

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
    load({ dispatch }) {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve) => {
        // DB -> store 持久化数据加载上次退出时的多页列表
        await dispatch("page/openedLoad", null, { root: true });
        // end
        resolve();
      });
    },
  },
  modules: {
    ...modules,
    // MODULE EXPORTS
  },
});
