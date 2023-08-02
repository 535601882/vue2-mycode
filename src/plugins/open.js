import utils from "@/libs/utils";

export default {
  // eslint-disable-next-line no-unused-vars
  install(Vue, options) {
    Vue.prototype.$open = utils.open;
  },
};
